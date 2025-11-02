"""
Post Processor Service
Handles bulk processing of scraped articles into SEO-optimized posts.
Includes duplicate detection, error handling, and progress tracking.
"""
import json
import logging
from datetime import datetime
from typing import Dict, List, Tuple, Optional
from pathlib import Path

from sqlalchemy.exc import IntegrityError
from models import db, Post, ProcessingLog
from utils.seo_utils import (
    extract_slug_from_url,
    generate_meta_title,
    generate_meta_description,
    generate_meta_keywords,
    generate_complete_structured_data,
    validate_required_fields
)
import config


# Configure logger
logger = logging.getLogger(__name__)


class PostProcessor:
    """
    Processes scraped articles and converts them to SEO-optimized posts.
    Handles duplicate detection, validation, and batch processing.
    """

    def __init__(self, app=None):
        """
        Initialize the post processor.

        Args:
            app: Flask application instance
        """
        self.app = app
        self.stats = {
            'total_articles': 0,
            'processed': 0,
            'created': 0,
            'skipped': 0,
            'errors': 0,
            'error_details': []
        }

    def load_scraped_data(self, file_path: Path) -> Dict:
        """
        Load scraped data from JSON file.

        Args:
            file_path: Path to the JSON data file

        Returns:
            Dictionary containing scraped data

        Raises:
            FileNotFoundError: If file doesn't exist
            json.JSONDecodeError: If file contains invalid JSON
        """
        logger.info(f"Loading scraped data from {file_path}")

        if not file_path.exists():
            raise FileNotFoundError(f"Data file not found: {file_path}")

        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        logger.info(f"Loaded {len(data)} pages from data file")
        return data

    def check_duplicate(self, url: str) -> bool:
        """
        Check if a post with the given URL already exists in database.

        Args:
            url: Original URL to check

        Returns:
            True if duplicate exists, False otherwise
        """
        existing = Post.query.filter_by(original_url=url).first()
        return existing is not None

    def create_post_from_article(
        self,
        article: Dict,
        page_number: int,
        article_number: int
    ) -> Tuple[Optional[Post], Optional[str]]:
        """
        Create a Post object from article data with SEO optimization.

        Args:
            article: Article dictionary containing video data
            page_number: Page number from scraped data
            article_number: Article number within the page

        Returns:
            Tuple of (Post object or None, error message or None)
        """
        try:
            # Validate required fields
            is_valid, error = validate_required_fields(article)
            if not is_valid:
                logger.warning(f"Article validation failed: {error}")
                return None, error

            # Check for duplicates
            original_url = article['url']
            if self.check_duplicate(original_url):
                logger.info(f"Skipping duplicate: {original_url}")
                self.stats['skipped'] += 1
                return None, "Duplicate URL"

            # Extract and process data
            slug = extract_slug_from_url(original_url)
            categories = article.get('category', [])
            tags = article.get('tags', [])

            # Generate SEO metadata
            meta_title = generate_meta_title(article['title'])
            meta_description = generate_meta_description(article['body'])
            meta_keywords = generate_meta_keywords(tags, categories)

            # Create post object
            post = Post(
                page_number=page_number,
                article_number=article_number,
                original_url=original_url,
                slug=slug,
                title=article['title'],
                body=article['body'],
                thumbnail=article.get('thumbnail'),
                video_url=article['video'],
                video_width=article.get('video_width'),
                video_height=article.get('video_height'),
                video_duration=article.get('video_duration'),
                video_duration_seconds=article.get('video_duration_seconds', 0),
                video_type=article.get('video_type', 'video'),
                meta_title=meta_title,
                meta_description=meta_description,
                meta_keywords=meta_keywords,
                is_published=True,
                processing_status='success'
            )

            # Set categories and tags
            post.set_categories(categories)
            post.set_tags(tags)

            # Generate structured data
            post_data = {
                'title': post.title,
                'body': post.body,
                'video_url': post.video_url,
                'thumbnail': post.thumbnail or config.DEFAULT_IMAGE,
                'created_at': datetime.utcnow(),
                'video_duration_seconds': post.video_duration_seconds,
                'categories': categories,
                'tags': tags,
                'slug': slug
            }

            structured_data = generate_complete_structured_data(
                post_data=post_data,
                site_url=config.SITE_URL,
                site_name=config.SITE_NAME
            )
            post.structured_data = structured_data

            return post, None

        except Exception as e:
            error_msg = f"Error creating post: {str(e)}"
            logger.error(error_msg, exc_info=True)
            return None, error_msg

    def process_articles_batch(
        self,
        articles: List[Tuple[Dict, int, int]],
        commit: bool = True
    ) -> List[Post]:
        """
        Process a batch of articles and save to database.

        Args:
            articles: List of tuples (article_dict, page_number, article_number)
            commit: Whether to commit to database

        Returns:
            List of successfully created Post objects
        """
        created_posts = []

        for article_data, page_num, article_num in articles:
            try:
                post, error = self.create_post_from_article(
                    article=article_data,
                    page_number=page_num,
                    article_number=article_num
                )

                if post:
                    db.session.add(post)
                    created_posts.append(post)
                    self.stats['created'] += 1
                    logger.debug(f"Created post: {post.title}")
                elif error and error != "Duplicate URL":
                    self.stats['errors'] += 1
                    self.stats['error_details'].append({
                        'page': page_num,
                        'article': article_num,
                        'error': error
                    })

                self.stats['processed'] += 1

            except IntegrityError as e:
                # Handle unique constraint violations
                db.session.rollback()
                logger.warning(f"Integrity error (likely duplicate): {str(e)}")
                self.stats['skipped'] += 1
                self.stats['processed'] += 1

            except Exception as e:
                db.session.rollback()
                error_msg = f"Unexpected error processing article: {str(e)}"
                logger.error(error_msg, exc_info=True)
                self.stats['errors'] += 1
                self.stats['error_details'].append({
                    'page': page_num,
                    'article': article_num,
                    'error': error_msg
                })
                self.stats['processed'] += 1

        # Commit the batch
        if commit and created_posts:
            try:
                db.session.commit()
                logger.info(f"Successfully committed batch of {len(created_posts)} posts")
            except Exception as e:
                db.session.rollback()
                logger.error(f"Error committing batch: {str(e)}", exc_info=True)
                self.stats['errors'] += len(created_posts)
                created_posts = []

        return created_posts

    def process_all_data(self, data_file: Path = None) -> Dict:
        """
        Process all scraped data and create posts.
        Main entry point for bulk processing.

        Args:
            data_file: Path to data file (uses default from config if None)

        Returns:
            Dictionary containing processing statistics
        """
        if data_file is None:
            data_file = config.SCRAPED_DATA_FILE

        # Create processing log entry
        processing_log = ProcessingLog(status='running')
        db.session.add(processing_log)
        db.session.commit()

        logger.info("=" * 60)
        logger.info("Starting bulk post processing")
        logger.info("=" * 60)

        try:
            # Load data
            scraped_data = self.load_scraped_data(data_file)

            # Prepare articles list
            articles_to_process = []
            for page_key, page_data in scraped_data.items():
                page_number = page_data.get('page_number', int(page_key))
                articles = page_data.get('articles', {})

                for article_key, article_data in articles.items():
                    article_number = int(article_key)
                    articles_to_process.append((article_data, page_number, article_number))

            self.stats['total_articles'] = len(articles_to_process)
            processing_log.total_articles = self.stats['total_articles']
            db.session.commit()

            logger.info(f"Found {self.stats['total_articles']} total articles to process")

            # Process in batches
            batch_size = config.BATCH_SIZE
            total_batches = (len(articles_to_process) + batch_size - 1) // batch_size

            for i in range(0, len(articles_to_process), batch_size):
                batch = articles_to_process[i:i + batch_size]
                batch_num = (i // batch_size) + 1

                logger.info(f"Processing batch {batch_num}/{total_batches} ({len(batch)} articles)")

                self.process_articles_batch(batch, commit=True)

                # Update processing log
                processing_log.processed_articles = self.stats['processed']
                processing_log.created_posts = self.stats['created']
                processing_log.skipped_duplicates = self.stats['skipped']
                processing_log.errors = self.stats['errors']
                db.session.commit()

                logger.info(
                    f"Batch {batch_num} complete - "
                    f"Created: {self.stats['created']}, "
                    f"Skipped: {self.stats['skipped']}, "
                    f"Errors: {self.stats['errors']}"
                )

            # Mark processing as complete
            processing_log.status = 'completed'
            processing_log.completed_at = datetime.utcnow()

            if self.stats['error_details']:
                processing_log.error_details = json.dumps(self.stats['error_details'][:100])  # Limit stored errors

            db.session.commit()

            logger.info("=" * 60)
            logger.info("Processing complete!")
            logger.info(f"Total articles: {self.stats['total_articles']}")
            logger.info(f"Processed: {self.stats['processed']}")
            logger.info(f"Created: {self.stats['created']}")
            logger.info(f"Skipped (duplicates): {self.stats['skipped']}")
            logger.info(f"Errors: {self.stats['errors']}")
            logger.info("=" * 60)

        except Exception as e:
            logger.error(f"Fatal error during processing: {str(e)}", exc_info=True)
            processing_log.status = 'failed'
            processing_log.completed_at = datetime.utcnow()
            processing_log.error_details = str(e)
            db.session.commit()
            raise

        return self.stats

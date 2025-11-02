"""
Database models for storing video posts and metadata.
Uses SQLAlchemy ORM for database interactions.
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Index, UniqueConstraint
import json

db = SQLAlchemy()


class Post(db.Model):
    """
    Post model representing a video content entry.
    Stores video metadata, SEO information, and processing status.
    """
    __tablename__ = 'posts'

    # Primary key
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # Original data reference
    page_number = db.Column(db.Integer, nullable=False, index=True)
    article_number = db.Column(db.Integer, nullable=False)

    # URL and slugs (for duplicate detection)
    original_url = db.Column(db.String(512), unique=True, nullable=False, index=True)
    slug = db.Column(db.String(512), unique=True, nullable=False, index=True)

    # Content fields
    title = db.Column(db.String(255), nullable=False, index=True)
    body = db.Column(db.Text, nullable=False)

    # Media fields
    thumbnail = db.Column(db.String(512), nullable=True)
    video_url = db.Column(db.String(512), nullable=False)
    video_width = db.Column(db.Integer, nullable=True)
    video_height = db.Column(db.Integer, nullable=True)
    video_duration = db.Column(db.String(50), nullable=True)
    video_duration_seconds = db.Column(db.Float, nullable=True)
    video_type = db.Column(db.String(50), default='video')

    # Categorization
    categories = db.Column(db.Text, nullable=True)  # JSON array stored as text
    tags = db.Column(db.Text, nullable=True)  # JSON array stored as text

    # SEO fields
    meta_title = db.Column(db.String(255), nullable=True)
    meta_description = db.Column(db.String(512), nullable=True)
    meta_keywords = db.Column(db.Text, nullable=True)
    structured_data = db.Column(db.Text, nullable=True)  # JSON-LD schema

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Processing status
    is_published = db.Column(db.Boolean, default=True, index=True)
    processing_status = db.Column(db.String(50), default='success', index=True)
    error_message = db.Column(db.Text, nullable=True)

    # Add composite index for efficient querying
    __table_args__ = (
        Index('idx_page_article', 'page_number', 'article_number'),
        Index('idx_created_published', 'created_at', 'is_published'),
    )

    def set_categories(self, categories_list):
        """Store categories as JSON string"""
        self.categories = json.dumps(categories_list) if categories_list else None

    def get_categories(self):
        """Retrieve categories as Python list"""
        return json.loads(self.categories) if self.categories else []

    def set_tags(self, tags_list):
        """Store tags as JSON string"""
        self.tags = json.dumps(tags_list) if tags_list else None

    def get_tags(self):
        """Retrieve tags as Python list"""
        return json.loads(self.tags) if self.tags else []

    def to_dict(self):
        """Convert model to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'page_number': self.page_number,
            'article_number': self.article_number,
            'url': self.original_url,
            'slug': self.slug,
            'title': self.title,
            'body': self.body,
            'thumbnail': self.thumbnail,
            'video_url': self.video_url,
            'video_width': self.video_width,
            'video_height': self.video_height,
            'video_duration': self.video_duration,
            'video_duration_seconds': self.video_duration_seconds,
            'video_type': self.video_type,
            'categories': self.get_categories(),
            'tags': self.get_tags(),
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'meta_keywords': self.meta_keywords,
            'structured_data': json.loads(self.structured_data) if self.structured_data else None,
            'is_published': self.is_published,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f'<Post {self.id}: {self.title[:50]}>'


class ProcessingLog(db.Model):
    """
    Logs for tracking bulk processing operations.
    Maintains history of data imports and processing jobs.
    """
    __tablename__ = 'processing_logs'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    started_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    total_articles = db.Column(db.Integer, default=0)
    processed_articles = db.Column(db.Integer, default=0)
    created_posts = db.Column(db.Integer, default=0)
    skipped_duplicates = db.Column(db.Integer, default=0)
    errors = db.Column(db.Integer, default=0)
    status = db.Column(db.String(50), default='running', index=True)
    error_details = db.Column(db.Text, nullable=True)

    def to_dict(self):
        """Convert log to dictionary"""
        return {
            'id': self.id,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'total_articles': self.total_articles,
            'processed_articles': self.processed_articles,
            'created_posts': self.created_posts,
            'skipped_duplicates': self.skipped_duplicates,
            'errors': self.errors,
            'status': self.status,
            'error_details': self.error_details,
        }

    def __repr__(self):
        return f'<ProcessingLog {self.id}: {self.status}>'

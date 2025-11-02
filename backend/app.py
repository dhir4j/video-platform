"""
Flask Backend Server for SEO-Optimized Post Creation
Main application file with API endpoints for processing scraped data.
"""
import logging
import sys
from pathlib import Path
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

import config
from models import db, Post, ProcessingLog
from services.post_processor import PostProcessor


# Configure logging
logging.basicConfig(
    level=getattr(logging, config.LOG_LEVEL),
    format=config.LOG_FORMAT,
    handlers=[
        logging.FileHandler(config.LOG_FILE),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)


def create_app():
    """
    Application factory function.
    Creates and configures the Flask application.

    Returns:
        Configured Flask application instance
    """
    app = Flask(__name__)

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = config.DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JSON_SORT_KEYS'] = False

    # Enable CORS for frontend integration
    CORS(app)

    # Initialize database
    db.init_app(app)

    # Create tables if they don't exist
    with app.app_context():
        db.create_all()
        logger.info("Database tables initialized")

    return app


# Create application instance
app = create_app()


# ============================================================================
# API Endpoints
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint.
    Returns server status and database connectivity.
    """
    try:
        # Test database connection
        db.session.execute(db.text('SELECT 1'))

        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'database': 'connected'
        }), 200
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            'status': 'unhealthy',
            'timestamp': datetime.utcnow().isoformat(),
            'error': str(e)
        }), 500


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """
    Get current database statistics.
    Returns counts of posts, categories, processing logs, etc.
    """
    try:
        total_posts = Post.query.count()
        published_posts = Post.query.filter_by(is_published=True).count()

        # Get recent processing logs
        recent_logs = ProcessingLog.query.order_by(
            ProcessingLog.started_at.desc()
        ).limit(5).all()

        # Get category distribution
        all_posts = Post.query.all()
        category_counts = {}
        for post in all_posts:
            for category in post.get_categories():
                category_counts[category] = category_counts.get(category, 0) + 1

        return jsonify({
            'total_posts': total_posts,
            'published_posts': published_posts,
            'unpublished_posts': total_posts - published_posts,
            'categories': len(category_counts),
            'category_distribution': category_counts,
            'recent_processing_logs': [log.to_dict() for log in recent_logs]
        }), 200
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500


@app.route('/api/process', methods=['POST'])
def process_data():
    """
    Trigger bulk processing of scraped data.
    Processes all articles from the JSON file and creates posts.

    Request body (optional):
        {
            "data_file": "/path/to/custom/data.json"
        }

    Returns:
        Processing statistics and results
    """
    try:
        logger.info("Received request to process data")

        # Get optional custom data file path
        data = request.get_json() or {}
        custom_data_file = data.get('data_file')

        if custom_data_file:
            data_file_path = Path(custom_data_file)
        else:
            data_file_path = config.SCRAPED_DATA_FILE

        # Initialize processor
        processor = PostProcessor(app=app)

        # Process all data
        with app.app_context():
            stats = processor.process_all_data(data_file=data_file_path)

        logger.info(f"Processing completed. Stats: {stats}")

        return jsonify({
            'status': 'success',
            'message': 'Data processing completed',
            'statistics': stats
        }), 200

    except FileNotFoundError as e:
        logger.error(f"Data file not found: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Data file not found',
            'error': str(e)
        }), 404

    except Exception as e:
        logger.error(f"Error processing data: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': 'Error processing data',
            'error': str(e)
        }), 500


@app.route('/api/posts', methods=['GET'])
def get_posts():
    """
    Get posts with pagination and filtering.

    Query parameters:
        - page: Page number (default: 1)
        - per_page: Items per page (default: 20, max: 100)
        - category: Filter by category
        - published: Filter by published status (true/false)
        - search: Search in title and body

    Returns:
        Paginated list of posts
    """
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        category = request.args.get('category')
        published = request.args.get('published')
        search_query = request.args.get('search')

        # Build query
        query = Post.query

        # Apply filters
        if published is not None:
            is_published = published.lower() == 'true'
            query = query.filter_by(is_published=is_published)

        if search_query:
            search_pattern = f"%{search_query}%"
            query = query.filter(
                db.or_(
                    Post.title.ilike(search_pattern),
                    Post.body.ilike(search_pattern)
                )
            )

        # Category filter (requires scanning JSON field - less efficient)
        if category:
            all_posts = query.all()
            filtered_posts = [
                post for post in all_posts
                if category in post.get_categories()
            ]
            total = len(filtered_posts)
            start = (page - 1) * per_page
            end = start + per_page
            posts = filtered_posts[start:end]
        else:
            # Paginate
            pagination = query.order_by(Post.created_at.desc()).paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
            posts = pagination.items
            total = pagination.total

        return jsonify({
            'posts': [post.to_dict() for post in posts],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'pages': (total + per_page - 1) // per_page
            }
        }), 200

    except Exception as e:
        logger.error(f"Error getting posts: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500


@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    """
    Get a single post by ID.

    Args:
        post_id: Post ID

    Returns:
        Post details with all metadata
    """
    try:
        post = Post.query.get_or_404(post_id)
        return jsonify(post.to_dict()), 200
    except Exception as e:
        logger.error(f"Error getting post {post_id}: {str(e)}")
        return jsonify({'error': str(e)}), 404


@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    """
    Update a post.

    Args:
        post_id: Post ID

    Request body:
        Fields to update (title, body, is_published, etc.)

    Returns:
        Updated post data
    """
    try:
        post = Post.query.get_or_404(post_id)
        data = request.get_json()

        # Update allowed fields
        allowed_fields = [
            'title', 'body', 'is_published', 'meta_title',
            'meta_description', 'meta_keywords'
        ]

        for field in allowed_fields:
            if field in data:
                setattr(post, field, data[field])

        # Update tags and categories if provided
        if 'tags' in data:
            post.set_tags(data['tags'])

        if 'categories' in data:
            post.set_categories(data['categories'])

        post.updated_at = datetime.utcnow()
        db.session.commit()

        logger.info(f"Updated post {post_id}")
        return jsonify(post.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating post {post_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    """
    Delete a post.

    Args:
        post_id: Post ID

    Returns:
        Success message
    """
    try:
        post = Post.query.get_or_404(post_id)
        db.session.delete(post)
        db.session.commit()

        logger.info(f"Deleted post {post_id}")
        return jsonify({'message': f'Post {post_id} deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting post {post_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/processing-logs', methods=['GET'])
def get_processing_logs():
    """
    Get processing logs with pagination.

    Query parameters:
        - page: Page number (default: 1)
        - per_page: Items per page (default: 10)

    Returns:
        Paginated list of processing logs
    """
    try:
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 10, type=int), 50)

        pagination = ProcessingLog.query.order_by(
            ProcessingLog.started_at.desc()
        ).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        return jsonify({
            'logs': [log.to_dict() for log in pagination.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        }), 200

    except Exception as e:
        logger.error(f"Error getting processing logs: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/categories', methods=['GET'])
def get_categories():
    """
    Get all unique categories with post counts.

    Returns:
        List of categories with statistics
    """
    try:
        all_posts = Post.query.filter_by(is_published=True).all()

        category_stats = {}
        for post in all_posts:
            for category in post.get_categories():
                if category not in category_stats:
                    category_stats[category] = {
                        'name': category,
                        'count': 0,
                        'slug': category.lower().replace(' ', '-')
                    }
                category_stats[category]['count'] += 1

        categories = sorted(
            category_stats.values(),
            key=lambda x: x['count'],
            reverse=True
        )

        return jsonify({
            'categories': categories,
            'total': len(categories)
        }), 200

    except Exception as e:
        logger.error(f"Error getting categories: {str(e)}")
        return jsonify({'error': str(e)}), 500


# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Resource not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    db.session.rollback()
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500


# ============================================================================
# Main Entry Point
# ============================================================================

if __name__ == '__main__':
    logger.info("=" * 60)
    logger.info("Starting Flask Backend Server")
    logger.info(f"Host: {config.FLASK_HOST}")
    logger.info(f"Port: {config.FLASK_PORT}")
    logger.info(f"Debug: {config.FLASK_DEBUG}")
    logger.info(f"Database: {config.DATABASE_URI}")
    logger.info("=" * 60)

    app.run(
        host=config.FLASK_HOST,
        port=config.FLASK_PORT,
        debug=config.FLASK_DEBUG
    )

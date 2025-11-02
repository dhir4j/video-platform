# SEO-Optimized Post Creation Backend

A Flask-based backend server that automates the creation of SEO-optimized posts from scraped video platform data. Designed to efficiently process up to 18,000+ entries with duplicate detection, comprehensive error handling, and structured data generation.

## Features

- **Automated Post Creation**: Processes JSON data and creates database entries automatically
- **SEO Optimization**:
  - Auto-generated meta titles, descriptions, and keywords
  - Schema.org VideoObject structured data (JSON-LD)
  - Breadcrumb navigation markup
  - Optimized slugs and URLs
- **Duplicate Detection**: Smart URL-based duplicate prevention
- **Batch Processing**: Efficient handling of large datasets with configurable batch sizes
- **Error Handling**: Comprehensive logging and error tracking
- **REST API**: Full CRUD operations for posts and metadata
- **Processing Logs**: Track all bulk processing operations with detailed statistics

## Architecture

```
backend/
├── app.py                 # Main Flask application with API endpoints
├── config.py             # Configuration and environment settings
├── models.py             # SQLAlchemy database models
├── requirements.txt      # Python dependencies
├── services/
│   └── post_processor.py # Bulk processing logic
├── utils/
│   └── seo_utils.py      # SEO optimization utilities
└── logs/
    └── post_processor.log # Application logs
```

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Setup Steps

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   # On Linux/Mac
   python3 -m venv venv
   source venv/bin/activate

   # On Windows
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables** (optional):
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Initialize the database**:
   The database will be automatically created when you first run the server.

## Configuration

Edit `config.py` or set environment variables to customize:

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_HOST` | Server host address | `0.0.0.0` |
| `FLASK_PORT` | Server port | `5000` |
| `FLASK_DEBUG` | Debug mode | `False` |
| `SITE_URL` | Your site's base URL | `https://www.ytplatform.com` |
| `SITE_NAME` | Site name for SEO | `YT Platform` |
| `LOG_LEVEL` | Logging level | `INFO` |
| `BATCH_SIZE` | Processing batch size | `100` |

## Running the Server

### Development Mode

```bash
python app.py
```

The server will start on `http://localhost:5000`

### Production Mode

Using Gunicorn (recommended for production):

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

Options:
- `-w 4`: Use 4 worker processes
- `-b 0.0.0.0:5000`: Bind to all interfaces on port 5000

## API Endpoints

### Health Check

```http
GET /api/health
```

Check server and database connectivity.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-03-15T10:30:00",
  "database": "connected"
}
```

### Get Statistics

```http
GET /api/stats
```

Get current database statistics and category distribution.

**Response**:
```json
{
  "total_posts": 4,
  "published_posts": 4,
  "unpublished_posts": 0,
  "categories": 4,
  "category_distribution": {
    "Cooking": 1,
    "Fitness": 1,
    "DIY": 1,
    "Education": 1
  },
  "recent_processing_logs": [...]
}
```

### Process Scraped Data

```http
POST /api/process
Content-Type: application/json

{
  "data_file": "/path/to/data.json"  // Optional, uses default if not provided
}
```

Triggers bulk processing of scraped data from JSON file.

**Response**:
```json
{
  "status": "success",
  "message": "Data processing completed",
  "statistics": {
    "total_articles": 4,
    "processed": 4,
    "created": 4,
    "skipped": 0,
    "errors": 0
  }
}
```

### Get Posts (Paginated)

```http
GET /api/posts?page=1&per_page=20&category=Cooking&published=true&search=pasta
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20, max: 100)
- `category`: Filter by category
- `published`: Filter by published status (`true`/`false`)
- `search`: Search in title and body

**Response**:
```json
{
  "posts": [
    {
      "id": 1,
      "title": "Cooking Tutorial: Make Delicious Pasta Carbonara In 20 Minutes",
      "slug": "cooking-tutorial-make-delicious-pasta-carbonara-in-20-minutes",
      "body": "...",
      "thumbnail": "https://...",
      "video_url": "https://...",
      "categories": ["Cooking"],
      "tags": ["cooking tutorial", "pasta recipe", ...],
      "meta_title": "...",
      "meta_description": "...",
      "structured_data": {...},
      "created_at": "2024-03-15T10:30:00"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 4,
    "pages": 1
  }
}
```

### Get Single Post

```http
GET /api/posts/{id}
```

**Response**: Same as individual post object above.

### Update Post

```http
PUT /api/posts/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "body": "Updated body content",
  "is_published": true,
  "tags": ["tag1", "tag2"],
  "categories": ["Category1"]
}
```

### Delete Post

```http
DELETE /api/posts/{id}
```

**Response**:
```json
{
  "message": "Post 1 deleted successfully"
}
```

### Get Categories

```http
GET /api/categories
```

Get all unique categories with post counts.

**Response**:
```json
{
  "categories": [
    {
      "name": "Cooking",
      "slug": "cooking",
      "count": 1
    }
  ],
  "total": 4
}
```

### Get Processing Logs

```http
GET /api/processing-logs?page=1&per_page=10
```

View history of all bulk processing operations.

## Usage Examples

### 1. Process the Scraped Data

After placing your `scraped_pages.json` in the `/data` directory:

```bash
curl -X POST http://localhost:5000/api/process
```

The server will:
1. Load all pages and articles from the JSON file
2. Validate each article's required fields
3. Check for duplicates using URLs
4. Generate SEO metadata (meta tags, structured data)
5. Save posts to the database in batches
6. Log all operations with detailed statistics

### 2. View Processing Results

```bash
curl http://localhost:5000/api/stats
```

### 3. Retrieve Posts

```bash
# Get all posts
curl http://localhost:5000/api/posts

# Get posts in a specific category
curl http://localhost:5000/api/posts?category=Cooking

# Search posts
curl http://localhost:5000/api/posts?search=pasta
```

### 4. Get a Specific Post

```bash
curl http://localhost:5000/api/posts/1
```

## SEO Features Explained

### Meta Tags

Each post automatically receives:
- **Meta Title**: Optimized title (max 60 characters)
- **Meta Description**: Compelling description (max 160 characters)
- **Meta Keywords**: Extracted from tags and categories

### Structured Data (JSON-LD)

Two types of structured data are generated:

1. **VideoObject Schema**: Helps search engines understand video content
   - Video metadata (duration, thumbnail, upload date)
   - Engagement actions (WatchAction)
   - Keywords and categories

2. **BreadcrumbList Schema**: Improves site navigation in search results
   - Hierarchical navigation path
   - Category-based organization

### URL Structure

Posts use SEO-friendly slugs extracted from original URLs:
- `/videos/cooking-tutorial-make-delicious-pasta-carbonara-in-20-minutes/`
- Clean, readable URLs
- Hyphen-separated words
- Lowercase format

## Database Schema

### Posts Table

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| page_number | Integer | Source page number |
| article_number | Integer | Article number within page |
| original_url | String | Original URL (unique) |
| slug | String | SEO-friendly slug (unique) |
| title | String | Post title |
| body | Text | Post content/description |
| thumbnail | String | Thumbnail image URL |
| video_url | String | Video file URL |
| video_width/height | Integer | Video dimensions |
| video_duration | String | Duration (MM:SS format) |
| video_duration_seconds | Float | Duration in seconds |
| categories | JSON | Array of categories |
| tags | JSON | Array of tags |
| meta_title | String | SEO meta title |
| meta_description | String | SEO meta description |
| meta_keywords | String | SEO keywords |
| structured_data | JSON | JSON-LD schema |
| is_published | Boolean | Publication status |
| created_at | DateTime | Creation timestamp |
| updated_at | DateTime | Last update timestamp |

### Processing Logs Table

Tracks all bulk processing operations with statistics and error details.

## Error Handling

The system includes comprehensive error handling:

1. **Validation Errors**: Missing required fields are logged
2. **Duplicate Detection**: Skips existing URLs without errors
3. **Database Errors**: Automatic rollback on failures
4. **Batch Processing**: Errors in one batch don't affect others
5. **Detailed Logging**: All errors logged with context

## Logging

Logs are written to:
- **File**: `backend/logs/post_processor.log`
- **Console**: Standard output

Log levels:
- INFO: Normal operations and statistics
- WARNING: Skipped duplicates and validation issues
- ERROR: Processing errors and failures

## Performance Optimization

For processing 18,000+ entries:

1. **Batch Processing**: Configured batch size (default: 100)
2. **Database Indexing**: Optimized queries with indexes
3. **Memory Management**: Processes data in chunks
4. **Transaction Batching**: Commits in batches to reduce I/O

## Troubleshooting

### Server won't start

- Check if port 5000 is already in use
- Verify Python version (3.8+)
- Ensure all dependencies are installed

### Database errors

- Delete `posts.db` and restart to recreate tables
- Check file permissions in the backend directory

### Processing failures

- Verify JSON file exists at `/data/scraped_pages.json`
- Check JSON file format matches expected structure
- Review logs in `backend/logs/post_processor.log`

### Out of memory errors

- Reduce `BATCH_SIZE` in `config.py`
- Process data in smaller chunks
- Increase available system memory

## Development

### Running Tests

```bash
# Install dev dependencies
pip install pytest pytest-flask

# Run tests
pytest
```

### Code Structure

- **app.py**: Flask routes and API endpoints
- **models.py**: Database models (Post, ProcessingLog)
- **services/post_processor.py**: Core processing logic
- **utils/seo_utils.py**: SEO utility functions
- **config.py**: Centralized configuration

## Future Enhancements

Potential improvements:
- [ ] Background job processing with Celery
- [ ] Progress tracking for long-running operations
- [ ] Image optimization and CDN integration
- [ ] Advanced search with Elasticsearch
- [ ] Rate limiting and caching
- [ ] Admin dashboard UI
- [ ] Export functionality (CSV, JSON)
- [ ] Automated sitemap generation

## License

This project is part of the video-platform application.

## Support

For issues or questions:
1. Check the logs in `backend/logs/post_processor.log`
2. Review the API response error messages
3. Consult this documentation

---

**Version**: 1.0.0
**Last Updated**: November 2024

# Quick Start Guide

Get the Flask backend server up and running in 5 minutes.

## 1. Install Dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 2. Start the Server

```bash
python app.py
```

Or use the convenience script:
```bash
./run.sh
```

The server will start on `http://localhost:5000`

## 3. Verify Installation

Check server health:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-03-15T10:30:00",
  "database": "connected"
}
```

## 4. Process Your Data

Make sure your `scraped_pages.json` file is in the `/data` directory, then:

```bash
curl -X POST http://localhost:5000/api/process
```

This will:
- Read all articles from the JSON file
- Create SEO-optimized posts
- Skip duplicates automatically
- Log all operations

## 5. View Results

Get statistics:
```bash
curl http://localhost:5000/api/stats
```

Get all posts:
```bash
curl http://localhost:5000/api/posts
```

## Common Commands

```bash
# Get posts in a category
curl http://localhost:5000/api/posts?category=Cooking

# Search posts
curl http://localhost:5000/api/posts?search=tutorial

# Get specific post
curl http://localhost:5000/api/posts/1

# Get all categories
curl http://localhost:5000/api/categories

# View processing logs
curl http://localhost:5000/api/processing-logs
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize settings in `config.py`
- Integrate with your frontend application
- Set up for production with Gunicorn

## Need Help?

Check the logs:
```bash
tail -f logs/post_processor.log
```

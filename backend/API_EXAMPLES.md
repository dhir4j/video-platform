# API Examples and Usage

Complete examples for testing all API endpoints.

## Prerequisites

Server running on `http://localhost:5000`

## 1. Health Check

```bash
curl http://localhost:5000/api/health
```

## 2. Get Current Statistics

```bash
curl http://localhost:5000/api/stats
```

Response:
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

## 3. Process Scraped Data

Process the default data file:

```bash
curl -X POST http://localhost:5000/api/process \
  -H "Content-Type: application/json"
```

Process a custom data file:

```bash
curl -X POST http://localhost:5000/api/process \
  -H "Content-Type: application/json" \
  -d '{"data_file": "/path/to/custom/data.json"}'
```

Response:
```json
{
  "status": "success",
  "message": "Data processing completed",
  "statistics": {
    "total_articles": 4,
    "processed": 4,
    "created": 4,
    "skipped": 0,
    "errors": 0,
    "error_details": []
  }
}
```

## 4. Get Posts (with Filtering)

### Get all posts (paginated)

```bash
curl "http://localhost:5000/api/posts?page=1&per_page=20"
```

### Filter by category

```bash
curl "http://localhost:5000/api/posts?category=Cooking"
```

### Search posts

```bash
curl "http://localhost:5000/api/posts?search=tutorial"
```

### Get published posts only

```bash
curl "http://localhost:5000/api/posts?published=true"
```

### Combine filters

```bash
curl "http://localhost:5000/api/posts?category=Cooking&published=true&page=1&per_page=10"
```

Response:
```json
{
  "posts": [
    {
      "id": 1,
      "page_number": 947,
      "article_number": 1,
      "url": "https://www.ytplatform.com/videos/cooking-tutorial-make-delicious-pasta-carbonara-in-20-minutes/",
      "slug": "cooking-tutorial-make-delicious-pasta-carbonara-in-20-minutes",
      "title": "Cooking Tutorial: Make Delicious Pasta Carbonara In 20 Minutes",
      "body": "Learn how to make authentic Italian pasta carbonara...",
      "thumbnail": "https://www.ytplatform.com/wp-content/uploads/2024/03/pasta-carbonara-tutorial.gif",
      "video_url": "https://cdn.ytplatform.com/2024/03/cooking-tutorial-pasta-carbonara-20-minutes.mp4",
      "video_width": 444,
      "video_height": 251,
      "video_duration": "5:58",
      "video_duration_seconds": 358.48,
      "video_type": "video",
      "categories": ["Cooking"],
      "tags": ["cooking tutorial", "pasta recipe", "italian food", ...],
      "meta_title": "Cooking Tutorial: Make Delicious Pasta Carbonara In 20...",
      "meta_description": "Learn how to make authentic Italian pasta carbonara in just 20 minutes...",
      "meta_keywords": "Cooking, cooking tutorial, pasta recipe, italian food",
      "structured_data": {...},
      "is_published": true,
      "created_at": "2024-03-15T10:30:00",
      "updated_at": "2024-03-15T10:30:00"
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

## 5. Get Single Post

```bash
curl http://localhost:5000/api/posts/1
```

## 6. Update Post

```bash
curl -X PUT http://localhost:5000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "body": "Updated body content",
    "meta_description": "Updated meta description",
    "is_published": true
  }'
```

Update categories and tags:

```bash
curl -X PUT http://localhost:5000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "categories": ["Cooking", "Tutorial"],
    "tags": ["cooking", "pasta", "italian", "recipe", "quick meals"]
  }'
```

## 7. Delete Post

```bash
curl -X DELETE http://localhost:5000/api/posts/1
```

Response:
```json
{
  "message": "Post 1 deleted successfully"
}
```

## 8. Get All Categories

```bash
curl http://localhost:5000/api/categories
```

Response:
```json
{
  "categories": [
    {
      "name": "Cooking",
      "slug": "cooking",
      "count": 1
    },
    {
      "name": "Fitness",
      "slug": "fitness",
      "count": 1
    },
    {
      "name": "DIY",
      "slug": "diy",
      "count": 1
    },
    {
      "name": "Education",
      "slug": "education",
      "count": 1
    }
  ],
  "total": 4
}
```

## 9. Get Processing Logs

```bash
curl "http://localhost:5000/api/processing-logs?page=1&per_page=10"
```

Response:
```json
{
  "logs": [
    {
      "id": 1,
      "started_at": "2024-03-15T10:00:00",
      "completed_at": "2024-03-15T10:05:00",
      "total_articles": 4,
      "processed_articles": 4,
      "created_posts": 4,
      "skipped_duplicates": 0,
      "errors": 0,
      "status": "completed",
      "error_details": null
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 1,
    "pages": 1
  }
}
```

## Using with JavaScript/Fetch

### Process data

```javascript
fetch('http://localhost:5000/api/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Get posts

```javascript
fetch('http://localhost:5000/api/posts?category=Cooking')
  .then(response => response.json())
  .then(data => {
    console.log('Posts:', data.posts);
    console.log('Pagination:', data.pagination);
  })
  .catch(error => console.error('Error:', error));
```

### Update post

```javascript
fetch('http://localhost:5000/api/posts/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Updated Title',
    is_published: true
  })
})
  .then(response => response.json())
  .then(data => console.log('Updated:', data))
  .catch(error => console.error('Error:', error));
```

## Using with Python

```python
import requests

# Process data
response = requests.post('http://localhost:5000/api/process')
print(response.json())

# Get posts with filters
params = {
    'category': 'Cooking',
    'published': 'true',
    'page': 1,
    'per_page': 20
}
response = requests.get('http://localhost:5000/api/posts', params=params)
posts_data = response.json()

# Update post
update_data = {
    'title': 'Updated Title',
    'is_published': True
}
response = requests.put('http://localhost:5000/api/posts/1', json=update_data)
print(response.json())

# Get categories
response = requests.get('http://localhost:5000/api/categories')
categories = response.json()
```

## Postman Collection

Import this JSON into Postman for easy testing:

```json
{
  "info": {
    "name": "SEO Post Creator API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/health"
      }
    },
    {
      "name": "Get Stats",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/stats"
      }
    },
    {
      "name": "Process Data",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/process",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{}"
        }
      }
    },
    {
      "name": "Get Posts",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:5000/api/posts?page=1&per_page=20",
          "query": [
            {"key": "page", "value": "1"},
            {"key": "per_page", "value": "20"}
          ]
        }
      }
    },
    {
      "name": "Get Single Post",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/posts/1"
      }
    },
    {
      "name": "Update Post",
      "request": {
        "method": "PUT",
        "url": "http://localhost:5000/api/posts/1",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Updated Title\",\n  \"is_published\": true\n}"
        }
      }
    },
    {
      "name": "Delete Post",
      "request": {
        "method": "DELETE",
        "url": "http://localhost:5000/api/posts/1"
      }
    },
    {
      "name": "Get Categories",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/categories"
      }
    },
    {
      "name": "Get Processing Logs",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/processing-logs"
      }
    }
  ]
}
```

## Error Responses

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

### Processing Error

```json
{
  "status": "error",
  "message": "Data file not found",
  "error": "Data file not found: /path/to/file.json"
}
```

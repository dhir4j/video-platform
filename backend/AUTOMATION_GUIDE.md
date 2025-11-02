# Complete Automation Guide

This guide explains the complete automation workflow for your video platform, from data scraping to displaying posts on the frontend.

## Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                         AUTOMATION FLOW                             │
└────────────────────────────────────────────────────────────────────┘

1. Automation Script (Python)
   └──> Scrapes new video data
   └──> Updates scraped_pages.json
   └──> (Optional) Triggers webhook

2. Backend Server (myserverwebsite.com)
   └──> File Watcher monitors JSON file
   └──> Detects changes automatically (every 5 minutes)
   └──> Post Processor creates SEO-optimized posts
   └──> Stores in database
   └──> Serves via REST API

3. Frontend (frontendwebsite.com)
   └──> Fetches posts via API
   └──> Displays to users with SEO optimization
```

## Architecture

### Components

1. **Automation Script** (`automation_example.py`)
   - Scrapes/fetches new video data
   - Merges with existing data
   - Updates JSON file
   - Triggers backend via webhook

2. **File Watcher** (`services/file_watcher.py`)
   - Monitors `scraped_pages.json` for changes
   - Uses file hash and timestamp detection
   - Triggers processing when changes detected

3. **Scheduler** (`services/scheduler.py`)
   - Runs periodic checks (every N minutes)
   - Uses APScheduler for reliability
   - Supports cron expressions

4. **Post Processor** (`services/post_processor.py`)
   - Creates SEO-optimized posts
   - Generates meta tags and structured data
   - Handles duplicate detection
   - Batch processing for efficiency

5. **REST API** (`app.py`)
   - Serves posts to frontend
   - CORS-enabled for cross-origin requests
   - Provides automation control endpoints

## Setup

### 1. Backend Configuration

Create a `.env` file in the backend directory:

```env
# Backend Configuration
BACKEND_URL=https://myserverwebsite.com
FRONTEND_URL=https://frontendwebsite.com

# CORS - Allow frontend to make requests
CORS_ORIGINS=https://frontendwebsite.com

# Automation Settings
AUTO_PROCESS_ENABLED=True      # Enable automatic processing
CHECK_INTERVAL_MINUTES=5       # Check for updates every 5 minutes

# Optional: Use cron expression instead
# CRON_SCHEDULE=0 */6 * * *    # Every 6 hours

# SEO Configuration
SITE_URL=https://frontendwebsite.com
SITE_NAME=Your Platform Name
```

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Required packages:
- Flask (web framework)
- Flask-SQLAlchemy (database ORM)
- Flask-CORS (cross-origin requests)
- APScheduler (task scheduling)

### 3. Start Backend Server

```bash
python app.py
```

The server will:
- Start on port 5000 (configurable)
- Initialize database
- Start file watcher (if enabled)
- Start scheduler (if enabled)
- Serve REST API

## Usage

### Method 1: Automatic Monitoring (Recommended)

The backend automatically monitors the JSON file and processes new data.

1. **Start the backend server**:
   ```bash
   python app.py
   ```

2. **Update your data file**:
   ```bash
   # Your automation script updates the file
   python your_scraper.py
   ```

3. **Backend auto-detects and processes**:
   - File watcher detects changes within 5 minutes (configurable)
   - Post processor creates SEO-optimized posts
   - New posts available via API immediately

**How it works**:
- Scheduler checks file every `CHECK_INTERVAL_MINUTES`
- File watcher compares file hash and timestamp
- If changed, triggers automatic processing
- All operations logged to `logs/post_processor.log`

### Method 2: Webhook Trigger (Fastest)

For immediate processing, trigger via webhook after updating data.

1. **Update data and call webhook**:
   ```python
   import requests
   import json

   # Update your JSON file
   # ... your scraping logic ...

   # Trigger immediate processing
   response = requests.post(
       'https://myserverwebsite.com/api/webhook/data-updated',
       json={
           'source': 'my_scraper',
           'force': False  # Set to True to force processing
       }
   )

   print(response.json())
   ```

2. **Using the provided automation script**:
   ```bash
   # Edit automation_example.py with your scraping logic
   python automation_example.py
   ```

   The script will:
   - Fetch new data
   - Merge with existing data
   - Save to JSON file
   - Trigger webhook
   - Log all operations

### Method 3: Manual Trigger

Trigger processing manually via API:

```bash
# Check for updates and process if changed
curl -X POST https://myserverwebsite.com/api/automation/check-now

# Force processing (ignores change detection)
curl -X POST https://myserverwebsite.com/api/webhook/data-updated \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

## API Endpoints

### Automation Control

#### Get Automation Status

```bash
GET /api/automation/status
```

Response:
```json
{
  "enabled": true,
  "scheduler": {
    "is_running": true,
    "jobs": [
      {
        "id": "check_data_updates",
        "name": "Check for data file updates",
        "next_run": "2024-03-15T10:35:00",
        "trigger": "interval[0:05:00]"
      }
    ]
  },
  "file_monitor": {
    "is_running": true,
    "file_path": "/path/to/data/scraped_pages.json",
    "check_interval": 300,
    "processing_count": 5,
    "last_processed": "2024-03-15T10:30:00",
    "file_exists": true,
    "last_modified": "2024-03-15T10:29:45"
  },
  "config": {
    "check_interval_minutes": 5,
    "data_file": "/path/to/scraped_pages.json",
    "cron_schedule": null
  }
}
```

#### Trigger Manual Check

```bash
POST /api/automation/check-now
```

Response if changes detected:
```json
{
  "status": "success",
  "message": "Data file updated - processing completed",
  "processed": true
}
```

Response if no changes:
```json
{
  "status": "success",
  "message": "No changes detected in data file",
  "processed": false
}
```

#### Webhook for Automation Scripts

```bash
POST /api/webhook/data-updated
Content-Type: application/json

{
  "source": "automation_script",
  "force": false
}
```

Response:
```json
{
  "status": "success",
  "message": "Data updated and processed",
  "processed": true
}
```

Or with force processing:
```bash
POST /api/webhook/data-updated
Content-Type: application/json

{
  "source": "automation_script",
  "force": true
}
```

Response:
```json
{
  "status": "success",
  "message": "Forced processing completed",
  "statistics": {
    "total_articles": 100,
    "processed": 100,
    "created": 15,
    "skipped": 85,
    "errors": 0
  }
}
```

## Automation Script Example

### Basic Template

```python
import json
import requests
from pathlib import Path

# Configuration
DATA_FILE = "../data/scraped_pages.json"
BACKEND_URL = "https://myserverwebsite.com"
WEBHOOK_URL = f"{BACKEND_URL}/api/webhook/data-updated"

def fetch_new_data():
    """
    Replace with your actual scraping logic.
    Should return data in the same format as scraped_pages.json
    """
    # Your scraping code here
    new_data = {
        "1000": {
            "page_number": 1000,
            "total_articles": 5,
            "scraped_articles": 5,
            "articles": {
                # ... your articles ...
            }
        }
    }
    return new_data

def merge_and_save(new_data):
    """Merge new data with existing and save"""
    data_file = Path(DATA_FILE)

    # Load existing
    if data_file.exists():
        with open(data_file, 'r') as f:
            existing = json.load(f)
    else:
        existing = {}

    # Merge
    existing.update(new_data)

    # Save
    with open(data_file, 'w') as f:
        json.dump(existing, f, indent=4)

    return len(existing)

def trigger_webhook():
    """Notify backend that data was updated"""
    try:
        response = requests.post(
            WEBHOOK_URL,
            json={"source": "my_scraper"},
            timeout=30
        )
        return response.json()
    except Exception as e:
        print(f"Webhook failed: {e}")
        return None

# Main automation
if __name__ == '__main__':
    print("Fetching new data...")
    new_data = fetch_new_data()

    print("Merging and saving...")
    total_pages = merge_and_save(new_data)
    print(f"Total pages: {total_pages}")

    print("Triggering backend webhook...")
    result = trigger_webhook()
    print(f"Result: {result}")
```

### Using the Provided Example

The `automation_example.py` file provides a complete template:

```bash
# 1. Customize the fetch_new_data() method
nano automation_example.py

# 2. Update configuration
# - DATA_FILE_PATH
# - BACKEND_URL

# 3. Run the script
python automation_example.py
```

## Scheduling Automation

### Option 1: Cron Job (Linux/Mac)

```bash
# Edit crontab
crontab -e

# Add entry to run every hour
0 * * * * cd /path/to/backend && python automation_example.py >> logs/automation.log 2>&1

# Or every 6 hours
0 */6 * * * cd /path/to/backend && python automation_example.py >> logs/automation.log 2>&1
```

### Option 2: Windows Task Scheduler

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (e.g., Daily at 2 AM)
4. Action: Start a program
5. Program: `python`
6. Arguments: `C:\path\to\backend\automation_example.py`

### Option 3: Systemd Service (Linux)

Create `/etc/systemd/system/video-scraper.timer`:

```ini
[Unit]
Description=Video Scraper Timer

[Timer]
OnCalendar=*:0/6  # Every 6 hours
Persistent=true

[Install]
WantedBy=timers.target
```

Create `/etc/systemd/system/video-scraper.service`:

```ini
[Unit]
Description=Video Scraper Service

[Service]
Type=oneshot
WorkingDirectory=/path/to/backend
ExecStart=/usr/bin/python3 automation_example.py
User=your-user
```

Enable and start:
```bash
sudo systemctl enable video-scraper.timer
sudo systemctl start video-scraper.timer
```

## Monitoring

### Check Automation Status

```bash
curl https://myserverwebsite.com/api/automation/status | jq
```

### View Processing Logs

```bash
# Backend logs
tail -f backend/logs/post_processor.log

# Grep for errors
grep ERROR backend/logs/post_processor.log

# Grep for automation triggers
grep "NEW DATA DETECTED" backend/logs/post_processor.log
```

### View Processing History

```bash
# Get recent processing logs
curl https://myserverwebsite.com/api/processing-logs | jq
```

### Check Stats

```bash
curl https://myserverwebsite.com/api/stats | jq
```

## Troubleshooting

### Issue: Automation not running

**Check if enabled**:
```bash
curl https://myserverwebsite.com/api/automation/status
```

**Verify config**:
```bash
# Check .env file
cat backend/.env | grep AUTO_PROCESS
```

Should show:
```
AUTO_PROCESS_ENABLED=True
```

### Issue: File changes not detected

**Verify file path**:
```bash
curl https://myserverwebsite.com/api/automation/status | jq '.file_monitor.file_path'
```

**Check file modification time**:
```bash
ls -la /path/to/data/scraped_pages.json
```

**Manually trigger check**:
```bash
curl -X POST https://myserverwebsite.com/api/automation/check-now
```

### Issue: Webhook not working

**Test backend health**:
```bash
curl https://myserverwebsite.com/api/health
```

**Test webhook directly**:
```bash
curl -X POST https://myserverwebsite.com/api/webhook/data-updated \
  -H "Content-Type: application/json" \
  -d '{"source": "test", "force": true}'
```

**Check CORS if calling from script**:
- Verify backend is accessible from your automation server
- Check firewall rules
- Verify HTTPS certificates

### Issue: Duplicates being created

The system uses URL-based duplicate detection. If duplicates appear:

1. **Check for URL variations**:
   - `http://` vs `https://`
   - Trailing slashes
   - Query parameters

2. **Normalize URLs in your scraper**:
   ```python
   def normalize_url(url):
       # Remove trailing slash
       url = url.rstrip('/')
       # Force https
       url = url.replace('http://', 'https://')
       return url
   ```

## Best Practices

### 1. Incremental Updates

Don't re-scrape all data every time:

```python
# Track last scraped page
last_page = load_last_page()

# Only scrape new pages
new_data = scrape_pages(start=last_page + 1, end=last_page + 50)

# Save progress
save_last_page(last_page + 50)
```

### 2. Error Handling

```python
try:
    new_data = fetch_new_data()
    merge_and_save(new_data)
    trigger_webhook()
except Exception as e:
    # Log error
    logger.error(f"Automation failed: {e}")
    # Send alert (email, Slack, etc.)
    send_alert(f"Scraping failed: {e}")
```

### 3. Rate Limiting

```python
import time

for page in pages:
    scrape_page(page)
    time.sleep(2)  # Be nice to the source server
```

### 4. Logging

```python
import logging

logging.basicConfig(
    filename='automation.log',
    level=logging.INFO,
    format='%(asctime)s - %(message)s'
)

logger.info(f"Scraped {count} articles")
```

## Performance Tuning

### Adjust Check Interval

```env
# Check more frequently
CHECK_INTERVAL_MINUTES=1

# Check less frequently (save resources)
CHECK_INTERVAL_MINUTES=30
```

### Use Cron for Specific Times

```env
# Instead of interval, use cron
CHECK_INTERVAL_MINUTES=60
CRON_SCHEDULE=0 2,8,14,20 * * *  # At 2am, 8am, 2pm, 8pm
```

### Batch Size

```env
# In config.py, adjust batch size
BATCH_SIZE=200  # Process more at once (uses more memory)
```

## Security

### 1. Secure Your Webhook

Add authentication:

```python
# In app.py webhook endpoint
WEBHOOK_SECRET = os.getenv('WEBHOOK_SECRET')

@app.route('/api/webhook/data-updated', methods=['POST'])
def webhook_data_updated():
    # Verify secret
    auth_header = request.headers.get('Authorization')
    if auth_header != f"Bearer {WEBHOOK_SECRET}":
        return jsonify({'error': 'Unauthorized'}), 401
    # ... rest of code
```

### 2. HTTPS Only

```python
# Force HTTPS in production
if not request.is_secure and not app.debug:
    return redirect(request.url.replace('http://', 'https://'))
```

### 3. Rate Limiting

Use Flask-Limiter:

```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=get_remote_address)

@app.route('/api/webhook/data-updated', methods=['POST'])
@limiter.limit("10 per minute")
def webhook_data_updated():
    # ...
```

## Production Deployment

### 1. Use Gunicorn

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### 2. Use Supervisor for Process Management

`/etc/supervisor/conf.d/backend.conf`:
```ini
[program:backend]
directory=/path/to/backend
command=/path/to/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 app:app
autostart=true
autorestart=true
stderr_logfile=/var/log/backend.err.log
stdout_logfile=/var/log/backend.out.log
```

### 3. Use Nginx as Reverse Proxy

```nginx
server {
    listen 80;
    server_name myserverwebsite.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Summary

Your complete automation workflow:

1. **Setup**: Configure backend with `.env` file
2. **Start**: Run `python app.py` (backend auto-monitors)
3. **Automate**: Schedule your scraping script (cron/Task Scheduler)
4. **Monitor**: Check logs and `/api/automation/status`
5. **Frontend**: Fetch posts via API and display

The system is designed to be:
- **Automatic**: No manual intervention needed
- **Reliable**: Duplicate detection, error handling
- **Scalable**: Handles 18,000+ entries
- **SEO-Optimized**: Meta tags, structured data
- **Production-Ready**: CORS, logging, monitoring

Questions? Check the logs and API endpoints for debugging!

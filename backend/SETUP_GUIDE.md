# Complete Setup Guide

## System Overview

Your video platform consists of three main components:

1. **Backend Server** (myserverwebsite.com)
   - Flask REST API
   - Automatic data processing
   - Database storage
   - SEO optimization

2. **Frontend Website** (frontendwebsite.com)
   - Next.js application
   - Displays video content
   - Fetches data from backend API

3. **Automation Script**
   - Regularly scrapes/updates data
   - Updates JSON file
   - Triggers backend processing

## Quick Start (5 Minutes)

### 1. Install Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
nano .env  # Edit with your settings
```

Update these key values:
```env
BACKEND_URL=https://myserverwebsite.com
FRONTEND_URL=https://frontendwebsite.com
CORS_ORIGINS=https://frontendwebsite.com
AUTO_PROCESS_ENABLED=True
```

### 3. Start Backend

```bash
python app.py
```

Server starts on port 5000 with:
- ✅ Database initialized
- ✅ Automatic file monitoring enabled
- ✅ CORS configured for frontend
- ✅ REST API ready

### 4. Verify Installation

```bash
# Test backend
curl http://localhost:5000/api/health

# Check automation status
curl http://localhost:5000/api/automation/status
```

### 5. Setup Frontend

In your Next.js frontend project:

```bash
# Create .env.local
echo "NEXT_PUBLIC_API_URL=https://myserverwebsite.com/api" > .env.local
```

Copy the API client from `FRONTEND_INTEGRATION.md` and start building!

## Detailed Setup

### Backend Setup

#### 1. Directory Structure

Your backend should look like this:

```
backend/
├── app.py                      # Main Flask app
├── config.py                   # Configuration
├── models.py                   # Database models
├── requirements.txt            # Dependencies
├── .env                        # Environment variables (create this)
├── services/
│   ├── post_processor.py      # Post creation logic
│   ├── file_watcher.py        # File monitoring
│   └── scheduler.py           # Task scheduling
├── utils/
│   └── seo_utils.py           # SEO utilities
└── logs/
    └── post_processor.log     # Application logs
```

#### 2. Environment Variables

Create `.env` file:

```env
# === REQUIRED ===

# Backend server URL (where this Flask app runs)
BACKEND_URL=https://myserverwebsite.com

# Frontend URL (where your Next.js app runs)
FRONTEND_URL=https://frontendwebsite.com

# CORS origins (allow frontend to make requests)
CORS_ORIGINS=https://frontendwebsite.com,https://www.frontendwebsite.com

# === OPTIONAL ===

# Flask Configuration
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
FLASK_DEBUG=False

# Automation
AUTO_PROCESS_ENABLED=True       # Enable automatic processing
CHECK_INTERVAL_MINUTES=5        # Check for updates every 5 minutes
CRON_SCHEDULE=                  # Optional cron expression

# SEO
SITE_URL=https://frontendwebsite.com
SITE_NAME=Your Platform Name

# Logging
LOG_LEVEL=INFO
```

#### 3. Database

The database is automatically created when you start the server.

**Schema**:
- `posts`: Video posts with SEO metadata
- `processing_logs`: History of data processing operations

**Location**: `backend/posts.db` (SQLite)

For production, you can switch to PostgreSQL/MySQL by updating `DATABASE_URI` in `config.py`.

#### 4. Test Installation

```bash
# Run the test script
python test_server.py
```

This verifies:
- ✅ All dependencies installed
- ✅ Database connection works
- ✅ SEO utilities functional
- ✅ App creates successfully

### Frontend Setup

#### 1. Install API Client

Create `lib/api.ts` in your Next.js project:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ... copy the complete API client from FRONTEND_INTEGRATION.md
```

#### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://myserverwebsite.com/api
```

#### 3. Update Next.js Config

Ensure your `next.config.js` allows external images:

```javascript
module.exports = {
  images: {
    domains: ['www.ytplatform.com', 'cdn.ytplatform.com'],
  },
}
```

#### 4. Example Page

```typescript
// app/page.tsx
import { api } from '@/lib/api';

export default async function HomePage() {
  const { posts } = await api.getPosts({ per_page: 12, published: true });

  return (
    <div>
      <h1>Latest Videos</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}
```

See `FRONTEND_INTEGRATION.md` for complete examples.

### Automation Setup

#### 1. Customize Automation Script

Edit `automation_example.py`:

```python
# Update these configurations
DATA_FILE_PATH = "../data/scraped_pages.json"
BACKEND_URL = "https://myserverwebsite.com"

# Customize the fetch_new_data() method with your scraping logic
def fetch_new_data():
    # Your scraping code here
    # Return data in the same format as scraped_pages.json
    pass
```

#### 2. Test Manually

```bash
python automation_example.py
```

This will:
1. Fetch new data (using your logic)
2. Merge with existing data
3. Save to JSON file
4. Trigger backend webhook
5. Backend processes and creates posts

#### 3. Schedule Automation

**Linux/Mac (Cron)**:
```bash
crontab -e

# Add line (runs every hour):
0 * * * * cd /path/to/backend && python automation_example.py >> logs/automation.log 2>&1
```

**Windows (Task Scheduler)**:
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily/Hourly
4. Action: Start `python C:\path\to\backend\automation_example.py`

## Production Deployment

### Backend Deployment

#### Option 1: VPS (DigitalOcean, Linode, etc.)

```bash
# 1. Install dependencies
sudo apt update
sudo apt install python3-pip python3-venv nginx

# 2. Clone/upload your code
cd /var/www
git clone your-repo backend

# 3. Setup virtual environment
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
nano .env  # Update with production values

# 5. Test
python app.py

# 6. Setup Gunicorn
pip install gunicorn

# 7. Create systemd service
sudo nano /etc/systemd/system/backend.service
```

`/etc/systemd/system/backend.service`:
```ini
[Unit]
Description=Backend API Server
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/backend
Environment="PATH=/var/www/backend/venv/bin"
ExecStart=/var/www/backend/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 app:app

[Install]
WantedBy=multi-user.target
```

```bash
# 8. Start service
sudo systemctl enable backend
sudo systemctl start backend
sudo systemctl status backend

# 9. Configure Nginx
sudo nano /etc/nginx/sites-available/backend
```

`/etc/nginx/sites-available/backend`:
```nginx
server {
    listen 80;
    server_name myserverwebsite.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# 10. Enable site
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 11. Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d myserverwebsite.com
```

#### Option 2: Docker

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./data:/app/data
      - ./logs:/app/backend/logs
    environment:
      - BACKEND_URL=https://myserverwebsite.com
      - FRONTEND_URL=https://frontendwebsite.com
      - AUTO_PROCESS_ENABLED=True
    restart: unless-stopped
```

```bash
docker-compose up -d
```

### Frontend Deployment

Deploy your Next.js app to Vercel, Netlify, or your own server:

```bash
# Vercel
vercel

# Or build and deploy manually
npm run build
npm start
```

Make sure `.env.production` has:
```env
NEXT_PUBLIC_API_URL=https://myserverwebsite.com/api
```

## Monitoring

### Health Checks

```bash
# Backend health
curl https://myserverwebsite.com/api/health

# Automation status
curl https://myserverwebsite.com/api/automation/status

# Database stats
curl https://myserverwebsite.com/api/stats
```

### Logs

```bash
# View real-time logs
tail -f backend/logs/post_processor.log

# Check for errors
grep ERROR backend/logs/post_processor.log

# Check automation triggers
grep "NEW DATA DETECTED" backend/logs/post_processor.log
```

### Systemd Service Logs

```bash
# View service logs
sudo journalctl -u backend -f

# Check service status
sudo systemctl status backend
```

## Troubleshooting

### Backend won't start

```bash
# Check if port is in use
sudo lsof -i :5000

# Check logs
cat backend/logs/post_processor.log

# Test database
python -c "from app import app; app.app_context().push(); from models import db; db.create_all()"
```

### CORS errors in frontend

Verify backend `.env`:
```env
CORS_ORIGINS=https://frontendwebsite.com
```

Test CORS:
```bash
curl -H "Origin: https://frontendwebsite.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://myserverwebsite.com/api/posts
```

### Automation not working

```bash
# Check if enabled
curl https://myserverwebsite.com/api/automation/status | jq '.enabled'

# Manually trigger
curl -X POST https://myserverwebsite.com/api/automation/check-now

# Force process
curl -X POST https://myserverwebsite.com/api/webhook/data-updated \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

### No posts showing

```bash
# Check if posts exist
curl https://myserverwebsite.com/api/posts | jq '.pagination.total'

# Process data manually
curl -X POST https://myserverwebsite.com/api/process
```

## Performance Optimization

### Database

For large datasets, switch to PostgreSQL:

```python
# config.py
DATABASE_URI = "postgresql://user:password@localhost/dbname"
```

```bash
pip install psycopg2-binary
```

### Caching

Add Redis caching:

```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'redis'})

@app.route('/api/posts')
@cache.cached(timeout=300)
def get_posts():
    # ...
```

### CDN

Serve static assets (thumbnails, videos) via CDN:
- Cloudflare
- AWS CloudFront
- Bunny CDN

## Backup

### Database Backup

```bash
# SQLite
cp backend/posts.db backend/posts.db.backup

# Automated daily backup
crontab -e
0 2 * * * cp /var/www/backend/posts.db /backups/posts-$(date +\%Y\%m\%d).db
```

### Data File Backup

```bash
# Backup JSON file
cp data/scraped_pages.json data/scraped_pages.json.backup

# Version control
cd data
git init
git add scraped_pages.json
git commit -m "Backup"
```

## Security Checklist

- [ ] Use HTTPS for both backend and frontend
- [ ] Set strong database passwords (if using PostgreSQL/MySQL)
- [ ] Enable firewall (ufw, iptables)
- [ ] Keep dependencies updated: `pip list --outdated`
- [ ] Use environment variables for secrets
- [ ] Set `FLASK_DEBUG=False` in production
- [ ] Implement rate limiting on API endpoints
- [ ] Regular backups scheduled
- [ ] Monitor logs for suspicious activity

## Support

### Documentation

- `README.md` - Overview and basic usage
- `QUICKSTART.md` - Quick start guide
- `AUTOMATION_GUIDE.md` - Complete automation workflow
- `FRONTEND_INTEGRATION.md` - Frontend integration examples
- `API_EXAMPLES.md` - API endpoint examples
- `SETUP_GUIDE.md` - This file

### Logs

- Application: `backend/logs/post_processor.log`
- System: `sudo journalctl -u backend`
- Nginx: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`

### Testing

```bash
# Test backend
python test_server.py

# Test API
curl https://myserverwebsite.com/api/health

# Test automation
python automation_example.py
```

---

**You're all set!** 🎉

Your complete automated video platform is ready:
- ✅ Backend processes data automatically
- ✅ Frontend displays SEO-optimized content
- ✅ Automation keeps data fresh
- ✅ Production-ready with monitoring

Questions? Check the documentation files or review the logs!

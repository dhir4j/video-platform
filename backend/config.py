"""
Configuration file for the Flask backend server.
Contains all environment-specific settings and constants.
"""
import os
from pathlib import Path

# Base directory paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / 'data'
LOGS_DIR = BASE_DIR / 'backend' / 'logs'
DATABASE_DIR = BASE_DIR / 'backend'

# Data source
SCRAPED_DATA_FILE = DATA_DIR / 'scraped_pages.json'

# Database configuration
DATABASE_URI = f"sqlite:///{DATABASE_DIR}/posts.db"

# Flask configuration
FLASK_HOST = os.getenv('FLASK_HOST', '0.0.0.0')
FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'

# Processing configuration
BATCH_SIZE = 100  # Process articles in batches to manage memory
MAX_WORKERS = 4   # Number of parallel workers for processing

# Frontend/Backend URLs
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:5000')  # e.g., https://myserverwebsite.com
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')  # e.g., https://frontendwebsite.com

# CORS Configuration
# Allow requests from frontend domain
CORS_ORIGINS = os.getenv('CORS_ORIGINS', FRONTEND_URL).split(',')

# SEO Configuration
SITE_URL = os.getenv('SITE_URL', FRONTEND_URL)  # Use frontend URL for SEO
SITE_NAME = os.getenv('SITE_NAME', 'YT Platform')
SITE_DESCRIPTION = 'Discover amazing video content across various categories'
DEFAULT_IMAGE = f'{SITE_URL}/default-thumbnail.jpg'

# Automation Configuration
AUTO_PROCESS_ENABLED = os.getenv('AUTO_PROCESS_ENABLED', 'True').lower() == 'true'
CHECK_INTERVAL_MINUTES = int(os.getenv('CHECK_INTERVAL_MINUTES', 5))  # Check for updates every 5 minutes
CRON_SCHEDULE = os.getenv('CRON_SCHEDULE', '')  # Optional cron expression (e.g., "0 */6 * * *")

# Logging configuration
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
LOG_FILE = LOGS_DIR / 'post_processor.log'

# Ensure directories exist
LOGS_DIR.mkdir(exist_ok=True)
DATA_DIR.mkdir(exist_ok=True)

"""
Example Automation Script
This script demonstrates how to update the scraped_pages.json file
and trigger the backend to process new data.

Usage:
    python automation_example.py
"""
import json
import logging
import requests
from pathlib import Path
from datetime import datetime
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)


class DataAutomation:
    """
    Automation script for updating scraped data and notifying the backend.
    """

    def __init__(self, data_file_path: str, backend_url: str):
        """
        Initialize the automation script.

        Args:
            data_file_path: Path to scraped_pages.json
            backend_url: Backend API URL (e.g., https://myserverwebsite.com)
        """
        self.data_file = Path(data_file_path)
        self.backend_url = backend_url.rstrip('/')
        self.webhook_url = f"{self.backend_url}/api/webhook/data-updated"

    def fetch_new_data(self):
        """
        Fetch new data from your scraping source.
        REPLACE THIS METHOD with your actual data fetching logic.

        Returns:
            Dictionary containing new scraped data
        """
        # Example: This is where you would call your scraping API or function
        # For demonstration, we'll create sample data

        logger.info("Fetching new data from scraping source...")

        # Example new data (replace with actual scraping logic)
        new_data = {
            "948": {
                "page_number": 948,
                "total_articles": 2,
                "scraped_articles": 2,
                "articles": {
                    "1": {
                        "url": "https://www.ytplatform.com/videos/advanced-javascript-tutorial/",
                        "thumbnail": "https://www.ytplatform.com/wp-content/uploads/2024/03/js-tutorial.gif",
                        "title": "Advanced JavaScript Tutorial - Master Async/Await",
                        "body": "Learn advanced JavaScript concepts including async/await, promises, and error handling in this comprehensive tutorial.",
                        "video": "https://cdn.ytplatform.com/2024/03/advanced-javascript-tutorial.mp4",
                        "video_width": 640,
                        "video_height": 360,
                        "video_duration": "15:30",
                        "video_duration_seconds": 930,
                        "video_type": "video",
                        "category": ["Education"],
                        "tags": ["javascript", "programming", "tutorial", "async", "web development"]
                    },
                    "2": {
                        "url": "https://www.ytplatform.com/videos/healthy-smoothie-recipes/",
                        "thumbnail": "https://www.ytplatform.com/wp-content/uploads/2024/03/smoothie-recipes.gif",
                        "title": "5 Healthy Smoothie Recipes for Energy",
                        "body": "Discover 5 delicious and nutritious smoothie recipes that will boost your energy throughout the day.",
                        "video": "https://cdn.ytplatform.com/2024/03/healthy-smoothie-recipes.mp4",
                        "video_width": 444,
                        "video_height": 251,
                        "video_duration": "8:45",
                        "video_duration_seconds": 525,
                        "video_type": "video",
                        "category": ["Cooking"],
                        "tags": ["smoothie", "healthy", "recipes", "nutrition", "breakfast"]
                    }
                }
            }
        }

        logger.info(f"Fetched {new_data['948']['total_articles']} new articles")
        return new_data

    def load_existing_data(self):
        """
        Load existing data from JSON file.

        Returns:
            Dictionary containing existing data, or empty dict if file doesn't exist
        """
        if self.data_file.exists():
            with open(self.data_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}

    def merge_data(self, existing_data: dict, new_data: dict):
        """
        Merge new data with existing data.
        This prevents duplicates and only adds new pages.

        Args:
            existing_data: Existing scraped data
            new_data: New data to merge

        Returns:
            Merged data dictionary
        """
        # Create a copy of existing data
        merged = existing_data.copy()

        # Add new pages
        for page_key, page_data in new_data.items():
            if page_key not in merged:
                merged[page_key] = page_data
                logger.info(f"Added new page: {page_key}")
            else:
                # Page exists, merge articles
                existing_articles = merged[page_key].get('articles', {})
                new_articles = page_data.get('articles', {})

                for article_key, article_data in new_articles.items():
                    if article_key not in existing_articles:
                        existing_articles[article_key] = article_data
                        logger.info(f"Added new article to page {page_key}: {article_key}")

                merged[page_key]['articles'] = existing_articles
                merged[page_key]['total_articles'] = len(existing_articles)
                merged[page_key]['scraped_articles'] = len(existing_articles)

        return merged

    def save_data(self, data: dict):
        """
        Save data to JSON file.

        Args:
            data: Data to save
        """
        # Ensure directory exists
        self.data_file.parent.mkdir(parents=True, exist_ok=True)

        # Save with pretty formatting
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        logger.info(f"Data saved to {self.data_file}")

    def notify_backend(self, force: bool = False):
        """
        Notify the backend that data has been updated via webhook.

        Args:
            force: Force processing even if file hasn't changed

        Returns:
            Response from backend
        """
        try:
            logger.info(f"Notifying backend at {self.webhook_url}")

            payload = {
                "source": "automation_script",
                "force": force,
                "timestamp": datetime.utcnow().isoformat()
            }

            response = requests.post(
                self.webhook_url,
                json=payload,
                timeout=30
            )

            response.raise_for_status()

            result = response.json()
            logger.info(f"Backend notification successful: {result.get('message')}")

            if 'statistics' in result:
                stats = result['statistics']
                logger.info(
                    f"Processing stats - "
                    f"Created: {stats.get('created', 0)}, "
                    f"Skipped: {stats.get('skipped', 0)}, "
                    f"Errors: {stats.get('errors', 0)}"
                )

            return result

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to notify backend: {str(e)}")
            raise

    def check_backend_health(self):
        """
        Check if backend is healthy and reachable.

        Returns:
            True if backend is healthy, False otherwise
        """
        try:
            health_url = f"{self.backend_url}/api/health"
            logger.info(f"Checking backend health: {health_url}")

            response = requests.get(health_url, timeout=10)
            response.raise_for_status()

            health = response.json()

            if health.get('status') == 'healthy':
                logger.info("Backend is healthy and ready")
                return True
            else:
                logger.warning(f"Backend health check returned: {health}")
                return False

        except Exception as e:
            logger.error(f"Backend health check failed: {str(e)}")
            return False

    def run(self, notify: bool = True):
        """
        Run the full automation workflow.

        Args:
            notify: Whether to notify backend after updating data

        Returns:
            True if successful, False otherwise
        """
        try:
            logger.info("=" * 60)
            logger.info("Starting Data Automation")
            logger.info("=" * 60)

            # Step 1: Fetch new data
            logger.info("Step 1: Fetching new data...")
            new_data = self.fetch_new_data()

            # Step 2: Load existing data
            logger.info("Step 2: Loading existing data...")
            existing_data = self.load_existing_data()
            logger.info(f"Loaded {len(existing_data)} existing pages")

            # Step 3: Merge data
            logger.info("Step 3: Merging data...")
            merged_data = self.merge_data(existing_data, new_data)

            # Step 4: Save updated data
            logger.info("Step 4: Saving updated data...")
            self.save_data(merged_data)

            # Step 5: Notify backend (if enabled)
            if notify:
                logger.info("Step 5: Notifying backend...")

                # Check backend health first
                if not self.check_backend_health():
                    logger.error("Backend is not healthy. Skipping notification.")
                    return False

                # Notify backend
                self.notify_backend(force=False)

            logger.info("=" * 60)
            logger.info("Automation completed successfully!")
            logger.info("=" * 60)

            return True

        except Exception as e:
            logger.error(f"Automation failed: {str(e)}", exc_info=True)
            return False


def main():
    """
    Main entry point for the automation script.
    """
    # Configuration
    # IMPORTANT: Update these values for your environment
    DATA_FILE_PATH = "../data/scraped_pages.json"
    BACKEND_URL = "http://localhost:5000"  # Change to https://myserverwebsite.com in production

    # Create automation instance
    automation = DataAutomation(
        data_file_path=DATA_FILE_PATH,
        backend_url=BACKEND_URL
    )

    # Run automation
    success = automation.run(notify=True)

    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()

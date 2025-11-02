"""
File Watcher Service
Monitors the scraped_pages.json file for changes and triggers automatic processing.
Uses file modification time to detect updates.
"""
import os
import time
import logging
from pathlib import Path
from datetime import datetime
from typing import Optional, Callable
import hashlib

logger = logging.getLogger(__name__)


class FileWatcher:
    """
    Watches a file for changes and triggers callbacks when modified.
    Uses both timestamp and content hash for reliable change detection.
    """

    def __init__(self, file_path: Path, callback: Optional[Callable] = None, check_interval: int = 60):
        """
        Initialize the file watcher.

        Args:
            file_path: Path to the file to watch
            callback: Function to call when file changes (receives file_path as argument)
            check_interval: How often to check for changes in seconds (default: 60)
        """
        self.file_path = Path(file_path)
        self.callback = callback
        self.check_interval = check_interval
        self.last_modified = None
        self.last_hash = None
        self.is_running = False

        logger.info(f"FileWatcher initialized for {self.file_path}")

    def get_file_hash(self, file_path: Path) -> str:
        """
        Calculate MD5 hash of file contents.

        Args:
            file_path: Path to file

        Returns:
            MD5 hash string
        """
        hash_md5 = hashlib.md5()
        try:
            with open(file_path, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_md5.update(chunk)
            return hash_md5.hexdigest()
        except Exception as e:
            logger.error(f"Error calculating file hash: {str(e)}")
            return ""

    def file_changed(self) -> bool:
        """
        Check if the file has been modified since last check.
        Uses both modification time and content hash for accuracy.

        Returns:
            True if file has changed, False otherwise
        """
        try:
            if not self.file_path.exists():
                logger.warning(f"File does not exist: {self.file_path}")
                return False

            # Get current modification time
            current_modified = os.path.getmtime(self.file_path)

            # First run - initialize tracking
            if self.last_modified is None:
                self.last_modified = current_modified
                self.last_hash = self.get_file_hash(self.file_path)
                logger.info("Initial file state recorded")
                return False

            # Check if modification time changed
            if current_modified > self.last_modified:
                # Verify content actually changed by comparing hashes
                current_hash = self.get_file_hash(self.file_path)

                if current_hash != self.last_hash:
                    logger.info(
                        f"File changed detected! "
                        f"Modified: {datetime.fromtimestamp(current_modified).isoformat()}"
                    )
                    self.last_modified = current_modified
                    self.last_hash = current_hash
                    return True
                else:
                    # Timestamp changed but content same (false positive)
                    self.last_modified = current_modified
                    logger.debug("File timestamp changed but content identical")
                    return False

            return False

        except Exception as e:
            logger.error(f"Error checking file change: {str(e)}", exc_info=True)
            return False

    def on_file_change(self):
        """
        Called when file change is detected.
        Executes the callback function if provided.
        """
        logger.info(f"Processing file change: {self.file_path}")

        if self.callback:
            try:
                self.callback(self.file_path)
            except Exception as e:
                logger.error(f"Error in callback function: {str(e)}", exc_info=True)
        else:
            logger.warning("No callback function configured")

    def start(self):
        """
        Start watching the file.
        This is a blocking call that runs indefinitely.
        Use start_background() for non-blocking operation.
        """
        self.is_running = True
        logger.info(f"Starting file watcher (check interval: {self.check_interval}s)")

        try:
            while self.is_running:
                if self.file_changed():
                    self.on_file_change()

                # Wait before next check
                time.sleep(self.check_interval)

        except KeyboardInterrupt:
            logger.info("File watcher stopped by user")
            self.is_running = False
        except Exception as e:
            logger.error(f"File watcher error: {str(e)}", exc_info=True)
            self.is_running = False

    def stop(self):
        """Stop the file watcher"""
        logger.info("Stopping file watcher")
        self.is_running = False

    def check_once(self) -> bool:
        """
        Perform a single check for file changes.
        Useful for manual/scheduled checks.

        Returns:
            True if file changed and callback was executed
        """
        if self.file_changed():
            self.on_file_change()
            return True
        return False


class DataFileMonitor:
    """
    Specialized monitor for scraped_pages.json file.
    Integrates with Flask app for automatic post processing.
    """

    def __init__(self, app, file_path: Path, check_interval: int = 60):
        """
        Initialize data file monitor.

        Args:
            app: Flask application instance
            file_path: Path to scraped_pages.json
            check_interval: Check interval in seconds
        """
        self.app = app
        self.file_path = file_path
        self.check_interval = check_interval
        self.watcher = None
        self.processing_count = 0
        self.last_processed = None

    def process_new_data(self, file_path: Path):
        """
        Callback function to process new data when file changes.

        Args:
            file_path: Path to the changed file
        """
        logger.info("=" * 60)
        logger.info("NEW DATA DETECTED - Starting automatic processing")
        logger.info("=" * 60)

        try:
            from services.post_processor import PostProcessor

            with self.app.app_context():
                processor = PostProcessor(app=self.app)
                stats = processor.process_all_data(data_file=file_path)

                self.processing_count += 1
                self.last_processed = datetime.utcnow()

                logger.info("=" * 60)
                logger.info("AUTOMATIC PROCESSING COMPLETE")
                logger.info(f"Processed: {stats['processed']}")
                logger.info(f"Created: {stats['created']}")
                logger.info(f"Skipped: {stats['skipped']}")
                logger.info(f"Errors: {stats['errors']}")
                logger.info("=" * 60)

        except Exception as e:
            logger.error(f"Error in automatic processing: {str(e)}", exc_info=True)

    def start(self):
        """Start monitoring the data file"""
        logger.info(f"Starting data file monitor for {self.file_path}")

        self.watcher = FileWatcher(
            file_path=self.file_path,
            callback=self.process_new_data,
            check_interval=self.check_interval
        )

        # This is blocking - should be run in a separate thread
        self.watcher.start()

    def check_once(self) -> bool:
        """
        Perform a single check.
        Returns True if new data was processed.
        """
        if not self.watcher:
            self.watcher = FileWatcher(
                file_path=self.file_path,
                callback=self.process_new_data,
                check_interval=self.check_interval
            )

        return self.watcher.check_once()

    def get_status(self) -> dict:
        """
        Get current monitor status.

        Returns:
            Dictionary with status information
        """
        return {
            'is_running': self.watcher.is_running if self.watcher else False,
            'file_path': str(self.file_path),
            'check_interval': self.check_interval,
            'processing_count': self.processing_count,
            'last_processed': self.last_processed.isoformat() if self.last_processed else None,
            'file_exists': self.file_path.exists(),
            'last_modified': datetime.fromtimestamp(
                os.path.getmtime(self.file_path)
            ).isoformat() if self.file_path.exists() else None
        }

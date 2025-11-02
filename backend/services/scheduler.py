"""
Scheduler Service
Handles periodic tasks like checking for data file updates.
Uses APScheduler for reliable background job scheduling.
"""
import logging
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger
from pathlib import Path

logger = logging.getLogger(__name__)


class AutomationScheduler:
    """
    Manages scheduled tasks for automatic data processing.
    Runs in background without blocking the main Flask application.
    """

    def __init__(self, app, data_file_monitor):
        """
        Initialize the scheduler.

        Args:
            app: Flask application instance
            data_file_monitor: DataFileMonitor instance
        """
        self.app = app
        self.monitor = data_file_monitor
        self.scheduler = BackgroundScheduler()
        self.is_running = False

        logger.info("AutomationScheduler initialized")

    def check_for_updates(self):
        """
        Scheduled job to check for data file updates.
        This runs periodically based on configured interval.
        """
        try:
            logger.debug("Running scheduled check for data file updates")

            with self.app.app_context():
                # Check if file changed and process if needed
                changed = self.monitor.check_once()

                if changed:
                    logger.info("Data file updated - processing completed")
                else:
                    logger.debug("No changes detected in data file")

        except Exception as e:
            logger.error(f"Error in scheduled check: {str(e)}", exc_info=True)

    def start(self, check_interval_minutes: int = 5):
        """
        Start the scheduler with periodic checks.

        Args:
            check_interval_minutes: How often to check for updates (in minutes)
        """
        if self.is_running:
            logger.warning("Scheduler is already running")
            return

        logger.info(f"Starting scheduler (check interval: {check_interval_minutes} minutes)")

        # Add periodic job to check for updates
        self.scheduler.add_job(
            func=self.check_for_updates,
            trigger=IntervalTrigger(minutes=check_interval_minutes),
            id='check_data_updates',
            name='Check for data file updates',
            replace_existing=True
        )

        # Start the scheduler
        self.scheduler.start()
        self.is_running = True

        logger.info("Scheduler started successfully")

    def add_cron_job(self, cron_expression: str):
        """
        Add a cron-based schedule for checking updates.
        Example: "0 */6 * * *" runs every 6 hours

        Args:
            cron_expression: Cron expression for scheduling
        """
        try:
            # Parse cron expression
            parts = cron_expression.split()
            if len(parts) != 5:
                raise ValueError("Invalid cron expression. Expected format: 'minute hour day month day_of_week'")

            minute, hour, day, month, day_of_week = parts

            self.scheduler.add_job(
                func=self.check_for_updates,
                trigger=CronTrigger(
                    minute=minute,
                    hour=hour,
                    day=day,
                    month=month,
                    day_of_week=day_of_week
                ),
                id='cron_data_updates',
                name=f'Cron check: {cron_expression}',
                replace_existing=True
            )

            logger.info(f"Added cron job: {cron_expression}")

        except Exception as e:
            logger.error(f"Error adding cron job: {str(e)}")

    def stop(self):
        """Stop the scheduler"""
        if not self.is_running:
            logger.warning("Scheduler is not running")
            return

        logger.info("Stopping scheduler")
        self.scheduler.shutdown()
        self.is_running = False
        logger.info("Scheduler stopped")

    def get_jobs(self):
        """
        Get list of scheduled jobs.

        Returns:
            List of job information
        """
        jobs = []
        for job in self.scheduler.get_jobs():
            jobs.append({
                'id': job.id,
                'name': job.name,
                'next_run': job.next_run_time.isoformat() if job.next_run_time else None,
                'trigger': str(job.trigger)
            })
        return jobs

    def get_status(self):
        """
        Get scheduler status.

        Returns:
            Dictionary with status information
        """
        return {
            'is_running': self.is_running,
            'jobs': self.get_jobs(),
            'monitor_status': self.monitor.get_status()
        }

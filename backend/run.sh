#!/bin/bash
# Simple script to run the Flask server

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Set environment to development if not set
export FLASK_ENV=${FLASK_ENV:-development}

# Run the Flask application
python app.py

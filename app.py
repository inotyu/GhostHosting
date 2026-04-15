from flask import Flask
from flask_cors import CORS
import os
import sys

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Import backend app factory
from app import create_app

# Create Flask app instance (Vercel requires 'app' variable)
app = create_app()
CORS(app)

# Vercel entry point
if __name__ != '__main__':
    # When running on Vercel, set environment variables
    app.config['SECRET_PASSWORD'] = os.getenv('SECRET_PASSWORD', 'gean2026@')
    app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024

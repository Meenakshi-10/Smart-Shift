#!/usr/bin/env python3
"""
Startup script for SmartShift API
Initializes database and starts the server
"""

import asyncio
import uvicorn
from database import init_database
from main import app

def main():
    print("🚀 Starting SmartShift API...")
    
    # Initialize database with sample data
    print("📊 Initializing database...")
    init_database()
    print("✅ Database initialized successfully!")
    
    # Start the server
    print("🌐 Starting server on http://localhost:8000")
    print("📚 API documentation available at http://localhost:8000/docs")
    print("🔍 Interactive API explorer at http://localhost:8000/redoc")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()

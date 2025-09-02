from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

async def init_db(db: AsyncIOMotorDatabase):
    """Initialize database with indexes and initial data"""
    try:
        # Create indexes for better query performance
        await db.users.create_index("email", unique=True)
        await db.shifts.create_index("date")
        await db.shifts.create_index("employee_id")
        await db.shifts.create_index("status")
        await db.requests.create_index("employee_id")
        await db.requests.create_index("status")
        await db.requests.create_index("type")
        
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise

async def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    from main import app
    return app.mongodb 
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Dict, Any
from datetime import datetime, timedelta

from app.core.database import get_database
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_analytics(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get dashboard analytics"""
    if current_user.role != "manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can access analytics"
        )
    
    # Get basic counts
    total_employees = await db.users.count_documents({"role": "employee"})
    total_shifts = await db.shifts.count_documents({})
    pending_requests = await db.requests.count_documents({"status": "pending"})
    
    # Get today's shifts
    today = datetime.now().date()
    today_shifts = await db.shifts.count_documents({"date": today})
    
    # Get shifts by status for today
    on_duty_shifts = await db.shifts.count_documents({"date": today, "status": "on_duty"})
    late_shifts = await db.shifts.count_documents({"date": today, "status": "late"})
    absent_shifts = await db.shifts.count_documents({"date": today, "status": "absent"})
    
    return {
        "total_employees": total_employees,
        "total_shifts": total_shifts,
        "pending_requests": pending_requests,
        "today_shifts": today_shifts,
        "today_status": {
            "on_duty": on_duty_shifts,
            "late": late_shifts,
            "absent": absent_shifts
        }
    } 
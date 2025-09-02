from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import bson

from app.core.database import get_database
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[User])
async def get_employees(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all employees"""
    if current_user.role != "manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can view all employees"
        )
    
    cursor = db.users.find({"role": "employee"})
    employees = []
    
    async for employee in cursor:
        employee["id"] = str(employee["_id"])
        employees.append(User(**employee))
    
    return employees 
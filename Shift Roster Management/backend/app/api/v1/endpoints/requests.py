from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
import bson
from datetime import datetime

from app.core.database import get_database
from app.models.user import User
from app.models.request import Request, SwapRequestCreate, LeaveRequestCreate, RequestStatus
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/pending", response_model=List[Request])
async def get_pending_requests(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get pending requests"""
    query = {"status": "pending"}
    
    # If user is employee, only show their requests
    if current_user.role == "employee":
        query["employee_id"] = current_user.id
    
    cursor = db.requests.find(query).sort("created_at", -1)
    requests = []
    
    async for req in cursor:
        req["id"] = str(req["_id"])
        # Populate employee data
        if "employee_id" in req:
            employee = await db.users.find_one({"_id": bson.ObjectId(req["employee_id"])})
            if employee:
                employee["id"] = str(employee["_id"])
                req["employee"] = employee
        requests.append(Request(**req))
    
    return requests

@router.post("/swap", response_model=Request)
async def create_swap_request(
    request_in: SwapRequestCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a shift swap request"""
    request_dict = request_in.dict()
    request_dict["employee_id"] = current_user.id
    request_dict["created_at"] = request_dict["updated_at"] = bson.datetime.datetime.utcnow()
    
    result = await db.requests.insert_one(request_dict)
    request_dict["id"] = str(result.inserted_id)
    
    return Request(**request_dict)

@router.post("/leave", response_model=Request)
async def create_leave_request(
    request_in: LeaveRequestCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a leave request"""
    request_dict = request_in.dict()
    request_dict["employee_id"] = current_user.id
    request_dict["created_at"] = request_dict["updated_at"] = bson.datetime.datetime.utcnow()
    
    result = await db.requests.insert_one(request_dict)
    request_dict["id"] = str(result.inserted_id)
    
    return Request(**request_dict)

@router.post("/{request_id}/approve")
async def approve_request(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Approve a request (managers only)"""
    if current_user.role != "manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can approve requests"
        )
    
    # Check if request exists
    request = await db.requests.find_one({"_id": bson.ObjectId(request_id)})
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    await db.requests.update_one(
        {"_id": bson.ObjectId(request_id)},
        {
            "$set": {
                "status": "approved",
                "manager_id": current_user.id,
                "updated_at": bson.datetime.datetime.utcnow()
            }
        }
    )
    
    return {"message": "Request approved successfully"}

@router.post("/{request_id}/deny")
async def deny_request(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Deny a request (managers only)"""
    if current_user.role != "manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can deny requests"
        )
    
    # Check if request exists
    request = await db.requests.find_one({"_id": bson.ObjectId(request_id)})
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    await db.requests.update_one(
        {"_id": bson.ObjectId(request_id)},
        {
            "$set": {
                "status": "denied",
                "manager_id": current_user.id,
                "updated_at": bson.datetime.datetime.utcnow()
            }
        }
    )
    
    return {"message": "Request denied successfully"} 
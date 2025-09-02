from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
import bson
from datetime import datetime, date

from app.core.database import get_database
from app.models.user import User
from app.models.shift import ShiftCreate, ShiftUpdate, Shift, ShiftStatus
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Shift])
async def get_shifts(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    employee_id: Optional[str] = None,
    status: Optional[ShiftStatus] = None
):
    """Get shifts with optional filtering"""
    query = {}
    
    if date_from:
        query["date"] = {"$gte": date_from}
    if date_to:
        if "date" in query:
            query["date"]["$lte"] = date_to
        else:
            query["date"] = {"$lte": date_to}
    if employee_id:
        query["employee_id"] = employee_id
    if status:
        query["status"] = status
    
    # If user is employee, only show their shifts
    if current_user.role == "employee":
        query["employee_id"] = current_user.id
    
    cursor = db.shifts.find(query).sort("date", 1)
    shifts = []
    
    async for shift in cursor:
        shift["id"] = str(shift["_id"])
        # Populate employee data
        if "employee_id" in shift:
            employee = await db.users.find_one({"_id": bson.ObjectId(shift["employee_id"])})
            if employee:
                employee["id"] = str(employee["_id"])
                shift["employee"] = employee
        shifts.append(Shift(**shift))
    
    return shifts

@router.post("/", response_model=Shift)
async def create_shift(
    shift_in: ShiftCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new shift"""
    if current_user.role != "manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can create shifts"
        )
    
    shift_dict = shift_in.dict()
    shift_dict["created_at"] = shift_dict["updated_at"] = bson.datetime.datetime.utcnow()
    
    result = await db.shifts.insert_one(shift_dict)
    shift_dict["id"] = str(result.inserted_id)
    
    return Shift(**shift_dict)

@router.put("/{shift_id}/status", response_model=Shift)
async def update_shift_status(
    shift_id: str,
    status: ShiftStatus,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update shift status"""
    # Check if shift exists
    shift = await db.shifts.find_one({"_id": bson.ObjectId(shift_id)})
    if not shift:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shift not found"
        )
    
    # Only allow employees to update their own shift status
    if current_user.role == "employee" and shift["employee_id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only update your own shift status"
        )
    
    await db.shifts.update_one(
        {"_id": bson.ObjectId(shift_id)},
        {"$set": {"status": status, "updated_at": bson.datetime.datetime.utcnow()}}
    )
    
    # Get updated shift
    updated_shift = await db.shifts.find_one({"_id": bson.ObjectId(shift_id)})
    updated_shift["id"] = str(updated_shift["_id"])
    
    return Shift(**updated_shift)

@router.post("/ai-generate", response_model=dict)
async def generate_ai_shifts(
    start_date: date,
    end_date: date,
    min_staff_required: int,
    constraints: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Generate AI-powered shift roster"""
    if current_user.role != "manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can generate AI shifts"
        )
    
    # Get all employees
    employees = []
    cursor = db.users.find({"role": "employee"})
    async for employee in cursor:
        employee["id"] = str(employee["_id"])
        employees.append(employee)
    
    if len(employees) < min_staff_required:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Not enough employees. Need at least {min_staff_required}"
        )
    
    # Simple AI algorithm (in a real app, this would be more sophisticated)
    import random
    from datetime import timedelta
    
    generated_shifts = []
    current_date = start_date
    
    while current_date <= end_date:
        # Select random employees for this day
        selected_employees = random.sample(employees, min(len(employees), min_staff_required))
        
        for employee in selected_employees:
            shift = {
                "employee_id": employee["id"],
                "date": current_date,
                "start_time": "09:00:00",
                "end_time": "17:00:00",
                "shift_type": "morning",
                "location": "Main Office",
                "status": "scheduled",
                "created_at": bson.datetime.datetime.utcnow(),
                "updated_at": bson.datetime.datetime.utcnow()
            }
            generated_shifts.append(shift)
        
        current_date += timedelta(days=1)
    
    # Create roster document
    roster = {
        "id": str(bson.ObjectId()),
        "manager_id": current_user.id,
        "start_date": start_date,
        "end_date": end_date,
        "constraints": constraints,
        "shifts": generated_shifts,
        "status": "pending",
        "created_at": bson.datetime.datetime.utcnow(),
        "updated_at": bson.datetime.datetime.utcnow()
    }
    
    return roster 
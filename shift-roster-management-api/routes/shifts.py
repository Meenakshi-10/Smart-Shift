from fastapi import APIRouter, HTTPException
from database import get_database
from typing import List, Optional
from pydantic import BaseModel
from datetime import date

router = APIRouter()

class Shift(BaseModel):
    shift_id: str
    date: str
    start_time: str
    end_time: str
    shift_type: str
    assigned_employee: str
    status: str

class CreateShift(BaseModel):
    date: str
    start_time: str
    end_time: str
    shift_type: str
    assigned_employee: str

@router.get("/shifts", response_model=List[Shift])
async def get_shifts(date: Optional[str] = None, employee_id: Optional[str] = None):
    """
    Get all shifts with optional filtering by date or employee
    """
    db = await get_database()
    
    # Build filter
    filter_query = {}
    if date:
        filter_query["date"] = date
    if employee_id:
        filter_query["assigned_employee"] = employee_id
    
    shifts = await db.shifts.find(filter_query).to_list(length=100)
    
    # Convert ObjectId to string for JSON serialization
    for shift in shifts:
        if "_id" in shift:
            del shift["_id"]
    
    return shifts

@router.post("/shifts", response_model=Shift)
async def create_shift(shift: CreateShift):
    """
    Create a new shift
    """
    db = await get_database()
    
    # Generate unique shift ID
    shift_id = f"SHIFT{str(await db.shifts.count_documents({}) + 1).zfill(3)}"
    
    new_shift = {
        "shift_id": shift_id,
        "date": shift.date,
        "start_time": shift.start_time,
        "end_time": shift.end_time,
        "shift_type": shift.shift_type,
        "assigned_employee": shift.assigned_employee,
        "status": "assigned"
    }
    
    await db.shifts.insert_one(new_shift)
    
    return new_shift

@router.get("/shifts/{shift_id}", response_model=Shift)
async def get_shift(shift_id: str):
    """
    Get a specific shift by ID
    """
    db = await get_database()
    shift = await db.shifts.find_one({"shift_id": shift_id})
    
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    
    if "_id" in shift:
        del shift["_id"]
    
    return shift

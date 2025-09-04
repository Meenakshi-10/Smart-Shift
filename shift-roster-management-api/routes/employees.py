from fastapi import APIRouter, HTTPException
from database import get_database
from typing import List
from pydantic import BaseModel

router = APIRouter()

class Employee(BaseModel):
    employee_id: str
    name: str
    role: str
    skills: List[str]
    department: str
    shift_preference: str

@router.get("/employees", response_model=List[Employee])
async def get_employees():
    """
    Get all employees (fixed list, cannot be modified)
    """
    db = await get_database()
    employees = await db.employees.find().to_list(length=100)
    
    # Convert ObjectId to string for JSON serialization
    for employee in employees:
        if "_id" in employee:
            del employee["_id"]
    
    return employees

@router.get("/employees/{employee_id}", response_model=Employee)
async def get_employee(employee_id: str):
    """
    Get a specific employee by ID
    """
    db = await get_database()
    employee = await db.employees.find_one({"employee_id": employee_id})
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if "_id" in employee:
        del employee["_id"]
    
    return employee

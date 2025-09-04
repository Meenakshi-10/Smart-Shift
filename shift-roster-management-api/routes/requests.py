from fastapi import APIRouter, HTTPException
from database import get_database
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter()

class Request(BaseModel):
    request_id: str
    employee_id: str
    request_type: str  # "leave" or "swap"
    start_date: str
    end_date: str
    reason: str
    status: str  # "pending", "approved", "rejected"
    swap_partner: Optional[str] = None  # For swap requests

class CreateRequest(BaseModel):
    employee_id: str
    request_type: str
    start_date: str
    end_date: str
    reason: str
    swap_partner: Optional[str] = None

@router.get("/requests", response_model=List[Request])
async def get_requests(
    employee_id: Optional[str] = None, 
    status: Optional[str] = None,
    request_type: Optional[str] = None
):
    """
    Get all requests with optional filtering
    """
    db = await get_database()
    
    # Build filter
    filter_query = {}
    if employee_id:
        filter_query["employee_id"] = employee_id
    if status:
        filter_query["status"] = status
    if request_type:
        filter_query["request_type"] = request_type
    
    requests = await db.requests.find(filter_query).to_list(length=100)
    
    # Convert ObjectId to string for JSON serialization
    for req in requests:
        if "_id" in req:
            del req["_id"]
    
    return requests

@router.post("/requests", response_model=Request)
async def create_request(request: CreateRequest):
    """
    Create a new leave or swap request
    """
    db = await get_database()
    
    # Validate employee exists
    employee = await db.employees.find_one({"employee_id": request.employee_id})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Generate unique request ID
    request_id = f"REQ{str(await db.requests.count_documents({}) + 1).zfill(3)}"
    
    new_request = {
        "request_id": request_id,
        "employee_id": request.employee_id,
        "request_type": request.request_type,
        "start_date": request.start_date,
        "end_date": request.end_date,
        "reason": request.reason,
        "status": "pending",
        "swap_partner": request.swap_partner
    }
    
    await db.requests.insert_one(new_request)
    
    return new_request

@router.put("/requests/{request_id}/status")
async def update_request_status(request_id: str, status: str):
    """
    Update request status (approve/reject)
    """
    if status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Status must be 'approved' or 'rejected'")
    
    db = await get_database()
    result = await db.requests.update_one(
        {"request_id": request_id},
        {"$set": {"status": status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")
    
    return {"message": f"Request {request_id} status updated to {status}"}

@router.get("/requests/{request_id}", response_model=Request)
async def get_request(request_id: str):
    """
    Get a specific request by ID
    """
    db = await get_database()
    request = await db.requests.find_one({"request_id": request_id})
    
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    if "_id" in request:
        del request["_id"]
    
    return request

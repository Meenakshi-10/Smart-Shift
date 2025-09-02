from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date
from enum import Enum

class RequestType(str, Enum):
    SWAP = "swap"
    LEAVE = "leave"

class RequestStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    DENIED = "denied"

class RequestBase(BaseModel):
    employee_id: str
    request_type: RequestType
    reason: Optional[str] = None

class SwapRequestCreate(RequestBase):
    request_type: RequestType = RequestType.SWAP
    target_employee_id: str
    my_shift_date: date
    target_shift_date: date

class LeaveRequestCreate(RequestBase):
    request_type: RequestType = RequestType.LEAVE
    start_date: date
    end_date: date
    leave_type: str = "vacation"  # vacation, sick, personal, etc.

class RequestUpdate(BaseModel):
    status: RequestStatus
    manager_notes: Optional[str] = None

class RequestInDB(RequestBase):
    id: str
    status: RequestStatus = RequestStatus.PENDING
    manager_id: Optional[str] = None
    manager_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    # Additional fields for specific request types
    target_employee_id: Optional[str] = None
    my_shift_date: Optional[date] = None
    target_shift_date: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    leave_type: Optional[str] = None

class Request(RequestBase):
    id: str
    status: RequestStatus
    manager_id: Optional[str] = None
    manager_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    employee: Optional[dict] = None  # For populated employee data
    manager: Optional[dict] = None   # For populated manager data
    # Additional fields for specific request types
    target_employee_id: Optional[str] = None
    my_shift_date: Optional[date] = None
    target_shift_date: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    leave_type: Optional[str] = None

    class Config:
        from_attributes = True 
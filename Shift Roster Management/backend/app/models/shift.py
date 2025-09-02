from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date, time
from enum import Enum

class ShiftStatus(str, Enum):
    SCHEDULED = "scheduled"
    ON_DUTY = "on_duty"
    LATE = "late"
    ABSENT = "absent"
    COMPLETED = "completed"

class ShiftType(str, Enum):
    MORNING = "morning"
    AFTERNOON = "afternoon"
    NIGHT = "night"
    OVERTIME = "overtime"

class ShiftBase(BaseModel):
    employee_id: str
    date: date
    start_time: time
    end_time: time
    shift_type: ShiftType = ShiftType.MORNING
    location: Optional[str] = None
    notes: Optional[str] = None

class ShiftCreate(ShiftBase):
    pass

class ShiftUpdate(BaseModel):
    date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    shift_type: Optional[ShiftType] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[ShiftStatus] = None

class ShiftInDB(ShiftBase):
    id: str
    status: ShiftStatus = ShiftStatus.SCHEDULED
    created_at: datetime
    updated_at: datetime

class Shift(ShiftBase):
    id: str
    status: ShiftStatus
    created_at: datetime
    updated_at: datetime
    employee: Optional[dict] = None  # For populated employee data

    class Config:
        from_attributes = True 
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel
import bson
from datetime import datetime

from app.core.database import get_database
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

class MessageCreate(BaseModel):
    message: str

@router.post("/broadcast")
async def broadcast_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Broadcast a message to all employees"""
    if current_user.role != "manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can broadcast messages"
        )
    
    # Store the broadcast message
    broadcast = {
        "message": message_data.message,
        "manager_id": current_user.id,
        "created_at": bson.datetime.datetime.utcnow()
    }
    
    result = await db.messages.insert_one(broadcast)
    
    return {"message": "Message broadcasted successfully", "id": str(result.inserted_id)} 
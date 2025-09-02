from fastapi import APIRouter
from app.api.v1.endpoints import auth, shifts, requests, employees, messages, analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(shifts.router, prefix="/shifts", tags=["shifts"])
api_router.include_router(requests.router, prefix="/requests", tags=["requests"])
api_router.include_router(employees.router, prefix="/employees", tags=["employees"])
api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"]) 
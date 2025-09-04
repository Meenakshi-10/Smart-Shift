from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import shifts, employees, requests

app = FastAPI(
    title="SmartShift API",
    description="API for SmartShift - Intelligent Shift Management System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(employees.router, prefix="/api/v1", tags=["Employees"])
app.include_router(shifts.router, prefix="/api/v1", tags=["Shifts"])
app.include_router(requests.router, prefix="/api/v1", tags=["Requests"])

@app.get("/")
async def root():
    return {"message": "SmartShift API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

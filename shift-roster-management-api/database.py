from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
DATABASE_NAME = "smartshift"

# Async client for FastAPI
async def get_database():
    client = AsyncIOMotorClient(MONGO_URL)
    return client[DATABASE_NAME]

# Sync client for initialization
def get_sync_database():
    client = MongoClient(MONGO_URL)
    return client[DATABASE_NAME]

# Initialize database with sample data
def init_database():
    db = get_sync_database()
    
    # Sample employees (fixed, cannot be added/deleted)
    employees_collection = db.employees
    if employees_collection.count_documents({}) == 0:
        sample_employees = [
            {
                "employee_id": "EMP001",
                "name": "John Smith",
                "role": "Software Engineer",
                "skills": ["Python", "React", "AWS"],
                "department": "Engineering",
                "shift_preference": "morning"
            },
            {
                "employee_id": "EMP002",
                "name": "Sarah Johnson",
                "role": "Senior Developer",
                "skills": ["Java", "Spring", "Docker"],
                "department": "Engineering",
                "shift_preference": "afternoon"
            },
            {
                "employee_id": "EMP003",
                "name": "Mike Chen",
                "role": "DevOps Engineer",
                "skills": ["Kubernetes", "Terraform", "Python"],
                "department": "Engineering",
                "shift_preference": "night"
            },
            {
                "employee_id": "EMP004",
                "name": "Emily Davis",
                "role": "Frontend Developer",
                "skills": ["React", "TypeScript", "CSS"],
                "department": "Engineering",
                "shift_preference": "morning"
            },
            {
                "employee_id": "EMP005",
                "name": "Alex Wilson",
                "role": "Backend Developer",
                "skills": ["Node.js", "MongoDB", "Express"],
                "department": "Engineering",
                "shift_preference": "afternoon"
            }
        ]
        employees_collection.insert_many(sample_employees)
    
    # Sample shifts
    shifts_collection = db.shifts
    if shifts_collection.count_documents({}) == 0:
        sample_shifts = [
            {
                "shift_id": "SHIFT001",
                "date": "2024-01-15",
                "start_time": "09:00",
                "end_time": "17:00",
                "shift_type": "morning",
                "assigned_employee": "EMP001",
                "status": "assigned"
            },
            {
                "shift_id": "SHIFT002",
                "date": "2024-01-15",
                "start_time": "17:00",
                "end_time": "01:00",
                "shift_type": "night",
                "assigned_employee": "EMP003",
                "status": "assigned"
            }
        ]
        shifts_collection.insert_many(sample_shifts)
    
    # Sample requests
    requests_collection = db.requests
    if requests_collection.count_documents({}) == 0:
        sample_requests = [
            {
                "request_id": "REQ001",
                "employee_id": "EMP002",
                "request_type": "leave",
                "start_date": "2024-01-20",
                "end_date": "2024-01-22",
                "reason": "Personal vacation",
                "status": "pending"
            }
        ]
        requests_collection.insert_many(sample_requests)
    
    print("Database initialized with sample data!")

if __name__ == "__main__":
    init_database()

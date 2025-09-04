# SmartShift API

A FastAPI-based backend for SmartShift - an intelligent shift management system for engineering teams.

## Features

- **Employee Management**: Fixed list of employees (read-only)
- **Shift Management**: Create and view shifts with filtering
- **Request System**: Handle leave and shift swap requests
- **Simple & Lightweight**: No authentication or complex roles

## Tech Stack

- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Async Support**: Motor for async MongoDB operations

## Prerequisites

- Python 3.8+
- MongoDB running locally or accessible
- pip package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shift-roster-management-api
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start MongoDB**
   - Ensure MongoDB is running on `mongodb://localhost:27017`
   - Or update the `MONGO_URL` in `database.py`

4. **Initialize database with sample data**
   ```bash
   python database.py
   ```

5. **Run the application**
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit `http://localhost:8000/docs` for interactive API documentation.

## API Endpoints

### Employees (Fixed List)

- `GET /api/v1/employees` - Get all employees
- `GET /api/v1/employees/{employee_id}` - Get specific employee

### Shifts

- `GET /api/v1/shifts` - Get all shifts (with optional date/employee filtering)
- `POST /api/v1/shifts` - Create new shift
- `GET /api/v1/shifts/{shift_id}` - Get specific shift

### Requests

- `GET /api/v1/requests` - Get all requests (with optional filtering)
- `POST /api/v1/requests` - Create new request (leave/swap)
- `PUT /api/v1/requests/{request_id}/status` - Update request status
- `GET /api/v1/requests/{request_id}` - Get specific request

## Sample Data

The system comes with 5 sample employees:
- John Smith (Software Engineer)
- Sarah Johnson (Senior Developer)
- Mike Chen (DevOps Engineer)
- Emily Davis (Frontend Developer)
- Alex Wilson (Backend Developer)

## Data Models

### Employee
```json
{
  "employee_id": "EMP001",
  "name": "John Smith",
  "role": "Software Engineer",
  "skills": ["Python", "React", "AWS"],
  "department": "Engineering",
  "shift_preference": "morning"
}
```

### Shift
```json
{
  "shift_id": "SHIFT001",
  "date": "2024-01-15",
  "start_time": "09:00",
  "end_time": "17:00",
  "shift_type": "morning",
  "assigned_employee": "EMP001",
  "status": "assigned"
}
```

### Request
```json
{
  "request_id": "REQ001",
  "employee_id": "EMP002",
  "request_type": "leave",
  "start_date": "2024-01-20",
  "end_date": "2024-01-22",
  "reason": "Personal vacation",
  "status": "pending",
  "swap_partner": null
}
```

## Usage Examples

### Create a new shift
```bash
curl -X POST "http://localhost:8000/api/v1/shifts" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-16",
    "start_time": "09:00",
    "end_time": "17:00",
    "shift_type": "morning",
    "assigned_employee": "EMP002"
  }'
```

### Create a leave request
```bash
curl -X POST "http://localhost:8000/api/v1/requests" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "request_type": "leave",
    "start_date": "2024-01-25",
    "end_date": "2024-01-26",
    "reason": "Doctor appointment"
  }'
```

### Get shifts for a specific date
```bash
curl "http://localhost:8000/api/v1/shifts?date=2024-01-15"
```

## Development

- The API is designed to be simple and lightweight
- No authentication or authorization is implemented
- All employees are pre-defined and cannot be modified
- The system focuses on core shift management functionality

## License

This project is for demonstration purposes.

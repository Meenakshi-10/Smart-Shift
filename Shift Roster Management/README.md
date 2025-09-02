# SmartShift - AI-Powered Shift Management Application

SmartShift is a comprehensive mobile application designed to simplify and optimize shift management for large engineering teams. It intelligently creates balanced shift rosters by considering employee availability, skills, and leave schedules, while preventing overlapping absences to maintain team coverage.

## 🚀 Features

### For Managers
- **AI-Powered Shift Creation**: Automatically generate optimized shift rosters using AI algorithms
- **Real-Time Dashboard**: Monitor team status, attendance, and pending requests
- **Request Management**: Approve or deny shift swaps and leave requests
- **Employee Management**: Add and manage team members
- **Broadcast Messages**: Send announcements to all team members
- **Analytics & Reports**: View performance metrics and attendance statistics

### For Employees
- **Personal Dashboard**: View upcoming shifts and notifications
- **Shift Schedule**: Access detailed shift information and status
- **Request System**: Submit shift swap and leave requests
- **In-App Communication**: Chat with team members and managers
- **Real-Time Updates**: Receive instant notifications for schedule changes

## 🛠 Tech Stack

- **Frontend**: React Native (Mobile App)
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT Tokens
- **State Management**: React Context API
- **UI Framework**: React Native Paper

## 📱 Screenshots

The application includes the following key screens:

1. **Login & Initial Setup**: User authentication and company configuration
2. **Manager Dashboard**: Overview of team status and quick actions
3. **AI Shift Creation**: Configure and generate AI-powered rosters
4. **Real-Time Roster Management**: Monitor employee status in real-time
5. **Request Management**: Handle shift swaps and leave requests
6. **Employee Dashboard**: Personal schedule and notifications
7. **Chat System**: In-app communication between team members

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (v4.4 or higher)
- React Native development environment
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartshift
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Set up Environment Variables**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URL=mongodb://localhost:27017
   DB_NAME=smartshift
   SECRET_KEY=your-secret-key-here
   ```

5. **Start MongoDB**
   ```bash
   mongod
   ```

6. **Start the Backend Server**
   ```bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

7. **Start the React Native App**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

## 📁 Project Structure

```
smartshift/
├── src/                          # React Native source code
│   ├── contexts/                 # React Context providers
│   ├── navigation/               # Navigation configuration
│   ├── screens/                  # Application screens
│   │   ├── auth/                # Authentication screens
│   │   ├── manager/             # Manager-specific screens
│   │   └── employee/            # Employee-specific screens
│   ├── services/                # API services
│   └── theme/                   # UI theme configuration
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── api/                 # API endpoints
│   │   ├── core/                # Core configuration
│   │   └── models/              # Data models
│   ├── requirements.txt         # Python dependencies
│   └── main.py                  # FastAPI application entry point
├── package.json                 # Node.js dependencies
└── README.md                    # Project documentation
```

## 🔧 Configuration

### Frontend Configuration

The React Native app uses the following key configurations:

- **API Base URL**: Configured in `src/services/api.js`
- **Theme**: Customizable in `src/theme/theme.js`
- **Navigation**: Set up in `src/navigation/`

### Backend Configuration

The FastAPI backend includes:

- **Database Connection**: MongoDB connection in `app/core/database.py`
- **Authentication**: JWT token handling in `app/core/security.py`
- **API Endpoints**: Organized in `app/api/v1/endpoints/`

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Shifts
- `GET /api/v1/shifts` - Get shifts with filtering
- `POST /api/v1/shifts` - Create new shift
- `PUT /api/v1/shifts/{id}/status` - Update shift status
- `POST /api/v1/shifts/ai-generate` - Generate AI-powered roster

### Requests
- `GET /api/v1/requests/pending` - Get pending requests
- `POST /api/v1/requests/swap` - Create shift swap request
- `POST /api/v1/requests/leave` - Create leave request
- `POST /api/v1/requests/{id}/approve` - Approve request
- `POST /api/v1/requests/{id}/deny` - Deny request

### Employees
- `GET /api/v1/employees` - Get all employees

### Messages
- `POST /api/v1/messages/broadcast` - Broadcast message

### Analytics
- `GET /api/v1/analytics/dashboard` - Get dashboard analytics

## 🤖 AI Features

The application includes AI-powered features for intelligent shift management:

1. **Smart Roster Generation**: Considers employee availability, skills, and preferences
2. **Conflict Prevention**: Avoids overlapping absences and back-to-back shifts
3. **Fair Distribution**: Ensures equitable shift distribution among team members
4. **Constraint Handling**: Respects company policies and employee constraints

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Different permissions for managers and employees
- **Password Hashing**: Secure password storage using bcrypt
- **Input Validation**: Comprehensive data validation using Pydantic

## 📱 Mobile Features

- **Offline Support**: Basic offline functionality for viewing schedules
- **Push Notifications**: Real-time notifications for schedule changes
- **Responsive Design**: Optimized for various screen sizes
- **Native Performance**: Built with React Native for native performance

## 🧪 Testing

### Frontend Testing
```bash
npm test
```

### Backend Testing
```bash
cd backend
pytest
```

## 🚀 Deployment

### Backend Deployment
1. Set up a production MongoDB instance
2. Configure environment variables for production
3. Deploy using Docker or cloud platforms (AWS, Google Cloud, etc.)

### Mobile App Deployment
1. Build the React Native app for production
2. Submit to App Store (iOS) and Google Play Store (Android)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Advanced AI Algorithms**: More sophisticated shift optimization
- **Integration APIs**: Connect with HR systems and calendars
- **Mobile Push Notifications**: Enhanced notification system
- **Reporting Dashboard**: Advanced analytics and reporting
- **Multi-language Support**: Internationalization support
- **Dark Mode**: Theme customization options

---

**SmartShift** - Making shift management smarter, one roster at a time! 🚀 
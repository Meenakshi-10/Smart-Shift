# SmartShift - Intelligent Shift Management

SmartShift is a mobile application designed to simplify and optimize shift management for large engineering teams. It intelligently creates balanced shift rosters by considering employee availability, skills, and leave schedules, while preventing overlapping absences to maintain team coverage.

## Features

### For Managers
- **Dashboard Overview**: Monitor current week staffing and quick access to key actions
- **AI-Powered Roster Creation**: Generate balanced shift schedules with configurable rules and constraints
- **Request Management**: Approve or deny shift swap and leave requests
- **Analytics**: View performance metrics and shift distribution statistics

### For Employees
- **Personal Dashboard**: View upcoming shifts and schedule overview
- **Request Management**: Submit leave requests and shift swap requests
- **Schedule View**: See assigned shifts with status indicators
- **Team Communication**: In-app chat for team coordination

## Tech Stack

- **Frontend**: React Native with Expo
- **UI Components**: React Native Paper
- **Navigation**: Expo Router
- **State Management**: React Context API
- **Backend**: FastAPI (separate repository)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

### Backend Setup

The app requires the SmartShift API backend to be running. See the [API repository](https://github.com/your-org/shift-roster-management-api) for setup instructions.

## App Structure

```
app/
├── _layout.tsx              # Root layout with navigation
├── login.tsx                # Login and setup screen
└── (tabs)/
    ├── _layout.tsx          # Tab navigation layout
    ├── index.tsx            # Manager/Employee dashboard
    ├── roster.tsx           # Roster management (Manager)
    ├── requests.tsx         # Request management (Manager/Employee)
    ├── analytics.tsx        # Analytics dashboard (Manager)
    ├── schedule.tsx         # Employee schedule view
    └── chat.tsx             # Team communication
```

## Usage

### Initial Setup
1. Launch the app
2. Choose between Login or Setup
3. For Setup: Enter company name and select an employee role
4. For Login: Enter credentials (demo mode)

### Manager Workflow
1. **Dashboard**: View current week overview and quick actions
2. **Create Roster**: Set date range, staff requirements, and rules for AI generation
3. **Manage Requests**: Review and approve/deny employee requests
4. **Analytics**: Monitor team performance and shift distribution

### Employee Workflow
1. **View Schedule**: Check assigned shifts and upcoming schedule
2. **Submit Requests**: Create leave or shift swap requests
3. **Team Chat**: Communicate with team members
4. **Track Status**: Monitor request approval status

## Configuration

### API Endpoint
Update the API base URL in `services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

### Sample Data
The app comes with 5 sample employees:
- John Smith (Software Engineer)
- Sarah Johnson (Senior Developer)
- Mike Chen (DevOps Engineer)
- Emily Davis (Frontend Developer)
- Alex Wilson (Backend Developer)

## Development

### Adding New Features
1. Create new screen components in the `app/` directory
2. Add navigation routes in `app/_layout.tsx` or `app/(tabs)/_layout.tsx`
3. Update the context in `contexts/AppContext.tsx` if needed
4. Add new API endpoints in `services/api.ts`

### Styling
The app uses a consistent design system with:
- Primary color: #2196F3 (Blue)
- Background: #f5f5f5 (Light Gray)
- Cards with elevation and rounded corners
- Consistent spacing and typography

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for demonstration purposes.

## Support

For questions or issues, please refer to the project documentation or create an issue in the repository.

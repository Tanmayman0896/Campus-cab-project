# Campus Cab - Complete Setup Guide

## Prerequisites

1. **Node.js** (version 18.0.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (to clone the repository)
   - Download from: https://git-scm.com/

4. **Expo CLI** (for React Native development)
   ```bash
   npm install -g @expo/cli
   ```

5. **Expo Go App** (on your mobile device)
   - Download from App Store (iOS) or Google Play Store (Android)

## Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Tanmayman0896/Campus-Cab.git
cd Campus-Cab
```

### 2. Backend Setup

#### Navigate to Backend directory
```bash
cd Backend
```

#### Install Backend Dependencies
```bash
npm install
```

#### Required Backend Dependencies:
- @prisma/client@^6.19.0
- cors@^2.8.5
- dotenv@^16.6.1
- express@^4.21.2
- express-rate-limit@^7.5.1
- express-validator@^7.2.1
- firebase@^11.9.1
- firebase-admin@^12.7.0
- helmet@^7.2.0
- moment@^2.30.1
- morgan@^1.10.0
- multer@^1.4.5-lts.1
- node-cron@^3.0.3

#### Dev Dependencies:
- nodemon@^3.0.2
- prisma@^6.10.1

#### Create .env file in Backend directory
```bash
# Backend/.env
PORT=3001
NODE_ENV=development
API_VERSION=v1

# Database Configuration (Replace with your own database URL)
DATABASE_URL="postgresql://neondb_owner:npg_DeWMGq3c4iwB@ep-solitary-breeze-a4h42gao-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'"

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Other Configuration
REQUEST_TIMEOUT=30000
```

#### Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) View database in Prisma Studio
npx prisma studio
```

#### Add Test User to Database
```bash
node scripts/createTestUser.js
```

#### Database Schema
The application uses PostgreSQL with Prisma ORM. Key tables:
- **Users**: Profile information, including base64 profile images
- **Requests**: Ride requests with location, date, time details
- **Votes**: User votes on ride requests (accept/reject)

#### Start Backend Server
```bash
npm start
# or for development with auto-restart
npm run dev
```

The backend should start on: `http://localhost:3001`

### 3. Frontend Setup

#### Navigate to Frontend directory (in a new terminal)
```bash
cd frontend
```

#### Install Frontend Dependencies
```bash
npm install
```

#### Required Frontend Dependencies:
- @expo/vector-icons@~14.0.4
- @react-native-community/datetimepicker@8.2.0
- @react-navigation/bottom-tabs@^6.6.1
- @react-navigation/native@^6.1.18
- @react-navigation/stack@^6.4.1
- axios@^1.13.2
- expo@~52.0.0
- expo-image-picker@~16.0.6
- expo-status-bar@~2.0.0
- react@18.3.1
- react-dom@18.3.1
- react-native@0.76.9
- react-native-gesture-handler@~2.20.2
- react-native-safe-area-context@4.12.0
- react-native-screens@~4.4.0
- react-native-vector-icons@^10.0.0
- react-native-web@~0.19.13

#### Start Frontend
```bash
npx expo start
```

## Running the Application

### Option 1: Mobile Device (Recommended)
1. Make sure your mobile device and computer are on the same WiFi network
2. Install "Expo Go" app on your phone
3. Run `npx expo start` in the frontend directory
4. Scan the QR code with your phone's camera (iOS) or Expo Go app (Android)

### Option 2: Web Browser
1. Run `npx expo start --web`
2. The app will open in your browser at `http://localhost:8081`

### Option 3: Android Emulator
1. Install Android Studio and set up an emulator
2. Run `npx expo start --android`

## Network Configuration

If running on different devices/networks, update the API base URL:

**Frontend: `frontend/src/services/api.js`**
```javascript
// Current network configuration (update IP if needed)
const getApiBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3001/api/v1';
  } else {
    // Replace with your computer's current network IP
    return 'http://10.63.209.138:3001/api/v1';
  }
};
```

To find your computer's IP address:
- **Windows**: `ipconfig` (look for IPv4 Address)
- **Mac/Linux**: `ifconfig` (look for inet)

## Troubleshooting

### Backend Issues:
1. **Database Connection Failed**: Check your DATABASE_URL in .env file
2. **Port Already in Use**: Change PORT in .env file to a different port (e.g., 3002)
3. **Module Not Found**: Run `npm install` in Backend directory

### Frontend Issues:
1. **Network Error**: Make sure backend is running and API_BASE_URL is correct
2. **Expo CLI Not Found**: Install globally with `npm install -g @expo/cli`
3. **QR Code Not Working**: Try web version with `npx expo start --web`

### Firewall Issues (Windows):
If the mobile app can't connect to the backend:
1. Allow Node.js through Windows Firewall
2. Or temporarily disable Windows Firewall for testing

## Project Structure

```
Campus-Cab/
├── Backend/
│   ├── src/
│   │   ├── controllers/     # API endpoint handlers
│   │   ├── middleware/      # Upload, validation middleware
│   │   ├── routes/          # API route definitions
│   │   ├── config/          # Database and app configuration
│   │   └── server.js        # Main server file
│   ├── scripts/            # Database setup scripts
│   ├── prisma/            # Database schema and migrations
│   ├── uploads/           # File upload directory (not used for images)
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── screens/        # App screens (Profile, Requests, etc.)
│   │   ├── components/     # Reusable UI components
│   │   └── services/       # API client and utilities
│   ├── assets/            # Static assets
│   ├── package.json
│   └── App.js
├── SETUP_GUIDE.md
└── QUICK_START.md
```

## Available Scripts

### Backend:
- `npm start` - Start the server
- `npm run dev` - Start with nodemon (auto-restart)
- `npm run prisma:studio` - Open Prisma Studio

### Frontend:
- `npx expo start` - Start Expo development server
- `npx expo start --web` - Start web version
- `npx expo start --android` - Start Android version
- `npx expo start --ios` - Start iOS version

## Default User Credentials

The app uses mock authentication. Default user:
- ID: `a1234567-1234-1234-1234-123456789abc`
- Name: `Tanmay`
- Email: `tanmay@example.com`

## Features

- **Requests Screen**: View all available ride requests
- **My Rides Screen**: View your own ride requests  
- **Profile Screen**: View and edit user profile with image upload
- **Filter Screen**: Filter rides by various criteria
- **Create Request**: Add new ride requests
- **Vote System**: Accept/reject ride requests from others
- **Profile Pictures**: Upload and display custom profile images (stored as base64 in database)
- **Real-time Data**: Dynamic data fetching from PostgreSQL database
- **Responsive UI**: Clean interface with proper error handling

## Support

If you encounter any issues:
1. Check that both backend and frontend are running
2. Verify network connectivity between devices
3. Check console logs for error messages
4. Ensure all dependencies are installed correctly
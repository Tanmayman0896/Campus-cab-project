# Quick Setup Commands

## Prerequisites Installation

### 1. Install Node.js (v18+)
Download and install from: https://nodejs.org/

### 2. Install Expo CLI
```bash
npm install -g @expo/cli
```

## Project Setup (Run these commands in order)

### 1. Clone Repository
```bash
git clone https://github.com/Tanmayman0896/Campus-Cab.git
cd Campus-Cab
```

### 2. Backend Setup
```bash
# Navigate to backend
cd Backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Add test user data
node scripts/createTestUser.js

# Start backend server
npm start
```

### 3. Frontend Setup (New Terminal)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

## Environment Configuration

Create `Backend/.env` file with:
```env
PORT=3001
NODE_ENV=development
API_VERSION=v1
DATABASE_URL="your_database_url_here"
JWT_SECRET=your_super_secure_jwt_secret_key_here
CORS_ORIGIN=http://localhost:3000
REQUEST_TIMEOUT=30000
```

## Network Setup

If running on different devices, update `frontend/src/services/api.js`:
```javascript
// Current network configuration (update IP if needed)
const getApiBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3001/api/v1';
  } else {
    return 'http://10.63.209.138:3001/api/v1'; // Update this IP if needed
  }
};
```

Find your IP address:
- **Windows**: Open CMD and run `ipconfig`
- **Mac/Linux**: Open Terminal and run `ifconfig`

## Running the App

1. **Mobile Device**: 
   - Install "Expo Go" app
   - Scan QR code from terminal

2. **Web Browser**:
   ```bash
   npx expo start --web
   ```

3. **Android Emulator**:
   ```bash
   npx expo start --android
   ```

## Verification

### Backend Running:
Visit: http://localhost:3001/api/v1/requests/all

Should return:
```json
{
  "success": true,
  "data": {
    "requests": [],
    "total": 0
  }
}
```

### Profile Features Working:
- User profile displays real data from database
- Profile image upload functionality (base64 storage)
- Edit profile with data persistence

### Frontend Running:
- Mobile: Scan QR code with Expo Go
- Web: Opens automatically in browser

## Common Issues & Solutions

1. **"Module not found"**: Run `npm install` in the respective directory
2. **"Port already in use"**: Change PORT in .env file  
3. **"Network Error"**: Check if backend is running and IP address is correct
4. **Database connection failed**: Verify DATABASE_URL in .env file
5. **"Campus Cab User" showing**: Backend connection issue - check network and server status
6. **Profile image not uploading**: Check expo-image-picker permissions and backend multer config
7. **App crashes on image select**: Ensure expo-image-picker@~16.0.6 is installed
-# Carpool App

A React Native mobile application for carpooling with a beautiful dark theme UI.

## Features

- **Home Screen**: Select vehicle type (Auto, Sedan, SUV, Traveller)
- **Carpool Requests**: View and browse ride requests from other users
- **Filter Options**: Filter requests by location, date, and gender preference
- **My Rides**: View current rides and passengers
- **Profile**: User profile with personal information
- **Create Request**: Add new carpool requests
- **Notifications**: Real-time notifications for ride requests and acceptances

## Tech Stack

### **Frontend (React Native Mobile App)**
- **React Native** - Cross-platform mobile development framework
- **Expo** - Development platform and toolchain
- **React Navigation** - Navigation library for React Native
- **Expo Vector Icons** - Icon library (Ionicons, MaterialCommunityIcons)
- **React Native Community Datetimepicker** - Date and time picker components
- **Expo Image Picker** - Camera and gallery image selection
- **Axios** - HTTP client for API requests
- **React Native Gesture Handler** - Touch and gesture system
- **React Native Safe Area Context** - Safe area handling
- **React Native Screens** - Native screen management
- **React Native Reanimated** - Advanced animations
- **Expo Status Bar** - Status bar configuration

### **Backend (Node.js API Server)**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for Node.js
- **Prisma** - Database ORM and toolkit
- **SQLite** - Lightweight database (development)
- **CORS** - Cross-Origin Resource Sharing middleware
- **Body Parser** - Request body parsing middleware
- **Multer** - File upload handling middleware
- **UUID** - Unique identifier generation
- **Axios** - HTTP client for external API calls
- **Nodemon** - Development server with auto-restart

### **Database**
- **SQLite** - File-based SQL database for development
- **Prisma Schema** - Database schema definition and migrations

### **Development Tools**
- **Git** - Version control
- **GitHub** - Code repository hosting
- **VS Code** - Code editor
- **Expo CLI** - Expo command line tools
- **Metro Bundler** - React Native JavaScript bundler

## Installation

### **🚨 Important Node.js Version Issue**
Your app is using **Node.js v24** which is not compatible with **Expo SDK 49**. 

### **Quick Solutions:**

#### **Option 1: Downgrade Node.js (Recommended)**
1. Install Node.js v18 LTS from [nodejs.org](https://nodejs.org/)
2. Then run:
```bash
npm install
npx expo start
```

#### **Option 2: Use Alternative Testing**
If you want to keep Node.js v24, you can:
```bash
# Test the components individually
npm test

# Or run with React Native CLI (without Expo)
npx react-native run-android
npx react-native run-ios
```

### **Standard Installation (Node.js v18)**
1. Install dependencies:
```bash
npm install
```

2. Fix dependency compatibility:
```bash
npx expo install --fix
```

3. Start the development server:
```bash
npx expo start
```

4. Run on device/emulator:
```bash
# For Android
npx expo run:android

# For iOS
npx expo run:ios

# For web
npx expo start --web
```

## Important Notes

- **Node.js Version**: Use Node.js v18 LTS for best compatibility
- **Expo Go Version**: Make sure you have Expo Go SDK 49 installed on your device
- **QR Code**: Scan the QR code with Expo Go app to run on your device
- **Web**: Press 'w' in the terminal to open in web browser
- **Android**: Press 'a' in the terminal to open Android emulator

## Project Structure

```
src/
├── screens/
│   ├── HomeScreen.js
│   ├── RequestsScreen.js
│   ├── MyRidesScreen.js
│   ├── ProfileScreen.js
│   ├── CreateRequestScreen.js
│   ├── NotificationsScreen.js
│   └── FilterScreen.js
└── assets/
    └── (placeholder images)
```

## Features Overview

### Home Screen
- Greeting message
- Vehicle type selection (Auto, Sedan, SUV, Traveller)
- Navigation to notifications and create request

### Requests Screen
- List of all carpool requests
- User information display
- Filter functionality
- Create new request button

### My Rides Screen
- Current active ride information
- Passenger list with contact options
- Call functionality for passengers

### Profile Screen
- User personal information
- Profile picture with edit option
- Change password and logout options

### Create Request Screen
- Starting point and destination input
- Date and time selection
- Passenger count slider
- Submit request functionality

### Notifications Screen
- Ride request notifications
- Accept/reject functionality
- Call option for requesters

### Filter Screen
- Location filter
- Date filter
- Gender preference filter
- Apply/clear filters

## Design

The app features a dark theme with:
- Primary color: Orange (#FFA500)
- Background: Black (#000)
- Cards: Dark gray (#1a1a1a)
- Text: White and gray variants
- Consistent typography and spacing

## Made with ❤️ by IEEE CS MUJ

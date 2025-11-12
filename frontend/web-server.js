const path = require('path');
const { createServer } = require('http');
const { readFileSync } = require('fs');
const { parse } = require('url');

// Simple development server for React Native Web
const PORT = 3000;

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;

  // Serve the main HTML file
  if (pathname === '/' || pathname === '/index.html') {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carpool App</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            min-height: 100vh;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            color: #2196F3;
        }
        .nav-tabs {
            display: flex;
            justify-content: space-around;
            background-color: #fff;
            border-top: 1px solid #eee;
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            max-width: 400px;
            padding: 10px 0;
        }
        .nav-tab {
            text-align: center;
            padding: 10px;
            cursor: pointer;
            flex: 1;
            border: none;
            background: none;
            color: #666;
        }
        .nav-tab.active {
            color: #2196F3;
        }
        .screen {
            display: none;
            padding-bottom: 80px;
        }
        .screen.active {
            display: block;
        }
        .card {
            background: white;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .button {
            background-color: #2196F3;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 8px 0;
            width: 100%;
        }
        .button:hover {
            background-color: #1976D2;
        }
        .input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            margin: 8px 0;
        }
        .ride-card {
            border-left: 4px solid #2196F3;
        }
        .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            margin: 8px 0;
        }
        .status.active {
            background-color: #4CAF50;
            color: white;
        }
        .status.pending {
            background-color: #FF9800;
            color: white;
        }
        .status.completed {
            background-color: #9E9E9E;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="home" class="screen active">
            <div class="header">
                <h1>🚗 Carpool App</h1>
                <p>Find or offer rides easily</p>
            </div>
            <div class="card">
                <h3>Quick Actions</h3>
                <button class="button" onclick="showScreen('create')">Create Ride Request</button>
                <button class="button" onclick="showScreen('requests')">Browse Requests</button>
                <button class="button" onclick="showScreen('rides')">My Rides</button>
            </div>
            <div class="card">
                <h3>Recent Activity</h3>
                <p>• John's ride to Airport - Tomorrow 9:00 AM</p>
                <p>• Sarah's ride to Downtown - Today 5:30 PM</p>
                <p>• Mike's ride to University - Yesterday</p>
            </div>
        </div>

        <div id="requests" class="screen">
            <div class="header">
                <h2>Ride Requests</h2>
                <button class="button" onclick="showScreen('filter')">Filter</button>
            </div>
            <div class="card ride-card">
                <h4>Downtown → Airport</h4>
                <p>Tomorrow, 9:00 AM</p>
                <p>Driver: John Smith</p>
                <p>Available seats: 3</p>
                <div class="status active">Active</div>
                <button class="button">Request Ride</button>
            </div>
            <div class="card ride-card">
                <h4>University → Mall</h4>
                <p>Today, 5:30 PM</p>
                <p>Driver: Sarah Johnson</p>
                <p>Available seats: 2</p>
                <div class="status active">Active</div>
                <button class="button">Request Ride</button>
            </div>
            <div class="card ride-card">
                <h4>Home → Office</h4>
                <p>Monday, 8:00 AM</p>
                <p>Driver: Mike Brown</p>
                <p>Available seats: 1</p>
                <div class="status pending">Pending</div>
                <button class="button">Request Ride</button>
            </div>
        </div>

        <div id="rides" class="screen">
            <div class="header">
                <h2>My Rides</h2>
            </div>
            <div class="card ride-card">
                <h4>My Ride: Home → Office</h4>
                <p>Tomorrow, 8:00 AM</p>
                <p>Passengers: 2/4</p>
                <div class="status active">Active</div>
                <button class="button">Manage Ride</button>
            </div>
            <div class="card ride-card">
                <h4>Requested: Downtown → Airport</h4>
                <p>Friday, 3:00 PM</p>
                <p>Driver: Alex Wilson</p>
                <div class="status pending">Pending</div>
                <button class="button">Cancel Request</button>
            </div>
            <div class="card ride-card">
                <h4>Completed: University → Home</h4>
                <p>Yesterday, 6:00 PM</p>
                <p>Driver: Lisa Davis</p>
                <div class="status completed">Completed</div>
                <button class="button">Rate Ride</button>
            </div>
        </div>

        <div id="create" class="screen">
            <div class="header">
                <h2>Create Ride Request</h2>
            </div>
            <div class="card">
                <h3>Trip Details</h3>
                <input type="text" placeholder="From" class="input" id="from">
                <input type="text" placeholder="To" class="input" id="to">
                <input type="datetime-local" class="input" id="datetime">
                <input type="number" placeholder="Available seats" class="input" id="seats" min="1" max="8">
                <textarea placeholder="Additional notes..." class="input" id="notes" rows="3"></textarea>
                <button class="button" onclick="createRide()">Create Ride</button>
            </div>
        </div>

        <div id="filter" class="screen">
            <div class="header">
                <h2>Filter Rides</h2>
            </div>
            <div class="card">
                <h3>Filter Options</h3>
                <input type="text" placeholder="Departure location" class="input">
                <input type="text" placeholder="Destination" class="input">
                <input type="date" class="input">
                <input type="time" class="input">
                <select class="input">
                    <option>Any time</option>
                    <option>Morning (6-12)</option>
                    <option>Afternoon (12-18)</option>
                    <option>Evening (18-24)</option>
                </select>
                <button class="button" onclick="applyFilter()">Apply Filter</button>
                <button class="button" onclick="showScreen('requests')" style="background-color: #757575;">Cancel</button>
            </div>
        </div>

        <div id="profile" class="screen">
            <div class="header">
                <h2>Profile</h2>
            </div>
            <div class="card">
                <h3>John Doe</h3>
                <p>📧 john.doe@email.com</p>
                <p>📱 +1 (555) 123-4567</p>
                <p>⭐ Rating: 4.8/5</p>
                <p>🚗 Vehicle: Toyota Camry 2020</p>
                <button class="button">Edit Profile</button>
                <button class="button" onclick="showScreen('notifications')">Notifications</button>
                <button class="button" style="background-color: #f44336;">Logout</button>
            </div>
        </div>

        <div id="notifications" class="screen">
            <div class="header">
                <h2>Notifications</h2>
            </div>
            <div class="card">
                <h4>New ride request</h4>
                <p>Sarah wants to join your ride to Downtown</p>
                <p>2 minutes ago</p>
                <button class="button">Accept</button>
                <button class="button" style="background-color: #f44336;">Decline</button>
            </div>
            <div class="card">
                <h4>Ride confirmed</h4>
                <p>Your ride with Mike to University has been confirmed</p>
                <p>1 hour ago</p>
            </div>
            <div class="card">
                <h4>Ride reminder</h4>
                <p>Don't forget your ride tomorrow at 8:00 AM</p>
                <p>3 hours ago</p>
            </div>
        </div>
    </div>

    <nav class="nav-tabs">
        <button class="nav-tab active" onclick="showScreen('home')">🏠 Home</button>
        <button class="nav-tab" onclick="showScreen('requests')">🔍 Requests</button>
        <button class="nav-tab" onclick="showScreen('rides')">🚗 My Rides</button>
        <button class="nav-tab" onclick="showScreen('profile')">👤 Profile</button>
    </nav>

    <script>
        function showScreen(screenId) {
            // Hide all screens
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            // Show selected screen
            document.getElementById(screenId).classList.add('active');
            
            // Update navigation
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Find and activate the correct tab
            const tabs = document.querySelectorAll('.nav-tab');
            const tabMap = {
                'home': 0,
                'requests': 1,
                'rides': 2,
                'profile': 3
            };
            
            if (tabMap[screenId] !== undefined) {
                tabs[tabMap[screenId]].classList.add('active');
            }
        }
        
        function createRide() {
            const from = document.getElementById('from').value;
            const to = document.getElementById('to').value;
            const datetime = document.getElementById('datetime').value;
            const seats = document.getElementById('seats').value;
            const notes = document.getElementById('notes').value;
            
            if (from && to && datetime && seats) {
                alert('Ride created successfully!\\nFrom: ' + from + '\\nTo: ' + to + '\\nTime: ' + datetime + '\\nSeats: ' + seats);
                document.getElementById('from').value = '';
                document.getElementById('to').value = '';
                document.getElementById('datetime').value = '';
                document.getElementById('seats').value = '';
                document.getElementById('notes').value = '';
                showScreen('home');
            } else {
                alert('Please fill in all required fields');
            }
        }
        
        function applyFilter() {
            alert('Filter applied! Showing filtered results...');
            showScreen('requests');
        }
    </script>
</body>
</html>
    `;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  // Return 404 for other requests
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`🚗 Carpool App running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});

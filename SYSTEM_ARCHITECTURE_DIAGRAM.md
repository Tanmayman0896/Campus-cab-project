# Frontend-Backend Communication Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CAMPUS CAB APPLICATION                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (React Native)                   │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │                  Navigation Layer                     │   │  │
│  │  │  ┌─────────────┬─────────────┬──────────┬────────┐  │   │  │
│  │  │  │   Home      │  Requests   │ My Rides │Profile │  │   │  │
│  │  │  │  Screen     │  Screen     │  Screen  │ Screen │  │   │  │
│  │  │  └─────────────┴─────────────┴──────────┴────────┘  │   │  │
│  │  │                                                      │   │  │
│  │  │  ┌──────────────────────────────────────────────┐  │   │  │
│  │  │  │        Modal Screens                       │  │   │  │
│  │  │  │  ┌──────────┬──────────┬────────────────┐  │  │   │  │
│  │  │  │  │ Create   │Notif-    │ Filter/Search  │  │  │   │  │
│  │  │  │  │ Request  │ications  │ Requests       │  │  │   │  │
│  │  │  │  └──────────┴──────────┴────────────────┘  │  │   │  │
│  │  │  └──────────────────────────────────────────────┘  │   │  │
│  │  │                                                      │   │  │
│  │  │  ┌──────────────────────────────────────────────┐  │   │  │
│  │  │  │       UI Components                         │  │   │  │
│  │  │  │  ┌─────────────┬──────────────────────────┐ │  │   │  │
│  │  │  │  │RequestCard  │ VehicleCard & Utilities │ │  │   │  │
│  │  │  │  └─────────────┴──────────────────────────┘ │  │   │  │
│  │  │  └──────────────────────────────────────────────┘  │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │         API Service Layer (NEW)                 │   │  │
│  │  │                                                  │   │  │
│  │  │  ┌─────────────┐  ┌─────────────┐            │   │  │
│  │  │  │ requestAPI  │  │ voteAPI     │            │   │  │
│  │  │  │             │  │             │            │   │  │
│  │  │  │ createReq() │  │ voteOn()    │            │   │  │
│  │  │  │ getAll()    │  │ getVotes()  │            │   │  │
│  │  │  │ getUser()   │  │ getUserVotes│            │   │  │
│  │  │  │ search()    │  │ deleteVote()│            │   │  │
│  │  │  └─────────────┘  └─────────────┘            │   │  │
│  │  │  ┌─────────────┐  ┌─────────────┐            │   │  │
│  │  │  │ userAPI     │  │ rideAPI     │            │   │  │
│  │  │  │             │  │             │            │   │  │
│  │  │  │ getProfile()│  │ getAllRides │            │   │  │
│  │  │  │ updateProf()│  │ getRideById()│            │   │  │
│  │  │  │ getUserStats│  │             │            │   │  │
│  │  │  │ deleteUser()│  │             │            │   │  │
│  │  │  └─────────────┘  └─────────────┘            │   │  │
│  │  │                                              │   │  │
│  │  │  ┌──────────────────────────────────────┐   │   │  │
│  │  │  │  Axios HTTP Client (api.js)         │   │   │  │
│  │  │  │  ┌──────────────────────────────┐   │   │   │  │
│  │  │  │  │ • Base URL Configuration      │   │   │   │  │
│  │  │  │  │ • Request Interceptors        │   │   │   │  │
│  │  │  │  │ • Response Interceptors       │   │   │   │  │
│  │  │  │  │ • Error Handling              │   │   │   │  │
│  │  │  │  │ • Authentication Ready        │   │   │   │  │
│  │  │  │  └──────────────────────────────┘   │   │   │  │
│  │  │  └──────────────────────────────────────┘   │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                      │  │
│  │  .env Configuration                                 │  │
│  │  REACT_APP_API_URL=http://localhost:3000/api/v1    │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↑                                 │
│                           │ HTTP/REST                       │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               BACKEND (Node.js/Express)              │  │
│  │                                                      │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │              API Routes (/api/v1)           │   │  │
│  │  │                                              │   │  │
│  │  │  POST   /requests          → Create request │   │  │
│  │  │  GET    /requests/all      → All requests   │   │  │
│  │  │  GET    /requests/search   → Search         │   │  │
│  │  │  GET    /requests/my-reqs  → User requests  │   │  │
│  │  │  GET    /requests/:id      → Request detail │   │  │
│  │  │  PUT    /requests/:id      → Update request │   │  │
│  │  │  DELETE /requests/:id      → Cancel request │   │  │
│  │  │                                              │   │  │
│  │  │  POST   /votes/:id         → Vote on request│   │  │
│  │  │  GET    /votes/:id         → Request votes  │   │  │
│  │  │  GET    /votes/user/votes  → User votes     │   │  │
│  │  │  DELETE /votes/:id         → Delete vote    │   │  │
│  │  │                                              │   │  │
│  │  │  GET    /users/profile     → User profile   │   │  │
│  │  │  PUT    /users/profile     → Update profile │   │  │
│  │  │  GET    /users/stats       → User stats     │   │  │
│  │  │  GET    /users             → All users      │   │  │
│  │  │  DELETE /users/:id         → Delete user    │   │  │
│  │  │                                              │   │  │
│  │  │  GET    /rides             → All rides      │   │  │
│  │  │  GET    /rides/:id         → Ride detail    │   │  │
│  │  │                                              │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                      │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │           Controllers                        │   │  │
│  │  │                                              │   │  │
│  │  │  requestController     voteController        │   │  │
│  │  │  ├─ createRequest()    ├─ vote()            │   │  │
│  │  │  ├─ getAllRequests()   ├─ getRequestVotes() │   │  │
│  │  │  ├─ searchRequests()   ├─ getUserVotes()    │   │  │
│  │  │  ├─ getUserRequests()  └─ deleteVote()      │   │  │
│  │  │  ├─ getRequestById()                        │   │  │
│  │  │  ├─ updateRequest()    userController       │   │  │
│  │  │  └─ deleteRequest()    ├─ getProfile()     │   │  │
│  │  │                        ├─ updateProfile()   │   │  │
│  │  │                        ├─ getUserStats()    │   │  │
│  │  │                        ├─ getAllUsers()     │   │  │
│  │  │                        └─ deleteUser()      │   │  │
│  │  │                                              │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                      │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │        Prisma ORM                           │   │  │
│  │  │  ┌──────────────────────────────────────┐   │   │  │
│  │  │  │  Models & Database Access           │   │   │  │
│  │  │  ├─ User                               │   │   │  │
│  │  │  ├─ Request                            │   │   │  │
│  │  │  ├─ Vote                               │   │   │  │
│  │  │  └─ Driver                             │   │   │  │
│  │  │  └──────────────────────────────────────┘   │   │  │
│  │  │                                              │   │  │
│  │  │           ↓ Database Queries                │   │  │
│  │  │                                              │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                      │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │         PostgreSQL Database                 │   │  │
│  │  │                                              │   │  │
│  │  │  ┌─────────────┐  ┌──────────────────────┐  │   │  │
│  │  │  │ users table │  │ requests table       │  │   │  │
│  │  │  │ ├─ id       │  │ ├─ id                │  │   │  │
│  │  │  │ ├─ email    │  │ ├─ userId (FK)      │  │   │  │
│  │  │  │ ├─ name     │  │ ├─ from              │  │   │  │
│  │  │  │ ├─ phone    │  │ ├─ to                │  │   │  │
│  │  │  │ ├─ course   │  │ ├─ date              │  │   │  │
│  │  │  │ ├─ year     │  │ ├─ time              │  │   │  │
│  │  │  │ ├─ gender   │  │ ├─ carType           │  │   │  │
│  │  │  │ └─ role     │  │ ├─ maxPersons        │  │   │  │
│  │  │  │             │  │ ├─ currentOccupancy  │  │   │  │
│  │  │  └─────────────┘  │ ├─ status            │  │   │  │
│  │  │                   │ └─ timestamps        │  │   │  │
│  │  │  ┌──────────────┐ └──────────────────────┘  │   │  │
│  │  │  │ votes table  │ ┌──────────────────────┐  │   │  │
│  │  │  │ ├─ id        │ │ drivers table       │  │   │  │
│  │  │  │ ├─ requestId │ │ ├─ id                │  │   │  │
│  │  │  │ ├─ userId    │ │ ├─ name              │  │   │  │
│  │  │  │ ├─ status    │ │ ├─ carType           │  │   │  │
│  │  │  │ ├─ note      │ │ ├─ carNumber         │  │   │  │
│  │  │  │ └─ timestamps│ │ └─ avgPricing        │  │   │  │
│  │  │  │              │ └──────────────────────┘  │   │  │
│  │  │  └──────────────┘                           │   │  │
│  │  │                                              │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Request Flow Examples

### Flow 1: Creating a Ride Request

```
User opens CreateRequestScreen
         ↓
Fills form (from, to, date, time, passengers)
         ↓
Clicks "Submit Request"
         ↓
handleSubmit() called
         ↓
setLoading(true)
         ↓
requestAPI.createRequest(data)
         ↓ (HTTP POST)
Backend receives request
         ↓
requestController.createRequest()
         ↓
Prisma creates request in DB
  (currentOccupancy = 1, creator is first passenger)
         ↓
Backend returns response with created request
         ↓
Frontend receives response
         ↓
response.data.success ? Alert success & navigate back
                      : Alert error
         ↓
setLoading(false)
         ↓
Screen refreshed or user returns to home
```

---

### Flow 2: Browsing Available Requests

```
User opens RequestsScreen
         ↓
useFocusEffect detects screen focus
         ↓
fetchRequests() called
         ↓
setLoading(true)
         ↓
requestAPI.getAllRequests({ page: 1, limit: 20, status: 'active' })
         ↓ (HTTP GET)
Backend receives request
         ↓
requestController.getAllRequests()
         ↓
Prisma queries active requests from DB
  (Status = 'active', date >= now)
         ↓
Backend returns paginated results
  with user details and vote info
         ↓
Frontend receives response
         ↓
setRequests(response.data.data.requests)
setTotalPages(response.data.data.pagination.pages)
         ↓
setLoading(false)
         ↓
UI renders request list
```

---

### Flow 3: Voting on a Request

```
User sees request in RequestsScreen
         ↓
Clicks "Join Ride" button
         ↓
handleJoinRide() called
         ↓
voteAPI.voteOnRequest(requestId, { status: 'accepted' })
         ↓ (HTTP POST)
Backend receives vote
         ↓
voteController.vote()
         ↓
Prisma creates/updates vote
Prisma increments currentOccupancy
         ↓
If currentOccupancy >= maxPersons:
  Update request status to 'completed'
         ↓
Backend returns:
  - Vote details
  - Updated request
  - Contact info (if accepted)
         ↓
Frontend receives response
         ↓
Alert user with success message
Optional: Share contact details
Navigate or refresh list
```

---

### Flow 4: Viewing User Profile

```
User opens ProfileScreen
         ↓
useFocusEffect detects screen focus
         ↓
fetchProfileAndStats() called
         ↓
Promise.all([
  userAPI.getProfile(),
  userAPI.getUserStats()
])
         ↓
Parallel requests to backend:
  GET /users/profile
  GET /users/stats
         ↓
Backend:
  Get user profile from DB
  Calculate stats (count requests, votes, etc.)
         ↓
Backend returns both responses
         ↓
Frontend receives:
  {
    profileData,
    statsData
  }
         ↓
setUserInfo(profileData)
setUserStats(statsData)
         ↓
UI renders profile with stats cards
```

---

## Data Transformation Example

### Request Creation - What Gets Sent vs What's Stored

```
Frontend sends:
{
  from: "MUJ",
  to: "Delhi",
  date: "2025-11-01",
  time: "21:00",
  carType: "Traveller",
  maxPersons: 4
}

        ↓ (HTTP POST to backend)

Backend stores in DB:
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  userId: "550e8400-e29b-41d4-a716-446655440001",
  from: "MUJ",
  to: "Delhi",
  date: "2025-11-01T00:00:00.000Z",
  time: "21:00",
  carType: "Traveller",
  maxPersons: 4,
  currentOccupancy: 1,  // Creator is occupying 1 seat
  status: "active",
  createdAt: "2025-11-09T12:00:00.000Z",
  updatedAt: "2025-11-09T12:00:00.000Z"
}

        ↓ (Response sent back)

Frontend receives:
{
  success: true,
  message: "Your ride request has been created!",
  data: {
    // Full request object from above
  }
}

        ↓

Frontend displays success alert and navigates back to home
```

---

## Error Handling Flow

```
API Call Made
      ↓
   ┌──┴──┐
   │     │
Response  No Response
   │        (Network error)
   │          │
   ↓          ↓
Success    Network Error
(2xx)      Alert: "No response from server"
   │
   │
   ↓
Error Status
(4xx, 5xx)
   │
   ├── 404 Not Found
   │   Alert: "Resource not found"
   │
   ├── 400 Bad Request
   │   Alert: "Invalid data"
   │
   ├── 401 Unauthorized
   │   Alert: "Authentication required"
   │
   ├── 403 Forbidden
   │   Alert: "Permission denied"
   │
   └── 500 Server Error
       Alert: "Server error, please try again"
```

---

## Component Communication

```
CreateRequestScreen
├─ Imports: requestAPI
├─ Uses: useState, useCallback
├─ Calls: requestAPI.createRequest()
└─ Handles: Loading, Success, Error

RequestsScreen
├─ Imports: requestAPI, useFocusEffect
├─ Uses: useState, useEffect
├─ Calls: requestAPI.getAllRequests()
├─ Displays: RequestCard components
└─ Handles: Loading, Pagination, Empty state

MyRidesScreen
├─ Imports: requestAPI, voteAPI
├─ Calls: requestAPI.getUserRequests()
├─ Displays: Participant cards with vote status
└─ Handles: Call button (future)

ProfileScreen
├─ Imports: userAPI
├─ Calls: userAPI.getProfile()
│          userAPI.getUserStats()
├─ Displays: Profile info + Stats cards
└─ Handles: Edit/Logout (future)
```

---

## State Management Pattern

```
Screen Component
├─ useState(data)
├─ useState(loading)
├─ useState(error)
├─ useFocusEffect(fetch function)
└─ Try-Catch for API calls

Typical flow:
  setLoading(true)
  ↓
  try {
    response = await API.call()
    if (response.success) {
      setData(response.data)
      Alert success
    }
  } catch (error) {
    Alert error
  } finally {
    setLoading(false)
  }
  ↓
  Conditional rendering based on state
```

---

## Data Refresh Strategy

```
Screen Opens
└─ useFocusEffect runs
   └─ Calls fetchData()
      └─ Makes API call
         └─ Updates state
            └─ UI re-renders

User navigates away
└─ Component unfocuses
   └─ Effect cleanup (optional)

User returns to screen
└─ useFocusEffect runs again
   └─ Fresh data fetched
      └─ UI updated
```

---

## Pagination Strategy

```
Initial Load
└─ Fetch page 1
   └─ Load 20 items
      └─ Store totalPages = 5

User scrolls to end
└─ onEndReached triggered
   └─ Check: currentPage < totalPages?
      └─ Yes: Fetch page 2
      └─ No: Stop loading

Append new items to existing list
└─ setRequests([...existing, ...new])
   └─ Increment page counter
      └─ Continue scrolling works
```

---

This comprehensive diagram shows how data flows between your frontend and backend, making it easier to understand the complete system architecture.

import axios from 'axios';

// Configure the API base URL - Backend is running on port 3003
// Try localhost first, fallback to network IP if needed  
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3003/api/v1';

console.log('🚀 API Base URL:', API_BASE_URL);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and logging
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.config.method?.toUpperCase(), response.config.url, '✅');
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('❌ API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('❌ No response from server. Check if backend is running on', API_BASE_URL);
    } else {
      // Something else happened
      console.error('❌ API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// REQUEST ENDPOINTS
export const requestAPI = {
  // Create a new ride request
  createRequest: (data) => {
    return apiClient.post('/requests', data);
  },

  // Search for matching requests
  searchRequests: (params) => {
    return apiClient.get('/requests/search', { params });
  },

  // Get all requests with optional filters
  getAllRequests: (params) => {
    return apiClient.get('/requests/all', { params });
  },

  // Get user's own requests
  getUserRequests: (params) => {
    return apiClient.get('/requests/my-requests', { params });
  },

  // Get request details by ID
  getRequestById: (id) => {
    return apiClient.get(`/requests/${id}`);
  },

  // Update request
  updateRequest: (id, data) => {
    return apiClient.put(`/requests/${id}`, data);
  },

  // Delete/cancel request
  deleteRequest: (id) => {
    return apiClient.delete(`/requests/${id}`);
  },
};

// VOTE ENDPOINTS
export const voteAPI = {
  // Vote on a request (accept/reject)
  voteOnRequest: (requestId, data) => {
    return apiClient.post(`/votes/${requestId}`, data);
  },

  // Get votes on a request (for request owner)
  getRequestVotes: (requestId) => {
    return apiClient.get(`/votes/${requestId}`);
  },

  // Get user's own votes
  getUserVotes: (params) => {
    return apiClient.get('/votes/user/votes', { params });
  },

  // Delete a vote
  deleteVote: (requestId) => {
    return apiClient.delete(`/votes/${requestId}`);
  },
};

// USER ENDPOINTS
export const userAPI = {
  // Get current user profile
  getProfile: () => {
    return apiClient.get('/users/profile');
  },

  // Update user profile
  updateProfile: (data) => {
    return apiClient.put('/users/profile', data);
  },

  // Get user statistics
  getUserStats: () => {
    return apiClient.get('/users/stats');
  },

  // Get all users (admin only)
  getAllUsers: (params) => {
    return apiClient.get('/users', { params });
  },

  // Delete user (admin only)
  deleteUser: (userId) => {
    return apiClient.delete(`/users/${userId}`);
  },
};

// RIDE ENDPOINTS
export const rideAPI = {
  // Get all rides
  getAllRides: (params) => {
    return apiClient.get('/rides', { params });
  },

  // Get ride details by ID
  getRideById: (id) => {
    return apiClient.get(`/rides/${id}`);
  },
};

// Test connection function
export const testConnection = async () => {
  try {
    console.log('🔄 Testing backend connection...');
    const response = await apiClient.get('/health');
    console.log('✅ Backend connection successful!', response.data);
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    return false;
  }
};

export default apiClient;
import axios from 'axios';
import { Platform, NativeModules } from 'react-native';

const API_VERSION_PATH = '/api/v1';

const parseHostFromUrl = (value) => {
  if (!value || typeof value !== 'string') return null;
  const match = value.match(/https?:\/\/([^/:]+)/i);
  return match ? match[1] : null;
};

const getExpoHost = () => {
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  const hostFromScript = parseHostFromUrl(scriptURL);
  if (hostFromScript) return hostFromScript;

  try {
    // expo-constants typically exposes hostUri like "192.168.x.x:8081" in dev.
    const Constants = require('expo-constants').default;
    const hostUri = Constants?.expoConfig?.hostUri || Constants?.manifest2?.extra?.expoClient?.hostUri || Constants?.manifest?.debuggerHost;
    if (hostUri && typeof hostUri === 'string') {
      return hostUri.split(':')[0];
    }
  } catch (error) {
    // Ignore when module/runtime metadata is unavailable.
  }

  try {
    // Linking URL in Expo dev often includes exp://<host>:<port>
    const Linking = require('expo-linking');
    const createdUrl = Linking?.createURL?.('/');
    const hostFromLinking = parseHostFromUrl(createdUrl);
    if (hostFromLinking) return hostFromLinking;
  } catch (error) {
    // Ignore when module/runtime metadata is unavailable.
  }

  return parseHostFromUrl(globalThis?.location?.origin);
};

const getCandidateBaseUrls = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL || process.env.REACT_APP_API_URL;
  if (envUrl) {
    return [envUrl.replace(/\/$/, '')];
  }

  const envHost = process.env.EXPO_PUBLIC_API_HOST;
  const explicitPort = Number(process.env.EXPO_PUBLIC_API_PORT);
  const fallbackPorts = [3001];
  const ports = Number.isInteger(explicitPort)
    ? [explicitPort, ...fallbackPorts.filter((port) => port !== explicitPort)]
    : fallbackPorts;
  const urls = [];

  if (Platform.OS === 'web') {
    ports.forEach((port) => urls.push(`http://localhost:${port}${API_VERSION_PATH}`));
    ports.forEach((port) => urls.push(`http://127.0.0.1:${port}${API_VERSION_PATH}`));
  } else {
    if (envHost) {
      ports.forEach((port) => urls.push(`http://${envHost}:${port}${API_VERSION_PATH}`));
    }

    const expoHost = getExpoHost();
    if (expoHost) {
      ports.forEach((port) => urls.push(`http://${expoHost}:${port}${API_VERSION_PATH}`));
    }

    // Localhost can work for simulators; try before emulator-specific alias.
    ports.forEach((port) => urls.push(`http://localhost:${port}${API_VERSION_PATH}`));
    ports.forEach((port) => urls.push(`http://127.0.0.1:${port}${API_VERSION_PATH}`));

    // Android emulator loopback alias as a last fallback.
    ports.forEach((port) => urls.push(`http://10.0.2.2:${port}${API_VERSION_PATH}`));
  }

  return [...new Set(urls)];
};

const API_BASE_URL = getCandidateBaseUrls()[0] || `http://localhost:3001${API_VERSION_PATH}`;

console.log('🚀 API Base URL:', API_BASE_URL);
console.log('🔧 Platform:', Platform.OS);

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
      console.error('❌ No response from server. Check if backend is running on', apiClient.defaults.baseURL);
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

  reverseGeocode: (params) => {
    return apiClient.get('/requests/geocode/reverse', { params });
  },

  searchPlaces: (params) => {
    return apiClient.get('/requests/geocode/search', { params });
  },

  getPlaceDetails: (params) => {
    return apiClient.get('/requests/geocode/place', { params });
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

  // Test connection for user operations
  testConnection: async () => {
    return await requestAPI.testConnection();
  },

  // Upload profile image (now sends base64 data)
  uploadProfileImage: async (imageUri) => {
    try {
      // Convert image URI to base64
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result;
          console.log('📤 Sending base64 image data to backend');
          console.log('📊 Base64 data length:', base64Data.length);
          
          // Send base64 data to backend
          apiClient.post('/users/profile/image', {
            profileImage: base64Data
          }).then(resolve).catch(reject);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('❌ Error converting image to base64:', error);
      throw error;
    }
  },

  // Get API base URL for constructing image URLs
  getApiBaseUrl: () => {
    return apiClient.defaults.baseURL.replace('/api/v1', '');
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

// Enhanced connection test function
requestAPI.testConnection = async () => {
  const testUrls = getCandidateBaseUrls();
  
  console.log('🔄 Testing backend connection with multiple URLs...');
  
  for (const baseUrl of testUrls) {
    try {
      console.log(`🌐 Trying connection to: ${baseUrl}`);
      
      // Create temporary client for this URL
      const tempClient = axios.create({
        baseURL: baseUrl,
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Test the requests endpoint directly
      const response = await tempClient.get('/requests/all');
      
      console.log(`✅ Connection successful to ${baseUrl}`);
      console.log('📊 Response status:', response.status);
      console.log('📡 Response data type:', typeof response.data);
      console.log('🚗 Raw response:', JSON.stringify(response.data, null, 2));
      
      if (response.data && response.data.data && response.data.data.requests) {
        console.log('📈 Number of requests found:', response.data.data.requests.length);
        response.data.data.requests.forEach((req, idx) => {
          console.log(`  Request ${idx + 1}:`, {
            id: req.id.substring(0, 8) + '...',
            route: `${req.from} → ${req.to}`,
            date: req.date,
            status: req.status
          });
        });
      }
      
      // Update the global API client to use this working URL
      apiClient.defaults.baseURL = baseUrl;
      console.log(`🎯 Updated API base URL to: ${baseUrl}`);
      
      return {
        success: true,
        url: baseUrl,
        data: response.data
      };
      
    } catch (error) {
      console.log(`❌ Failed to connect to ${baseUrl}:`, error.message);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data:`, error.response.data);
      }
      continue;
    }
  }
  
  console.error('❌ All connection attempts failed!');
  return {
    success: false,
    error: 'Could not connect to any backend URL'
  };
};

// Legacy test connection function for backward compatibility
export const testConnection = async () => {
  const result = await requestAPI.testConnection();
  return result.success;
};

export default apiClient;
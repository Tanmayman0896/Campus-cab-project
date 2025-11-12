// Common utility functions for the app

export const formatDate = (date) => {
  const options = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  };
  return new Date(date).toLocaleDateString('en-GB', options);
};

export const formatTime = (time) => {
  const options = { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  };
  return new Date(time).toLocaleTimeString('en-US', options);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

export const getVehicleIcon = (vehicleType) => {
  const icons = {
    auto: 'bicycle',
    sedan: 'car',
    suv: 'car-sport',
    traveller: 'bus',
  };
  return icons[vehicleType.toLowerCase()] || 'car';
};

export const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
};

export const colors = {
  primary: '#FFA500',
  background: '#000',
  cardBackground: '#1a1a1a',
  textPrimary: '#FFF',
  textSecondary: '#888',
  textTertiary: '#666',
  accent: '#333',
  success: '#4CAF50',
  error: '#F44336',
};

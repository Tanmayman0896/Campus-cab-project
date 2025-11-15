// Quick test script to check what the profile endpoint returns
const axios = require('axios');

async function testProfile() {
  try {
    console.log('🧪 Testing profile endpoint...');
    
    // Test the profile endpoint directly
    const response = await axios.get('http://localhost:3001/api/v1/users/profile');
    
    console.log('✅ Response received');
    console.log('📊 Status:', response.status);
    console.log('📋 Response structure:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.data) {
      console.log('👤 User name from API:', response.data.data.name);
      console.log('📧 User email from API:', response.data.data.email);
    }
    
  } catch (error) {
    console.error('❌ Error testing profile endpoint:', error.message);
    if (error.response) {
      console.error('📋 Error response:', error.response.data);
    }
  }
}

testProfile();
const axios = require('axios');

async function testBackendConnection() {
  const testUrls = [
    'http://localhost:3001/api/v1/requests/all',
    'http://10.63.209.138:3001/api/v1/requests/all'
  ];
  
  console.log('🔍 Testing backend connectivity...');
  
  for (const url of testUrls) {
    try {
      console.log(`\n🌐 Testing: ${url}`);
      const response = await axios.get(url, { timeout: 5000 });
      console.log('✅ Success!');
      console.log('📊 Status:', response.status);
      console.log('📡 Data:', JSON.stringify(response.data, null, 2));
      return true;
    } catch (error) {
      console.log('❌ Failed:', error.message);
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Data:', error.response.data);
      }
    }
  }
  
  console.log('\n❌ All connection attempts failed!');
  return false;
}

testBackendConnection();
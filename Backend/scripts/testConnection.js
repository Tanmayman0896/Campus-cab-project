async function testBackendConnection() {
  const testUrls = [
    'http://localhost:3000/api/v1/requests/all',
    'http://localhost:3001/api/v1/requests/all',
    'http://172.31.3.138:3000/api/v1/requests/all',
    'http://172.31.3.138:3001/api/v1/requests/all'
  ];
  
  console.log('🔍 Testing backend connectivity...');
  
  for (const url of testUrls) {
    try {
      console.log(`\n🌐 Testing: ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      console.log('✅ Success!');
      console.log('📊 Status:', response.status);
      console.log('📡 Data:', JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.log('❌ Failed:', error.message);
    }
  }
  
  console.log('\n❌ All connection attempts failed!');
  return false;
}

testBackendConnection();
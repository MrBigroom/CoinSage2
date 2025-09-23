const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
  try {
    console.log('Testing authentication system...\n');

    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      currency: 'USD',
      monthly_income: 3000
    });
    
    console.log('✅ Registration successful');
    console.log('Token:', registerResponse.data.token);
    console.log('User:', registerResponse.data.data.user);
    
    const token = registerResponse.data.token;
    
    // Test 2: Login with the same user
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful');
    console.log('Token:', loginResponse.data.token);
    
    // Test 3: Get current user profile
    console.log('\n3. Testing protected route...');
    const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ Protected route access successful');
    console.log('User profile:', meResponse.data.data.user);
    
    console.log('\n🎉 All authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Start your server first, then run this test
testAuth();
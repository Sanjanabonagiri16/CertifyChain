const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let userToken = '';

async function testUserFlow() {
    try {
        console.log('Testing User Registration and Login Flow...\n');

        // 1. Register new user
        console.log('1. Testing user registration...');
        const registerResponse = await axios.post(`${API_URL}/auth/register`, {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'test123'
        });
        console.log('✓ User registration successful');
        console.log('Response:', registerResponse.data, '\n');

        // 2. Login with new user
        console.log('2. Testing user login...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'testuser@example.com',
            password: 'test123'
        });
        userToken = loginResponse.data.token;
        console.log('✓ User login successful');
        console.log('User details:', loginResponse.data.user, '\n');

        // 3. Get user profile
        console.log('3. Testing get user profile...');
        const profileResponse = await axios.get(
            `${API_URL}/auth/me`,
            {
                headers: { Authorization: `Bearer ${userToken}` }
            }
        );
        console.log('✓ Profile retrieved successfully');
        console.log('Profile:', profileResponse.data, '\n');

        // 4. Test admin access (should fail)
        console.log('4. Testing admin access (should fail)...');
        try {
            await axios.get(
                `${API_URL}/certificates/all`,
                {
                    headers: { Authorization: `Bearer ${userToken}` }
                }
            );
        } catch (error) {
            console.log('✓ Admin access correctly denied\n');
        }

        // 5. Test user logout
        console.log('5. Testing user logout...');
        const logoutResponse = await axios.post(
            `${API_URL}/auth/logout`,
            {},
            {
                headers: { Authorization: `Bearer ${userToken}` }
            }
        );
        console.log('✓ User logout successful');
        console.log('Response:', logoutResponse.data, '\n');

        console.log('All user flow tests completed successfully! 🎉');

    } catch (error) {
        console.error('Error during testing:', error.response?.data || error.message);
    }
}

// Run tests
testUserFlow(); 
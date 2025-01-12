const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';

async function testApi() {
    try {
        console.log('Starting API tests...\n');

        // Test 1: Admin Login
        console.log('1. Testing Admin Login...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@certifychain.com',
            password: 'admin123'
        });
        authToken = loginResponse.data.token;
        console.log('✅ Admin Login successful\n');

        // Test 2: Issue Certificate
        console.log('2. Testing Certificate Issuance...');
        const certificateResponse = await axios.post(
            `${API_URL}/certificates`,
            {
                recipient_name: 'John Doe',
                recipient_email: 'john.doe@example.com',
                course_name: 'Blockchain Fundamentals',
                issue_date: new Date().toISOString(),
                expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                achievements: 'Completed with distinction'
            },
            {
                headers: { Authorization: `Bearer ${authToken}` }
            }
        );
        const certificateId = certificateResponse.data.certificate_id;
        console.log(`✅ Certificate issued successfully. Certificate ID: ${certificateId}\n`);

        // Test 3: Verify Certificate
        console.log('3. Testing Certificate Verification...');
        const verificationResponse = await axios.post(
            `${API_URL}/certificates/verify/${certificateId}`
        );
        console.log(`✅ Certificate verification successful. Certificate is valid for ${verificationResponse.data.recipient_name} in ${verificationResponse.data.course_name}\n`);

        // Test 4: Get All Certificates
        console.log('4. Testing Get All Certificates...');
        const allCertificatesResponse = await axios.get(
            `${API_URL}/certificates`,
            {
                headers: { Authorization: `Bearer ${authToken}` }
            }
        );
        console.log(`✅ Successfully retrieved ${allCertificatesResponse.data.length} certificates\n`);

        console.log('All tests completed successfully! 🎉');
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data?.message || error.message);
        process.exit(1);
    }
}

// Install axios if not already installed
const { execSync } = require('child_process');
try {
    require.resolve('axios');
} catch (err) {
    console.log('Installing axios...');
    execSync('npm install axios', { stdio: 'inherit' });
}

// Run tests
testApi(); 
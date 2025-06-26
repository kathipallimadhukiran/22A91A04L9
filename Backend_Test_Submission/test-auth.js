const axios = require('axios');

async function getAuthToken() {
    try {
        const response = await axios.post(
            'http://20.244.56.144/evaluation-service/auth',
            {
                email: "kathipallimadhu@gmail.com",
                name: "kathipalli madhu kiran",
                rollNo: "22a91a04l9",
                accessCode: "NFwgRT",
                clientID: "ccf04974-372f-4b88-b5d9-52f75a7ea2ab",
                clientSecret: "AdGXHWHQfQdkghkU"
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('Auth Response:', response.data);
        
        // Now try to use the new token
        if (response.data.token_type === 'Bearer' && response.data.access_token) {
            const logResponse = await axios.post(
                'http://20.244.56.144/evaluation-service/logs',
                {
                    stack: 'backend',
                    level: 'info',
                    package: 'controller',
                    message: 'Test message with fresh token'
                },
                {
                    headers: {
                        'Authorization': `${response.data.token_type} ${response.data.access_token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('\nLog Response:', logResponse.data);
        }
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Headers:', error.response.headers);
        }
    }
}

getAuthToken(); 
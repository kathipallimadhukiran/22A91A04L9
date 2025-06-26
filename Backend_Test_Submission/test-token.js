const axios = require('axios');

async function testToken() {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrYXRoaXBhbGxpbWFkaHVAZ21haWwuY29tIiwiZXhwIjoxNzUwOTIxMDY0LCJpYXQiOjE3NTA5MjAxNjQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI1MjBjOGZlNi0zZDY1LTQ5MzktODI0Mi1hNzk2ZmRiZTYwNTUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJrYXRoaXBhbGxpIG1hZGh1IGtpcmFuIiwic3ViIjoiY2NmMDQ5NzQtMzcyZi00Yjg4LWI1ZDktNTJmNzVhN2VhMmFiIn0sImVtYWlsIjoia2F0aGlwYWxsaW1hZGh1QGdtYWlsLmNvbSIsIm5hbWUiOiJrYXRoaXBhbGxpIG1hZGh1IGtpcmFuIiwicm9sbE5vIjoiMjJhOTFhMDRsOSIsImFjY2Vzc0NvZGUiOiJORndnUlQiLCJjbGllbnRJRCI6ImNjZjA0OTc0LTM3MmYtNGI4OC1iNWQ5LTUyZjc1YTdlYTJhYiIsImNsaWbnRTZWNyZXQiOiJBZEdYSFdIUWZRZGtnaGtVIn0.pkbDJfSBvOh-ED4eExyt_YdnD7XmbPKQBVsxo-Tf8EY';
    
    try {
        const response = await axios.post(
            'http://20.244.56.144/evaluation-service/logs',
            {
                stack: 'backend',
                level: 'info',
                package: 'controller',
                message: 'Test message'
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Headers:', error.response.headers);
        }
    }
}

testToken(); 
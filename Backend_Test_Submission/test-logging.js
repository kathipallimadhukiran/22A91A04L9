const LoggingMiddleware = require('./middleware/logging');

// Initialize logger with the provided token
const logger = new LoggingMiddleware('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrYXRoaXBhbGxpbWFkaHVAZ21haWwuY29tIiwiZXhwIjoxNzUwOTIxMDY0LCJpYXQiOjE3NTA5MjAxNjQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI1MjBjOGZlNi0zZDY1LTQ5MzktODI0Mi1hNzk2ZmRiZTYwNTUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJrYXRoaXBhbGxpIG1hZGh1IGtpcmFuIiwic3ViIjoiY2NmMDQ5NzQtMzcyZi00Yjg4LWI1ZDktNTJmNzVhN2VhMmFiIn0sImVtYWlsIjoia2F0aGlwYWxsaW1hZGh1QGdtYWlsLmNvbSIsIm5hbWUiOiJrYXRoaXBhbGxpIG1hZGh1IGtpcmFuIiwicm9sbE5vIjoiMjJhOTFhMDRsOSIsImFjY2Vzc0NvZGUiOiJORndnUlQiLCJjbGllbnRJRCI6ImNjZjA0OTc0LTM3MmYtNGI4OC1iNWQ5LTUyZjc1YTdlYTJhYiIsImNsaWVudFNlY3JldCI6IkFkR1hIV0hRZlFka2doa1UifQ.pkbDJfSBvOh-ED4eExyt_YdnD7XmbPKQBVsxo-Tf8EY');

async function testLogging() {
    try {
        console.log('Starting logging tests...\n');

        // Test 1: Backend info log with controller package
        console.log('Test 1: Sending backend info log...');
        const result1 = await logger.Log(
            'backend',
            'info',
            'controller',
            'Testing logging middleware - Info level from controller'
        );
        console.log('Success! Response:', result1);
        console.log('------------------------\n');

        // Test 2: Backend error log with handler package
        console.log('Test 2: Sending backend error log...');
        const result2 = await logger.Log(
            'backend',
            'error',
            'handler',
            'Testing logging middleware - Error level from handler'
        );
        console.log('Success! Response:', result2);
        console.log('------------------------\n');

        // Test 3: Backend debug log with cron_job package
        console.log('Test 3: Sending backend debug log...');
        const result3 = await logger.Log(
            'backend',
            'debug',
            'cron_job',
            'Testing logging middleware - Debug level from cron_job'
        );
        console.log('Success! Response:', result3);
        console.log('------------------------\n');

        // Test 4: Frontend info log with component package
        console.log('Test 4: Sending frontend info log...');
        const result4 = await logger.Log(
            'frontend',
            'info',
            'component',
            'Testing logging middleware - Info level from frontend component'
        );
        console.log('Success! Response:', result4);
        console.log('------------------------\n');

        console.log('All tests completed successfully!');

    } catch (error) {
        console.error('Test failed:', error.message);
        process.exit(1);
    }
}

// Run the tests
testLogging().catch(console.error); 
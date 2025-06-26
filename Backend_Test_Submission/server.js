const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Simple in-memory storage
let urls = {};

// Middleware
app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Generate a random shortcode
function generateShortCode() {
    return Math.random().toString(36).substring(2, 7);
}

// Get all URLs (for display purposes)
app.get('/urls', (req, res) => {
    console.log('GET /urls - Current URLs:', urls);
    try {
        const activeUrls = Object.entries(urls)
            .filter(([_, data]) => new Date(data.expiry) > new Date())
            .map(([code, data]) => ({
                originalUrl: data.originalUrl,
                shortLink: `http://localhost:${PORT}/${code}`,
                expiry: data.expiry
            }));
        res.json(activeUrls);
    } catch (error) {
        console.error('Error in GET /urls:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create short URL
app.post('/shorturls', (req, res) => {
    console.log('POST /shorturls - Request body:', req.body);
    const { url, validity = 30, shortcode } = req.body;
    
    // Basic validation
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Generate or use provided shortcode
    const code = shortcode || generateShortCode();
    
    // Check if shortcode already exists
    if (urls[code]) {
        return res.status(400).json({ error: 'Shortcode already in use' });
    }

    // Calculate expiry
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + parseInt(validity));

    // Store URL data
    urls[code] = {
        originalUrl: url,
        expiry: expiryDate.toISOString()
    };

    // Return response in the specified format
    res.status(201).json({
        shortLink: `http://localhost:${PORT}/${code}`,
        expiry: expiryDate.toISOString()
    });
});

// Redirect to original URL (must be last route)
app.get('/:code', (req, res) => {
    console.log('GET /:code - Params:', req.params);
    const { code } = req.params;
    const urlData = urls[code];

    if (!urlData) {
        return res.status(404).json({ error: 'URL not found' });
    }

    if (new Date(urlData.expiry) < new Date()) {
        delete urls[code];
        return res.status(410).json({ error: 'URL has expired' });
    }

    res.redirect(urlData.originalUrl);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- GET /urls');
    console.log('- POST /shorturls');
    console.log('- GET /:code');
}); 
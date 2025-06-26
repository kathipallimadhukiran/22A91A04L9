import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000';

function URLShortener() {
    const [url, setUrl] = useState('');
    const [validity, setValidity] = useState('30');
    const [shortcode, setShortcode] = useState('');
    const [urls, setUrls] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch existing URLs
    useEffect(() => {
        fetchUrls();
    }, []);

    const fetchUrls = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/urls`);
            if (!response.ok) {
                throw new Error('Failed to fetch URLs');
            }
            const data = await response.json();
            setUrls(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching URLs:', err);
            setError('Failed to load URLs');
            setUrls([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!url) {
            setError('Please enter a URL');
            return;
        }

        // Add https:// if no protocol is specified
        let urlToShorten = url;
        if (!/^https?:\/\//i.test(url)) {
            urlToShorten = `https://${url}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/shorturls`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: urlToShorten,
                    validity: parseInt(validity),
                    shortcode: shortcode || undefined
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to shorten URL');
            }

            setUrl('');
            setShortcode('');
            fetchUrls(); // Refresh the list
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="url-form">
                <div className="form-group">
                    <label htmlFor="url">Enter your URL:</label>
                    <input
                        type="text"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="example.com"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="validity">Validity (minutes):</label>
                    <input
                        type="number"
                        id="validity"
                        value={validity}
                        onChange={(e) => setValidity(e.target.value)}
                        min="1"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="shortcode">Custom Shortcode (optional):</label>
                    <input
                        type="text"
                        id="shortcode"
                        value={shortcode}
                        onChange={(e) => setShortcode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                        placeholder="Enter alphanumeric code"
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit" className="submit-button">
                    Shorten URL
                </button>
            </form>

            <div className="url-list">
                <h2>Shortened URLs</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : urls.length > 0 ? (
                    urls.map((item, index) => (
                        <div key={index} className="url-item">
                            <p>Original URL: {item.originalUrl}</p>
                            <p>
                                Short URL:{' '}
                                <a href={item.shortLink} target="_blank" rel="noopener noreferrer">
                                    {item.shortLink}
                                </a>
                            </p>
                            <p>Expires: {new Date(item.expiry).toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No shortened URLs yet</p>
                )}
            </div>
        </div>
    );
}

export default URLShortener; 
import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Paper, 
    TextField, 
    Button, 
    Typography, 
    Box, 
    Card, 
    CardContent,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip,
    Snackbar,
    Chip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

const API_BASE_URL = 'http://localhost:5000';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
    },
}));

function URLShortener() {
    const [url, setUrl] = useState('');
    const [validity, setValidity] = useState('30');
    const [shortcode, setShortcode] = useState('');
    const [urls, setUrls] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [showStats, setShowStats] = useState(false);
    const [searchCode, setSearchCode] = useState('');
    const [searchError, setSearchError] = useState('');
    const [searchResult, setSearchResult] = useState(null);

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

        let urlToShorten = url;
        // Basic URL validation
        try {
            if (!/^https?:\/\//i.test(url)) {
                urlToShorten = `https://${url}`;
            }
            new URL(urlToShorten); // Will throw if invalid URL
        } catch (err) {
            setError('Please enter a valid URL');
            return;
        }

        // Validate validity period
        const validityNum = parseInt(validity);
        if (isNaN(validityNum) || validityNum < 1) {
            setError('Validity period must be at least 1 minute');
            return;
        }

        // Validate shortcode if provided
        if (shortcode && !/^[a-zA-Z0-9]{1,10}$/.test(shortcode)) {
            setError('Shortcode must be 1-10 alphanumeric characters');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/shorturls`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: urlToShorten,
                    validity: validityNum,
                    shortcode: shortcode || undefined
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to shorten URL');
            }

            setUrl('');
            setShortcode('');
            fetchUrls();
            setSnackbar({ open: true, message: 'URL shortened successfully!' });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setSnackbar({ open: true, message: 'Copied to clipboard!' });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSearch = async () => {
        if (!searchCode) {
            setSearchError('Please enter a shortcode');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/shorturls/${searchCode}`);
            if (!response.ok) {
                throw new Error('Failed to find URL');
            }
            const data = await response.json();
            setSearchResult(data);
        } catch (err) {
            setSearchError(err.message);
            setSearchResult(null);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    URL Shortener
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => setShowStats(!showStats)}
                    sx={{ 
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    }}
                >
                    {showStats ? 'Show Shortener' : 'Show Statistics'}
                </Button>
            </Box>

            {!showStats ? (
                <>
                    {/* Quick Search Section */}
                    <StyledPaper elevation={3} sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick URL Lookup
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Enter Shortcode"
                                variant="outlined"
                                placeholder="e.g., abc123"
                                fullWidth
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                                error={!!searchError}
                                helperText={searchError}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                sx={{
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                    minWidth: '120px'
                                }}
                            >
                                Search
                            </Button>
                        </Box>
                        {searchResult && (
                            <Box sx={{ mt: 2 }}>
                                <StyledCard>
                                    <CardContent>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Original URL:
                                        </Typography>
                                        <Typography variant="body1" gutterBottom noWrap>
                                            {searchResult.originalUrl}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Short URL:
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="body1" component="a" 
                                                href={searchResult.shortLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                sx={{ color: '#1976d2', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                            >
                                                {searchResult.shortLink}
                                            </Typography>
                                            <Tooltip title="Copy to clipboard">
                                                <IconButton onClick={() => handleCopy(searchResult.shortLink)} size="small">
                                                    <ContentCopyIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Chip
                                                icon={<AccessTimeIcon />}
                                                label={`${searchResult.clicks} clicks`}
                                                color="primary"
                                                variant="outlined"
                                            />
                                            <Typography variant="body2" color="textSecondary">
                                                Expires: {new Date(searchResult.expiry).toLocaleString()}
                                            </Typography>
                                        </Box>
                                        {searchResult.clickHistory && searchResult.clickHistory.length > 0 && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                    Recent Clicks:
                                                </Typography>
                                                <Box sx={{ maxHeight: '150px', overflowY: 'auto' }}>
                                                    {searchResult.clickHistory.map((click, idx) => (
                                                        <Typography key={idx} variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                                            {new Date(click.timestamp).toLocaleString()} - {click.referrer || 'Direct'}
                                                        </Typography>
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}
                                    </CardContent>
                                </StyledCard>
                            </Box>
                        )}
                    </StyledPaper>

                    {/* URL Shortener Form */}
                    <StyledPaper elevation={3}>
                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="Enter your URL"
                                    variant="outlined"
                                    fullWidth
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="example.com"
                                    required
                                    InputProps={{
                                        startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} />,
                                    }}
                                />
                                <TextField
                                    label="Validity (minutes)"
                                    type="number"
                                    variant="outlined"
                                    value={validity}
                                    onChange={(e) => setValidity(e.target.value)}
                                    inputProps={{ min: "1" }}
                                    InputProps={{
                                        startAdornment: <AccessTimeIcon sx={{ mr: 1, color: 'action.active' }} />,
                                    }}
                                />
                                <TextField
                                    label="Custom Shortcode (optional)"
                                    variant="outlined"
                                    value={shortcode}
                                    onChange={(e) => setShortcode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                                    placeholder="Enter alphanumeric code"
                                    helperText="1-10 alphanumeric characters"
                                />
                                {error && <Alert severity="error">{error}</Alert>}
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    size="large"
                                    sx={{
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                    }}
                                >
                                    Shorten URL
                                </Button>
                            </Box>
                        </form>
                    </StyledPaper>

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            Shortened URLs
                        </Typography>
                        {loading ? (
                            <Box display="flex" justifyContent="center" p={3}>
                                <CircularProgress />
                            </Box>
                        ) : urls.length > 0 ? (
                            urls.map((item, index) => (
                                <StyledCard key={index}>
                                    <CardContent>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Original URL:
                                        </Typography>
                                        <Typography variant="body1" gutterBottom noWrap>
                                            {item.originalUrl}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Short URL:
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="body1" component="a" 
                                                href={item.shortLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                sx={{ color: '#1976d2', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                            >
                                                {item.shortLink}
                                            </Typography>
                                            <Tooltip title="Copy to clipboard">
                                                <IconButton onClick={() => handleCopy(item.shortLink)} size="small">
                                                    <ContentCopyIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Typography variant="body2" color="textSecondary">
                                            Expires: {new Date(item.expiry).toLocaleString()}
                                        </Typography>
                                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                {item.clicks} clicks
                                            </Typography>
                                            {item.clickHistory && item.clickHistory.length > 0 && (
                                                <Tooltip title={
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Click History:</Typography>
                                                        {item.clickHistory.slice(-5).map((click, idx) => (
                                                            <Typography key={idx} variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                                {new Date(click.timestamp).toLocaleString()}
                                                            </Typography>
                                                        ))}
                                                        {item.clickHistory.length > 5 && (
                                                            <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                                                                ...and {item.clickHistory.length - 5} more
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }>
                                                    <IconButton size="small" color="primary">
                                                        <InfoIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </CardContent>
                                </StyledCard>
                            ))
                        ) : (
                            <Alert severity="info">No shortened URLs yet</Alert>
                        )}
                    </Box>
                </>
            ) : (
                <Alert severity="info">Statistics feature not implemented</Alert>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            />
        </Container>
    );
}

export default URLShortener; 
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function URLStatistics() {
  const [shortcode, setShortcode] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const fetchStats = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/stats/${shortcode}`);
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      setStats(null);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          URL Statistics
        </Typography>

        <Box component="form" onSubmit={fetchStats} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Enter Shortcode"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Get Statistics
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {stats && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              URL Details
            </Typography>
            <Typography variant="body1">
              Original URL: {stats.originalUrl}
            </Typography>
            <Typography variant="body1">
              Short URL: {stats.shortLink}
            </Typography>
            <Typography variant="body1">
              Expires: {new Date(stats.expiry).toLocaleString()}
            </Typography>
            <Typography variant="body1">
              Total Clicks: {stats.statistics.clicks}
            </Typography>

            {stats.statistics.clickDetails.length > 0 && (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User Agent</TableCell>
                      <TableCell>Referer</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.statistics.clickDetails.map((click, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(click.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{click.userAgent}</TableCell>
                        <TableCell>{click.referer}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default URLStatistics; 
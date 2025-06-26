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
  Container,
  Collapse,
  IconButton,
  Chip,
} from '@mui/material';
import axios from 'axios';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

const API_BASE_URL = 'http://localhost:5000/api';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledSearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  alignItems: 'center',
}));

function Row({ url }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <StyledTableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
            {url.originalUrl}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography 
            component="a" 
            href={url.shortLink} 
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            {url.shortLink}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Chip 
            label={url.clicks} 
            color="primary" 
            variant="outlined"
            size="small"
          />
        </TableCell>
        <TableCell>
          {new Date(url.expiry).toLocaleString()}
        </TableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Click History
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>User Agent</TableCell>
                    <TableCell>Referrer</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {url.clickHistory && url.clickHistory.map((click, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{click.userAgent}</TableCell>
                      <TableCell>{click.referrer}</TableCell>
                      <TableCell>{click.location || 'Unknown'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function URLStatistics({ urls: allUrls }) {
  const [searchCode, setSearchCode] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [urls, setUrls] = useState(allUrls);

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      setSearchError('Please enter a shortcode');
      return;
    }

    try {
      setSearchError('');
      const response = await fetch(`${API_BASE_URL}/stats/${searchCode}`);
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      setSearchResult(data);
      setUrls([data]); // Show only the searched URL
    } catch (err) {
      setSearchError(err.message);
      setSearchResult(null);
      setUrls(allUrls); // Reset to show all URLs
    }
  };

  const handleReset = () => {
    setSearchCode('');
    setSearchError('');
    setSearchResult(null);
    setUrls(allUrls);
  };

  return (
    <Container maxWidth="lg">
      <StyledSearchBox>
        <TextField
          label="Enter Shortcode"
          variant="outlined"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          placeholder="e.g., abc123"
          error={!!searchError}
          helperText={searchError}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
          }}
        >
          Search
        </Button>
        {searchResult && (
          <Button
            variant="outlined"
            onClick={handleReset}
          >
            Show All
          </Button>
        )}
      </StyledSearchBox>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        URL Statistics
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Original URL</TableCell>
              <TableCell>Short URL</TableCell>
              <TableCell align="center">Clicks</TableCell>
              <TableCell>Expiry</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url, index) => (
              <Row key={index} url={url} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default URLStatistics; 
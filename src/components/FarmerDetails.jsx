import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router';
import {
    Container, Typography, Box, CircularProgress, Alert, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, TextField, InputAdornment,
    MenuItem
} from '@mui/material';
import {
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon
} from '@mui/icons-material';

const FarmerDetails = () => {
    const { _id } = useParams();
    const token = localStorage.getItem('authToken');
    const location = useLocation();
    const surveyCount = location.state.surveyCount;

    console.log("Survey Count from location state:", surveyCount);

    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        farmerID: '',
        name: '',
        guardianName: '',
        year: '',
        village: '',
        block: '',
        district: '',
        state: '',
        status: 'all',
        survey: 'all'
    });

    const API_BASE_URL = 'http://192.168.0.160:3000';

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchFarmers = useCallback(async (currentFilters) => {
        if (!_id) return;
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            Object.keys(currentFilters).forEach(key => {
                if (currentFilters[key] && currentFilters[key] !== 'all') {
                    queryParams.append(key, currentFilters[key]);
                }
            });

            const response = await fetch(`${API_BASE_URL}/projects/${_id}/farmers?${queryParams.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await response.json();

            if (result.success) {
                setFarmers(result.data);
                setError(null);
            } else {
                setError('Failed to fetch farmer data');
            }
        } catch (err) {
            setError('An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    }, [_id, token]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchFarmers(filters);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [filters, fetchFarmers]);

    const handleDelete = async (farmerId) => {
        if (window.confirm("Are you sure you want to delete this farmer?")) {
            console.log("Deleting farmer:", farmerId);
        }
    };

    const renderSearchField = (name, label) => (
        <TextField
            fullWidth
            size="small"
            variant="standard"
            placeholder={`Search ${label}...`}
            name={name}
            value={filters[name]}
            onChange={handleFilterChange}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 16, color: 'gray' }} />
                    </InputAdornment>
                ),
                style: { fontSize: '0.8rem' }
            }}
        />
    );

    return (
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
                List of Farmers
            </Typography>

            <Box sx={{ maxWidth: 300, mb: 6 }}>
                <TextField
                    select
                    fullWidth
                    label="Filter by Survey"
                    name="survey"
                    value={filters.survey}
                    onChange={handleFilterChange}
                    variant="outlined"
                    sx={{ bgcolor: 'white' }}
                >
                    <MenuItem value="all">All Surveys</MenuItem>
                    {[...Array(surveyCount).keys()].map(num => (
                        <MenuItem key={num + 1} value={`${num + 1}`}>
                            Survey {num + 1}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 2, maxHeight: '75vh' }}>
                <Table stickyHeader sx={{ minWidth: 1500 }}>
                    <TableHead>
                        <TableRow>
                            {/* Actions moved to first position */}
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa', width: 100 }} align="center">Actions</TableCell>
                            {/* Farmer ID width set small */}
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa', width: 120 }}>Farmer ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Farmer Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Guardian Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Year</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Village</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Block</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>District</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>State</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Status</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{ bgcolor: '#f8f9fa', py: 1 }} align="center">
                                <Typography variant="caption" color="text.secondary">Filters</Typography>
                            </TableCell>
                            <TableCell sx={{ bgcolor: '#f8f9fa', py: 1 }}>{renderSearchField('farmerID', 'ID')}</TableCell>
                            <TableCell sx={{ bgcolor: '#f8f9fa', py: 1 }}>{renderSearchField('name', 'Name')}</TableCell>
                            <TableCell sx={{ bgcolor: '#f8f9fa', py: 1 }}>{renderSearchField('guardianName', 'Guardian')}</TableCell>
                            <TableCell sx={{ bgcolor: '#f8f9fa', py: 1 }}>{renderSearchField('year', 'Year')}</TableCell>
                            <TableCell sx={{ bgcolor: '#f8f9fa', py: 1 }}>{renderSearchField('village', 'Village')}</TableCell>
                            <TableCell sx={{ bgcolor: '#f8f9fa', py: 1 }}>{renderSearchField('block', 'Block')}</TableCell>
                            <TableCell sx={{ bgcolor: '#f8f9fa', py: 1 }}>{renderSearchField('district', 'District')}</TableCell>
                            <TableCell sx={{ bgcolor: '#f8f9fa', py: 1 }}>{renderSearchField('state', 'State')}</TableCell>
                            <TableCell sx={{ bgcolor: '#f8f9fa', py: 1 }}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    variant="standard"
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    InputProps={{ style: { fontSize: '0.8rem' } }}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="success">Success</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                </TextField>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading && farmers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                                    <CircularProgress size={30} />
                                    <Typography sx={{ mt: 2 }}>Searching farmers...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : farmers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                                    <Alert severity="info" sx={{ display: 'inline-flex' }}>No farmers match your search criteria.</Alert>
                                </TableCell>
                            </TableRow>
                        ) : (
                            farmers.map((farmer) => (
                                <TableRow key={farmer._id} hover>
                                    {/* Action buttons moved to start */}
                                    <TableCell align="center">
                                        <Box display="flex" justifyContent="center" gap={1}>
                                            <Tooltip title="Edit Farmer">
                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                    sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Farmer">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(farmer._id)}
                                                    sx={{
                                                        border: '1px solid #ffcdd2',
                                                        color: '#d32f2f',
                                                        borderRadius: '4px'
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                    {/* Small Farmer ID cell */}
                                    <TableCell sx={{ fontSize: '0.85rem', fontFamily: 'monospace', width: 120 }}>
                                        {farmer.farmerID || farmer._id.slice(-8).toUpperCase()}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>{farmer.name}</TableCell>
                                    <TableCell>{farmer.guardianName || '—'}</TableCell>
                                    <TableCell>{farmer.year || '—'}</TableCell>
                                    <TableCell>{farmer.village}</TableCell>
                                    <TableCell>{farmer.block || '—'}</TableCell>
                                    <TableCell>{farmer.district}</TableCell>
                                    <TableCell>
                                        <Chip label={farmer.state} size="small" variant="outlined" color="secondary" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={farmer.status || 'pending'}
                                            size="small"
                                            color={farmer.status === 'success' ? 'success' : 'warning'}
                                            sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default FarmerDetails;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Visibility as ViewIcon,
    Edit as EditIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon
} from '@mui/icons-material';

const FarmerDetails = () => {
    const { _id } = useParams();
    const token = localStorage.getItem('authToken');
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://192.168.0.160:3000';

    useEffect(() => {
        const fetchFarmers = async () => {
            if (!_id) return;
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/projects/${_id}/farmers`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const result = await response.json();
                if (result.success) {
                    setFarmers(result.data);
                } else {
                    setError('Failed to fetch farmer data');
                }
            } catch (err) {
                setError('An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };
        fetchFarmers();
    }, [_id, token]);

    if (loading) {
        return (
            <Box display="flex" sx={{ justifyContent: 'center' }} alignitems="center" minheight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box mb={3} display="flex" justifycontent="space-between" alignitems="center">
                <Typography variant="h4" fontWeight="bold" >
                    List of Farmers
                </Typography>
                <Chip label={`${farmers.length} Farmers Total`} color="primary" variant="filled" sx={{ mt: 2, mb: 4 }} />
            </Box>

            {farmers.length === 0 ? (
                <Alert severity="info">No farmers found for this project.</Alert>
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="farmers table">
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Farmer Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Coordinates (Lat/Long)</TableCell>
                                {/* ADD NEW COLUMN HEADERS HERE */}
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {farmers.map((farmer) => (
                                <TableRow
                                    key={farmer._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#fafafa' } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" fontWeight="bold">{farmer.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ID: {farmer._id.slice(-6).toUpperCase()}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Box display="flex" alignitems="center">
                                            <PhoneIcon fontSize="inherit" sx={{ mr: 0.5, color: 'gray' }} />
                                            {farmer.contactNumber}
                                        </Box>
                                    </TableCell>

                                    <TableCell>
                                        <Box display="flex" alignitems="center">
                                            <LocationIcon fontSize="inherit" sx={{ mr: 0.5, color: 'gray' }} />
                                            {`${farmer.village}, ${farmer.district}`}
                                        </Box>
                                        <Typography variant="caption" display="block" sx={{ ml: 2.5 }}>
                                            {farmer.state}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography variant="body2">
                                            {farmer.farmCentralLatLong.lat.toFixed(4)}, {farmer.farmCentralLatLong.long.toFixed(4)}
                                        </Typography>
                                    </TableCell>

                                    {/* ACTIONS COLUMN: Future features go here */}
                                    <TableCell align="center">
                                        <Tooltip title="View Details">
                                            <IconButton size="small" color="primary">
                                                <ViewIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Farmer">
                                            <IconButton size="small" color="secondary" sx={{ ml: 1 }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        {/* Example: Add more IconButtons here for future features */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default FarmerDetails;
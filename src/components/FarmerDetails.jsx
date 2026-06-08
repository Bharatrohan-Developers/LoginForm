import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
    Container, Typography, Box, CircularProgress, Alert, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, TextField, InputAdornment,
    MenuItem, Menu, Checkbox, FormControlLabel, Button, Divider
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    FirstPage as FirstPageIcon,
    LastPage as LastPageIcon,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    ViewColumn as ViewColumnIcon,
    FilterList as FilterListIcon,
    FilterListOff as FilterListOffIcon,
    LocationOn as LocationIcon,
    DeleteSweep as DeleteSweepIcon,
    Map as MapIcon,           // Icon for Prescription Map
    Assignment as AdvisoryIcon // Icon for Advisory
} from '@mui/icons-material';
import TablePagination from '@mui/material/TablePagination';

// --- CUSTOM PAGINATION ---
function TablePaginationActions(props) {
    const { count, page, rowsPerPage, onPageChange } = props;
    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}><FirstPageIcon /></IconButton>
            <IconButton onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0}><KeyboardArrowLeft /></IconButton>
            <IconButton onClick={(e) => onPageChange(e, page + 1)} disabled={page >= Math.ceil(count / rowsPerPage) - 1}><KeyboardArrowRight /></IconButton>
            <IconButton onClick={(e) => onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))} disabled={page >= Math.ceil(count / rowsPerPage) - 1}><LastPageIcon /></IconButton>
        </Box>
    );
}

const FarmerDetails = () => {
    const { _id } = useParams();
    const location = useLocation();
    const token = localStorage.getItem('authToken');
    const surveyCount = location?.state?.surveyCount || 0;
    const API_BASE_URL = import.meta.env.VITE_URL;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showFilters, setShowFilters] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);

    const [columns, setColumns] = useState([
        { id: '_id', label: 'ID', visible: true },
        { id: 'name', label: 'Farmer Name', visible: true },
        { id: 'contactNumber', label: 'Contact No.', visible: true },
        { id: 'village', label: 'Village', visible: true },
        { id: 'district', label: 'District', visible: true },
        { id: 'state', label: 'State', visible: true },
        // NEW COLUMNS
        { id: 'prescription', label: 'Prescription Map', visible: true },
        { id: 'advisory', label: 'Advisory', visible: true },

        { id: 'lat', label: 'Latitude', visible: false },
        { id: 'long', label: 'Longitude', visible: false },
        { id: 'createdAt', label: 'Created At', visible: false },
    ]);

    const [filters, setFilters] = useState({
        name: '', contactNumber: '', village: '', district: '', state: '', survey: 'all'
    });

    // --- FUTURE TASK Prescription map of farmer ---
    const handleOpenPrescriptionMap = (farmerId) => {
        console.log("Future Task: Open Map for ID:", farmerId);
        alert(`Feature coming soon: Opening Prescription Map for farmer ${farmerId}`);
    };

    // --- FUTURE TASK Upload advisory file for farmer ---
    const handleUploadAdvisory = (farmerId) => {
        console.log("Future Task: Upload Advisory for ID:", farmerId);
        alert(`Feature coming soon: Uploading Advisory file for farmer ${farmerId}`);
    };

    // --- SELECTION LOGIC ---
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const newSelected = farmers.map((n) => n._id);
            setSelectedItems((prev) => [...new Set([...prev, ...newSelected])]);
        } else {
            const currentPageIds = farmers.map((n) => n._id);
            setSelectedItems((prev) => prev.filter(id => !currentPageIds.includes(id)));
        }
    };
    // Toggle selection of individual item
    const handleSelectItem = (id) => {
        console.log(id);
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const isSelected = (id) => selectedItems.indexOf(id) !== -1;
    const isAllSelectedOnPage = farmers.length > 0 && farmers.every(f => selectedItems.includes(f._id));
    const isSomeSelectedOnPage = farmers.some(f => selectedItems.includes(f._id)) && !isAllSelectedOnPage;

    const handleColumnToggle = (columnId) => {
        setColumns(prev => prev.map(col => col.id === columnId ? { ...col, visible: !col.visible } : col));
    };

    const fetchFarmers = useCallback(async (currentFilters) => {
        if (!_id) return;
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            Object.keys(currentFilters).forEach(key => {
                const value = currentFilters[key];
                if (value && value !== 'all') {
                    const apiKey = key === 'survey' ? 'surveyNumber' : key;
                    queryParams.append(apiKey, value);
                }
            });
            queryParams.append('page', page + 1);
            queryParams.append('limit', rowsPerPage);

            const response = await fetch(`${API_BASE_URL}/projects/${_id}/farmers?${queryParams.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await response.json();

            if (result.success) {
                setFarmers(result.data);
                setTotalRecords(result.pagination?.totalRecords || result.count || 0);
                setError(null);
            }
        } catch (err) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    }, [_id, token, page, rowsPerPage, API_BASE_URL]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => fetchFarmers(filters), 500);
        return () => clearTimeout(delayDebounceFn);
    }, [filters, fetchFarmers]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(0);
    };

    return (
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Farmer Management</Typography>

            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextField
                    select size="small" label="Select Survey"
                    name="survey" value={filters.survey} onChange={handleFilterChange}
                    sx={{ minWidth: 200, bgcolor: 'white' }}
                >
                    <MenuItem value="all">All Surveys</MenuItem>
                    {[...Array(surveyCount).keys()].map(num => (
                        <MenuItem key={num + 1} value={`${num + 1}`}>Survey {num + 1}</MenuItem>
                    ))}
                </TextField>

                {selectedItems.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#e3f2fd', px: 2, py: 1, borderRadius: 2 }}>
                        <Typography variant="body2" fontWeight="bold">{selectedItems.length} selected</Typography>
                        <Button size="small" variant="contained" color="error" startIcon={<DeleteSweepIcon />}>Bulk Action</Button>
                        <Button size="small" onClick={() => setSelectedItems([])}>Clear</Button>
                    </Box>
                )}
            </Box>

            <Paper sx={{ boxShadow: 4, borderRadius: '8px', overflow: 'hidden' }}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff', borderBottom: '1px solid #eee' }}>
                    <Typography variant="h6" fontWeight="600" color="primary">Results ({totalRecords})</Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant={showFilters ? "contained" : "outlined"}
                            size="small"
                            startIcon={showFilters ? <FilterListOffIcon /> : <FilterListIcon />}
                            onClick={() => setShowFilters(!showFilters)}
                            sx={{ borderRadius: '20px', textTransform: 'none' }}
                        >
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </Button>

                        <Button
                            variant="outlined" size="small" startIcon={<ViewColumnIcon />}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            sx={{ borderRadius: '20px', textTransform: 'none' }}
                        >
                            Columns
                        </Button>

                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                            <Box sx={{ p: 1, width: 200 }}>
                                <Typography variant="subtitle2" sx={{ px: 1, fontWeight: 'bold' }}>Display Columns</Typography>
                                <Divider sx={{ my: 1 }} />
                                {columns.map(col => (
                                    <MenuItem key={col.id} sx={{ py: 0 }}>
                                        <FormControlLabel
                                            control={<Checkbox size="small" checked={col.visible} onChange={() => handleColumnToggle(col.id)} />}
                                            label={<Typography variant="body2">{col.label}</Typography>}
                                        />
                                    </MenuItem>
                                ))}
                            </Box>
                        </Menu>
                    </Box>
                </Box>

                <TableContainer sx={{ maxHeight: '60vh' }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox" sx={{ bgcolor: '#f8f9fa' }}>
                                    <Checkbox indeterminate={isSomeSelectedOnPage} checked={isAllSelectedOnPage} onChange={handleSelectAll} size="small" />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }} align="center">Actions</TableCell>
                                {columns.filter(c => c.visible).map(col => (
                                    <TableCell key={col.id} sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }} align={['prescription', 'advisory'].includes(col.id) ? 'center' : 'left'}>
                                        {col.label}
                                    </TableCell>
                                ))}
                            </TableRow>

                            {showFilters && (
                                <TableRow>
                                    <TableCell sx={{ bgcolor: '#fcfcfc' }} />
                                    <TableCell align="center" sx={{ bgcolor: '#fcfcfc', color: '#999', fontSize: '0.7rem' }}>FILTER</TableCell>
                                    {columns.filter(c => c.visible).map(col => (
                                        <TableCell key={col.id} sx={{ bgcolor: '#fcfcfc', py: 0.5 }}>
                                            {['_id', 'createdAt', 'lat', 'long', 'prescription', 'advisory'].includes(col.id) ? null : (
                                                <TextField
                                                    fullWidth size="small" variant="standard"
                                                    placeholder={`Search...`}
                                                    name={col.id}
                                                    value={filters[col.id] || ''}
                                                    onChange={handleFilterChange}
                                                    InputProps={{ style: { fontSize: '0.75rem' } }}
                                                />
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )}
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={15} align="center" sx={{ py: 5 }}><CircularProgress size={30} /></TableCell></TableRow>
                            ) : farmers.map((farmer) => {
                                const isItemSelected = isSelected(farmer._id);
                                return (
                                    <TableRow key={farmer._id} hover selected={isItemSelected}>
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={isItemSelected} onChange={() => handleSelectItem(farmer._id)} size="small" />
                                        </TableCell>

                                        <TableCell align="center">
                                            <IconButton size="small" color="primary"><EditIcon fontSize="inherit" /></IconButton>
                                        </TableCell>

                                        {columns.filter(c => c.visible).map(col => {
                                            // Handle special cell rendering
                                            if (col.id === '_id') return <TableCell key={col.id} sx={{ fontSize: '0.7rem' }}>{farmer._id.slice(-6).toUpperCase()}</TableCell>;
                                            if (col.id === 'name') return <TableCell key={col.id} sx={{ fontWeight: 600 }}>{farmer.name}</TableCell>;
                                            if (col.id === 'state') return <TableCell key={col.id}><Chip label={farmer.state} size="small" variant="outlined" /></TableCell>;

                                            // PRESCRIPTION MAP COLUMN
                                            if (col.id === 'prescription') return (
                                                <TableCell key={col.id} align="center">
                                                    <Tooltip title="View Prescription Map">
                                                        <IconButton color="secondary" size="small" onClick={() => handleOpenPrescriptionMap(farmer._id)}>
                                                            <MapIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            );

                                            // ADVISORY COLUMN
                                            if (col.id === 'advisory') return (
                                                <TableCell key={col.id} align="center">
                                                    <Tooltip title="Upload Advisory">
                                                        <IconButton color="info" size="small" onClick={() => handleUploadAdvisory(farmer._id)}>
                                                            <AdvisoryIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            );

                                            if (col.id === 'lat') return <TableCell key={col.id}>{farmer.farmCentralLatLong?.lat || '—'}</TableCell>;
                                            if (col.id === 'long') return <TableCell key={col.id}>{farmer.farmCentralLatLong?.long || '—'}</TableCell>;
                                            if (col.id === 'createdAt') return <TableCell key={col.id}>{new Date(farmer.createdAt).toLocaleDateString()}</TableCell>;
                                            return <TableCell key={col.id}>{farmer[col.id] || '—'}</TableCell>;
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={totalRecords}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    rowsPerPageOptions={[10, 25, 50]}
                    ActionsComponent={TablePaginationActions}
                />
            </Paper>
        </Container>
    );
};

export default FarmerDetails;
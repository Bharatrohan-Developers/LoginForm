import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
    Container, Typography, Box, CircularProgress, Alert, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, TextField, InputAdornment,
    MenuItem, Menu, Checkbox, FormControlLabel, Button, Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
} from '@mui/material';

import {
    Edit as EditIcon,
    Search as SearchIcon,
    FirstPage as FirstPageIcon,
    LastPage as LastPageIcon,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    ViewColumn as ViewColumnIcon,
    FilterList as FilterListIcon,
    FilterListOff as FilterListOffIcon,
    Map as MapIcon,
    Assignment as AdvisoryIcon,
    CloudUpload as BulkUploadIcon,
    Map as ViewMapIcon,
    Clear as ClearIcon,
    Campaign as CampaignIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import TablePagination from '@mui/material/TablePagination';
import AdvisoryGenerator from './advisory/AdvisoryGenerator';
import api from '../api/axiosConfig'; // Ensure this path is correct based on your project structure

// --- CUSTOM PAGINATION ACTIONS ---
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
    const role = localStorage.getItem('role');
    const surveyCount = location?.state?.surveyCount || 0;

    // Table State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Advisory Modal State
    const [advisoryOpen, setAdvisoryOpen] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState(null);

    // UI State
    const [anchorEl, setAnchorEl] = useState(null);
    const [showFilters, setShowFilters] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);

    const [columns, setColumns] = useState([
        { id: '_id', label: 'ID', visible: true },
        { id: 'name', label: 'Farmer Name', visible: true },
        { id: 'contactNumber', label: 'Contact No.', visible: true },
        { id: 'village', label: 'Village', visible: true },
        { id: 'district', label: 'District', visible: true },
        { id: 'state', label: 'State', visible: true },
        { id: 'prescription', label: 'Prescription Map', visible: true },
        { id: 'advisory', label: 'Advisory', visible: true },
        { id: 'lat', label: 'Latitude', visible: false },
        { id: 'long', label: 'Longitude', visible: false },
        { id: 'createdAt', label: 'Created At', visible: false },
    ]);

    const [filters, setFilters] = useState({
        name: '', contactNumber: '', village: '', district: '', state: '', survey: 'all'
    });


    // --- DYNAMIC COLUMN LOGIC ---
    // This creates a filtered list of columns based on the Survey selection
    const displayColumns = useMemo(() => {
        return columns.filter(col => {
            if (!col.visible) return false;

            // Hide "Prescription Map" and "Advisory" unless a specific survey is selected
            if (['prescription', 'advisory'].includes(col.id)) {
                return filters.survey !== 'all';
            }
            return true;
        });
    }, [columns, filters.survey]);


    // Check if any filter is active
    const isFiltering = Object.entries(filters).some(([key, value]) => {
        if (key === 'survey') return value !== 'all';
        return value !== '';
    });

    // --- FETCH DATA ---
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

            const response = await api.get(`/projects/${_id}/farmers?${queryParams.toString()}`);
            const result = response.data;
            console.log(response);

            if (result.success) {
                setFarmers(result.data || []);
                setTotalRecords(result.pagination?.totalRecords || result.count || 0);
            } else {
                setError(result.message || "Failed to load data");
            }
        } catch (err) {
            setError('Error connecting to the server');
        } finally {
            setLoading(false);
        }
    }, [_id, token, page, rowsPerPage]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchFarmers(filters);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [filters, fetchFarmers]);

    // --- HANDLERS ---
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(0);
    };

    const handleClearFilters = () => {
        setFilters({ name: '', contactNumber: '', village: '', district: '', state: '', survey: 'all' });
        setPage(0);
    };

    const handleColumnToggle = (columnId) => {
        setColumns(prev => prev.map(col => col.id === columnId ? { ...col, visible: !col.visible } : col));
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const newSelected = farmers.map((n) => n._id);
            setSelectedItems((prev) => [...new Set([...prev, ...newSelected])]);
        } else {
            const currentPageIds = farmers.map((n) => n._id);
            setSelectedItems((prev) => prev.filter(id => !currentPageIds.includes(id)));
        }
    };

    const handleSelectItem = (id) => {
        setSelectedItems((prev) => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const isSelected = (id) => selectedItems.indexOf(id) !== -1;
    const isAllSelectedOnPage = farmers.length > 0 && farmers.every(f => selectedItems.includes(f._id));
    const isSomeSelectedOnPage = farmers.some(f => selectedItems.includes(f._id)) && !isAllSelectedOnPage;

    const handleOpenPrescriptionMap = (id) => alert("Opening Map for ID: " + id);
    const handleUploadAdvisory = (id) => {
        const farmer = farmers.find(f => f._id === id);
        setSelectedFarmer(farmer);
        setAdvisoryOpen(true);
    };

    const handleBulkUpload = () => {
        setUploadModalOpen(true);
        setUploadStatus(null);
        setSelectedFile(null);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            setSelectedFile(file);
            setUploadStatus(null);
        } else {
            setUploadStatus({ type: 'error', message: 'Please upload a CSV or Excel file.' });
        }
    };

    // Simulated upload function - replace with actual API call with dynamic headers
    const handleUploadSubmit = async () => {
        if (!selectedFile) return;
        setUploading(true);
        try {
            console.log("Uploading file:", selectedFile);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setUploadStatus({ type: 'success', message: 'File uploaded successfully!' });
            setSelectedFile(null);
            fetchFarmers(filters);
        } catch (error) {
            setUploadStatus({ type: 'error', message: 'Upload failed.' });
        } finally {
            setUploading(false);
        }
    };

    const handlePreviewAdvisory = (farmer) => {
        if (farmer.advisoryUrl) {
            window.open(farmer.advisoryUrl, '_blank');
        } else {
            // Logic to open your preview modal or fetch the advisory content
            console.log("Previewing advisory for:", farmer.name);
            alert("Opening preview for " + farmer.name);
        }
    };

    return (
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Farmer Management</Typography>

            {/* TOP ACTION BAR */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        select size="small" label="Filter by Survey"
                        name="survey" value={filters.survey} onChange={handleFilterChange}
                        sx={{ minWidth: 200, bgcolor: 'white' }}
                    >
                        <MenuItem value="all">All Surveys</MenuItem>
                        {[...Array(surveyCount).keys()].map(num => (
                            <MenuItem key={num + 1} value={`${num + 1}`}>Survey {num + 1}</MenuItem>
                        ))}
                    </TextField>

                    {(role === 'admin' || role === 'Remote Sensing Manager') && (
                        <>
                            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 30, alignSelf: 'center' }} />
                            <Tooltip title="View All Markers"><IconButton sx={{ bgcolor: 'white', border: '1px solid #ddd' }}><ViewMapIcon color="secondary" /></IconButton></Tooltip>
                            <Tooltip title="Bulk Upload"><IconButton onClick={handleBulkUpload} sx={{ bgcolor: 'white', border: '1px solid #ddd' }}><BulkUploadIcon color="primary" /></IconButton></Tooltip>
                        </>
                    )}
                </Box>

                {selectedItems.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#e3f2fd', px: 2, py: 0.5, borderRadius: 2, border: '1px solid #2196f3' }}>
                        <Typography variant="body2" fontWeight="bold" color="primary.main">{selectedItems.length} Selected</Typography>
                        <Tooltip title="Bulk action advisory"><IconButton color="primary" size="small"><CampaignIcon /></IconButton></Tooltip>
                        <Button size="small" onClick={() => setSelectedItems([])}>Clear</Button>
                    </Box>
                )}
            </Box>

            <Paper sx={{ boxShadow: 4, borderRadius: '8px', overflow: 'hidden' }}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff', borderBottom: '1px solid #eee' }}>
                    <Typography variant="h6" fontWeight="600" color="primary">Farmers Survey Wise ({totalRecords})</Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {isFiltering && <Button size="small" color="error" startIcon={<ClearIcon />} onClick={handleClearFilters}>Clear Search</Button>}
                        <Button
                            variant={showFilters ? "contained" : "outlined"}
                            size="small"
                            startIcon={showFilters ? <FilterListOffIcon /> : <FilterListIcon />}
                            onClick={() => setShowFilters(!showFilters)}
                            sx={{ borderRadius: '20px', textTransform: 'none' }}
                        >
                            {showFilters ? "Hide Search" : "Search"}
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<ViewColumnIcon />} onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ borderRadius: '20px', textTransform: 'none' }}>Columns</Button>

                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                            <Box sx={{ p: 1, width: 220 }}>
                                <Typography variant="subtitle2" sx={{ px: 1, fontWeight: 'bold' }}>Display Columns</Typography>
                                <Divider sx={{ my: 1 }} />
                                {columns.map(col => {
                                    // Logic to disable checkboxes in menu if survey is 'all'
                                    const isRestricted = ['prescription', 'advisory'].includes(col.id);
                                    const forceDisabled = isRestricted && filters.survey === 'all';

                                    return (
                                        <MenuItem key={col.id} sx={{ py: 0 }} disabled={forceDisabled}>
                                            <FormControlLabel
                                                control={<Checkbox size="small" checked={forceDisabled ? false : col.visible} onChange={() => handleColumnToggle(col.id)} />}
                                                label={<Typography variant="body2">{col.label} {forceDisabled && "(Requires Survey)"}</Typography>}
                                            />
                                        </MenuItem>
                                    );
                                })}
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

                                {displayColumns.map(col => (
                                    <TableCell key={col.id} sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }} align={['prescription', 'advisory'].includes(col.id) ? 'center' : 'left'}>
                                        {col.label}
                                    </TableCell>
                                ))}
                            </TableRow>

                            {showFilters && (
                                <TableRow>
                                    <TableCell sx={{ bgcolor: '#fcfcfc' }} />
                                    <TableCell align="center" sx={{ bgcolor: '#fcfcfc', color: '#999', fontSize: '0.7rem' }}>FILTER</TableCell>
                                    {displayColumns.map(col => (
                                        <TableCell key={col.id} sx={{ bgcolor: '#fcfcfc', py: 1 }}>
                                            {['_id', 'createdAt', 'lat', 'long', 'prescription', 'advisory'].includes(col.id) ? null : (
                                                <TextField
                                                    fullWidth size="small" variant="outlined"
                                                    placeholder="Search..."
                                                    name={col.id}
                                                    value={filters[col.id] || ''}
                                                    onChange={handleFilterChange}
                                                    InputProps={{
                                                        style: { fontSize: '0.75rem', backgroundColor: 'white' },
                                                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '0.9rem', color: '#ccc' }} /></InputAdornment>,
                                                    }}
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
                            ) : farmers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={15} align="center" sx={{ py: 5 }}>
                                        <Typography color="text.secondary">No farmers found.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : farmers.map((farmer) => {
                                const isItemSelected = isSelected(farmer._id);
                                return (
                                    <TableRow key={farmer._id} hover selected={isItemSelected}>
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={isItemSelected} onChange={() => handleSelectItem(farmer._id)} size="small" />
                                        </TableCell>
                                        <TableCell align="center"><IconButton size="small" color="primary"><EditIcon fontSize="inherit" /></IconButton></TableCell>

                                        {displayColumns.map(col => {
                                            if (col.id === '_id') return <TableCell key={col.id} sx={{ fontSize: '0.7rem' }}>{farmer._id.slice(-6).toUpperCase()}</TableCell>;
                                            if (col.id === 'name') return <TableCell key={col.id} sx={{ fontWeight: 600 }}>{farmer.name}</TableCell>;
                                            if (col.id === 'state') return <TableCell key={col.id}><Chip label={farmer.state} size="small" variant="outlined" /></TableCell>;
                                            if (col.id === 'prescription') return (
                                                <TableCell key={col.id} align="center">
                                                    <Tooltip title="View Map"><IconButton color="secondary" size="small" onClick={() => handleOpenPrescriptionMap(farmer._id)}><MapIcon fontSize="small" /></IconButton></Tooltip>
                                                </TableCell>
                                            );
                                            if (col.id === 'advisory') {
                                                // Check if advisory and fileUrl exist in the farmer object
                                                const hasAdvisory = farmer.advisory && farmer.advisory.fileUrl;

                                                return (
                                                    <TableCell key={col.id} align="center">
                                                        {hasAdvisory ? (
                                                            // IF ADVISORY EXISTS: Show Preview Button
                                                            <Tooltip title="Preview Advisory">
                                                                <IconButton
                                                                    color="success"
                                                                    size="small"
                                                                    onClick={() => window.open(farmer.advisory.fileUrl, '_blank')}
                                                                >
                                                                    <PreviewIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        ) : (
                                                            // IF ADVISORY MISSING: Show Upload Button (Existing logic)
                                                            <Tooltip title="Upload Advisory">
                                                                <IconButton
                                                                    color="info"
                                                                    size="small"
                                                                    onClick={() => handleUploadAdvisory(farmer._id)}
                                                                >
                                                                    <AdvisoryIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </TableCell>
                                                );
                                            }
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


            <Dialog open={uploadModalOpen} onClose={() => !uploading && setUploadModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}><BulkUploadIcon color="primary" /> Bulk Farmer Upload</DialogTitle>
                <DialogContent dividers>
                    <Box
                        sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 4, textAlign: 'center', bgcolor: '#fafafa', cursor: 'pointer', '&:hover': { bgcolor: '#f0f0f0', borderColor: 'primary.main' } }}
                        onClick={() => document.getElementById('bulk-file-input').click()}
                    >
                        <input type="file" id="bulk-file-input" hidden accept=".csv, .xlsx, .xls" onChange={handleFileChange} />
                        <BulkUploadIcon sx={{ fontSize: 40, color: '#999', mb: 1 }} />
                        <Typography variant="subtitle1" fontWeight="medium">{selectedFile ? selectedFile.name : "Click to select or drag and drop"}</Typography>
                    </Box>
                    {uploadStatus && <Alert severity={uploadStatus.type} sx={{ mt: 2 }}>{uploadStatus.message}</Alert>}
                    {uploading && <Box sx={{ mt: 2 }}><Typography variant="caption">Uploading...</Typography><LinearProgress sx={{ mt: 1 }} /></Box>}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setUploadModalOpen(false)} disabled={uploading}>Cancel</Button>
                    <Button variant="contained" onClick={handleUploadSubmit} disabled={!selectedFile || uploading}>Upload Now</Button>
                </DialogActions>
            </Dialog>

            {/* ADVISORY COMPONENT */}
            <AdvisoryGenerator
                open={advisoryOpen}
                onClose={() => setAdvisoryOpen(false)}
                farmerName={selectedFarmer?.name}
            />
        </Container>
    );
};

export default FarmerDetails;
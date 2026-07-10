import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
    Add as AddIcon,
} from '@mui/icons-material';
import TablePagination from '@mui/material/TablePagination';
import AdvisoryGenerator from './advisory/AdvisoryGenerator';
import api from '../api/axiosConfig';

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
    const role = localStorage.getItem('role');
    const [surveyCount, setSurveyCount] = useState(location?.state?.surveyCount || 0);

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
    const [csvErrors, setCsvErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const firstLoad = useRef(true);

    const [addSurveyOpen, setAddSurveyOpen] = useState(false);
    const [bulkAdvisoryOpen, setBulkAdvisoryOpen] = useState(false);
    const [selectedBulkFarmers, setSelectedBulkFarmers] = useState([]);
    const [selectedFarmerMap, setSelectedFarmerMap] = useState({});

    // 1. REMOVED _id FROM COLUMNS
    const [columns, setColumns] = useState([
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

    const displayColumns = useMemo(() => {
        return columns.filter(col => {
            if (!col.visible) return false;
            if (['prescription', 'advisory'].includes(col.id)) {
                return filters.survey !== 'all';
            }
            return true;
        });
    }, [columns, filters.survey]);

    const isFiltering = Object.entries(filters).some(([key, value]) => {
        if (key === 'survey') return value !== 'all';
        return value !== '';
    });

    const fetchFarmers = useCallback(async (currentFilters) => {
        if (!_id) return;
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            Object.entries(currentFilters).forEach(([key, value]) => {
                const filterValue = typeof value === "string" ? value.trim() : value;
                if (!filterValue || filterValue === "all") return;
                const apiKey = key === "survey" ? "surveyNumber" : key;
                queryParams.append(apiKey, filterValue);
            });

            queryParams.append('page', page + 1);
            queryParams.append('limit', rowsPerPage);

            const response = await api.get(`/projects/${_id}/farmers?${queryParams.toString()}`);
            const result = response.data;

            if (result.success) {
                setFarmers(result.data || []);
                setTotalRecords(result.pagination?.total ?? 0);
            } else {
                setFarmers([]);
                setTotalRecords(0);
                setError(result.message || "Failed to load data");
            }
        } catch (err) {
            setFarmers([]);
            setTotalRecords(0);
            setError(err.response?.data?.message || "Error connecting to the server");
        } finally {
            setLoading(false);
        }
    }, [_id, page, rowsPerPage]);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            fetchFarmers(filters);
            return;
        }
        const timer = setTimeout(() => { fetchFarmers(filters); }, 500);
        return () => clearTimeout(timer);
    }, [filters, page, rowsPerPage]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: typeof value === "string" ? value.trimStart() : value }));
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

    const handleSelectItem = (farmer) => {
        setSelectedItems(prev =>
            prev.includes(farmer._id)
                ? prev.filter(id => id !== farmer._id)
                : [...prev, farmer._id]
        );

        setSelectedFarmerMap(prev => {
            const copy = { ...prev };
            if (copy[farmer._id]) {
                delete copy[farmer._id];
            } else {
                copy[farmer._id] = farmer;
            }

            return copy;
        });
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
        if (file && (file.name.endsWith('.csv'))) {
            setSelectedFile(file);
            setUploadStatus(null);
        } else {
            setUploadStatus({ type: 'error', message: 'Please upload a CSV file.' });
        }
    };

    const handleUploadSubmit = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setUploadStatus(null);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            const response = await api.post(`/projects/${_id}/farmers/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUploadStatus({ type: "success", message: response.data.message || "CSV uploaded successfully." });
            setSelectedFile(null);
            fetchFarmers(filters);
        } catch (error) {
            const response = error.response?.data;
            setUploadModalOpen(false);
            setSelectedFile(null);
            setUploadStatus({ type: "error", message: response?.message });
            setCsvErrors(response?.errors || []);
            setErrorDialogOpen(true);
        } finally {
            setUploading(false);
        }
    };

    const handlePreviewAdvisory = (farmer) => {
        return window.open(farmer.advisory.url, "_blank");
    };

    const handleOpenAddSurvey = () => setAddSurveyOpen(true);
    const handleCloseAddSurvey = () => setAddSurveyOpen(false);

    const handleAddSurveySubmit = async () => {
        try {
            const res = await api.patch(`/projects/${_id}/survey-count`);
            setSurveyCount(res.data.data.surveyCount);
            await fetchFarmers(filters);
            handleCloseAddSurvey();
        } catch (err) {
            alert("Failed to add survey");
        }
    };

    const handleBulkActionAdvisory = () => {
        if (filters.survey === "all") {
            alert("Please select survey");
            return;
        }

        const bulkFarmers = Object.values(selectedFarmerMap);

        setSelectedBulkFarmers(bulkFarmers);
        setBulkAdvisoryOpen(true);
    };

    const handleBulkAdvisorySuccess = () => {
        setSelectedItems([]);
        setSelectedFarmerMap({});
        setSelectedBulkFarmers([]);
        setBulkAdvisoryOpen(false);

        fetchFarmers(filters);
    };

    return (
        <Container maxWidth={false} sx={{ mt: 1, mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Farmer Management</Typography>

            {/* TOP ACTION BAR */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        select size="small"
                        label="Filter by Survey"
                        name="survey"
                        value={filters.survey}
                        onChange={handleFilterChange}
                        sx={{ minWidth: 200, bgcolor: 'white' }}
                    >
                        <MenuItem value="all">All Surveys</MenuItem>
                        {[...Array(surveyCount).keys()].map(num => (
                            <MenuItem key={num + 1} value={`${num + 1}`}>Survey {num + 1}</MenuItem>
                        ))}
                        {role === "Remote Sensing Manager" && (
                            <Box sx={{ p: 1, borderTop: '1px solid #eee' }}>
                                <Button fullWidth variant="contained" size="small" startIcon={<AddIcon />} onClick={handleOpenAddSurvey}>
                                    Add Survey
                                </Button>
                            </Box>
                        )}
                    </TextField>

                    {(role === 'Admin' || role === 'Remote Sensing Manager') && (
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
                        <Tooltip title="Bulk action advisory">
                            <IconButton color="primary" size="small" onClick={handleBulkActionAdvisory}>
                                <CampaignIcon />
                            </IconButton>
                        </Tooltip>
                        <Button
                            size="small"
                            onClick={() => {
                                setSelectedItems([]);
                                setSelectedFarmerMap({});
                            }}
                        >
                            Clear
                        </Button>
                    </Box>
                )}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
                                {/* 2. REMOVED ACTIONS HEADER */}
                                {displayColumns.map(col => (
                                    <TableCell key={col.id} sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }} align={['prescription', 'advisory'].includes(col.id) ? 'center' : 'left'}>
                                        {col.label}
                                    </TableCell>
                                ))}
                            </TableRow>

                            {showFilters && (
                                <TableRow>
                                    <TableCell sx={{ bgcolor: '#fcfcfc' }} />
                                    {/* 3. REMOVED FILTER LABEL PLACEHOLDER */}
                                    {displayColumns.map(col => (
                                        <TableCell key={col.id} sx={{ bgcolor: '#fcfcfc', py: 1 }}>
                                            {['createdAt', 'lat', 'long', 'prescription', 'advisory'].includes(col.id) ? null : (
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
                                            <Checkbox checked={isItemSelected} onChange={() => handleSelectItem(farmer)} size="small" />
                                        </TableCell>
                                        {/* 4. REMOVED ACTION BUTTON CELL */}
                                        {displayColumns.map(col => {
                                            if (col.id === 'name') return <TableCell key={col.id} sx={{ fontWeight: 600 }}>{farmer.name}</TableCell>;
                                            if (col.id === 'state') return <TableCell key={col.id}><Chip label={farmer.state} size="small" variant="outlined" /></TableCell>;
                                            if (col.id === 'prescription') return (
                                                <TableCell key={col.id} align="center">
                                                    <Tooltip title="View Map"><IconButton color="secondary" size="small" onClick={() => handleOpenPrescriptionMap(farmer._id)}><MapIcon fontSize="small" /></IconButton></Tooltip>
                                                </TableCell>
                                            );
                                            if (col.id === "advisory") {
                                                const hasAdvisory = !!farmer.advisory;
                                                return (
                                                    <TableCell key={col.id} align="center">
                                                        {hasAdvisory ? (
                                                            <Tooltip title="View Advisory"><IconButton color="success" size="small" onClick={() => handlePreviewAdvisory(farmer)}><ViewIcon fontSize="small" /></IconButton></Tooltip>
                                                        ) : (
                                                            <Tooltip title="Upload Advisory"><IconButton color="info" size="small" onClick={() => handleUploadAdvisory(farmer._id)}><AdvisoryIcon fontSize="small" /></IconButton></Tooltip>
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

            {/* DIALOGS */}
            <Dialog open={uploadModalOpen} onClose={() => !uploading && setUploadModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}><BulkUploadIcon color="primary" /> Bulk Farmer Upload</DialogTitle>
                <DialogContent dividers>
                    <Box
                        sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 4, textAlign: 'center', bgcolor: '#fafafa', cursor: 'pointer', '&:hover': { bgcolor: '#f0f0f0', borderColor: 'primary.main' } }}
                        onClick={() => document.getElementById('bulk-file-input').click()}
                    >
                        <input type="file" id="bulk-file-input" hidden accept=".csv" onChange={handleFileChange} />
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

            <Dialog open={addSurveyOpen} onClose={handleCloseAddSurvey} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Create New Survey</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField label="New Survey Number" value={surveyCount + 1} disabled fullWidth helperText="This number is automatically assigned" />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseAddSurvey} color="inherit">Cancel</Button>
                    <Button onClick={handleAddSurveySubmit} variant="contained">Confirm & Submit</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>CSV Validation Errors</DialogTitle>
                <DialogContent dividers>
                    {csvErrors.slice(0, 4).map((item) => (
                        <Alert severity="error" sx={{ mb: 1 }} key={item.row}>
                            <strong>Row {item.row}</strong>: {item.errors.join(", ")}
                        </Alert>
                    ))}
                    {csvErrors.length > 4 && <Typography sx={{ mt: 2 }}>...and {csvErrors.length - 4} more errors.</Typography>}
                </DialogContent>
                <DialogActions><Button onClick={() => setErrorDialogOpen(false)}>Close</Button></DialogActions>
            </Dialog>

            <AdvisoryGenerator
                open={advisoryOpen}
                onClose={() => setAdvisoryOpen(false)}
                farmer={selectedFarmer}
                farmerName={selectedFarmer?.name}
                projectId={_id}
                surveyNumber={filters.survey}
            />

            <AdvisoryGenerator
                open={bulkAdvisoryOpen}
                onClose={() => setBulkAdvisoryOpen(false)}
                farmers={selectedBulkFarmers}
                projectId={_id}
                surveyNumber={filters.survey}
                isBulk={true}
                onSuccess={handleBulkAdvisorySuccess}
            />
        </Container>
    );
};

export default FarmerDetails;
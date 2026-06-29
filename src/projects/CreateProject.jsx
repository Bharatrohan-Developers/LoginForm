import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Alert,
    CircularProgress,
    Breadcrumbs,
    Link,
    useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import api from '../api/axiosConfig';

const CreateProject = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const token = localStorage.getItem('authToken');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        crop: '',
        location: '',
        startDate: ''
    });

    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post(
                `/projects`,
                formData
            );
            
            if (response.status === 201 || response.status === 200) {
                navigate(`/projects/assign/${response.data.data._id}`);
            }
        } catch (err) {
            console.error('Error creating project:', err);
            setError(err.response?.data?.message || 'Failed to create project. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    // Validation
    const isFormValid = formData.name && formData.crop && formData.location && formData.startDate;

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            {/* Breadcrumbs for Navigation */}
            <Breadcrumbs sx={{ mb: 4 }}>
                <Link
                    underline="hover"
                    color={theme.palette.primary.main}
                    onClick={() => navigate('/dashboard')}
                    sx={{ 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center',
                        fontWeight: 500,
                        transition: 'opacity 0.3s ease',
                        '&:hover': { opacity: 0.8 }
                    }}
                >
                    <ArrowBackIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> My Projects
                </Link>
                <Typography color={theme.palette.text.primary} fontWeight={600}>
                    New Project
                </Typography>
            </Breadcrumbs>

            <form onSubmit={handleSubmit}>
                {/* HEADER ROW */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 4,
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'row' }
                    }}
                >
                    <TextField
                        label="Name of project"
                        name="name"
                        variant="outlined"
                        fullWidth
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rice Kharif 2025"
                        sx={{ 
                            flex: 1,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            }
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!isFormValid || loading}
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                        sx={{
                            height: '56px',
                            px: 3,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 700,
                            minWidth: { xs: '100%', sm: 150 },
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {loading ? 'Creating...' : 'Create'}
                    </Button>
                </Box>

                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3,
                            borderRadius: 2,
                        }}
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}

                {/* FORM BODY */}
                <Paper 
                    sx={{ 
                        p: 4, 
                        borderRadius: 3, 
                        boxShadow: `0 4px 20px ${theme.palette.primary.main}10`,
                        backgroundColor: theme.palette.background.paper,
                    }}
                >
                    <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                            mb: 3, 
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                        }}
                    >
                        Project Details
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Crop Type"
                                name="crop"
                                fullWidth
                                required
                                value={formData.crop}
                                onChange={handleChange}
                                placeholder="e.g. Rice"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Start Date"
                                name="startDate"
                                type="date"
                                fullWidth
                                required
                                
                                value={formData.startDate}
                                onChange={handleChange}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Location"
                                name="location"
                                fullWidth
                                required
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Haryana, India"
                                helperText="City, State or Region"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </form>
        </Container>
    );
};

export default CreateProject;
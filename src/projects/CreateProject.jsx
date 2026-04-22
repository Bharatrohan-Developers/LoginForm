import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
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
    IconButton,
    Breadcrumbs,
    Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

const CreateProject = () => {
    const navigate = useNavigate();
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_URL}/projects`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201 || response.status === 200) {
                // Redirect back to project list on success
                navigate('/projects');
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
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link 
                    underline="hover" 
                    color="inherit" 
                    onClick={() => navigate('/projects')} 
                    sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <ArrowBackIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> My Projects
                </Link>
                <Typography color="text.primary">New Project</Typography>
            </Breadcrumbs>

            <form onSubmit={handleSubmit}>
                {/* HEADER ROW */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: 4,
                        gap: 2
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
                        sx={{ maxWidth: '70%' }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!isFormValid || loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        sx={{ 
                            height: '56px', 
                            px: 4, 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        {loading ? 'Creating...' : 'Create Project'}
                    </Button>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {/* FORM BODY */}
                <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
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
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                
                                name="startDate"
                                type="date"
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                                value={formData.startDate}
                                onChange={handleChange}
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
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </form>
        </Container>
    );
};

export default CreateProject;
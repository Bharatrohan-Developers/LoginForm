import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    CircularProgress,
    useTheme
} from '@mui/material';

import api from '../api/axiosConfig';

const EditProjectDialog = ({ open, onClose, project, onUpdate }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        crop: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Sync form data when the project prop changes
    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || '',
                crop: project.crop || '',
                location: project.location || ''
            });
            setError('');
        }
    }, [project, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.patch(
                `/projects/${project._id}`,
                formData
            );

            if (response.data) {
                onUpdate(response.data.data || { ...project, ...formData });
                onClose();
            }
        } catch (error) {
            console.error("Update failed:", error);
            setError(error.response?.data?.message || "Failed to update project. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: `0 12px 32px ${theme.palette.primary.main}20`,
                }
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: theme.palette.text.primary,
                    borderBottom: `1px solid ${theme.palette.text.primary}10`,
                    pb: 2,
                }}
            >
                Edit Project
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ pt: 3 }}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <TextField
                                label="Project Name"
                                name="name"
                                fullWidth
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter project name"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Crop"
                                name="crop"
                                fullWidth
                                value={formData.crop}
                                onChange={handleChange}
                                required
                                placeholder="Enter crop type"
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
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="Enter location"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${theme.palette.text.primary}10` }}>
                    <Button 
                        onClick={onClose}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            color: theme.palette.text.secondary,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{
                            minWidth: 120,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={18} sx={{ mr: 1 }} />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditProjectDialog;
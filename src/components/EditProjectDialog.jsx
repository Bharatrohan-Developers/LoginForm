import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    CircularProgress
} from '@mui/material';

import api from '../api/axiosConfig'; // Ensure this path is correct based on your project structure

const EditProjectDialog = ({ open, onClose, project, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        crop: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);

    // Sync form data when the project prop changes
    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || '',
                crop: project.crop || '',
                location: project.location || ''
            });
        }
    }, [project]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('authToken');

        try {
            // Using your VITE_URL or a dummy URL
            const response = await api.patch(
                `${import.meta.env.VITE_URL}/projects/${project._id}`,
                formData
            );

            if (response.data) {
                // Update the local state in the parent component
                onUpdate(response.data.data || { ...project, ...formData });
                onClose();
            }
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update project. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Project</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Project Name"
                                name="name"
                                fullWidth
                                value={formData.name}
                                onChange={handleChange}
                                required
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
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditProjectDialog;
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Alert,
    Box,
} from "@mui/material";

import api from "../api/axiosConfig";

const EditProjectDialog = ({ open, onClose, project, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: "",
        crop: "",
        state: "",
        district: "",
        village: "",
        startDate: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || "",
                crop: project.crop || "",
                state: project.state || "",
                district: project.district || "",
                village: project.village || "",
                startDate: project.startDate
                    ? project.startDate.split("T")[0]
                    : "",
            });
            setError("");
        }
    }, [project, open]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.patch(
                `/projects/${project._id}`,
                formData
            );

            onUpdate(response.data.data || { ...project, ...formData });
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update project."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <DialogTitle >Edit Project</DialogTitle>

                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mt: 1,
                        }}
                    >
                        <TextField
                            label="Project Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            sx={{ maxWidth: 400, mb: 2 }}
                        />

                        <TextField
                            label="Crop"
                            name="crop"
                            value={formData.crop}
                            onChange={handleChange}
                            fullWidth
                            sx={{ maxWidth: 400, mb: 2 }}
                        />

                        <TextField
                            label="Start Date"
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            sx={{ maxWidth: 400, mb: 2 }}
                        />

                        <TextField
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            fullWidth
                            sx={{ maxWidth: 400, mb: 2 }}
                        />

                        <TextField
                            label="District"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            fullWidth
                            sx={{ maxWidth: 400, mb: 2 }}
                        />

                        <TextField
                            label="Village"
                            name="village"
                            value={formData.village}
                            onChange={handleChange}
                            fullWidth
                            sx={{ maxWidth: 400 }}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose}>Cancel</Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditProjectDialog;
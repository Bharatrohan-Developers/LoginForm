import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    Paper,
    Chip,
    TextField,
    MenuItem,
    Stack,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
} from "@mui/x-data-grid";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

import api from "../api/axiosConfig";

const UserList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

    // State Management
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // Add User Modal State
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "Agronomist",
    });

    const API_BASE_URL = import.meta.env.VITE_URL;
    const authConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    };

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(
                `${API_BASE_URL}/admin/users`);
            const userData = response.data.data || response.data;
            setUsers(userData);
            setError(null);
        } catch (err) {
            setError("Failed to fetch users.");
            showSnackbar("Error loading users", "error");
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
    const showSnackbar = (message, severity = "success") =>
        setSnackbar({ open: true, message, severity });

    const handleFormChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddUserSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`${API_BASE_URL}/admin/users`, formData);
            showSnackbar("User added successfully");
            setAddUserOpen(false);
            setFormData({ name: "", email: "", password: "", role: "Agronomist" });
            fetchUsers();
        } catch (err) {
            showSnackbar(
                err.response?.data?.message || "Failed to add user",
                "error",
            );
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(
                `${API_BASE_URL}/admin/users/${userToDelete._id}`);
            setUsers(users.filter((u) => u._id !== userToDelete._id));
            showSnackbar("User deleted successfully");
        } catch (err) {
            showSnackbar("Failed to delete user", "error");
        } finally {
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    // Responsive Columns Configuration
    const columns = [
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight="500" sx={{ py: 1 }}>
                    {params.value}
                </Typography>
            ),
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1.5,
            minWidth: 200,
            // Automatically hide email on very small screens via the columnVisibilityModel below
        },
        {
            field: "role",
            headerName: "Role",
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    color={
                        params.value.toLowerCase().includes("admin")
                            ? "secondary"
                            : "default"
                    }
                    variant="outlined"
                />
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        size="small"
                        onClick={() => console.log("Edit", params.row._id)}
                        color="primary"
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => {
                            setUserToDelete(params.row);
                            setDeleteDialogOpen(true);
                        }}
                        color="error"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    function CustomToolbar() {
        return (
            <GridToolbarContainer sx={{ p: 1, justifyContent: "space-between" }}>
                <Box>
                    <GridToolbarExport size="small" />
                    <Button
                        startIcon={<RefreshIcon />}
                        onClick={fetchUsers}
                        size="small"
                        sx={{ ml: 1 }}
                    >
                        Refresh
                    </Button>
                </Box>
            </GridToolbarContainer>
        );
    }

    return (
        <Box sx={{ width: "100%", overflow: "hidden" }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: { xs: 0, sm: 2 },
                    border: "1px solid #eee",
                }}
            >
                {/* Header Section - Responsive Stack */}
                <Stack
                    direction={{ xs: "row", sm: "row" }}
                    sx={{
                        mb: 3,
                        justifyContent: "space-between",
                        alignItems: "center",
                        spacing: 2,
                    }}
                >
                    <Typography
                        variant={isMobile ? "h5" : "h4"}
                        sx={{ fontWeight: 800, color: "text.primary" }}
                    >
                        Users
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => setAddUserOpen(true)}
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            px: { xs: 2, sm: 3 },
                        }}
                    >
                        {isMobile ? "Add" : "Add New User"}
                    </Button>
                </Stack>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* DataGrid Container */}
                <Box
                    sx={{
                        height: 650,
                        width: "100%",
                        "& .MuiDataGrid-root": {
                            border: "none",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f8f9fa",
                            borderRadius: "8px",
                        },
                    }}
                >
                    <DataGrid
                        rows={users}
                        columns={columns}
                        getRowId={(row) => row._id}
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                            // Hide Email column on mobile automatically
                            columns: {
                                columnVisibilityModel: {
                                    email: !isMobile,
                                },
                            },
                        }}
                        loading={loading}
                        disableRowSelectionOnClick
                        slots={{ toolbar: CustomToolbar }}
                        sx={{
                            "& .MuiDataGrid-cell": {
                                borderBottom: "1px solid #f0f0f0",
                                display: "flex",
                                alignItems: "center",
                            },
                        }}
                    />
                </Box>
            </Paper>

            {/* Add User Dialog - FullScreen on Mobile */}
            <Dialog
                open={addUserOpen}
                onClose={() => setAddUserOpen(false)}
                fullScreen={isMobile}
                fullWidth
                maxWidth="xs"
            >
                <form
                    onSubmit={handleAddUserSubmit}
                    style={{ display: "flex", flexDirection: "column", height: "100%" }}
                >
                    <DialogTitle sx={{ fontWeight: 700 }}>Add New User</DialogTitle>
                    <DialogContent dividers>
                        <Stack spacing={2.5} sx={{ mt: 1 }}>
                            <TextField
                                label="Full Name"
                                name="name"
                                fullWidth
                                required
                                value={formData.name}
                                onChange={handleFormChange}
                            />
                            <TextField
                                label="Email Address"
                                name="email"
                                type="email"
                                fullWidth
                                required
                                value={formData.email}
                                onChange={handleFormChange}
                            />
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                fullWidth
                                required
                                value={formData.password}
                                onChange={handleFormChange}
                            />
                            <TextField
                                select
                                label="Assign Role"
                                name="role"
                                fullWidth
                                required
                                value={formData.role}
                                onChange={handleFormChange}
                            >
                                <MenuItem value="Agronomist">Agronomist</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Remote Sensing Manager">
                                    Remote Sensing Manager
                                </MenuItem>
                            </TextField>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5 }}>
                        <Button onClick={() => setAddUserOpen(false)} color="inherit">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained">
                            Create User
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        Are you sure you want to remove <b>{userToDelete?.name}</b>? This
                        action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserList;

import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Typography,
    Button,
    IconButton,
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
    InputAdornment,
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
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";

import api from "../api/axiosConfig";

const UserList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // State Management
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Delete State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Add User State
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "Agronomist",
    });

    // Edit User State
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [userToEditId, setUserToEditId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: "",
        email: "",
        password: "", // Added password
        role: "Agronomist",
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // Password Visibility State
    const [showAddPassword, setShowAddPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);

    console.log(showEditPassword);

    // --- Actions ---

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/admin/users");
            const userData = response.data.data || response.data;
            setUsers(userData);
            setError(null);
        } catch (err) {
            setError("Failed to fetch users.");
            showSnackbar("Error loading users", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const showSnackbar = (message, severity = "success") =>
        setSnackbar({ open: true, message, severity });

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    // Add Logic
    const handleAddUserSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/admin/users", formData);
            showSnackbar("User added successfully");
            setAddUserOpen(false);
            setFormData({ name: "", email: "", password: "", role: "Agronomist" });
            fetchUsers();
        } catch (err) {
            showSnackbar(err.response?.data?.message || "Failed to add user", "error");
        }
    };

    // Edit Logic
    const handleEditClick = (user) => {
        setUserToEditId(user._id);
        setEditFormData({
            name: user.name,
            email: user.email,
            password: "", // Keep empty for security, only update if typed
            role: user.role,
        });
        setEditDialogOpen(true);
    };

    const handleEditUserSubmit = async (e) => {
        e.preventDefault();
        try {
            // Only send password if it's not empty
            const payload = { ...editFormData };
            if (!payload.password) delete payload.password;

            // bhai check once this api request is correct or not
            await api.patch(`/admin/users/${userToEditId}`, payload);
            showSnackbar("User updated successfully");
            setEditDialogOpen(false);
            fetchUsers();
        } catch (err) {
            showSnackbar(err.response?.data?.message || "Failed to update user", "error");
        }
    };

    // Delete Logic
    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/admin/users/${userToDelete._id}`);
            setUsers(users.filter((u) => u._id !== userToDelete._id));
            showSnackbar("User deleted successfully");
        } catch (err) {
            showSnackbar("Failed to delete user", "error");
        } finally {
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    // --- Columns ---
    const columns = [
        { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
        { field: "email", headerName: "Email", flex: 1.5, minWidth: 200 },
        {
            field: "role",
            headerName: "Role",
            width: 130,
            renderCell: (params) => (
                <Chip label={params.value} size="small" variant="outlined"
                    color={params.value.toLowerCase().includes("admin") ? "secondary" : "default"} />
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton size="small" onClick={() => handleEditClick(params.row)} color="primary">
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => { setUserToDelete(params.row); setDeleteDialogOpen(true); }} color="error">
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
                    <Button startIcon={<RefreshIcon />} onClick={fetchUsers} size="small" sx={{ ml: 1 }}>
                        Refresh
                    </Button>
                </Box>
            </GridToolbarContainer>
        );
    }

    return (
        <Box sx={{ width: "100%", overflow: "hidden" }}>
            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: { xs: 0, sm: 2 }, border: "1px solid #eee" }}>
                <Stack direction="row" sx={{ mb: 3, justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 800 }}>Users</Typography>
                    <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setAddUserOpen(true)}>
                        {isMobile ? "Add" : "Add New User"}
                    </Button>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ height: 650, width: "100%" }}>
                    <DataGrid
                        rows={users}
                        columns={columns}
                        getRowId={(row) => row._id}
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{ pagination: { paginationModel: { pageSize: 10 } }, columns: { columnVisibilityModel: { email: !isMobile } } }}
                        loading={loading}
                        slots={{ toolbar: CustomToolbar }}
                    />
                </Box>
            </Paper>

            {/* ADD USER DIALOG */}
            <Dialog open={addUserOpen} onClose={() => setAddUserOpen(false)} fullScreen={isMobile} fullWidth maxWidth="xs">
                <form onSubmit={handleAddUserSubmit}>
                    <DialogTitle sx={{ fontWeight: 700 }}>Add New User</DialogTitle>
                    <DialogContent dividers>
                        <Stack spacing={2.5} sx={{ mt: 1 }}>
                            <TextField label="Full Name" fullWidth required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            <TextField label="Email Address" type="email" fullWidth required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            <TextField
                                fullWidth
                                label="Password"
                                type={showAddPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowAddPassword((prev) => !prev)}
                                                >
                                                    {showAddPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <TextField select label="Role" fullWidth required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                <MenuItem value="Agronomist">Agronomist</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Remote Sensing Manager">Remote Sensing Manager</MenuItem>
                            </TextField>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5 }}>
                        <Button onClick={() => setAddUserOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">Create User</Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* EDIT USER DIALOG */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullScreen={isMobile} fullWidth maxWidth="xs">
                <form onSubmit={handleEditUserSubmit}>
                    <DialogTitle sx={{ fontWeight: 700 }}>Edit User</DialogTitle>
                    <DialogContent dividers>
                        <Stack spacing={2.5} sx={{ mt: 1 }}>
                            <TextField label="Full Name" fullWidth required value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} />
                            <TextField label="Email Address" type="email" fullWidth required value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} />
                            {/* Password Field */}
                            <TextField
                                fullWidth
                                label="Password"
                                type={showEditPassword ? "text" : "password"}
                                value={editFormData.password}
                                onChange={(e) =>
                                    setEditFormData({
                                        ...editFormData,
                                        password: e.target.value,
                                    })
                                }
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowEditPassword((prev) => !prev)}
                                                >
                                                    {showEditPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <TextField select label="Role" fullWidth required value={editFormData.role} onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}>
                                <MenuItem value="Agronomist">Agronomist</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Remote Sensing Manager">Remote Sensing Manager</MenuItem>
                            </TextField>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5 }}>
                        <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">Update User</Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* DELETE DIALOG */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to remove <b>{userToDelete?.name}</b>?</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserList;
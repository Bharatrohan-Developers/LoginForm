import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Checkbox,
    Avatar,
    Paper,
    Divider,
    Container,
    CircularProgress,
    Snackbar,
    Alert,
    Skeleton
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    PersonAdd as PersonAddIcon,
    Save as SaveIcon,
    Person as PersonIcon,
    ErrorOutlined as ErrorOutline
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';

export default function AssignUsers() {
    const navigate = useNavigate();
    const projectId = useParams().id; // Assuming route is like /projects/assign/:id

    const [members, setMembers] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showList, setShowList] = useState(false);

    // Status States
    const [loading, setLoading] = useState(false); // For initial fetch
    const [isSaving, setIsSaving] = useState(false); // For Save button
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    // 1. Fetch Users from API
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // Replace 'url/users' with your actual environment variable or full URL
                const response = await axios.get(`${import.meta.env.VITE_URL}/users`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (response.data.success) {
                    setMembers(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                setNotification({
                    open: true,
                    message: 'Failed to load members. Please try again later.',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // 2. Handle Checkbox Toggle (using _id)
    const handleToggle = (id) => {
        const currentIndex = selectedIds.indexOf(id);
        const newChecked = [...selectedIds];

        if (currentIndex === -1) {
            newChecked.push(id);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setSelectedIds(newChecked);
    };

    // 3. Handle Save Action
    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Example POST/PUT request to save assignments
            // await axios.post('url/projects/assign', { userIds: selectedIds });
            const response = await axios.patch(
                `${import.meta.env.VITE_URL}/projects/${projectId}/users`,
                {
                    "users": [...selectedIds]
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            console.log("Saving Selected IDs:", selectedIds);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            setNotification({
                open: true,
                message: `Successfully assigned ${selectedIds.length} members!`,
                severity: 'success'
            });
        } catch (error) {
            setNotification({
                open: true,
                message: 'Failed to save assignments.',
                severity: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCloseSnackbar = () => setNotification({ ...notification, open: false });

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            {/* Top Action Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} mb={3}>
                <Button
                    startIcon={<BackIcon />}
                    variant="outlined"
                    onClick={() => navigate('/dashboard')}
                >
                    Go Back Home
                </Button>

                <Button
                    startIcon={<PersonAddIcon />}
                    variant="contained"
                    disabled={loading}
                    onClick={() => setShowList(!showList)}
                >
                    {showList ? "Hide List" : "Assign Members"}
                </Button>
            </Box>

            {/* Main Content Area */}
            {showList ? (
                <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mt: 3 }}>
                    <Box p={2} sx={{ bgcolor: "primary.main", color: "white", display: "flex", flexDirection: "column" }} >
                        <Typography variant="h6" sx={{ ml: 3 }}>Select staff to assign to this project</Typography>
                    </Box>

                    {loading ? (
                        // Skeleton Loading State
                        <Box p={2}>
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 1, borderRadius: 1 }} />
                            ))}
                        </Box>
                    ) : members.length > 0 ? (
                        <List sx={{ width: '100%', bgcolor: 'background.paper', py: 0 }}>
                            {members.map((member) => {
                                const labelId = `checkbox-list-label-${member._id}`;

                                return (
                                    <React.Fragment key={member._id}>
                                        <ListItem
                                            secondaryAction={
                                                <Checkbox
                                                    edge="end"
                                                    onChange={() => handleToggle(member._id)}
                                                    checked={selectedIds.indexOf(member._id) !== -1}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            }
                                            disablePadding
                                        >
                                            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', p: 2 }}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: member.role === 'Remote Sensing Manager' ? 'secondary.main' : 'primary.light' }}>
                                                        <PersonIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    id={labelId}
                                                    primary={<Typography variant="subtitle1" fontWeight="600">{member.name}</Typography>}
                                                    secondary={
                                                        <Typography variant="body2" color="text.secondary">
                                                            {member.role} • {member.email}
                                                        </Typography>
                                                    }
                                                />
                                            </Box>
                                        </ListItem>
                                        <Divider component="li" />
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    ) : (
                        <Box p={5} textAlign="center">
                            <ErrorOutline color="disabled" sx={{ fontSize: 40 }} />
                            <Typography>No members found in the database.</Typography>
                        </Box>
                    )}

                    {/* Bottom Save Action */}
                    <Box p={3} sx={{ display: "flex", justifyContent: "center", bgcolor: "#fcfcfc" }} >
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            disabled={isSaving || selectedIds.length === 0 || loading}
                            onClick={handleSave}
                            sx={{ minWidth: 250, borderRadius: '8px' }}
                        >
                            {isSaving ? 'Processing...' : `Assign ${selectedIds.length} Members`}
                        </Button>
                    </Box>
                </Paper>
            ) : (
                <Box sx={{ textAlign: "center", py: 12, border: "2px dashed", borderColor: "divider", mt: 3 }} >
                    <PersonAddIcon sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                        RSM Management Portal
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Click the button above to view and assign agronomists.
                    </Typography>
                </Box>
            )}

            {/* Notifications */}
            <Snackbar
                open={notification.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={notification.severity} variant="filled">
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}
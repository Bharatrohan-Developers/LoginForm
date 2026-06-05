import React from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Paper,
    Divider,
    Container,
    Button
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ShowAgronomist() {
    const navigate = useNavigate();
    const location = useLocation();

    // Getting passed data
    const agronomists = location.state?.assignedAgronomists || [];

    return (
        <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>

            {/* Top Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} mb={3}>
                <Button
                    startIcon={<BackIcon />}
                    variant="outlined"
                    onClick={() => navigate('/dashboard')}
                >
                    Go Back
                </Button>

                <Typography variant="h6">
                    Assigned Agronomists
                </Typography>
            </Box>

            {/* Main Content */}
            {agronomists.length > 0 ? (
                <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mt: 4 }}>

                    {/* Header */}

                    {/* List */}
                    <List sx={{ py: 0 }}>
                        {agronomists.map((member) => (
                            <React.Fragment key={member._id}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                                            <PersonIcon />
                                        </Avatar>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={
                                            <Typography fontWeight={600}>
                                                {member.name}
                                            </Typography>
                                        }
                                        secondary={`${member.role} • ${member.email}`}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            ) : (
                <Box
                    py={10}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: "center",
                        border: "2px dashed",
                        borderColor: "divider", mt: 4,
                        backgroundColor: 'background.paper',
                    }}
                >
                    <PersonIcon sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
                    <Typography variant="h6">
                        No Agronomists Assigned
                    </Typography>
                </Box>
            )}
        </Container>
    );
}
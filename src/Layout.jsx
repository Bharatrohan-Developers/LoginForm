import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Outlet } from 'react-router';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Grid,
    Box,
    Avatar,
    IconButton,
    CssBaseline,
    ThemeProvider,
    createTheme
} from '@mui/material';
import ProjectCard from './components/ProjectCard';

// Create a custom theme
const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        background: { default: '#f4f6f8' },
    },
});

const Sidebar = () => {
    const token = localStorage.getItem('authToken');
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
        } else {
            axios.get('http://192.168.0.160:3000/projects', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    // Access the "data" array inside the response object
                    setProjects(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching projects:', error);
                });
        }
    }, [token, navigate]);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            {/* HEADER */}
            <AppBar position="sticky" elevation={2} sx={{ backgroundColor: 'white', color: 'black' }}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        {/* Logo Section */}
                        <Box
                            component="img"
                            sx={{
                                height: 50, // Adjust height as needed
                                width: 'auto',
                                cursor: 'pointer',
                            }}
                            alt="BharatRohan Logo"
                            src="https://media.licdn.com/dms/image/v2/D5616AQGWrf8jvZ_AkQ/profile-displaybackgroundimage-shrink_200_800/B56ZaLRjBqHUAU-/0/1746093357189?e=2147483647&v=beta&t=eucW_8F2ZxmDo-yISEiZs1uSWuB8-vt4O-egVZl4_mU" // Replace with your actual local path or variable
                        />


                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                Welcome, Admin!
                            </Typography>
                            <IconButton sx={{ p: 0 }}>
                                <Avatar alt="User Profile" src="https://mui.com/static/images/avatar/1.jpg" />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* BODY / CONTENT */}
            <Box component="main" sx={{ py: 2, minHeight: '80vh'}}>
                <Outlet />
            </Box>

            {/* FOOTER */}
        </ThemeProvider>
    );
};

export default Sidebar;
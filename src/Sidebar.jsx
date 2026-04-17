import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
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
            <AppBar position="sticky" elevation={1} sx={{ backgroundColor: 'white', color: 'black' }}>
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
            <Box component="main" sx={{ py: 6, minHeight: '80vh' }}>
                <Container maxWidth="lg">
                    <Box mb={4}>
                        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                            My Projects
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {projects.map((project) => (
                            <Grid item="true" key={project._id} xs={12} sm={6} md={4}>
                                <ProjectCard project={project} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* FOOTER */}
            <Box component="footer" sx={{ py: 6, px: 2, mt: 'auto', backgroundColor: '#fff', borderTop: '1px solid #e0e0e0' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} sx={{ justifyContent: 'space-between' }}>
                        <Grid item="true" xs={12} sm={6}>
                            <Typography variant="h6" color="text.primary" gutterBottom>
                                About This Dashboard
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Built with React and Material UI. This dashboard showcases responsive design
                                and modular component architecture.
                            </Typography>
                        </Grid>
                        <Grid item="true" xs={12} sm={3}>
                            <Typography variant="h6" color="text.primary" gutterBottom>
                                Contact
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Email: hello@example.com
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Github: @yourusername
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
                        {'Copyright © '} {new Date().getFullYear()} BharatRohan.
                    </Typography>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default Sidebar;
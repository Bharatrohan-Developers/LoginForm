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
import ProjectCard from './ProjectCard';

// Create a custom theme
const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        background: { default: '#f4f6f8' },
    },
});

const ProjectList = () => {
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
    );
};

export default ProjectList;
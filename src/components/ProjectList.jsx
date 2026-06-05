import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Container,
    Grid,
    Box,
    Button,
    CircularProgress,
    Alert,
    useMediaQuery,
    useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ProjectCard from './ProjectCard';

const ProjectList = () => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const AUTHORIZED_MANAGER_ROLE = "Remote Sensing Manager";

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_URL}/projects`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(response.data?.data || []);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('Failed to load projects.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [token, navigate]);

    return (
        <Box component="main" sx={{ py: 6, minHeight: '80vh', px: { xs: 2, sm: 3, md: 4 } }}>
            {/* HEADER SECTION: Title and Button on the same row */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    gap: 2,
                    mt: -5
                }}
            >
                <Typography
                    variant={isMobile ? "h5" : "h4"}
                    component="h1"
                    fontWeight="bold"
                    sx={{ margin: 0 }}
                >
                    My Projects
                </Typography>

                {role === AUTHORIZED_MANAGER_ROLE && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/projects/create')}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap', // Prevents button text from wrapping
                            px: { xs: 2, sm: 3 },
                            height: 'fit-content' // Keeps button height tight
                        }}
                    >
                        Create Project
                    </Button>
                )}
            </Box>

            {/* Content Logic */}
            {loading ? (
                <Box display="flex" justifyContent="center" my={10}><CircularProgress /></Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <Grid container spacing={4} sx={{ display: "grid", justifyContent: "center", gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)' }}>
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <Grid item key={project._id} xs={12} sm={6} md={4}>
                                <ProjectCard project={project} />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography color="textSecondary" textAlign="center">
                                No projects found.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            )}
        </Box>
    );
};

export default ProjectList;
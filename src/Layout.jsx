import { Outlet, useNavigate } from 'react-router';
import { useMemo } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Avatar,
    IconButton,
    CssBaseline,
    ThemeProvider,
    createTheme
} from '@mui/material';


const Layout = () => {
    //const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');
    const navigate = useNavigate();
    // Create a custom theme
    const theme = useMemo(() => createTheme({
        palette: {
            primary: { main: '#1976d2' },
            background: { default: '#f4f6f8' },
        },
    }), []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            {/* HEADER */}
            <AppBar position="sticky" elevation={2} sx={{ backgroundColor: 'white', color: 'black' }}>
                <Toolbar disableGutters sx={{ justifyContent: 'space-between', px: 3 }}>
                    {/* Logo Section */}
                    <Box
                        component="img"
                        onClick={() => navigate('/dashboard')}
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
                            Welcome, {role || 'User'}!
                        </Typography>
                        <IconButton sx={{ p: 0 }}>
                            <Avatar alt="User Profile" src="https://mui.com/static/images/avatar/1.jpg" />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* BODY / CONTENT */}
            <Box component="main" sx={{ py: 2, minHeight: '100vh', backgroundImage: 'url(/bgMI.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                <Outlet />
            </Box>

            {/* FOOTER */}
        </ThemeProvider>
    );
};

export default Layout;
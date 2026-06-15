import { Outlet, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Avatar,
    IconButton,
    CssBaseline,
    ThemeProvider,
    createTheme,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Layout = () => {
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        try {
            // Close menu
            handleMenuClose();

            // Clear storage
            localStorage.clear();
            sessionStorage.clear();

            // Redirect to login page
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    primary: { main: '#1976d2' },
                    background: { default: '#f4f6f8' }
                }
            }),
        []
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            {/* HEADER */}
            <AppBar
                position="sticky"
                elevation={1}
                sx={{
                    backgroundColor: 'white',
                    color: 'black'
                }}
            >
                <Toolbar
                    disableGutters
                    sx={{
                        justifyContent: 'space-between',
                        px: 3
                    }}
                >
                    {/* Logo */}
                    <Box
                        component="img"
                        onClick={() => navigate('/dashboard')}
                        sx={{
                            height: 40,
                            width: 'auto',
                            cursor: 'pointer'
                        }}
                        alt="BharatRohan Logo"
                        src="https://media.licdn.com/dms/image/v2/D5616AQGWrf8jvZ_AkQ/profile-displaybackgroundimage-shrink_200_800/B56ZaLRjBqHUAU-/0/1746093357189?e=2147483647&v=beta&t=eucW_8F2ZxmDo-yISEiZs1uSWuB8-vt4O-egVZl4_mU"
                    />

                    {/* User Section */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                fontWeight: 500
                            }}
                        >
                            {role ? role.toUpperCase() : 'User'}
                        </Typography>

                        <IconButton
                            onClick={handleMenuOpen}
                            size="small"
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar
                                alt="User Profile"
                                src="https://mui.com/static/images/avatar/1.jpg"
                                sx={{
                                    width: 35,
                                    height: 35,
                                    border: '1px solid #ddd'
                                }}
                            />
                        </IconButton>
                    </Box>

                    {/* Profile Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleMenuClose}
                        transformOrigin={{
                            horizontal: 'right',
                            vertical: 'top'
                        }}
                        anchorOrigin={{
                            horizontal: 'right',
                            vertical: 'bottom'
                        }}
                        PaperProps={{
                            elevation: 3,
                            sx: {
                                mt: 1.5,
                                minWidth: 180,
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform:
                                        'translateY(-50%) rotate(45deg)',
                                    zIndex: 0
                                }
                            }
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                navigate('/profile');
                            }}
                        >
                            <ListItemIcon>
                                <AccountCircleIcon fontSize="small" />
                            </ListItemIcon>
                            Profile
                        </MenuItem>

                        <Divider />

                        <MenuItem
                            onClick={handleLogout}
                            sx={{ color: 'error.main' }}
                        >
                            <ListItemIcon>
                                <LogoutIcon
                                    fontSize="small"
                                    sx={{ color: 'error.main' }}
                                />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    py: 3,
                    px: 2,
                    minHeight: '100vh',
                    backgroundColor: '#f4f6f8'
                }}
            >
                <Outlet />
            </Box>
        </ThemeProvider>
    );
};

export default Layout;
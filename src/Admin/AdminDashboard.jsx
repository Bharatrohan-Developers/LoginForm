import React, { useMemo, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
} from '@mui/material';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import FolderIcon from '@mui/icons-material/Folder';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';

const FULL_DRAWER_WIDTH = 260;
const COLLAPSED_DRAWER_WIDTH = 75;



const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role') || 'Admin';

  // Responsive Breakpoint check
  const isMobile = useMediaQuery('(max-width:900px)');

  // Sidebar States
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = useMemo(() =>
    createTheme({
      palette: {
        primary: { main: '#007a33' },
        background: { default: '#f4f7f6' },
      },
      typography: { fontFamily: '"Inter", sans-serif' },
    }), []
  );

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Projects', icon: <FolderIcon />, path: '/admin/projects' },
  ];

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false); // Close drawer on mobile after clicking
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Determine current drawer width based on state
  const drawerWidth = isMobile ? FULL_DRAWER_WIDTH : (isCollapsed ? COLLAPSED_DRAWER_WIDTH : FULL_DRAWER_WIDTH);

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflowX: 'hidden' }}>
      <Toolbar /> {/* Top spacing */}
      <Divider />
      <List sx={{ px: 1.5, mt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const showText = isMobile || !isCollapsed;

          return (
            <Tooltip key={item.text} title={!showText ? item.text : ""} placement="right">
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  minHeight: 50,
                  justifyContent: showText ? 'initial' : 'center',
                  borderRadius: '10px',
                  mb: 1,
                  px: 2.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '&:hover': { backgroundColor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 0,
                  mr: showText ? 2 : 0,
                  justifyContent: 'center',
                  color: isActive ? 'white' : 'inherit'
                }}>
                  {item.icon}
                </ListItemIcon>
                {showText && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '14px',
                        fontWeight: isActive ? 600 : 500,
                        whiteSpace: 'nowrap'
                      }
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );

  const handleLogout = () => {
    // Clear all relevant data from localStorage
    localStorage.clear();
    sessionStorage.clear();
    navigate('/'); // Redirect to login page after logout
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />

        {/* APP BAR */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: 'white',
            color: 'text.primary',
            borderBottom: '1px solid #eee',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" onClick={handleToggle} edge="start" sx={{ mr: 0.5 }}>
                <MenuIcon />
              </IconButton>
              <Box
                component="img"
                src='/bha.jpg'
                alt="Logo"
                sx={{ height: { xs: 28, sm: 40 }, cursor: 'pointer' }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{role}</Typography>
                <Typography variant="caption" color="text.secondary">Welcome back!</Typography>
              </Box>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                <Avatar
                  src="https://mui.com/static/images/avatar/1.jpg"
                  sx={{ width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 }, border: '2px solid #007a33' }}
                />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* NAVIGATION DRAWER */}
        <Box
          component="nav"
          sx={{
            width: { md: drawerWidth },
            flexShrink: { md: 0 },
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          {/* Mobile View */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }} // Better open performance on mobile
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { width: FULL_DRAWER_WIDTH, boxSizing: 'border-box' },
            }}
          >
            {drawerContent}
          </Drawer>

          {/* Desktop View */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                transition: (theme) => theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                overflowX: 'hidden',
                borderRight: '1px solid #eee'
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </Box>

        {/* MAIN CONTENT AREA */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            width: {
              xs: '100%',
              md: `calc(100% - ${drawerWidth}px)`
            },
            transition: (theme) => theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Toolbar /> {/* Spacer for the fixed AppBar */}
          <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
            <Outlet />
          </Box>
        </Box>

        {/* User Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ mt: 1 }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleMenuClose}>
            <AccountCircleIcon sx={{ mr: 1.5, fontSize: 20 }} /> Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} /> Logout
          </MenuItem>
        </Menu>
      </Box>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ThemeProvider>
  );
};

export default AdminDashboard;
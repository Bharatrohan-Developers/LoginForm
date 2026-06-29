import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  CssBaseline,
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
  useTheme,
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
  const theme = useTheme();
  const role = localStorage.getItem('role') || 'Admin';

  // Responsive Breakpoint check
  const isMobile = useMediaQuery('(max-width:900px)');

  // Sidebar States
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard', roles: ['Admin', 'Agronomist', 'Remote Sensing Manager'] },

    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/admin/users',
      roles: ['Admin'], // 👈 ONLY ADMIN CAN SEE
    },

    // { text: 'Projects', icon: <FolderIcon />, path: '/admin/projects', roles: ['Admin', 'Agronomist','Remote Sensing Manager'] },
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
    if (isMobile) setMobileOpen(false);
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Determine current drawer width based on state
  const drawerWidth = isMobile ? FULL_DRAWER_WIDTH : (isCollapsed ? COLLAPSED_DRAWER_WIDTH : FULL_DRAWER_WIDTH);

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowX: 'hidden',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
      }}
    >
      <Toolbar />
      <Divider sx={{ borderColor: `${theme.palette.common.white}30` }} />
      <List sx={{ px: 1.5, mt: 2 }}>
        {menuItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
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
                    borderRadius: 2,
                    mb: 1,
                    px: 2.5,
                    color: theme.palette.common.white,
                    fontFamily: "Jost, -apple-system, BlinkMacSystemFont, sans-serif",
                    '&.Mui-selected': {
                      backgroundColor: `${theme.palette.primary.dark}`,
                      color: theme.palette.common.white,
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.common.white,
                      },
                      '&:hover': {
                        backgroundColor: `${theme.palette.primary.dark}`,
                      },
                    },
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.light}`,
                      color: theme.palette.common.white,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: showText ? 2 : 0,
                      justifyContent: 'center',
                      color: theme.palette.common.white,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {showText && (
                    <ListItemText
                      primary={item.text}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '0.95rem',
                          fontWeight: isActive ? 700 : 500,
                          whiteSpace: 'nowrap',
                          color: theme.palette.common.white,
                          fontFamily: "Jost, -apple-system, BlinkMacSystemFont, sans-serif",
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
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  }

  return (
    <>
      <CssBaseline />

      {/* APP BAR */}
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          borderBottom: `1px solid ${theme.palette.common.white}10`,
          zIndex: (themeVal) => themeVal.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              onClick={handleToggle}
              edge="start"
              sx={{ mr: 1, transition: 'all 0.3s ease' }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              component="img"
              onClick={() => navigate('/admin/dashboard')}
              src='/bharatrohan.png'
              alt="Logo"
              sx={{
                height: { xs: 32, sm: 40 },
                cursor: 'pointer',
                transition: 'opacity 0.3s ease',
                '&:hover': { opacity: 0.8 }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {role}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Welcome back!
              </Typography>
            </Box>
            <IconButton
              onClick={handleMenuOpen}
              sx={{ p: 0.5, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}
            >
              <Avatar
                src="https://mui.com/static/images/avatar/1.jpg"
                sx={{
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  border: `2px solid ${theme.palette.secondary.main}`,
                  cursor: 'pointer'
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* MAIN LAYOUT */}
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>

        {/* NAVIGATION DRAWER */}
        <Box
          component="nav"
          sx={{
            width: { md: drawerWidth },
            flexShrink: { md: 0 },
            transition: (themeVal) => themeVal.transitions.create('width', {
              easing: themeVal.transitions.easing.sharp,
              duration: themeVal.transitions.duration.enteringScreen,
            }),
          }}
        >
          {/* Mobile View */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
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
                transition: (themeVal) => themeVal.transitions.create('width', {
                  easing: themeVal.transitions.easing.sharp,
                  duration: themeVal.transitions.duration.enteringScreen,
                }),
                overflowX: 'hidden',
                borderRight: `1px solid ${theme.palette.text.primary}10`
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
            transition: (themeVal) => themeVal.transitions.create(['width', 'margin'], {
              easing: themeVal.transitions.easing.sharp,
              duration: themeVal.transitions.duration.enteringScreen,
            }),
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Toolbar />
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
            <AccountCircleIcon sx={{ mr: 1.5, fontSize: 20, color: theme.palette.primary.main }} />
            Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
            <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: theme.palette.error.main }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default AdminDashboard;
import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate, useLocation } from 'react-router-dom';

import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsIcon from '@mui/icons-material/Settings';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '240px',
  height: '100vh',
  backgroundColor: '#1e1e2f',
  color: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
}));

const SidebarTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#ffffff',
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  color: '#ffffff',
  marginBottom: theme.spacing(1),
  borderRadius: '8px',
  '&:hover': { backgroundColor: '#292940' },
  '&.Mui-selected': { backgroundColor: '#4f46e5', '&:hover': { backgroundColor: '#4338ca' } },
}));

const Sidebaradmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/admindashboard' },
    { name: 'Manager', icon: <ManageAccountsIcon />, path: '/admindashboard/manager' },
    { name: 'Teams', icon: <GroupsIcon />, path: '/admindashboard/teams' },
    { name: 'Settings', icon: <SettingsIcon />, path: '/admindashboard/adminsettings' },
  ];

  return (
    <SidebarContainer>
      <SidebarTitle>Admin Panel</SidebarTitle>
      <List>
        {menuItems.map((item) => (
          <StyledListItemButton
            key={item.name}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </StyledListItemButton>
        ))}
      </List>
    </SidebarContainer>
  );
};

export default Sidebaradmin;

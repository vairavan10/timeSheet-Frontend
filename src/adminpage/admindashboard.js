import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebaradmin from './sidebar';
import Dashboard from './dashboard';
import Teams from './team';
import Settings from '../adminpage/adminsettings';
import ManagerForm from './managerform';

const getActiveMenu = (pathname) => {
  if (pathname.includes('admindashboard')) return 'Dashboard';
  if (pathname.includes('manager')) return 'Manager';
  if (pathname.includes('team')) return 'Teams';
  if (pathname.includes('settings')) return 'Settings';
  return 'Dashboard';
};

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [activeMenu, setActiveMenu] = useState(getActiveMenu(location.pathname));

  useEffect(() => {
    const newMenu = getActiveMenu(location.pathname);
    if (newMenu !== activeMenu) {
      setActiveMenu(newMenu);
    }
  }, [location.pathname, activeMenu]);

  const handleMenuSelect = (menu) => {
    setActiveMenu(menu);
    const pathMap = {
      'Dashboard': '/admindashboard',
      'Manager': '/manager',
      'Teams': '/team',
      'Settings': '/adminsettings'
    };
    if (pathMap[menu]) navigate(pathMap[menu]);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Teams':
        return <Teams />;
      case 'Manager':
        return <ManagerForm />;
      case 'Settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box display="flex" height="100vh" width="100vw" overflow="hidden">
      {/* <Sidebaradmin active={activeMenu} onMenuSelect={handleMenuSelect} /> */}
      <Box component="main" flexGrow={1} p={2} overflow="auto" sx={{ backgroundColor: '#f4f4f5' }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;

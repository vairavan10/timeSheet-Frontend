import { Outlet, useLocation } from 'react-router-dom';
import Sidebaradmin from './sidebar';
import { useState, useEffect } from 'react';

const AdminLayout = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  useEffect(() => {
    if (location.pathname.includes('admindashboard')) setActiveMenu('Dashboard');
    else if (location.pathname.includes('manager')) setActiveMenu('Manager');
    else if (location.pathname.includes('teams')) setActiveMenu('Teams');
    else if (location.pathname.includes('adminsettings')) setActiveMenu('Settings');
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebaradmin active={activeMenu} onMenuSelect={setActiveMenu} />
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext'; // Import context

import LoginPage from './components/login';
import Dashboard from './components/dashboard';
import CreateContainer from './components/signup';
import InputSheet from './components/inputsheet';
import Employees from './components/employees';
import Settings from './components/settings';
import AdminDashboard from './adminpage/admindashboard';
import TeamForm from './adminpage/team';
import ManagerForm from './adminpage/managerform';
import AdminLayout from './adminpage/adminlayout';
import AdminSettings from './adminpage/adminsettings';
import EmployeeTable from './components/table';
import SideMenu from './components/sidebar';
import Project from './components/project';
import Profile from './components/profile';
import EmployeesListPage from './components/Profileview';
import EmployeeDetailsPage from './components/EmployeeDetailsPage';
import ProjectDisplayPage from './components/ProjectDisplayPage';
import ProjectListPage from './components/projectview';
import ViewReportPage from './components/viewReportPage';
import ExtraActivityPage from './components/extraActivity';
import EmployeeSummaryPage from './components/employeeWork'

function App() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const toggleTheme = () => setDarkMode((prevMode) => !prevMode);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<CreateContainer />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inputsheet" element={<InputSheet />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/fulltable" element={<EmployeeTable />} />
        {/* <Route path="/projects" element={<ProjectDisplayPage/>}/> */}
        <Route path="/employee/:id" element={<EmployeeDetailsPage />} />

        <Route path="/profile" element={<Profile/>}/>
        <Route path="/Profileview" element={<EmployeesListPage/>}/>
        <Route path="/projects" element={<ProjectListPage />} />
        <Route path="/add-projects" element={<Project />} />
        <Route path="/project/:projectId" element={<ProjectDisplayPage />} />
        <Route path="/project/:projectId/report" element={<ViewReportPage />} />
        <Route path="/extraActivity" element={<ExtraActivityPage />} />
        <Route path="/employeeSumarry" element={<EmployeeSummaryPage />} />





        {/* Admin Routes */}
        <Route path="/admindashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="manager" element={<ManagerForm />} />
          <Route path="teams" element={<TeamForm />} />

          <Route path="adminsettings" element={<AdminSettings />} />
        </Route>

      
        
      </Routes>
    </Router>
  );
}

export default App;

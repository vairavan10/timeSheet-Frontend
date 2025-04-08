import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Chip,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AccountCircle, Email, Phone } from "@mui/icons-material";
import SideMenu from "./sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "./layout";


const skillsList = ["React", "Node.js", "Python", "Java", "AWS", "UI/UX"];

const Employee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    designation: "",
    joiningDate: null,
    experience: "",
    skills: [],
    certification: null,
  });

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (event) => {
    setEmployee({ ...employee, skills: event.target.value });
  };

  const handleFileUpload = (event) => {
    setEmployee({ ...employee, certification: event.target.files[0] });
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const employeeData = {
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      designation: employee.designation,
      joiningDate: employee.joiningDate,
      experience: employee.experience,
      skills: employee.skills,
    };
  
    try {
      const response = await axios.post("api/employees/addemployee", employeeData, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 201) {
        alert("Employee profile created successfully!");
        setEmployee({
          name: "",
          email: "",
          phone: "",
          role: "",
          designation: "",
          joiningDate: null,
          experience: "",
          skills: [],
        });
        navigate("/dashboard");
      } else {
        alert("Something went wrong! Please try again.");
      }
    } catch (error) {
      console.error("Error submitting employee profile:", error);
      alert("Error submitting employee profile. Please try again later.");
    }
  };
  

  return (
    
    <Layout>
      {/* <SideMenu /> */}
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f6f8" p={2}>
        <Paper elevation={3} sx={{ p: 4, width: "600px", borderRadius: "12px" }}>
          <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
            Create Employee Profile
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Name" name="name" value={employee.name} onChange={handleChange} 
                  InputProps={{ startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email" name="email" value={employee.email} onChange={handleChange} 
                  InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Phone" name="phone" value={employee.phone} onChange={handleChange} 
                  InputProps={{ startAdornment: <InputAdornment position="start"><Phone /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Role" name="role" value={employee.role} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Designation" name="designation" value={employee.designation} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="Joining Date"
                  value={employee.joiningDate}
                  onChange={(date) => setEmployee({ ...employee, joiningDate: date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Experience (in years)" name="experience" value={employee.experience} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
  <FormControl fullWidth sx={{ minWidth: 120 }} variant="outlined">
    <InputLabel id="skill-set-label">Skill Set</InputLabel>
    <Select
      labelId="skill-set-label"
      multiple
      name="skills"
      value={employee.skills}
      onChange={handleSkillChange}
      label="Skill Set"
      renderValue={(selected) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selected.map((value) => (
            <Chip key={value} label={value} />
          ))}
        </Box>
      )}
    >
      {skillsList.map((skill) => (
        <MenuItem key={skill} value={skill}>
          {skill}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

              <Grid item xs={12}>
                <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileUpload} />
                {employee.certification && <Typography variant="body2">Selected: {employee.certification.name}</Typography>}
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                  Create Profile
                </Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Paper>
      </Box>
      </Layout>  );
};

export default Employee;
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
  Stack,
  IconButton ,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AccountCircle, Email, Phone } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./layout";

// const skillsList = ["React", "Node.js", "Python", "Java", "AWS", "UI/UX"];

const Employee = () => {
  const [newSkill, setNewSkill] = useState("");
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error", // can be "success", "warning", "info", or "error"
  });
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  const showSnackbar = (message, severity = "error") => {
    setSnackbar({ open: true, message, severity });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const employeeData = { ...employee };
    delete employeeData.certification;
  
    try {
      const response = await axios.post("api/employees/addemployee", employeeData, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 201) {
        showSnackbar("Employee profile created successfully!", "success");
        setEmployee({
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
        setTimeout(() => navigate("/dashboard"), 1000); // Navigate after short delay
      } else {
        showSnackbar("Something went wrong! Please try again.");
      }
    } catch (error) {
      console.error("Error submitting employee profile:", error);
      showSnackbar("Error submitting employee profile. Please try again later.");
    }
  };
  

  return (
    <Layout>
      
  <Box
    sx={{
      minHeight: "100vh",
      width: "100%",
      // bgcolor: "#e9edf0",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      px: 2,
      py: 4,
    }}
  >

        <Paper elevation={6} sx={{ p: 5, borderRadius: 4, maxWidth: 750, width: "100%" }}>
          <Typography variant="h4" align="center" fontWeight="bold" mb={4}>
            Employee Profile Form
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={employee.name}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={employee.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={employee.phone}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Role"
                  name="role"
                  value={employee.role}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  name="designation"
                  value={employee.designation}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
  <DatePicker
    label="Joining Date"
    value={employee.joiningDate}
    onChange={(date) => setEmployee({ ...employee, joiningDate: date })}
    format="DD/MM/YYYY"
    renderInput={(params) => <TextField fullWidth {...params} />}
  />
</Grid>


              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Experience (in years)"
                  name="experience"
                  value={employee.experience}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
  <FormControl fullWidth>
    
    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
      <TextField
        id="skills-input"
        placeholder="Type a skill"
        label="Skill Set"
        value={newSkill}
        onChange={(e) => setNewSkill(e.target.value)}
        fullWidth
      />
      <IconButton
        onClick={() => {
          if (newSkill.trim() && !employee.skills.includes(newSkill.trim())) {
            setEmployee({ ...employee, skills: [...employee.skills, newSkill.trim()] });
            setNewSkill("");
          }
        }}
        color="primary"
        sx={{ border: '1px solid #ccc', borderRadius: 1 }}
      >
        <AddIcon />
      </IconButton>
    </Box>

    <Stack direction="row" spacing={1} flexWrap="wrap">
      {employee.skills.map((skill, index) => (
        <Chip
          key={index}
          label={skill}
          onDelete={() => {
            const updatedSkills = employee.skills.filter((s) => s !== skill);
            setEmployee({ ...employee, skills: updatedSkills });
          }}
          color="primary"
        />
      ))}
    </Stack>
  </FormControl>
</Grid>
{/* 
              <Grid item xs={12}>
                <Button component="label" variant="outlined" fullWidth>
                  Upload Certification
                  <input type="file" hidden onChange={handleFileUpload} accept=".pdf,.jpg,.png" />
                </Button>
                {employee.certification && (
                  <Typography variant="body2" mt={1} color="text.secondary">
                    Selected: {employee.certification.name}
                  </Typography>
                )}
              </Grid> */}

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit}
                  sx={{
                    background: "linear-gradient(90deg,rgb(137, 30, 238) 0%, #42a5f5 100%)",
                    color: "#fff",
                    fontWeight: "bold",
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      background: "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)",
                    }
                  }}
                >
                  Create Profile
                </Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Paper>
      </Box>
      <Snackbar
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={handleCloseSnackbar}
>
  <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} elevation={6} variant="filled">
    {snackbar.message}
  </MuiAlert>
</Snackbar>

    </Layout>
  );
};

export default Employee;

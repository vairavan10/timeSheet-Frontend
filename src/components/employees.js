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
  useTheme,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AccountCircle, Email, Phone } from "@mui/icons-material";
import Layout from "./layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const skillsList = ["React", "Node.js", "Python", "Java", "AWS", "UI/UX"];

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

  const theme = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (event) => {
    setEmployee({ ...employee, skills: event.target.value });
  };

  const handleFileUpload = (event) => {
    setEmployee({ ...employee, certification: event.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employeeData = {
      ...employee,
      certification: undefined,
    };

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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default" p={2}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: "600px",
            borderRadius: "16px",
            backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
            boxShadow: theme.palette.mode === "dark" ? "0px 4px 20px rgba(255,255,255,0.1)" : undefined,
          }}
        >
          <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
            Create Employee Profile
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
                  <InputLabel id="skill-set-label">Skill Set</InputLabel>
                  <Select
                    labelId="skill-set-label"
                    multiple
                    name="skills"
                    value={employee.skills}
                    onChange={handleSkillChange}
                    label="Skill Set"
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} color="primary" />
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
                <Button variant="outlined" component="label" fullWidth>
                  Upload Certification
                  <input type="file" accept=".pdf,.jpg,.png" hidden onChange={handleFileUpload} />
                </Button>
                {employee.certification && (
                  <Typography variant="body2" mt={1}>
                    Selected: {employee.certification.name}
                  </Typography>
                )}
              </Grid>
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
    </Layout>
  );
};

export default Employee;

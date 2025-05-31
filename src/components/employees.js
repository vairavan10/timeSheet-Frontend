import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Snackbar,
  Alert,
  useTheme,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { InputAdornment } from '@mui/material';

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AccountCircle, Email, Phone } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "./layout";

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
    managerId: "",
    certification: null,
  });
  const [managerName, setManagerName] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const theme = useTheme();
  const navigate = useNavigate();

  const managerData = JSON.parse(localStorage.getItem("user"));
  const managerId = managerData?.id;

  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (event) => {
    setEmployee({ ...employee, skills: event.target.value });
  };

  const handleFileUpload = (event) => {
    setEmployee({ ...employee, certification: event.target.files[0] });
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0: // Personal Details Step
        if (!employee.name || !employee.email || !employee.phone) {
          showSnackbar("Please fill out all required fields in personal details", "error");
          return false;
        }
        break;
      case 1: // Working Details Step
        if (!employee.role || !employee.designation || !employee.joiningDate) {
          showSnackbar("Please fill out all required fields in working details", "error");
          return false;
        }
        break;
      case 2: // Skills Step
        if (employee.skills.length === 0) {
          showSnackbar("Please select at least one skill", "error");
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  // Create FormData object
  const formData = new FormData();

  // Append all employee fields to formData
  formData.append("name", employee.name);
  formData.append("email", employee.email);
  formData.append("phone", employee.phone);
  formData.append("role", employee.role);
  formData.append("designation", employee.designation);
  formData.append("joiningDate", employee.joiningDate);  // make sure this is a string or ISO date
  formData.append("experience", employee.experience);
  
  // Append skills array as JSON string
employee.skills.forEach(skill => formData.append("skills", skill));

  formData.append("managerId", managerId);

  if (employee.certification) {
    formData.append("certification", employee.certification);
  }

  // Append image file - assuming you have an image file in employee.image
  if (employee.image) {
    formData.append("image", employee.image);
  }

  try {
    const response = await axios.post("api/employees/addemployee", formData, {
      headers: { "Content-Type": "multipart/form-data" },
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
        managerId: "",
        certification: null,
        image: null, // reset image too
      });
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      showSnackbar("Something went wrong! Please try again.");
    }
  } catch (error) {
    console.error("Error submitting employee profile:", error);
    showSnackbar("Error submitting employee profile. Please try again later.");
  }
};


  useEffect(() => {
    const fetchManagerName = async () => {
      try {
        const res = await axios.get(`/api/managers/${managerId}`);
        setManagerName(res.data.name);
      } catch (error) {
        console.error("Error fetching manager name", error);
      }
    };

    if (managerId) {
      fetchManagerName();
    }
  }, [managerId]);

  return (
    <Layout>
<Typography
  variant="h4"
  sx={{
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "2rem",
    color: "primary.main",
    textTransform: "uppercase",
    letterSpacing: "2px",
    mt: 2,  // Reduced margin-top
    mb: 1,  // Reduced margin-bottom
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
  }}
>
  Employee Creation
</Typography>

      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default" p={2}>
      

        <Box sx={{ width: "100%", maxWidth: 900 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step>
              <StepLabel>Personal Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Working Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Skills</StepLabel>
            </Step>
          </Stepper>

          <Box mt={2}>
            <form onSubmit={handleSubmit}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={3}>
                  {activeStep === 0 && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Name"
                          name="name"
                          value={employee.name}
                          onChange={handleChange}
                          required
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
                          required
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
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </>
                  )}
                  {activeStep === 1 && (
                    <>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Role" name="role" value={employee.role} onChange={handleChange} required />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Designation" name="designation" value={employee.designation} onChange={handleChange} required />
                      </Grid>
                      <Grid item xs={6}>
                        <DatePicker
                          label="Joining Date"
                          value={employee.joiningDate}
                          onChange={(date) => setEmployee({ ...employee, joiningDate: date })}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                          required
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Experience (in years)" name="experience" value={employee.experience} onChange={handleChange} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">Upload Profile Image</Typography>
                        <Button variant="outlined" component="label">
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => setEmployee({ ...employee, image: e.target.files[0] })}
                          />
                        </Button>
                        {employee.image && (
                          <Typography variant="body2" color="textSecondary">
                            Selected: {employee.image.name}
                          </Typography>
                        )}
                      </Grid>

                    </>
                  )}
                  {activeStep === 2 && (
                    <>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id="skill-set-label">Skill Set</InputLabel>
                          <Select
                            labelId="skill-set-label"
                            multiple
                            name="skills"
                            value={employee.skills}
                            onChange={handleSkillChange}
                            required
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
                    </>
                  )}
                  <Grid item xs={12} mt={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0}>
                        Back
                      </Button>
                      {activeStep === 2 ? (
                        <Button variant="contained" color="primary" type="submit">
                          Submit
                        </Button>
                      ) : (
                        <Button variant="contained" color="primary" onClick={handleNext}>
                          Next
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </form>
          </Box>

          {/* Snackbar (Aligned to the right and larger size) */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "500px", fontSize: "1.1rem" }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Layout>
  );
};

export default Employee;

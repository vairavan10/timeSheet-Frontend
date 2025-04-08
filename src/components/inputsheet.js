import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./layout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


const InputSheet = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedEmail = storedUser ? storedUser.email : "";

  const [formData, setFormData] = useState({
    date: "",
    name: "",
    project: "",
    hours: "",
    workDone: "",
    extraActivity: "",
    typeOfWork: "regular",
    leaveType: "",
    email: storedEmail
  });

  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [extraActivityList, setExtraActivityList] = useState([]);

  const [isProjectDisabled, setIsProjectDisabled] = useState(false);
  const [isExtraActivityDisabled, setIsExtraActivityDisabled] = useState(false);
  const [isHoursDisabled, setIsHoursDisabled] = useState(false);

  const dateInputRef = useRef(null);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, projectsRes, extraActivityRes] = await Promise.all([
          axios.get("api/employees/list"),
          axios.get("api/project"),
          axios.get("api/extra-activities")
        ]);
        setEmployeeList(employeesRes.data.data || []);
        setProjectList(projectsRes.data.data || []);
        setExtraActivityList(extraActivityRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    if (name === "typeOfWork") {
      if (value === "leave") {
        updatedForm.project = "";
        updatedForm.extraActivity = "";
        updatedForm.hours = "";
        setIsProjectDisabled(true);
        setIsExtraActivityDisabled(true);
        setIsHoursDisabled(true);
      } else {
        setIsProjectDisabled(false);
        setIsExtraActivityDisabled(false);
        setIsHoursDisabled(false);
      }
    }

    if (name === "project") {
      if (value === "") {
        setIsExtraActivityDisabled(false);
      } else {
        updatedForm.extraActivity = "";
        setIsExtraActivityDisabled(true);
      }
    }

    if (name === "extraActivity") {
      if (value === "") {
        setIsProjectDisabled(false);
      } else {
        updatedForm.project = "";
        setIsProjectDisabled(true);
      }
    }
   

    setFormData(updatedForm);
  };
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" // 'error', 'warning', 'info', 'success'
  });
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
      

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("api/timesheet/addtimesheet", formData);
      if (response.status === 201) {
        setSnackbar({
          open: true,
          message: "Time Sheet Submitted Successfully!",
          severity: "success"
        });
        setFormData({
          date: "",
          name: "",
          project: "",
          hours: "",
          workDone: "",
          extraActivity: "",
          typeOfWork: "regular",
          leaveType: "",
          email: storedEmail
        });
        setTimeout(() => navigate("/dashboard"), 1000); 
      } else {
        setSnackbar({
          open: true,
          message: "Something went wrong! Please try again.",
          severity: "error"
        });
      }
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      setSnackbar({
        open: true,
        message: "Error submitting timesheet. Please try again later.",
        severity: "error"
      });
    }
  };
  
  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleDateClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Card elevation={4} sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              Submit Time Sheet
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <Grid container spacing={2}>
                {/* Date */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    inputRef={dateInputRef}
                    name="date"
                    label="Select Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.date}
                    onChange={handleChange}
                    fullWidth
                    required
                    onClick={handleDateClick}
                  />
                </Grid>

                {/* Name */}
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    fullWidth
                    options={employeeList}
                    getOptionLabel={(option) => `${option.name} - ${option.role}`}
                    value={employeeList.find((emp) => emp.name === formData.name) || null}
                    onChange={(event, newValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: newValue ? newValue.name : ""
                      }))
                    }
                    renderInput={(params) => <TextField {...params} label="Employee Name" required />}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                  />
                </Grid>

                {/* Type of Work */}
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Type of Work</InputLabel>
                    <Select
                      name="typeOfWork"
                      value={formData.typeOfWork}
                      onChange={handleChange}
                      label="Type of Work"
                    >
                      <MenuItem value="regular">Regular Work</MenuItem>
                      <MenuItem value="leave">Leave</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Leave Type */}
                {formData.typeOfWork === "leave" && (
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Leave Type</InputLabel>
                      <Select
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleChange}
                        label="Leave Type"
                      >
                        <MenuItem value="half">Half Day</MenuItem>
                        <MenuItem value="full">Full Day</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {/* Project */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required disabled={isProjectDisabled}>
                    <InputLabel>Project</InputLabel>
                    <Select
                      name="project"
                      value={formData.project || ""}
                      onChange={handleChange}
                      label="Project"
                    >
                      <MenuItem value="">-- Select Project --</MenuItem>
                      {projectList.map((project) => (
                        <MenuItem key={project._id} value={project._id}>
                          {project.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Extra Activity */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={isExtraActivityDisabled}>
                    <InputLabel>Extra Activity</InputLabel>
                    <Select
                      name="extraActivity"
                      value={formData.extraActivity}
                      onChange={handleChange}
                      label="Extra Activity"
                    >
                      <MenuItem value="">-- Select Extra Activity --</MenuItem>
                      {extraActivityList.map((activity) => (
                        <MenuItem key={activity._id} value={activity.name}>
                          {activity.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Work Done */}
                <Grid item xs={12}>
                  <TextField
                    name="workDone"
                    label={formData.typeOfWork === "leave" ? "Reason for Leave" : "Work Description"}
                    multiline
                    rows={4}
                    value={formData.workDone}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                {/* Hours Worked */}
                <Grid item xs={12}>
                  <TextField
                    name="hours"
                    label="Number of Hours Worked"
                    type="number"
                    value={formData.hours}
                    onChange={handleChange}
                    inputProps={{ min: 0 }}
                    fullWidth
                    required
                    disabled={isHoursDisabled}
                  />
                </Grid>

                {/* Buttons */}
                <Grid item xs={12} sm={6}>
                  <Button variant="outlined" fullWidth color="secondary" onClick={handleBack}>
                    Back
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button variant="contained" fullWidth color="primary" type="submit">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
>
  <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
    {snackbar.message}
  </Alert>
</Snackbar>

    </Layout>
  );
};

export default InputSheet;

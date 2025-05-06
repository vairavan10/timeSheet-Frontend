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
  Divider,
  Snackbar
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./layout";
import MuiAlert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
          axios.get(`/api/employees/fulllist`),
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
    severity: "success"
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
          message: "✅ Time Sheet Submitted Successfully!",
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
        throw new Error();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "❌ Error submitting timesheet. Please try again.",
        severity: "error"
      });
    }
  };

  const handleBack = () => navigate("/dashboard");
  const handleDateClick = () => dateInputRef.current?.showPicker();

  return (
    <Layout>
      <Container
        maxWidth="md"
        sx={{
          mt: 6,
          mb: 6,
          background: "linear-gradient(to bottom, #f4f6f8, #e3e7ec)",
          borderRadius: 4,
          p: 3,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
        }}
      >
        <Card sx={{ borderRadius: 4, boxShadow: 4 }}>
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              sx={{ fontWeight: "bold", mb: 3, color: "#333" }}
            >
              🕒 Daily Time Sheet Entry
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    inputRef={dateInputRef}
                    name="date"
                    label="📅 Select Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.date}
                    onChange={handleChange}
                    fullWidth
                    onClick={handleDateClick}
                    required
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                  />
                </Grid>

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
                    renderInput={(params) => (
                      <TextField {...params} label="👤 Employee Name" required sx={{ backgroundColor: "#fff", borderRadius: 1 }} />
                    )}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
                    <InputLabel>💼 Type of Work</InputLabel>
                    <Select
                      name="typeOfWork"
                      value={formData.typeOfWork}
                      onChange={handleChange}
                      MenuProps={{
                        PaperProps: { sx: { zIndex: 1500 } }
                      }}
                    >
                      <MenuItem value="regular">Regular Work</MenuItem>
                      <MenuItem value="leave">Leave</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {formData.typeOfWork === "leave" && (
                  <Grid item xs={12}>
                    <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
                      <InputLabel>🌴 Leave Type</InputLabel>
                      <Select
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleChange}
                      >
                        <MenuItem value="half">Half Day</MenuItem>
                        <MenuItem value="full">Full Day</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required disabled={isProjectDisabled} sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
                    <InputLabel>📁 Project</InputLabel>
                    <Select
                      name="project"
                      value={formData.project || ""}
                      onChange={handleChange}
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

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={isExtraActivityDisabled} sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
                    <InputLabel>🎯 Extra Activity</InputLabel>
                    <Select
                      name="extraActivity"
                      value={formData.extraActivity}
                      onChange={handleChange}
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

                <Grid item xs={12}>
                  <TextField
                    name="workDone"
                    label={
                      formData.typeOfWork === "leave"
                        ? "✍️ Reason for Leave"
                        : "📝 Work Description"
                    }
                    multiline
                    rows={4}
                    value={formData.workDone}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="hours"
                    label="⏱️ Hours Worked"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={formData.hours}
                    onChange={handleChange}
                    fullWidth
                    disabled={isHoursDisabled}
                    required
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    color="secondary"
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{ height: 50 }}
                  >
                    Back to Dashboard
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    type="submit"
                    startIcon={<CheckCircleIcon />}
                    sx={{
                      height: 50,
                      backgroundColor: "#4caf50",
                      "&:hover": {
                        backgroundColor: "#388e3c"
                      }
                    }}
                  >
                    Submit Timesheet
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default InputSheet;

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
  Grid
} from "@mui/material";
import SideMenu from "./sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "./layout";

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
    typeOfWork: "regular",  // 👈 add this
    leaveType: "",          // 👈 add this
    email: storedEmail
  });
  

  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const dateInputRef = useRef(null);
  const [extraActivityList, setExtraActivityList] = useState([]);
  const [isProjectDisabled, setIsProjectDisabled] = useState(false);
const [isExtraActivityDisabled, setIsExtraActivityDisabled] = useState(false);
const [isHoursDisabled, setIsHoursDisabled] = useState(false);



  // Fetch Employees and Projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, projectsRes, extraActivityRes] = await Promise.all([
          axios.get("http://localhost:8080/api/employees/list"),
          axios.get("http://localhost:8080/api/project"),
          axios.get("http://localhost:8080/api/extra-activities") // ✅ your GET API
        ]);
  
        setEmployeeList(employeesRes.data.data || []);
        setProjectList(projectsRes.data.data || []);
        setExtraActivityList(extraActivityRes.data || []); // ✅
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };
  
    // Logic for Type of Work
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
  
    // Logic for Project and Extra Activity conflict
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
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting form data:", formData);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/timesheet/addtimesheet",
        formData
      );

      if (response.status === 201) {
        alert("Time Sheet Submitted Successfully!");
        setFormData({
          date: "",
          name: "",
          project: "",
          hours: "",
          workDone: "",
          email: storedEmail
        });
        navigate("/dashboard");
      } else {
        alert("Something went wrong! Please try again.");
      }
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      alert("Error submitting timesheet. Please try again later.");
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
    <>
      {/* <SideMenu /> */}
      <Layout>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Time Sheet
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            mt: 4
          }}
        >
          {/* Date Field */}
          <Box onClick={handleDateClick}>
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
              sx={{ cursor: "pointer" }}
            />
          </Box>

          {/* Name Dropdown */}
          <FormControl fullWidth required>
            <InputLabel id="name-label">Name</InputLabel>
            <Select
              labelId="name-label"
              name="name"
              value={formData.name}
              label="Name"
              onChange={handleChange}
            >
              {employeeList.length > 0 ? (
                employeeList.map((employee) => (
                  <MenuItem key={employee._id} value={employee.name}>
                    {employee.name} - {employee.role}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Employees Found</MenuItem>
              )}
            </Select>
          </FormControl>
          {/* Type of Work */}
<FormControl fullWidth required>
  <InputLabel id="typeOfWork-label">Type of Work</InputLabel>
  <Select
    labelId="typeOfWork-label"
    name="typeOfWork"
    value={formData.typeOfWork}
    label="Type of Work"
    onChange={handleChange}
  >
    <MenuItem value="regular">Regular Work</MenuItem>
    <MenuItem value="leave">Leave</MenuItem>
  </Select>
</FormControl>

{/* Leave Type (Only when Leave is selected) */}
{formData.typeOfWork === "leave" && (
  <FormControl fullWidth required>
    <InputLabel id="leaveType-label">Leave Type</InputLabel>
    <Select
      labelId="leaveType-label"
      name="leaveType"
      value={formData.leaveType}
      label="Leave Type"
      onChange={handleChange}
    >
      <MenuItem value="half">Half Day</MenuItem>
      <MenuItem value="full">Full Day</MenuItem>
    </Select>
  </FormControl>
)}


          {/* Project Dropdown */}
          <FormControl fullWidth required disabled={isProjectDisabled}>
  <InputLabel id="project-label">Project</InputLabel>
  <Select
    labelId="project-label"
    name="project"
    value={formData.project || ""}
    label="Project"
    onChange={handleChange}
  >
     <MenuItem value="">-- Select Project --</MenuItem>
    {projectList.length > 0 ? (
      projectList.map((project) => (
        
        <MenuItem key={project._id} value={project._id}>
          {project.name}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No Projects Found</MenuItem>
    )}
  </Select>
</FormControl>


          {/* Work Done Field */}
          <TextField
            name="workDone"
            label="Work Done"
            multiline
            rows={4}
            value={formData.workDone}
            onChange={handleChange}
            fullWidth
            required
          />
         <FormControl fullWidth disabled={isExtraActivityDisabled}>
  <InputLabel id="extra-activity-label">Extra Activity</InputLabel>
  <Select
    labelId="extra-activity-label"
    name="extraActivity"
    value={formData.extraActivity}
    label="Extra Activity"
    onChange={handleChange}
  >
    <MenuItem value="">-- Select Extra Activity --</MenuItem>

    {extraActivityList.length > 0 ? (
      extraActivityList.map((activity) => (
        <MenuItem key={activity._id} value={activity.name}>
          {activity.name}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No Extra Activities Found</MenuItem>
    )}
  </Select>
</FormControl>


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

          {/* Buttons */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Button
                onClick={handleBack}
                variant="outlined"
                color="secondary"
                fullWidth
              >
                Back
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      </Layout>
    </>
  );
};

export default InputSheet;

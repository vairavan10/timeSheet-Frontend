import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaBriefcase,
  FaCalendarAlt,
  FaUsersCog,
  FaLaptopCode,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Layout from "./layout";
import {
  Avatar,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Paper,
  useTheme,
  Button,
  Snackbar,
  Alert,
  Tooltip,
  Chip,
  Divider,
  Stack
} from "@mui/material";

const iconStyle = { marginRight: 12 };

const waveAnimation = {
  initial: { rotate: 0 },
  hover: {
    rotate: [0, 15, -15, 15, -15, 0],
    transition: { duration: 1, repeat: Infinity, repeatDelay: 1 },
  },
};
const skillColors = [
  "#FF8A80", "#EA80FC", "#8C9EFF", "#80D8FF",
  "#A7FFEB", "#CCFF90", "#FFFF8D", "#FFD180",
  "#FF9E80"
];

const ProfileItem = ({ icon, label, onCopy, hoverMessage, theme }) => (
  <Tooltip title={hoverMessage} arrow placement="right">
    <motion.div
      whileHover={{ scale: 1.05, x: 5 }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: theme.palette.mode === "dark" ? "#0d47a1" : "#e3f2fd",
        padding: "12px 20px",
        borderRadius: 15,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 8px rgba(255,255,255,0.05)"
            : "0 4px 8px rgba(0,0,0,0.05)",
        cursor: "pointer",
        userSelect: "text",
      }}
    >
      {icon}
      <Typography
        variant="body1"
        sx={{
          flexGrow: 1,
          fontWeight: 600,
          color: theme.palette.mode === "dark" ? "#bbdefb" : "#1565c0",
        }}
      >
        {label}
      </Typography>
      <Button
        variant="contained"
        size="small"
        onClick={onCopy}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          "&:hover": { backgroundColor: theme.palette.primary.dark },
          borderRadius: 8,
          textTransform: "none",
          fontWeight: "bold",
        }}
      >
        Copy
      </Button>
    </motion.div>
  </Tooltip>
);

const Profile = () => {
  const theme = useTheme();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchEmployee = async () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData?.id) {
        setError("No employee ID found.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/employees/${userData.id}`);
        console.log("skillsss",res.data)
        if (res.status === 200) {
           if (typeof res.data.skills === "string") {
    try {
      console.log("res.data.skills",res.data.skills)
      res.data.skills = JSON.parse(res.data.skills);
      console.log("res.data.skills",res.data.skills)
    } catch {
      res.data.skills = [];
    }
  }

          setEmployee(res.data);
        } else {
          setError("Employee not found.");
        }
      } catch {
        setError("Error fetching employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, []);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({ open: true, message: `${label} copied to clipboard`, severity: "success" });
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const formattedDate = employee?.joiningDate
    ? new Date(employee.joiningDate).toLocaleDateString("en-GB")
    : "";

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Typography align="center" mt={5} color="error">
        {error}
      </Typography>
    );

  const iconColor = theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main;
  const paperBgColor = theme.palette.background.paper;
  const boxBgColor = theme.palette.background.default;
  const textSecondary = theme.palette.text.secondary;

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: boxBgColor,
          p: { xs: 2, md: 4 },
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        {/* Sidebar with Avatar and Main Info */}
        <Paper
          elevation={10}
          sx={{
            width: { xs: "100%", md: 320 },
            p: 4,
            borderRadius: 4,
            bgcolor: paperBgColor,
            textAlign: "center",
            boxShadow: theme.shadows[8],
            position: "sticky",
            top: 20,
            height: "fit-content",
          }}
        >
          <motion.div
            initial="initial"
            whileHover="hover"
            style={{ display: "inline-block", cursor: "pointer", position: "relative" }}
          >
            <motion.div variants={waveAnimation}>
            <Avatar
            src={
              employee.image
                ? `${axios.defaults.baseURL}${employee.image.replace(/\\/g, '/')}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random`
            }
            alt={employee.name}
            sx={{
              width: 140,
              height: 140,
              mb: 2,
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              border: '3px solid #1976d2', // MUI default primary blue hex color
            }}
          />

            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              variants={{
                hover: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                initial: { opacity: 0, y: 10 },
              }}
              style={{
                position: "absolute",
                top: "-45px",
                left: "50%",
                transform: "translateX(-50%)",
                background: iconColor,
                color: theme.palette.getContrastText(iconColor),
                padding: "8px 16px",
                borderRadius: "24px",
                fontWeight: "bold",
                fontSize: "1.2rem",
                boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
                pointerEvents: "none",
              }}
            >
              Hi! 👋
            </motion.div>
          </motion.div>

          <Typography
            variant="h4"
            fontWeight={700}
            color={theme.palette.mode === "dark" ? "#90caf9" : "#1976d2"}
            mt={3}
            sx={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
          >
            {employee.name}
          </Typography>
          <Typography variant="h6" color={textSecondary} sx={{ fontStyle: "italic", fontWeight: 600, mb: 3 }}>
            {employee.role}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Contact Info */}
          <Box display="flex" flexDirection="column" gap={2}>
            {[{
              icon: <FaEnvelope style={{ ...iconStyle, color: iconColor }} />,
              label: employee.email,
              hoverMessage: "Send me an email!",
              copyLabel: "Email",
            },{
              icon: <FaPhoneAlt style={{ ...iconStyle, color: iconColor }} />,
              label: employee.phone,
              hoverMessage: "Give me a call!",
              copyLabel: "Phone",
            },{
              icon: <FaMapMarkerAlt style={{ ...iconStyle, color: iconColor }} />,
              label: employee.location,
              hoverMessage: "Where I am based.",
              copyLabel: "Location",
            }].map(({ icon, label, hoverMessage, copyLabel }) => (
              <ProfileItem
                key={label}
                icon={icon}
                label={label}
                hoverMessage={hoverMessage}
                onCopy={() => handleCopy(label, copyLabel)}
                theme={theme}
              />
            ))}
          </Box>
        </Paper>

        {/* Main Content: About, Skills, Experience, Projects */}
        <Box
          sx={{
            flex: 1,
            maxWidth: 700,
          }}
        >
          <Paper
            elevation={10}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 4,
              bgcolor: paperBgColor,
              boxShadow: theme.shadows[8],
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={2} color={iconColor}>
              About Me
            </Typography>
            <Typography variant="body1" color={textSecondary} sx={{ whiteSpace: "pre-line" }}>
              {employee.about || "No about me description available. You can add a summary here to showcase your background, interests, and goals."}
            </Typography>
          </Paper>

          <Paper
            elevation={10}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 4,
              bgcolor: paperBgColor,
              boxShadow: theme.shadows[8],
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={2} color={iconColor}>
              Skills
            </Typography>
<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
  {Array.isArray(employee.skills) && employee.skills.length > 0 ? (
    employee.skills.map((skill) => (
      <Chip
        key={skill}
        label={skill}
        color="primary"
        variant={theme.palette.mode === "dark" ? "filled" : "outlined"}
        sx={{ fontWeight: "bold" }}
      />
    ))
  ) : (
    <Typography color={textSecondary}>No skills listed.</Typography>
  )}
</Box>




          </Paper>

          <Paper
            elevation={10}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 4,
              bgcolor: paperBgColor,
              boxShadow: theme.shadows[8],
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={3} color={iconColor}>
              Experience & Details
            </Typography>

            <Box display="flex" flexDirection="column" gap={3}>
              {[{
                icon: <FaBriefcase style={{ ...iconStyle, color: iconColor }} />,
                label: `Designation: ${employee.designation}`,
                hoverMessage: "My professional title.",
                copyLabel: "Designation",
              },{
                icon: <FaCalendarAlt style={{ ...iconStyle, color: iconColor }} />,
                label: `Joined: ${formattedDate}`,
                hoverMessage: "My first day here!",
                copyLabel: "Joining Date",
              },{
                icon: <FaUsersCog style={{ ...iconStyle, color: iconColor }} />,
                label: `Experience: ${employee.experience} years`,
                hoverMessage: "Years of expertise.",
                copyLabel: "Experience",
              }].map(({ icon, label, hoverMessage, copyLabel }) => (
                <ProfileItem
                  key={label}
                  icon={icon}
                  label={label}
                  hoverMessage={hoverMessage}
                  onCopy={() => handleCopy(label, copyLabel)}
                  theme={theme}
                />
              ))}
            </Box>
          </Paper>

          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 4,
              bgcolor: paperBgColor,
              boxShadow: theme.shadows[8],
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={2} color={iconColor}>
              Projects
            </Typography>
            {/* Placeholder for projects - you can fill with real data */}
            <Typography color={textSecondary} fontStyle="italic">
              No projects added yet. This is where you can showcase your work, contributions, or portfolio pieces.
            </Typography>
          </Paper>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Profile;

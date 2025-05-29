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
} from "@mui/material";

const iconStyle = { marginRight: 12 };

const waveAnimation = {
  initial: { rotate: 0 },
  hover: {
    rotate: [0, 15, -15, 15, -15, 0],
    transition: { duration: 1, repeat: Infinity, repeatDelay: 1 },
  },
};

// ProfileItem component must be defined **before** use inside Profile
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
      }}
    >
      {icon}
      <Typography
        variant="body1"
        sx={{
          flexGrow: 1,
          userSelect: "text",
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
        if (res.status === 200) {
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
          alignItems: "center",
        }}
      >
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Paper
            elevation={12}
            sx={{
              maxWidth: 900,
              p: { xs: 3, md: 6 },
              borderRadius: 4,
              bgcolor: paperBgColor,
              boxShadow: theme.shadows[12],
            }}
          >
            <Grid container spacing={5} alignItems="center">
              {/* Avatar */}
              <Grid item xs={12} md={4} textAlign="center">
                <motion.div
                  initial="initial"
                  whileHover="hover"
                  style={{ display: "inline-block", cursor: "pointer", position: "relative" }}
                >
                  <motion.div variants={waveAnimation}>
                    <Avatar
                      src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      sx={{
                        width: 160,
                        height: 160,
                        mx: "auto",
                        boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
                        border: `4px solid ${iconColor}`,
                      }}
                      alt="Profile"
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
                      top: "-40px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: iconColor,
                      color: theme.palette.getContrastText(iconColor),
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
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
                  mt={2}
                  sx={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
                >
                  {employee.name}
                </Typography>
                <Typography variant="subtitle1" color={textSecondary} sx={{ fontStyle: "italic", fontWeight: 600 }}>
                  {employee.role}
                </Typography>
              </Grid>

              {/* Profile details */}
              <Grid item xs={12} md={8}>
                <Box display="flex" flexDirection="column" gap={3}>
                  {[
                    {
                      icon: <FaEnvelope style={{ ...iconStyle, color: iconColor }} />,
                      label: employee.email,
                      hoverMessage: "Send me an email!",
                      copyLabel: "Email",
                    },
                    {
                      icon: <FaPhoneAlt style={{ ...iconStyle, color: iconColor }} />,
                      label: employee.phone,
                      hoverMessage: "Give me a call!",
                      copyLabel: "Phone",
                    },
                    {
                      icon: <FaBriefcase style={{ ...iconStyle, color: iconColor }} />,
                      label: `Designation: ${employee.designation}`,
                      hoverMessage: "My professional title.",
                      copyLabel: "Designation",
                    },
                    {
                      icon: <FaCalendarAlt style={{ ...iconStyle, color: iconColor }} />,
                      label: `Joined: ${formattedDate}`,
                      hoverMessage: "My first day here!",
                      copyLabel: "Joining Date",
                    },
                    {
                      icon: <FaUsersCog style={{ ...iconStyle, color: iconColor }} />,
                      label: `Experience: ${employee.experience} years`,
                      hoverMessage: "Years of expertise.",
                      copyLabel: "Experience",
                    },
                    {
                      icon: <FaLaptopCode style={{ ...iconStyle, color: iconColor }} />,
                      label: `Skills: ${employee.skills.join(", ")}`,
                      hoverMessage: "My tech stack.",
                      copyLabel: "Skills",
                    },
                    {
                      icon: <FaMapMarkerAlt style={{ ...iconStyle, color: iconColor }} />,
                      label: `Location: ${employee.location}`,
                      hoverMessage: "Where I am based.",
                      copyLabel: "Location",
                    },
                  ].map(({ icon, label, hoverMessage, copyLabel }) => (
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
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Profile;

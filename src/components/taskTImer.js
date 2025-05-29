import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Layout from "./layout";
import Confetti from "react-confetti";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import humanImg from "../asset/human.png"; 
import { Button, Snackbar, Alert } from "@mui/material";
const TaskTimer = () => {
  const [taskName, setTaskName] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [showConfetti, setShowConfetti] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false); 
    const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [snackbarOpen, setSnackbarOpen] = useState(false);


  useEffect(() => {
    axios
      .get("/api/project")
      .then((res) => setProjects(res.data.data))
      .catch((err) => {
        console.error(err);
        showSnackbar("Failed to load projects", "error");
      });
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isPaused]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      setShowPopup(true);
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isRunning, isPaused]);

  // Snackbar helper function
  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleStart = () => {
    if (!taskName.trim()) {
      showSnackbar("Please enter a task name.", "error");
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
    showSnackbar("Timer started!", "success");
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    showSnackbar(isPaused ? "Timer resumed" : "Timer paused", "info");
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    showSnackbar("Timer stopped", "warning");
  };

  const handleSubmit = async () => {
    if (!taskName.trim() || elapsedTime === 0) {
      showSnackbar(
        "Start the timer and enter the task name before submitting.",
        "error"
      );
      return;
    }
    try {
      await axios.post("/api/timesheet/addtimesheet", {
        date: new Date().toISOString().slice(0, 10),
        name: storedUser.name,
        project: selectedProject || null,
        hours: elapsedTime / 3600,
        workDone: taskName,
        extraActivity: null,
        email: storedUser.email,
        typeOfWork: "regular",
        leaveType: null,
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      showSnackbar("🎉 Task submitted successfully!", "success");

      setTaskName("");
      setElapsedTime(0);
      setSelectedProject("");
      setIsRunning(false);
      setIsPaused(false);
    } catch (err) {
      console.error(err);
      showSnackbar("Error submitting task.", "error");
    }
  };

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const maxSeconds = 7200; // 2 hours max
  const progress = Math.min(elapsedTime / maxSeconds, 1);

  const timeEmoji =
    elapsedTime < 60
      ? "⏳"
      : elapsedTime < 300
      ? "🔥"
      : elapsedTime < 900
      ? "🚀"
      : elapsedTime < 1800
      ? "💪"
      : "🏆";

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };


  return (
    <Layout>
      <div
        style={{
          ...styles.pageContainer,
          background: darkMode ? "#121212" : "#f4f6f8",
          color: darkMode ? "#eee" : "#333",
          position: "relative",
        }}
      >
        <header style={styles.header}>
          <h1 style={{ userSelect: "none" }}>🕒 Task Timer {timeEmoji}</h1>
        </header>

        <main style={styles.mainContent}>
          <section
            style={{
              ...styles.leftPanel,
              backgroundColor: darkMode ? "#1e1e1e" : "#fff",
              color: darkMode ? "#eee" : "#333",
            }}
          >
            <FormControl fullWidth variant="outlined" size="small" style={{ marginBottom: 16 }}>
              <InputLabel style={{ color: darkMode ? "#eee" : "#333" }}>Select Project</InputLabel>
              <Select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                label="Select Project"
                style={{
                  backgroundColor: darkMode ? "#333" : "#fff",
                  color: darkMode ? "#eee" : "#333",
                }}
              >
                <MenuItem value="">-- Select Project --</MenuItem>
                {projects.map((proj) => (
                  <MenuItem key={proj._id} value={proj._id}>
                    {proj.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <label style={styles.label}>
              Task Name:
              <input
                type="text"
                placeholder="Enter task name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                disabled={isRunning}
                style={{
                  ...styles.input,
                  backgroundColor: darkMode ? "#333" : "#fff",
                  color: darkMode ? "#eee" : "#333",
                  borderColor: darkMode ? "#555" : "#ccc",
                }}
              />
            </label>

            {/* Buttons container */}
            <div style={styles.buttonsContainer}>
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  style={{ ...styles.startButton, ...styles.animatedButton }}
                >
                  Start
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePauseResume}
                    style={{ ...styles.pauseButton, ...styles.animatedButton }}
                  >
                    {isPaused ? "Resume" : "Pause"}
                  </button>
                  <button
                    onClick={handleStop}
                    style={{ ...styles.stopButton, ...styles.animatedButton }}
                  >
                    Stop
                  </button>
                </>
              )}

              <button
                onClick={handleSubmit}
                disabled={isRunning || elapsedTime === 0 || !taskName.trim()}
                style={{
                  ...styles.submitButton,
                  ...styles.animatedButton,
                  opacity:
                    !isRunning && elapsedTime !== 0 && taskName.trim() ? 1 : 0.5,
                  cursor:
                    !isRunning && elapsedTime !== 0 && taskName.trim()
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                Submit
              </button>
            </div>
          </section>

          <section
            style={{
              ...styles.rightPanel,
              backgroundColor: darkMode ? "#1e1e1e" : "#fff",
            }}
          >
            <div style={styles.timerWrapper}>
              <svg
                viewBox="0 0 36 36"
                style={{
                  transform: "rotate(0deg)",
                  width: "200px",
                  height: "200px",
                }}
              >
                <path
                  d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={darkMode ? "#444" : "#eee"}
                  strokeWidth="3.8"
                />
                <path
                  d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  strokeDasharray={`${progress * 100}, 100`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 1s linear" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3a86ff" />
                    <stop offset="100%" stopColor="#00c7f2" />
                  </linearGradient>
                </defs>
                <text
                  x="18"
                  y="20.35"
                  style={{
                    fill: darkMode ? "#eee" : "#333",
                    fontSize: "7px",
                    textAnchor: "middle",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {formatTime(elapsedTime)}
                </text>
              </svg>
            </div>

            {/* Dark mode toggle */}
            {/* <div style={{ marginTop: 10 }}>
              <label style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />{" "}
                Dark Mode
              </label>
            </div> */}
          </section>

        {/* Popup animation */}
        {showPopup && (
          <div style={popupStyles.container}>
            <img
              src={humanImg}
              alt="Human animation"
              style={popupStyles.image}
            />
            <div style={popupStyles.text}>The task is started</div>
          </div>
        )}

        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      </main>

      {/* Global CSS animations injected */}
      <style>{`
        @keyframes fadeInOut {
          0% {opacity: 0; transform: translateY(20px);}
          10% {opacity: 1; transform: translateY(0);}
          90% {opacity: 1; transform: translateY(0);}
          100% {opacity: 0; transform: translateY(-20px);}
        }
        @keyframes popScale {
          0% {transform: scale(0.5);}
          50% {transform: scale(1.1);}
          100% {transform: scale(1);}
        }
      `}</style>
    </div>
    </Layout>
  );
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  mainContent: {
    display: "flex",
    flexDirection: "row",
    gap: "2rem",
    maxWidth: "1200px",
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  leftPanel: {
    flex: "1 1 350px",
    padding: "24px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  },
  rightPanel: {
    flex: "1 1 300px",
    padding: "24px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    display: "block",
    fontWeight: "600",
    margin: "12px 0 6px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
    marginTop: "4px",
    outline: "none",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: "20px",
    gap: "10px",
  },
  startButton: {
    backgroundColor: "#3a86ff",
    color: "#fff",
  },
  pauseButton: {
    backgroundColor: "#ffc300",
    color: "#fff",
  },
  stopButton: {
    backgroundColor: "#ef233c",
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#06d6a0",
    color: "#fff",
    flexGrow: 1,
  },
  animatedButton: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  timerWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

const popupStyles = {
  container: {
    position: "fixed",
    bottom: "40px",
    right: "40px",
    backgroundColor: "#ffffffee",
    padding: "16px 24px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    animation: "fadeInOut 3s ease-in-out",
    zIndex: 9999,
  },
  image: {
    width: "40px",
    height: "40px",
  },
  text: {
    fontWeight: "600",
    fontSize: "16px",
    color: "#333",
  },
};


export default TaskTimer;

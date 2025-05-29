import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Layout from "./layout";
import Confetti from "react-confetti";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import humanImg from "../"; // Import your image

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
  const [showPopup, setShowPopup] = useState(false); // New state for popup

  // Fetch projects once
  useEffect(() => {
    axios
      .get("/api/project")
      .then((res) => setProjects(res.data.data))
      .catch(console.error);
  }, []);

  // Timer logic
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

  // Show popup animation when task starts
  useEffect(() => {
    if (isRunning && !isPaused) {
      setShowPopup(true);
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000); // Popup visible for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isRunning, isPaused]);

  // Handle start with popup
  const handleStart = () => {
    if (!taskName.trim()) return alert("Please enter a task name.");
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
  };

  // On submit, show confetti celebration and reset
  const handleSubmit = async () => {
    if (!taskName.trim() || elapsedTime === 0) {
      return alert("Start the timer and enter the task name before submitting.");
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
      alert("🎉 Task submitted successfully!");
      setTaskName("");
      setElapsedTime(0);
      setSelectedProject("");
    } catch (err) {
      console.error(err);
      alert("Error submitting task.");
    }
  };

  // Format seconds into HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const maxSeconds = 7200; // 2 hours max
  const progress = Math.min(elapsedTime / maxSeconds, 1);

  // Emoji feedback based on elapsed time
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
                  transform: "rotate(-90deg)",
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
            <div style={{ marginTop: 10 }}>
              <label style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />{" "}
                Dark Mode
              </label>
            </div>
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

const popupStyles = {
  container: {
    position: "fixed",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: "12px",
    padding: "25px 35px",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.25)",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    animation: "fadeInOut 3s forwards",
  },
  image: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    marginBottom: "12px",
    animation: "popScale 0.7s ease-in-out",
    boxShadow: "0 0 12px #4caf50",
    objectFit: "cover",
  },
  text: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#4caf50",
    userSelect: "none",
  },
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
  },
  header: {
    marginBottom: "20px",
    textAlign: "center",
  },
  mainContent: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    flexGrow: 1,
  },
  leftPanel: {
    flex: "1 1 320px",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
  },
  rightPanel: {
    flex: "1 1 320px",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    display: "block",
    marginBottom: "12px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },
  buttonsContainer: {
    marginTop: "15px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  startButton: {
    backgroundColor: "#4caf50",
    border: "none",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
  pauseButton: {
    backgroundColor: "#fbc02d",
    border: "none",
    color: "#333",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
  stopButton: {
    backgroundColor: "#e53935",
    border: "none",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
  submitButton: {
    backgroundColor: "#3a86ff",
    border: "none",
    color: "white",
    padding: "10px 25px",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
  animatedButton: {
    transition: "transform 0.2s ease",
  },
  timerWrapper: {
    userSelect: "none",
  },
};

export default TaskTimer;

import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import humanImg from "../asset/human.png";

const TaskTimer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef(null);
  const circleRef = useRef(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  // Format time mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Start task and show popup animation emerging from timer circle
  const startTask = () => {
    if (!timerRunning) {
      setTimerRunning(true);

      // Get circle timer position to animate popup from there
      if (circleRef.current) {
        const rect = circleRef.current.getBoundingClientRect();
        setPopupPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }

      setShowPopup(true);

      // Hide popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  };

  const stopTask = () => {
    setTimerRunning(false);
    setElapsedTime(0);
    setShowConfetti(true);

    // Stop confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={{ textAlign: "center" }}>Task Timer</h1>
      <main style={styles.mainContent}>
        <section style={styles.leftPanel}>
          {/* Circle Timer */}
          <div
            ref={circleRef}
            style={{
              ...styles.circleTimer,
              userSelect: "none",
              cursor: "default",
            }}
            aria-label="Elapsed time timer"
          >
            {formatTime(elapsedTime)}
          </div>

          {/* Buttons */}
          <div style={styles.buttonsContainer}>
            <button onClick={startTask} style={styles.startButton} disabled={timerRunning}>
              Start Task
            </button>
            <button onClick={stopTask} style={styles.stopButton} disabled={!timerRunning}>
              Stop Task
            </button>
          </div>
        </section>

        {/* Popup animation */}
        {showPopup && (
          <PopupAnimation image={humanImg} position={popupPosition} />
        )}

        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      </main>

      {/* Global CSS animations */}
      <style>{`
        @keyframes popupGrowOut {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.1);
          }
          50% {
            opacity: 1;
            transform: translate(0, -40px) scale(1.2);
          }
          100% {
            opacity: 1;
            transform: translate(0, -60px) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

const PopupAnimation = ({ image, position }) => {
  // Position popup absolutely relative to viewport, starting exactly at timer center
  return (
    <div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        transformOrigin: "center bottom",
        animation: "popupGrowOut 3s forwards",
        zIndex: 10000,
        pointerEvents: "none",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img
        src={image}
        alt="Human animation"
        style={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          boxShadow: "0 0 12px #4caf50",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          marginTop: 12,
          fontSize: "1.3rem",
          fontWeight: "700",
          color: "#4caf50",
          userSelect: "none",
          textAlign: "center",
          textShadow: "0 0 5px #4caf50",
        }}
      >
        The task is started
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    fontFamily: "Arial, sans-serif",
  },
  mainContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    flexGrow: 1,
  },
  leftPanel: {
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  circleTimer: {
    width: 150,
    height: 150,
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #3a86ff 0%, #00c7f2 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2.8rem",
    color: "#fff",
    fontWeight: "700",
    userSelect: "none",
    margin: "0 auto 20px",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  startButton: {
    backgroundColor: "#4caf50",
    border: "none",
    color: "white",
    padding: "10px 25px",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
  stopButton: {
    backgroundColor: "#e53935",
    border: "none",
    color: "white",
    padding: "10px 25px",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
};

export default TaskTimer;

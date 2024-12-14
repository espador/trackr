import React, { useState, useEffect } from "react";
import "./App.css";

function Timer() {
  const [time, setTime] = useState(() => {
    // Retrieve saved elapsed time from localStorage (default to 0)
    const savedTime = localStorage.getItem("elapsedTime");
    return savedTime ? parseInt(savedTime, 10) : 0;
  });

  const [isRunning, setIsRunning] = useState(() => {
    // Retrieve running state from localStorage (default to false)
    const savedIsRunning = localStorage.getItem("isRunning");
    return savedIsRunning === "true"; // Convert string to boolean
  });

  const [startTimestamp, setStartTimestamp] = useState(() => {
    // Retrieve saved start timestamp from localStorage (default to null)
    const savedStartTimestamp = localStorage.getItem("startTimestamp");
    return savedStartTimestamp ? parseInt(savedStartTimestamp, 10) : null;
  });

  useEffect(() => {
    if (isRunning && startTimestamp) {
      const interval = setInterval(() => {
        // Update elapsed time based on the difference between now and startTimestamp
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        setTime((currentTime - startTimestamp));
      }, 1000);

      return () => clearInterval(interval); // Cleanup the interval on unmount
    }
  }, [isRunning, startTimestamp]);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("elapsedTime", time);
    localStorage.setItem("isRunning", isRunning);
    if (startTimestamp) {
      localStorage.setItem("startTimestamp", startTimestamp);
    } else {
      localStorage.removeItem("startTimestamp");
    }
  }, [time, isRunning, startTimestamp]);

  const startTimer = () => {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    setStartTimestamp(currentTime); // Save the start timestamp
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
    setStartTimestamp(null);
    localStorage.removeItem("elapsedTime");
    localStorage.removeItem("startTimestamp");
    localStorage.setItem("isRunning", false);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="timer-container">
      <h1 className="timer">{formatTime(time)}</h1>
      {isRunning ? (
        <button onClick={pauseTimer}>Pause</button>
      ) : (
        <button onClick={startTimer}>Start</button>
      )}
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default Timer;

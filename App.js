import React, { useState, useEffect } from "react";
import "./App.css";

function Timer() {
  const [time, setTime] = useState(() => parseInt(localStorage.getItem("time")) || 0);
  const [isRunning, setIsRunning] = useState(() => localStorage.getItem("isRunning") === "true");
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks")) || []);
  const [lastTaskTime, setLastTaskTime] = useState(() => parseInt(localStorage.getItem("lastTaskTime")) || 0);
  const [note, setNote] = useState("");
  const [projectName, setProjectName] = useState("Your project name");

  // Timer Logic
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem("time", time);
    localStorage.setItem("isRunning", isRunning);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("lastTaskTime", lastTaskTime);
  }, [time, isRunning, tasks, lastTaskTime]);

  // Timer Controls
  const toggleTimer = () => setIsRunning(!isRunning);

  const addTask = () => {
    const taskDuration = time - lastTaskTime;
    const newTask = {
      id: Date.now(),
      duration: taskDuration,
      name: `New Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
    setLastTaskTime(time);
  };

  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
    setTasks([]);
    setLastTaskTime(0);
    localStorage.clear();
  };

  const removeTask = (id) => setTasks(tasks.filter((task) => task.id !== id));

  // Helpers
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatCompactTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  return (
    <div className="timer-container">
      <h1 className="timer">{formatTime(time)}</h1>
      <div className="button-group">
        <button onClick={toggleTimer}>{isRunning ? "Pause" : "Start"}</button>
        <button onClick={addTask} disabled={!isRunning}>
          New Task
        </button>
        <button onClick={resetTimer}>Stop</button>
      </div>
      <div className="project-section">
        <label className="project-label">Project</label>
        <EditableText
          value={projectName}
          placeholder="Your project name"
          onSave={(newName) => setProjectName(newName)}
        />
        <input
          type="text"
          maxLength="140"
          placeholder="Add a note (140 characters max)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      {tasks.length > 0 && (
        <div className="laps">
          <h2>Task Sessions</h2>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <EditableText
                  value={task.name}
                  onSave={(newName) => {
                    const updatedTasks = tasks.map((t) =>
                      t.id === task.id ? { ...t, name: newName } : t
                    );
                    setTasks(updatedTasks);
                  }}
                />
                <span className="lap-time">Duration: {formatCompactTime(task.duration)}</span>
                <button onClick={() => removeTask(task.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Editable Input Component
function EditableText({ value, placeholder, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSave = () => {
    setIsEditing(false);
    onSave(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
  };

  return isEditing ? (
    <input
      type="text"
      value={inputValue}
      placeholder={placeholder}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      autoFocus
      className="editable-input"
    />
  ) : (
    <p onClick={() => setIsEditing(true)} className="editable-value">
      {value || placeholder}
    </p>
  );
}

export default Timer;

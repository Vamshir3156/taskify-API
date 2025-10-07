import React, { useState, useEffect } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../services/api";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const { data } = await getTasks();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newTask = { title, status: "pending" };
    const { data } = await createTask(newTask);
    setTasks([data, ...tasks]);
    setTitle("");
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    const { data } = await updateTask(task._id, { status: newStatus });
    setTasks(tasks.map((t) => (t._id === task._id ? data : t)));
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location = "/login";
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Task Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <form onSubmit={handleCreateTask} className="task-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="task-list">
        {tasks.map((task) => (
          <div key={task._id} className={`task-item ${task.status}`}>
            <span onClick={() => handleToggleStatus(task)}>{task.title}</span>
            <button
              onClick={() => handleDeleteTask(task._id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

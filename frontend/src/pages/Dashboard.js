import React, { useState, useEffect, useMemo } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../services/api";
import { NavLink, useSearchParams } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get("status");
  const filter =
    filterParam === "completed" || filterParam === "pending"
      ? filterParam
      : "all";

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await getTasks();
      setTasks(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const value = title.trim();
    if (!value) return;
    try {
      setCreating(true);
      const newTask = { title: value, status: "pending" };
      const { data } = await createTask(newTask);
      setTasks((prev) => [data || { ...newTask }, ...prev]);
      setTitle("");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (taskId) => {
    const current = tasks.find((t) => t._id === taskId);
    if (!current) return;
    const nextStatus = current.status === "pending" ? "completed" : "pending";

    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: nextStatus } : t))
    );

    try {
      const { data } = await updateTask(taskId, { status: nextStatus });
      if (data && data._id && data.status === nextStatus) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? data : t)));
      }
    } catch (err) {
      console.error("Error toggling status:", err);

      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, status: current.status } : t
        )
      );
      alert("Could not update task status. Please try again.");
    }
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location = "/login";
  };

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => (filter === "all" ? true : t.status === filter))
      .filter((t) =>
        query.trim()
          ? t.title.toLowerCase().includes(query.trim().toLowerCase())
          : true
      );
  }, [tasks, query, filter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-badge">T</div>
          <div>Taskify</div>
        </div>

        <nav className="nav">
          <NavLink
            end
            to="/"
            className={({ isActive }) =>
              isActive && filter === "all" ? "active" : ""
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/?status=completed"
            className={({ isActive }) =>
              isActive && filter === "completed" ? "active" : ""
            }
          >
            Completed
          </NavLink>

          <NavLink
            to="/?status=pending"
            className={({ isActive }) =>
              isActive && filter === "pending" ? "active" : ""
            }
          >
            Pending
          </NavLink>

          <span className="mono" style={{ opacity: 0.7, padding: "8px 12px" }}>
            v1.0
          </span>
        </nav>
      </aside>

      <header className="topbar">
        <div className="search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks..."
            aria-label="Search tasks"
          />
          <span className="icon">⌘K</span>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <select
            className="select"
            value={filter}
            onChange={(e) => {
              const next = e.target.value;
              if (next === "all") setSearchParams({});
              else setSearchParams({ status: next });
            }}
            aria-label="Filter tasks"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="content">
        <div className="grid cols-3">
          <section className="card">
            <div className="card-header">
              <div className="card-title">Quick Add</div>
            </div>
            <div className="card-body">
              <form className="form" onSubmit={handleCreateTask}>
                <div>
                  <label className="label" htmlFor="title">
                    Task title
                  </label>
                  <input
                    id="title"
                    className="input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Ship portfolio case study"
                  />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={creating}
                  >
                    {creating ? "Adding..." : "Add Task"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setTitle("")}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <div className="card-title">Overview</div>
            </div>
            <div className="card-body">
              <div className="grid cols-2">
                <div className="task">
                  <div className="title">Total</div>
                  <div className="badge total" style={{ marginLeft: "auto" }}>
                    {stats.total}
                  </div>
                </div>
                <div className="task">
                  <div className="title">Done</div>
                  <div className="badge success" style={{ marginLeft: "auto" }}>
                    {stats.completed}
                  </div>
                </div>
                <div className="task">
                  <div className="title">Pending</div>
                  <div className="badge warning" style={{ marginLeft: "auto" }}>
                    {stats.pending}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <div className="card-title">Tips</div>
            </div>
            <div className="card-body">
              <div className="helper">
                Click a task title or the action button to toggle status. Use
                the filter above or the sidebar to view pending/completed. Share
                links like <span className="mono">/?status=completed</span> with
                your team.
              </div>
            </div>
          </section>
        </div>

        <section className="card" style={{ marginTop: 16 }}>
          <div className="card-header">
            <div className="card-title">
              Your Tasks {filter !== "all" ? `— ${filter}` : ""}
            </div>
            <div className="helper">
              {filtered.length} shown • {tasks.length} total
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="empty">Loading tasks…</div>
            ) : filtered.length === 0 ? (
              <div className="empty">
                No tasks found. Try changing your search or filter.
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Status</th>
                    <th className="mono">ID</th>
                    <th style={{ width: 160 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((task) => (
                    <tr key={task._id}>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(task._id)}
                          className="btn btn-ghost"
                          style={{ padding: "8px 10px" }}
                          title="Toggle status"
                        >
                          <span className="title">{task.title}</span>
                        </button>
                      </td>
                      <td>
                        <span
                          className={
                            "badge " +
                            (task.status === "completed"
                              ? "success"
                              : task.status === "pending"
                              ? "warning"
                              : "")
                          }
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="mono" style={{ color: "#9fb1c9" }}>
                        {task._id?.slice(-6)}
                      </td>
                      <td className="cell-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleToggleStatus(task._id)}
                        >
                          {task.status === "completed"
                            ? "Mark Pending"
                            : "Mark Done"}
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={() => handleDeleteTask(task._id)}
                          style={{
                            borderColor: "rgba(239,68,68,.35)",
                            color: "#fca5a5",
                          }}
                          title="Delete task"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

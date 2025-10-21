import React, { useState } from "react";
import { login } from "../services/api";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setErr("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await login(formData);
      localStorage.setItem("token", data.token);
      window.location = "/";
    } catch (error) {
      console.error("Login failed:", error);
      setErr(
        error?.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="card auth-card">
        <div className="card-header">
          <div className="brand">
            <div className="brand-badge logo-spin">T</div>
            <div>
              <div className="h2" style={{ color: "var(--text)" }}>
                Taskify
              </div>
              <div className="helper">Welcome back — sign in to continue</div>
            </div>
          </div>
          <Link to="/register" className="btn btn-ghost">
            Create account
          </Link>
        </div>

        <div className="card-body">
          <form className="form" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="input"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  className="input"
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  onClick={() => setShowPw((s) => !s)}
                  className="btn btn-ghost"
                  style={{
                    position: "absolute",
                    right: 6,
                    top: 6,
                    padding: "8px 10px",
                  }}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              <div className="helper">Use at least 8 characters.</div>
            </div>

            {err ? (
              <div
                className="badge danger"
                role="alert"
                style={{ width: "fit-content" }}
              >
                {err}
              </div>
            ) : null}

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
              <Link to="/register" className="btn btn-ghost">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

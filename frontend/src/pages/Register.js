import React, { useState } from "react";
import { register } from "../services/api";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      const { data } = await register(formData);
      localStorage.setItem("token", data.token);
      window.location = "/"; // Redirect to dashboard
    } catch (error) {
      console.error("Registration failed:", error);
      setErr(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
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
            <div className="brand-badge">T</div>
            <div>
              <div className="h2" style={{ color: "var(--text)" }}>
                Create your Taskify account
              </div>
              <div className="helper">It’s fast and free.</div>
            </div>
          </div>
          <Link to="/login" className="btn btn-ghost">
            SignIn
          </Link>
        </div>

        <div className="card-body">
          <form className="form" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="label" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                className="input"
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
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
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="btn btn-ghost"
                  aria-label={showPw ? "Hide password" : "Show password"}
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
              <div className="helper">Minimum 8 characters recommended.</div>
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

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create account"}
              </button>
              <Link to="/login" className="btn btn-ghost">
                I already have an account
              </Link>
            </div>
          </form>

          <div style={{ marginTop: 14 }} className="helper">
            By creating an account, you agree to our{" "}
            <a className="link" href="#" onClick={(e) => e.preventDefault()}>
              Terms
            </a>{" "}
            and{" "}
            <a className="link" href="#" onClick={(e) => e.preventDefault()}>
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

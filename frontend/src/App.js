import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import "./index.css";

const API_BASE =
  (process.env.REACT_APP_API_URL || "").replace(/\/$/, "") ||
  "http://localhost:5000";

const HEALTH_URL = `${API_BASE}/health`;
const PROBE_EVERY_MS = 2000;

export default function App() {
  const token = localStorage.getItem("token");

  const [serverUp, setServerUp] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [attempt, setAttempt] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(45);
  const [windowSecs, setWindowSecs] = useState(45);

  const connectedRef = useRef(false);
  const extendedRef = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    const probe = async () => {
      try {
        const res = await fetch(HEALTH_URL, {
          cache: "no-store",
          mode: "cors",
        });
        return res.ok;
      } catch {
        return false;
      }
    };

    setIsWaiting(true);

    probe().then((ok) => {
      if (!mountedRef.current) return;
      if (ok) {
        connectedRef.current = true;
        setServerUp(true);
        setIsWaiting(false);
      }
    });

    let countdown = setInterval(() => {
      if (!mountedRef.current || connectedRef.current) return;

      setSecondsLeft((prev) => {
        if (prev <= 5 && !extendedRef.current) {
          extendedRef.current = true;
          setWindowSecs((w) => w + 30);
          setAttempt((a) => a + 1);
          return prev + 30;
        }

        if (prev > 5 && extendedRef.current) {
          extendedRef.current = false;
        }

        return Math.max(0, prev - 1);
      });
    }, 1000);

    let pinger = setInterval(async () => {
      if (!mountedRef.current || connectedRef.current) return;
      const ok = await probe();
      if (ok) {
        connectedRef.current = true;
        setServerUp(true);
        setIsWaiting(false);
      }
    }, PROBE_EVERY_MS);

    setWindowSecs(45);
    setSecondsLeft(45);

    return () => {
      mountedRef.current = false;
      clearInterval(countdown);
      clearInterval(pinger);
    };
  }, []);

  if (isWaiting && !serverUp) {
    const total = windowSecs || 1;
    const pct = Math.max(0, 100 - (secondsLeft / total) * 100);

    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          color: "white",
          background: "#0b1020",
          textAlign: "center",
          padding: 16,
        }}
      >
        <div className="h2" style={{ color: "var(--text)" }}>
          ⚡ Waking up the server… Please wait :)
        </div>
        <div className="helper" style={{ color: "#9fb1c9" }}>
          (We’ll render as soon as it connects)
        </div>

        <div
          style={{
            marginTop: 10,
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          Attempt <strong>#{attempt}</strong> • Estimated time left{" "}
          <strong>{secondsLeft}s</strong>
        </div>

        <div
          style={{
            width: 260,
            height: 6,
            marginTop: 8,
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          aria-hidden
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, rgba(110,168,255,.9), rgba(34,211,238,.9))",
              transition: "width 1s linear",
            }}
          />
        </div>

        <div className="helper" style={{ color: "#9fb1c9", marginTop: 8 }}>
          This app uses a free backend that may sleep when idle.
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

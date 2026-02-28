import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Page from "../shared/Page";
import { register } from "../auth";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(username, password);
      navigate("/", { replace: true });
    } catch (registerError) {
      setError(registerError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <h1 className="hero-title">Create account</h1>
      <p className="hero-subtitle">Register a new user to access the console.</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            minLength={3}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={10}
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,128}"
            title="At least 10 characters with uppercase, lowercase, and a number"
            required
          />
        </label>

        <label>
          Confirm password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={10}
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,128}"
            title="At least 10 characters with uppercase, lowercase, and a number"
            required
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="hero-subtitle">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
      <p className="hero-subtitle">Password must be 10+ characters with upper, lower, and number.</p>
    </Page>
  );
}
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Page from "../shared/Page";
import { login } from "../auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("alice");
  const [password, setPassword] = useState("changeme123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectPath = location.state?.from?.pathname || "/";

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(username, password);
      navigate(redirectPath, { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <h1 className="hero-title">Sign in</h1>
      <p className="hero-subtitle">Authenticate to access the builder console.</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="hero-subtitle">Demo credentials: alice / changeme123</p>
    </Page>
  );
}
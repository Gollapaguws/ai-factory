import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Page from "../shared/Page";
import { getOAuthConfig, login, oauthLogin } from "../auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("alice");
  const [password, setPassword] = useState("changeme123");
  const [oauthIdentity, setOauthIdentity] = useState("alice");
  const [oauthProvider, setOauthProvider] = useState("OAuth");
  const [oauthAllowlistHint, setOauthAllowlistHint] = useState("alice, bob");
  const [oauthLoading, setOauthLoading] = useState(false);
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

  React.useEffect(() => {
    getOAuthConfig()
      .then((data) => {
        if (data?.provider) {
          setOauthProvider(data.provider);
        }
        if (Array.isArray(data?.allowlistSample) && data.allowlistSample.length > 0) {
          setOauthAllowlistHint(data.allowlistSample.join(", "));
          setOauthIdentity(data.allowlistSample[0]);
        }
      })
      .catch(() => {
        setOauthProvider("OAuth");
      });
  }, []);

  async function handleOAuthLogin(event) {
    event.preventDefault();
    setOauthLoading(true);
    setError("");

    try {
      await oauthLogin(oauthIdentity);
      navigate(redirectPath, { replace: true });
    } catch (oauthError) {
      setError(oauthError.message);
    } finally {
      setOauthLoading(false);
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

      <form className="login-form" onSubmit={handleOAuthLogin}>
        <label>
          OAuth identity (email or username)
          <input
            type="text"
            value={oauthIdentity}
            onChange={(event) => setOauthIdentity(event.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={oauthLoading}>
          {oauthLoading ? "Signing in with OAuth..." : `Sign in with ${oauthProvider}`}
        </button>
      </form>

      <p className="hero-subtitle">Password demo: alice / changeme123</p>
      <p className="hero-subtitle">OAuth allowlist sample: {oauthAllowlistHint}</p>
    </Page>
  );
}
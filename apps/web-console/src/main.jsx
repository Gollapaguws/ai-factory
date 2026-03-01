
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { clearToken, isAuthenticated, subscribeAuthChange } from "./auth";

import "./style.css";
import NavBar from "./shared/NavBar";

function App() {
  const [authenticated, setAuthenticated] = React.useState(isAuthenticated());

  React.useEffect(() => {
    const unsubscribe = subscribeAuthChange(setAuthenticated);
    setAuthenticated(isAuthenticated());
    return unsubscribe;
  }, []);

  const links = [
    ...(authenticated
      ? [
          { to: "/", label: "Home", end: true },
          { to: "/dashboard", label: "Dashboard" },
          { to: "/features", label: "Features Lab" },
          { to: "/about", label: "About" }
        ]
      : []),
    ...(!authenticated
      ? [
          { to: "/login", label: "Login", end: true },
          { to: "/register", label: "Register" }
        ]
      : [])
  ];

  function handleLogout() {
    clearToken();
    setAuthenticated(false);
    window.location.href = "/login";
  }

  return (
    <BrowserRouter>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="top-nav">
        <div className="app-brand">AI Factory</div>
        <NavBar links={links} />
        {authenticated ? (
          <button className="logout-btn" onClick={handleLogout} type="button">
            Logout
          </button>
        ) : null}
      </div>
      <main id="main-content" className="main-content" tabIndex="-1">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

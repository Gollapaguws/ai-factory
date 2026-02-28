
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import "./style.css";
import NavBar from "../../shared/NavBar";

function App() {
  const [dark, setDark] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
  }, [dark]);

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About" },
    { to: "/workflow-builder", label: "Workflow Builder" },
    { to: "/ai-integration", label: "AI Integration" },
    { to: "/modules", label: "Modules" },
    { to: "/collaboration", label: "Collaboration" },
    { to: "/observability", label: "Observability" },
    { to: "/marketplace", label: "Marketplace" },
    { to: "/security", label: "Security" },
    { to: "/extensibility", label: "Extensibility" },
    { to: "/developer-experience", label: "Developer Experience" },
    { to: "/onboarding", label: "Onboarding" }
  ];
  return (
    <BrowserRouter>
      <NavBar links={links} />
      <main className="main-content">
        <AppRoutes />
        <button style={{marginLeft: 'auto', position: 'fixed', top: 12, right: 24, zIndex: 1000}} onClick={() => setDark(d => !d)}>
          {dark ? '🌙 Dark' : '☀️ Light'}
        </button>
      </main>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

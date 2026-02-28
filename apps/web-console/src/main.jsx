
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";

import "./style.css";
import NavBar from "./shared/NavBar";

function App() {
  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About" }
  ];
  return (
    <BrowserRouter>
      <NavBar links={links} />
      <main className="main-content">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

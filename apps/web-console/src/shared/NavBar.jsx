import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar({ links }) {
  return (
    <nav className="app-nav" aria-label="Primary">
      {links.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

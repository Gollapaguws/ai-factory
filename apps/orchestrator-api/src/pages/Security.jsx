import React, { useState } from "react";
import SecurityService, { ROLES } from "../security/SecurityService";
import Page from "../../../shared/Page";

// Security & Compliance: RBAC, audit trails
export default function Security() {
  const [users, setUsers] = useState(SecurityService.getUsers());
  const [audit, setAudit] = useState(SecurityService.getAuditTrail());

  const setRole = (username, role) => {
    SecurityService.setUserRole(username, role);
    setUsers([...SecurityService.getUsers()]);
    SecurityService.addAudit(username, `role changed to ${role}`);
    setAudit([...SecurityService.getAuditTrail()]);
  };

  return (
    <Page title="Security & Compliance">
      <h2>Users & Roles</h2>
      <ul>
        {users.map((u, i) => (
          <li key={i}>
            <strong>{u.username}</strong> -
            <select value={u.role} onChange={e => setRole(u.username, e.target.value)}>
              {ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
      <h2>Audit Trail</h2>
      <ul>
        {audit.map((a, i) => (
          <li key={i}>
            <strong>{a.user}</strong>: {a.action} <em>({new Date(a.timestamp).toLocaleTimeString()})</em>
          </li>
        ))}
      </ul>
    </Page>
  );
}

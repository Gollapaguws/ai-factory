// SecurityService.js
// Role-Based Access Control (RBAC) and Audit Trails (stub)

export const ROLES = ["admin", "engineer", "viewer"];

export default class SecurityService {
  static users = [
    { username: "alice", role: "admin" },
    { username: "bob", role: "engineer" },
    { username: "carol", role: "viewer" },
  ];

  static auditTrail = [
    { user: "alice", action: "created workflow", timestamp: Date.now() - 120000 },
    { user: "bob", action: "ran AI module", timestamp: Date.now() - 60000 },
    { user: "carol", action: "viewed dashboard", timestamp: Date.now() - 30000 },
  ];

  static getUsers() {
    return this.users;
  }

  static setUserRole(username, role) {
    const user = this.users.find(u => u.username === username);
    if (user) user.role = role;
  }

  static getAuditTrail() {
    return this.auditTrail;
  }

  static addAudit(user, action) {
    this.auditTrail.push({ user, action, timestamp: Date.now() });
  }
}

// CollabService.js
// Real-Time Collaboration Features (stub)

export default class CollabService {
  static listeners = [];
  static comments = [
    { user: "Alice", text: "Initial workflow draft.", timestamp: Date.now() - 60000 },
    { user: "Bob", text: "Looks good!", timestamp: Date.now() - 30000 },
  ];

  static getComments() {
    return this.comments;
  }

  static addComment(user, text) {
    const comment = { user, text, timestamp: Date.now() };
    this.comments.push(comment);
    this.listeners.forEach(fn => fn(this.comments));
  }

  static subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }
}

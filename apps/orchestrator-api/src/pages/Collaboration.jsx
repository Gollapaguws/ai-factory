import React, { useState, useEffect } from "react";
import CollabService from "../collab/CollabService";
import Page from "../../../shared/Page";

// Real-Time Collaboration Features
export default function Collaboration() {
  const [comments, setComments] = useState(CollabService.getComments());
  const [user, setUser] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const unsub = CollabService.subscribe(setComments);
    return unsub;
  }, []);

  const addComment = () => {
    if (!user || !text) return;
    CollabService.addComment(user, text);
    setText("");
  };

  return (
    <Page title="Collaboration">
      <p>Multi-user comments (real-time demo):</p>
      <ul>
        {comments.map((c, i) => (
          <li key={i}>
            <strong>{c.user}</strong>: {c.text} <em>({new Date(c.timestamp).toLocaleTimeString()})</em>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 16 }}>
        <input
          type="text"
          value={user}
          onChange={e => setUser(e.target.value)}
          placeholder="Your name"
        />
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Comment"
        />
        <button onClick={addComment} disabled={!user || !text}>Add Comment</button>
      </div>
    </Page>
  );
}

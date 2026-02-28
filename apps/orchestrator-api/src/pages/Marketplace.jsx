import React, { useState } from "react";
import MarketplaceService from "../marketplace/MarketplaceService";
import Page from "../../../shared/Page";

// Marketplace & Community Library
export default function Marketplace() {
  const [items, setItems] = useState(MarketplaceService.listItems());
  const [name, setName] = useState("");
  const [type, setType] = useState("Integration");
  const [author, setAuthor] = useState("");

  const addItem = () => {
    if (!name || !author) return;
    MarketplaceService.addItem({ name, type, author });
    setItems([...MarketplaceService.listItems()]);
    setName("");
    setAuthor("");
  };

  return (
    <Page title="Marketplace">
      <p>Library of integrations, templates, and AI models contributed by users.</p>
      <ul>
        {items.map((item, i) => (
          <li key={i}>
            <strong>{item.name}</strong> ({item.type}) by {item.author}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 16 }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Item name"
        />
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="Integration">Integration</option>
          <option value="Template">Template</option>
          <option value="AI Model">AI Model</option>
        </select>
        <input
          type="text"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Author"
        />
        <button onClick={addItem} disabled={!name || !author}>Add Item</button>
      </div>
    </Page>
  );
}

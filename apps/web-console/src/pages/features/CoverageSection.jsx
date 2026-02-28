import React from "react";

export default function CoverageSection({ allFeatureItems }) {
  return (
    <section className="capabilities">
      <h2 className="section-title">Coverage</h2>
      <div className="feature-list">
        {allFeatureItems.map((item) => (
          <span key={item} className="feature-chip">
            ✓ {item}
          </span>
        ))}
      </div>
    </section>
  );
}

import React from "react";
import OnboardingService from "../onboarding/OnboardingService";
import Page from "../../../shared/Page";

// Guided Onboarding, Templates, and Documentation
export default function Onboarding() {
  const templates = OnboardingService.getTemplates();
  const docs = OnboardingService.getDocs();

  return (
    <Page title="Onboarding & Documentation">
      <h2>Templates</h2>
      <ul>
        {templates.map((t, i) => (
          <li key={i}>
            <strong>{t.name}</strong>: {t.description}
          </li>
        ))}
      </ul>
      <h2>Documentation</h2>
      <ul>
        {docs.map((d, i) => (
          <li key={i}>
            <a href={d.url} target="_blank" rel="noopener noreferrer">{d.title}</a>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: 16 }}><em>Guided onboarding flows coming soon.</em></p>
    </Page>
  );
}

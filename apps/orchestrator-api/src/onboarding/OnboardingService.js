// OnboardingService.js
// Guided onboarding, templates, and documentation (stub)

export default class OnboardingService {
  static templates = [
    { name: "Starter Workflow", description: "A basic workflow template to get started." },
    { name: "AI Data Pipeline", description: "Template for AI-powered data processing." },
  ];

  static docs = [
    { title: "Getting Started", url: "https://docs.example.com/getting-started" },
    { title: "Workflow API", url: "https://docs.example.com/api" },
  ];

  static getTemplates() {
    return this.templates;
  }

  static getDocs() {
    return this.docs;
  }
}

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import WorkflowBuilder from "./pages/WorkflowBuilder";
import AIIntegration from "./pages/AIIntegration";
import ModuleLibrary from "./pages/ModuleLibrary";
import Collaboration from "./pages/Collaboration";
import Observability from "./pages/Observability";
import Marketplace from "./pages/Marketplace";
import Security from "./pages/Security";
import Extensibility from "./pages/Extensibility";
import DeveloperExperience from "./pages/DeveloperExperience";
import Onboarding from "./pages/Onboarding";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/workflow-builder" element={<WorkflowBuilder />} />
      <Route path="/ai-integration" element={<AIIntegration />} />
      <Route path="/modules" element={<ModuleLibrary />} />
      <Route path="/collaboration" element={<Collaboration />} />
      <Route path="/observability" element={<Observability />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/security" element={<Security />} />
      <Route path="/extensibility" element={<Extensibility />} />
      <Route path="/developer-experience" element={<DeveloperExperience />} />
      <Route path="/onboarding" element={<Onboarding />} />
    </Routes>
  );
}

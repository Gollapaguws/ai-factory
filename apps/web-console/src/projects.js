const storageKey = "ai_factory_projects";

function parseProjects(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function listProjects() {
  return parseProjects(localStorage.getItem(storageKey));
}

export function saveProjects(projects) {
  localStorage.setItem(storageKey, JSON.stringify(projects));
}

export function createProject({ name, prompt }) {
  const trimmedName = String(name || "").trim();
  const trimmedPrompt = String(prompt || "").trim();

  if (!trimmedName) {
    throw new Error("Project name is required");
  }

  if (!trimmedPrompt) {
    throw new Error("Project description is required");
  }

  const now = new Date().toISOString();
  const projects = listProjects();
  const project = {
    id: `project_${Date.now()}`,
    name: trimmedName,
    prompt: trimmedPrompt,
    status: "draft",
    createdAt: now,
    updatedAt: now
  };

  const nextProjects = [project, ...projects];
  saveProjects(nextProjects);
  return project;
}

export function updateProjectStatus(projectId, status) {
  const allowed = ["draft", "building", "ready"];
  if (!allowed.includes(status)) {
    throw new Error("Invalid project status");
  }

  const now = new Date().toISOString();
  const nextProjects = listProjects().map((project) => {
    if (project.id !== projectId) {
      return project;
    }

    return {
      ...project,
      status,
      updatedAt: now
    };
  });

  saveProjects(nextProjects);
  return nextProjects;
}

export function updateProject(projectId, updates) {
  const nextName = String(updates?.name || "").trim();
  const nextPrompt = String(updates?.prompt || "").trim();

  if (!nextName) {
    throw new Error("Project name is required");
  }

  if (!nextPrompt) {
    throw new Error("Project description is required");
  }

  const now = new Date().toISOString();
  const nextProjects = listProjects().map((project) => {
    if (project.id !== projectId) {
      return project;
    }

    return {
      ...project,
      name: nextName,
      prompt: nextPrompt,
      updatedAt: now
    };
  });

  saveProjects(nextProjects);
  return nextProjects;
}

export function deleteProject(projectId) {
  const nextProjects = listProjects().filter((project) => project.id !== projectId);
  saveProjects(nextProjects);
  return nextProjects;
}

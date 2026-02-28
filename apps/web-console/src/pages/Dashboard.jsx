import React from "react";
import Page from "../shared/Page";
import { createProject, deleteProject, listProjects, updateProject, updateProjectStatus } from "../projects";

const statusOrder = ["draft", "building", "ready"];

function nextStatus(currentStatus) {
  const index = statusOrder.indexOf(currentStatus);
  if (index === -1 || index === statusOrder.length - 1) {
    return statusOrder[0];
  }
  return statusOrder[index + 1];
}

export default function Dashboard() {
  const [name, setName] = React.useState("");
  const [prompt, setPrompt] = React.useState("");
  const [projects, setProjects] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState("");
  const [editName, setEditName] = React.useState("");
  const [editPrompt, setEditPrompt] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  React.useEffect(() => {
    const existingProjects = listProjects();
    setProjects(existingProjects);
    if (existingProjects.length > 0) {
      setSelectedId(existingProjects[0].id);
    }
  }, []);

  const selectedProject = projects.find((project) => project.id === selectedId) || null;

  React.useEffect(() => {
    if (!selectedProject) {
      setEditName("");
      setEditPrompt("");
      return;
    }

    setEditName(selectedProject.name);
    setEditPrompt(selectedProject.prompt);
  }, [selectedProject?.id]);

  function handleCreateProject(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const created = createProject({ name, prompt });
      const refreshed = listProjects();
      setProjects(refreshed);
      setSelectedId(created.id);
      setName("");
      setPrompt("");
      setSuccess(`Project ${created.name} created`);
    } catch (createError) {
      setError(createError.message);
    }
  }

  function handleAdvanceStatus(projectId) {
    setError("");
    setSuccess("");

    const target = projects.find((project) => project.id === projectId);
    if (!target) {
      setError("Project not found");
      return;
    }

    const status = nextStatus(target.status);
    const updated = updateProjectStatus(projectId, status);
    setProjects(updated);
    setSuccess(`Project moved to ${status}`);
  }

  function handleSaveEdits(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedProject) {
      setError("No project selected");
      return;
    }

    try {
      const updated = updateProject(selectedProject.id, {
        name: editName,
        prompt: editPrompt
      });
      setProjects(updated);
      setSuccess("Project updated");
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  function handleDeleteSelected() {
    setError("");
    setSuccess("");

    if (!selectedProject) {
      setError("No project selected");
      return;
    }

    const nextProjects = deleteProject(selectedProject.id);
    setProjects(nextProjects);
    setSelectedId(nextProjects[0]?.id || "");
    setSuccess("Project deleted");
  }

  return (
    <Page>
      <h1 className="hero-title">Project Dashboard</h1>
      <p className="hero-subtitle">
        Create projects from natural language prompts and track their build state locally.
      </p>

      <section className="capabilities">
        <h2 className="section-title">Create Project</h2>
        <form className="login-form" onSubmit={handleCreateProject}>
          <label>
            Project name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Internal tooling portal"
              required
            />
          </label>

          <label>
            Project description
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Build an internal dashboard with auth, project search, and deployment controls."
              rows={4}
              required
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}
          {success ? <p className="status-good">{success}</p> : null}

          <button type="submit">Create project</button>
        </form>
      </section>

      <section className="capabilities">
        <h2 className="section-title">Projects</h2>
        {projects.length === 0 ? (
          <p className="hero-subtitle">No projects yet. Create one to start your build flow.</p>
        ) : (
          <div className="capability-grid">
            {projects.map((project) => (
              <article
                key={project.id}
                className={`capability-card ${project.id === selectedId ? "capability-selected" : ""}`}
              >
                <h3>{project.name}</h3>
                <p>{project.prompt}</p>
                <p className="hero-subtitle">Status: {project.status}</p>
                <div className="action-row">
                  <button type="button" className="capability-action" onClick={() => setSelectedId(project.id)}>
                    Select
                  </button>
                  <button
                    type="button"
                    className="capability-action"
                    onClick={() => handleAdvanceStatus(project.id)}
                  >
                    Advance Status
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedProject ? (
        <section className="capabilities">
          <h2 className="section-title">Selected Project</h2>
          <article className="capability-card capability-selected">
            <h3>{selectedProject.name}</h3>
            <p>{selectedProject.prompt}</p>
            <p className="hero-subtitle">Build status: {selectedProject.status}</p>
            <p className="hero-subtitle">Updated: {new Date(selectedProject.updatedAt).toLocaleString()}</p>

            <form className="login-form" onSubmit={handleSaveEdits}>
              <label>
                Edit name
                <input
                  type="text"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  required
                />
              </label>

              <label>
                Edit description
                <textarea
                  value={editPrompt}
                  onChange={(event) => setEditPrompt(event.target.value)}
                  rows={4}
                  required
                />
              </label>

              <div className="action-row">
                <button type="submit" className="capability-action">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="capability-action danger-action"
                  onClick={handleDeleteSelected}
                >
                  Delete Project
                </button>
              </div>
            </form>
          </article>
        </section>
      ) : null}
    </Page>
  );
}

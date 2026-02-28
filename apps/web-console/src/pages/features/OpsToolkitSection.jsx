import React from "react";

export default function OpsToolkitSection({
  createBackup,
  restoreBackup,
  backupBlob,
  setBackupBlob,
  abName,
  setAbName,
  addExperiment,
  checkDependencies,
  dependencyStatus,
  importCsv,
  setImportCsv,
  importCsvData,
  exportProjects,
  importSummary,
  usageEvents
}) {
  return (
    <section className="capabilities">
      <h2 className="section-title">Ops Toolkit</h2>
      <div className="two-col">
        <article className="capability-card">
          <h3>Backup, Restore, A/B, Dependency Updates</h3>
          <div className="action-row">
            <button type="button" className="capability-action" onClick={createBackup}>
              Create Backup
            </button>
            <button type="button" className="capability-action" onClick={restoreBackup}>
              Restore Backup
            </button>
          </div>
          <textarea value={backupBlob} onChange={(event) => setBackupBlob(event.target.value)} rows={5} />
          <div className="action-row">
            <input value={abName} onChange={(event) => setAbName(event.target.value)} />
            <button type="button" className="capability-action" onClick={addExperiment}>
              Add A/B Test
            </button>
            <button type="button" className="capability-action" onClick={checkDependencies}>
              Check Dependencies
            </button>
          </div>
          <p className="hero-subtitle">{dependencyStatus}</p>
        </article>

        <article className="capability-card">
          <h3>Data Import / Export + Analytics</h3>
          <textarea value={importCsv} onChange={(event) => setImportCsv(event.target.value)} rows={5} />
          <div className="action-row">
            <button type="button" className="capability-action" onClick={importCsvData}>
              Import CSV
            </button>
            <button type="button" className="capability-action" onClick={exportProjects}>
              Export JSON
            </button>
          </div>
          <p className="hero-subtitle">{importSummary}</p>
          <p className="hero-subtitle">Usage events: {usageEvents.length}</p>
        </article>
      </div>
    </section>
  );
}

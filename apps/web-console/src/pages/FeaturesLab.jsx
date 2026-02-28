import React from "react";
import Page from "../shared/Page";
import CoverageSection from "./features/CoverageSection";
import CoreBuilderSection from "./features/CoreBuilderSection";
import TemplatesDeploySection from "./features/TemplatesDeploySection";
import IntegrationQualitySection from "./features/IntegrationQualitySection";
import AdvancedControlsSection from "./features/AdvancedControlsSection";
import OpsToolkitSection from "./features/OpsToolkitSection";
import LiveOutputsSection from "./features/LiveOutputsSection";
import useFeaturesLab from "./features/useFeaturesLab";

export default function FeaturesLab() {
  const {
    allFeatureItems,
    statusMessage,
    selectedModel,
    setSelectedModel,
    prompt,
    setPrompt,
    generateFromPrompt,
    profile,
    oauthAllowedUsers,
    setOauthAllowedUsers,
    oauthCandidate,
    setOauthCandidate,
    runOAuthCheck,
    oauthResult,
    template,
    setTemplate,
    generateMobileScaffold,
    generateTests,
    deploymentTarget,
    setDeploymentTarget,
    copyDeployCommand,
    appendCommit,
    rollbackCommit,
    codeSnippet,
    setCodeSnippet,
    saveCodeInjection,
    runCodeReview,
    generateDocs,
    reviewOutput,
    apiConnector,
    setApiConnector,
    addConnector,
    chatCommand,
    setChatCommand,
    webhookUrl,
    setWebhookUrl,
    triggerWebhook,
    plugins,
    togglePlugin,
    workflowStep,
    setWorkflowStep,
    addWorkflowStep,
    collabDraft,
    setCollabDraft,
    sendCollabNote,
    secretName,
    setSecretName,
    secretValue,
    setSecretValue,
    addSecret,
    measurePerformance,
    setIsLightTheme,
    perfText,
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
    usageEvents,
    generatedOutput,
    docsOutput,
    selectedProject,
    connectorList,
    workflowSteps,
    secrets,
    webhookLog,
    collabNotes,
    abExperiments
  } = useFeaturesLab();

  return (
    <Page>
      <h1 className="hero-title">Features Lab (README Coverage)</h1>
      <p className="hero-subtitle">
        Each feature listed in README is wired to a working MVP interaction in this workspace.
      </p>
      {statusMessage ? <p className="status-good">{statusMessage}</p> : null}

      <CoverageSection allFeatureItems={allFeatureItems} />
      <CoreBuilderSection
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        prompt={prompt}
        setPrompt={setPrompt}
        generateFromPrompt={generateFromPrompt}
        profile={profile}
        oauthAllowedUsers={oauthAllowedUsers}
        setOauthAllowedUsers={setOauthAllowedUsers}
        oauthCandidate={oauthCandidate}
        setOauthCandidate={setOauthCandidate}
        runOAuthCheck={runOAuthCheck}
        oauthResult={oauthResult}
      />
      <TemplatesDeploySection
        template={template}
        setTemplate={setTemplate}
        generateMobileScaffold={generateMobileScaffold}
        generateTests={generateTests}
        deploymentTarget={deploymentTarget}
        setDeploymentTarget={setDeploymentTarget}
        copyDeployCommand={copyDeployCommand}
        appendCommit={appendCommit}
        rollbackCommit={rollbackCommit}
      />
      <IntegrationQualitySection
        codeSnippet={codeSnippet}
        setCodeSnippet={setCodeSnippet}
        saveCodeInjection={saveCodeInjection}
        runCodeReview={runCodeReview}
        generateDocs={generateDocs}
        reviewOutput={reviewOutput}
        apiConnector={apiConnector}
        setApiConnector={setApiConnector}
        addConnector={addConnector}
        chatCommand={chatCommand}
        setChatCommand={setChatCommand}
        webhookUrl={webhookUrl}
        setWebhookUrl={setWebhookUrl}
        triggerWebhook={triggerWebhook}
      />
      <AdvancedControlsSection
        plugins={plugins}
        togglePlugin={togglePlugin}
        workflowStep={workflowStep}
        setWorkflowStep={setWorkflowStep}
        addWorkflowStep={addWorkflowStep}
        collabDraft={collabDraft}
        setCollabDraft={setCollabDraft}
        sendCollabNote={sendCollabNote}
        secretName={secretName}
        setSecretName={setSecretName}
        secretValue={secretValue}
        setSecretValue={setSecretValue}
        addSecret={addSecret}
        measurePerformance={measurePerformance}
        setIsLightTheme={setIsLightTheme}
        perfText={perfText}
      />
      <OpsToolkitSection
        createBackup={createBackup}
        restoreBackup={restoreBackup}
        backupBlob={backupBlob}
        setBackupBlob={setBackupBlob}
        abName={abName}
        setAbName={setAbName}
        addExperiment={addExperiment}
        checkDependencies={checkDependencies}
        dependencyStatus={dependencyStatus}
        importCsv={importCsv}
        setImportCsv={setImportCsv}
        importCsvData={importCsvData}
        exportProjects={exportProjects}
        importSummary={importSummary}
        usageEvents={usageEvents}
      />
      <LiveOutputsSection
        generatedOutput={generatedOutput}
        docsOutput={docsOutput}
        selectedProject={selectedProject}
        connectorList={connectorList}
        workflowSteps={workflowSteps}
        secrets={secrets}
        webhookLog={webhookLog}
        collabNotes={collabNotes}
        abExperiments={abExperiments}
      />
    </Page>
  );
}

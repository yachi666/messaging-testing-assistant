import { useState } from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent, ReactNode } from "react";
import {
  CaretDown,
  ClockCounterClockwise,
  Folder,
  GearSix,
  GridFour,
  Play,
  Warning,
} from "@phosphor-icons/react";

type WorkspaceId = "classification" | "onboarding" | "testing";

type Workspace = {
  id: WorkspaceId;
  label: string;
  eyebrow: string;
  title: string;
};

const workspaces: Workspace[] = [
  {
    id: "classification",
    label: "Classification",
    eyebrow: "Workspace 01",
    title: "User Case Classification",
  },
  {
    id: "onboarding",
    label: "Onboarding",
    eyebrow: "Workspace 02",
    title: "User Case Onboarding",
  },
  {
    id: "testing",
    label: "Intelligent Testing",
    eyebrow: "Workspace 03",
    title: "Intelligent Testing",
  },
];

const flowSteps = [
  ["Upload", "Records or schemas"],
  ["Generate", "Cases and artifacts"],
  ["Run", "Execute via MDP"],
  ["Report", "Refresh and review"],
] as const;

const testingSteps = ["Upload", "Generate", "Execute", "Report"] as const;

function App() {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>("onboarding");
  const [status, setStatus] = useState("Ready. Select a workspace and complete the required fields.");
  const [provider, setProvider] = useState("Azure OpenAI");
  const [model, setModel] = useState("gpt-4.1");
  const [classificationFile, setClassificationFile] = useState("");
  const [interfaceFile, setInterfaceFile] = useState("");
  const [isRunModalOpen, setRunModalOpen] = useState(false);

  const modelRoute = `${provider} / ${model}`;

  function showStatus(message: string) {
    setStatus(message);
    document.querySelector("#statusBanner")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function selectWorkspace(workspace: Workspace) {
    setActiveWorkspace(workspace.id);
    showStatus(`${workspace.label} workspace selected.`);
  }

  function updateFileName(event: ChangeEvent<HTMLInputElement>, setter: (fileName: string) => void) {
    const fileName = event.currentTarget.files?.[0]?.name ?? "";
    setter(fileName);

    if (fileName) {
      showStatus(`${fileName} selected.`);
    }
  }

  function closeRunModal() {
    setRunModalOpen(false);
  }

  function closeRunModalFromBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      closeRunModal();
    }
  }

  function closeRunModalWithKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      closeRunModal();
    }
  }

  return (
    <main className="page">
      <div className="app-shell">
        <header className="topbar">
          <div className="brand-block">
            <h1>Messaging Testing Assistant</h1>
            <p className="topbar-copy">
              AI-powered QA operations for messaging experiences.
            </p>
          </div>

          <div className="command-cluster">
            <div className="notice compact">
              <Warning size={18} weight="fill" aria-hidden="true" />
              <span>LLM outputs can be inaccurate or incomplete. Always review results before taking action.</span>
            </div>
            <div className="command-field">
              <label htmlFor="llm-provider">LLM Provider</label>
              <select id="llm-provider" value={provider} onChange={(event) => setProvider(event.currentTarget.value)}>
                <option>Azure OpenAI</option>
                <option>OpenAI</option>
                <option>Anthropic</option>
              </select>
            </div>
            <div className="command-field">
              <label htmlFor="llm-model">LLM Model</label>
              <select id="llm-model" value={model} onChange={(event) => setModel(event.currentTarget.value)}>
                <option>gpt-4.1</option>
                <option>gpt-4o</option>
                <option>claude-3-5-sonnet</option>
              </select>
            </div>
          </div>
        </header>

        <div className="workspace-layout">
          <aside className="app-nav" aria-label="Primary navigation">
            <button className="nav-item active" type="button">
              <GridFour size={20} aria-hidden="true" />
              Workbench
            </button>
            <button className="nav-item" type="button" onClick={() => showStatus("History view is ready for review.")}>
              <ClockCounterClockwise size={20} aria-hidden="true" />
              History
            </button>
            <button className="nav-item" type="button" onClick={() => showStatus("Template library opened.")}>
              <Folder size={20} aria-hidden="true" />
              Templates
            </button>
            <button className="nav-item" type="button" onClick={() => showStatus("Settings panel opened.")}>
              <GearSix size={20} aria-hidden="true" />
              Settings
            </button>

            <div className="recent-list">
              <span className="nav-kicker">Recent Workspaces</span>
              {["Welcome Series - Q2", "Abandoned Cart - V3", "Reactivation - Pilot", "Windback - SMS"].map((item, index) => (
                <button className="recent-item" key={item} type="button" onClick={() => showStatus(`${item} selected.`)}>
                  <strong>{item}</strong>
                  <span>Updated {index + 1}d ago</span>
                </button>
              ))}
            </div>

            <div className="profile-card">
              <span className="avatar">RM</span>
              <div>
                <strong>Riley Morgan</strong>
                <span>QA Operations</span>
              </div>
              <CaretDown size={16} aria-hidden="true" />
            </div>
          </aside>

          <div className="right-column workbench-shell">
            <section className="status-banner" id="statusBanner" role="status" aria-live="polite">
              <span className="status-dot" aria-hidden="true" />
              <div>
                <span className="status-banner__label">System Status</span>
                <span>{status}</span>
              </div>
              <span className="status-time">Model route: {modelRoute}</span>
            </section>

            <div className="workspace-command-row">
              <nav className="tab-bar" aria-label="Testing assistant workspaces">
                {workspaces.map((workspace) => (
                  <button
                    className={`tab-button ${activeWorkspace === workspace.id ? "active" : ""}`}
                    id={`tab-${workspace.id}`}
                    key={workspace.id}
                    type="button"
                    role="tab"
                    aria-selected={activeWorkspace === workspace.id}
                    aria-controls={workspace.id}
                    onClick={() => selectWorkspace(workspace)}
                  >
                    <span>{workspace.eyebrow}</span>
                    <strong>{workspace.title}</strong>
                  </button>
                ))}
              </nav>

              <div className="flow-strip" aria-label="Workflow steps">
                <span className="workflow-label">Workflow</span>
                {flowSteps.map(([title], index) => (
                  <div className={`flow-step ${index === 0 ? "active" : ""}`} key={title}>
                    <span className="flow-icon" aria-hidden="true">{index + 1}</span>
                    <strong>{title}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="document-layout">
              <section className="tab-shell">
              {activeWorkspace === "classification" ? (
                <ClassificationWorkspace
                  fileName={classificationFile}
                  onFileChange={(event) => updateFileName(event, setClassificationFile)}
                  onStatus={showStatus}
                />
              ) : null}
              {activeWorkspace === "onboarding" ? <OnboardingWorkspace onStatus={showStatus} /> : null}
              {activeWorkspace === "testing" ? (
                <TestingWorkspace
                  fileName={interfaceFile}
                  onFileChange={(event) => updateFileName(event, setInterfaceFile)}
                  onOpenRun={() => setRunModalOpen(true)}
                  onStatus={showStatus}
                />
              ) : null}
              </section>

              <ReviewRail provider={provider} model={model} onRun={() => setRunModalOpen(true)} onStatus={showStatus} />
            </div>
          </div>
        </div>
      </div>

      {isRunModalOpen ? (
        <RunModal
          onClose={closeRunModal}
          onBackdropClick={closeRunModalFromBackdrop}
          onKeyDown={closeRunModalWithKeyboard}
          onStatus={showStatus}
        />
      ) : null}
    </main>
  );
}

function ReviewRail({
  provider,
  model,
  onRun,
  onStatus,
}: {
  provider: string;
  model: string;
  onRun: () => void;
  onStatus: (message: string) => void;
}) {
  return (
    <aside className="review-rail" aria-label="Workspace review panel">
      <section className="rail-card compact-card">
        <div className="rail-title-row">
          <h2 className="rail-title">Workspace Status</h2>
          <span className="ready-pill">Ready</span>
        </div>
      </section>

      <section className="rail-card">
        <div className="rail-title-row">
          <h2 className="rail-title">Model Route</h2>
          <button className="secondary small" type="button" onClick={() => onStatus("Model settings ready to edit.")}>
            Edit settings
          </button>
        </div>
        <dl className="rail-definition">
          <div>
            <dt>Provider</dt>
            <dd>{provider}</dd>
          </div>
          <div>
            <dt>Model</dt>
            <dd>{model}</dd>
          </div>
          <div>
            <dt>Temperature</dt>
            <dd>0.3</dd>
          </div>
        </dl>
      </section>

      <section className="rail-card">
        <div className="rail-title-row">
          <h2 className="rail-title">Generated Artifact Preview</h2>
          <button className="text-button" type="button" onClick={() => onStatus("Opening all generated artifacts.")}>
            View all
          </button>
        </div>
        <span className="artifact-label">Sample Test Case</span>
        <pre className="code-preview">{`TC-001
Title: Check account balance
Intent: Get Account Balance

Example utterances:
- What's my checking balance?
- How much is in my account?
- Show my current balance.`}</pre>
      </section>

      <section className="rail-card">
        <div className="rail-title-row">
          <h2 className="rail-title">Action Checklist</h2>
          <span className="muted">5 of 5 completed</span>
        </div>
        <div className="check-progress" aria-hidden="true" />
        {["Validate test cases", "Validate user journeys", "Validate example utterances", "Validate edge cases", "Validate system prompts"].map((item) => (
          <label className="check-row" key={item}>
            <input type="checkbox" defaultChecked />
            <span>{item}</span>
          </label>
        ))}
      </section>

      <button className="primary rail-run" type="button" onClick={onRun}>
        <Play size={18} weight="fill" aria-hidden="true" />
        Run Tests
      </button>
      <button className="secondary rail-save" type="button" onClick={() => onStatus("Workspace saved.")}>
        Save Workspace
      </button>
      <button className="danger text-danger" type="button" onClick={() => onStatus("Discard workspace requested.")}>
        Discard Workspace
      </button>
    </aside>
  );
}

function ClassificationWorkspace({
  fileName,
  onFileChange,
  onStatus,
}: {
  fileName: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onStatus: (message: string) => void;
}) {
  return (
    <section className="workspace-panel-stack active" id="classification" role="tabpanel" aria-labelledby="tab-classification">
      <WorkspaceHero
        icon="UC"
        caption="Analysis Workspace"
        title="User Case Classification"
        description="Upload SMS record files, classify message content with regex-assisted LLM analysis, and upload the generated classification CSV to GitHub."
        stats={[
          ["CSV", "Artifact"],
          ["4", "Signals"],
        ]}
      />

      <div className="classification-grid">
        <section className="card panel">
          <SectionHeader icon="IN" eyebrow="Input" title="SMS Classification Input" />
          <p className="card-desc">Upload TXT, CSV, or XLSX SMS record files and generate a classification CSV artifact.</p>
          <div className="field">
            <label htmlFor="classification-file">
              <span className="required-mark">*</span>SMS Record File
            </label>
            <input id="classification-file" type="file" accept=".txt,.csv,.xlsx" onChange={onFileChange} />
            <small>Supported formats: TXT, CSV, XLSX.</small>
            <FilePreview fileName={fileName} />
          </div>
          <TextField id="classification-folder" label="GitHub Folder Path" required placeholder="Enter GitHub folder path" />
          <TextField id="classification-message" label="Commit Message" placeholder="Leave blank to use the default commit message" />
          <div className="button-row">
            <button className="primary" type="button" onClick={() => onStatus("Classification analysis started.")}>
              User Case Analysis
            </button>
          </div>
          <MetricGrid
            metrics={[
              ["0", "Total messages"],
              ["0", "Regex matched"],
              ["0", "LLM classified"],
              ["0", "Manual review"],
            ]}
          />
        </section>

        <section className="card panel">
          <SectionHeader icon="HI" eyebrow="History" title="Classification History" />
          <p className="card-desc">
            Review generated sms-classification CSV files from the configured GitHub history folder, open them in GitHub,
            or download them locally.
          </p>
          <TextField id="history-folder" label="History Folder Path" placeholder="Enter GitHub history folder" />
          <div className="button-row">
            <button className="secondary" type="button" onClick={() => onStatus("Classification history refreshed.")}>
              Refresh History
            </button>
            <button className="secondary" type="button" onClick={() => onStatus("Latest CSV downloaded.")}>
              Download CSV
            </button>
          </div>
          <div className="list-panel" aria-label="Classification records">
            <article className="record-item">
              <span className="report-status">Ready</span>
              <div className="record-main">
                <strong className="record-title">sms-classification-sample.csv</strong>
                <span className="record-meta">CSV</span>
              </div>
              <p className="muted">Prompt: default-classification-prompt</p>
              <div className="record-actions">
                <button className="secondary" type="button" onClick={() => onStatus("Opening sms-classification-sample.csv.")}>
                  Open CSV
                </button>
                <button className="secondary" type="button" onClick={() => onStatus("Downloading sms-classification-sample.csv.")}>
                  Download
                </button>
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}

function OnboardingWorkspace({ onStatus }: { onStatus: (message: string) => void }) {
  return (
    <section className="workspace-panel-stack active" id="onboarding" role="tabpanel" aria-labelledby="tab-onboarding">
      <WorkspaceHero
        icon="ON"
        caption="Automation Workspace"
        title="User Case Onboarding Automation"
        description="Build activation packages, download generated files, and deactivate existing UseCases when needed."
        stats={[
          ["2", "Types"],
          ["ZIP", "Package"],
        ]}
      />

      <section className="card panel usecase-section">
        <SectionHeader icon="AC" eyebrow="Activate" title="UseCase Activate" />
        <div className="field">
          <label htmlFor="usecase-type">UseCase Type</label>
          <select id="usecase-type">
            <option>MQ_CONNECTOR</option>
            <option>INGRESS_BRIDGE_API</option>
          </select>
        </div>
        <div className="usecase-subcard">
          <div className="usecase-config-grid">
            <TextField id="usecase-name" label="UseCase Name" required placeholder="Enter UseCase name" />
            <TextField id="tenant-id" label="Tenant ID" required placeholder="Enter Tenant ID" />
            <TextField id="pipeline" label="Pipeline" placeholder="Enter pipeline" />
          </div>
          <div className="field">
            <label htmlFor="source-list">Source Lists</label>
            <textarea id="source-list" placeholder="source, sender, senderId, mode, providers" />
          </div>
        </div>
        <div className="actions">
          <button className="primary" type="button" onClick={() => onStatus("UseCase Activate Success. Files are ready to download.")}>
            Activate
          </button>
          <button className="secondary" type="button" onClick={() => onStatus("UseCase package downloaded.")}>
            Download
          </button>
        </div>

        <div className="usecase-subcard">
          <h3 className="card-title">Deactivate UseCase</h3>
          <p className="card-desc">Submit a deactivation request by UseCase Name and Tenant ID.</p>
          <div className="usecase-config-grid">
            <TextField id="deactivate-usecase" label="UseCase Name" placeholder="Enter UseCase name" />
            <TextField id="deactivate-tenant" label="Tenant ID" placeholder="Enter Tenant ID" />
          </div>
          <button className="danger" type="button" onClick={() => onStatus("Deactivate request sent successfully.")}>
            Deactivate
          </button>
        </div>
      </section>
    </section>
  );
}

function TestingWorkspace({
  fileName,
  onFileChange,
  onOpenRun,
  onStatus,
}: {
  fileName: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onOpenRun: () => void;
  onStatus: (message: string) => void;
}) {
  return (
    <section className="workspace-panel-stack active" id="testing" role="tabpanel" aria-labelledby="tab-testing">
      <WorkspaceHero
        icon="IT"
        caption="Primary Workspace"
        title="Intelligent Testing"
        description="Upload interface specifications, generate AI-assisted test cases, and manage execution/reporting from one workspace."
        variant="light"
        stats={[
          ["MDP", "Execution"],
          ["AI", "Cases"],
        ]}
      >
        <div className="overview-strip">
          {testingSteps.map((step) => (
            <span className="overview-chip" key={step}>
              {step}
            </span>
          ))}
        </div>
      </WorkspaceHero>

      <div className="tab-panel-grid">
        <section className="card panel">
          <SectionHeader icon="GE" eyebrow="Generator" title="Upload and Generate" />
          <p className="card-desc">Generate a GitHub-backed test case artifact from the selected interface or schema file.</p>
          <div className="field">
            <label htmlFor="generation-mode">
              <span className="required-mark">*</span>Action Type
            </label>
            <select id="generation-mode">
              <option>Generation test case</option>
              <option>Upload test case</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="interface-file">
              <span className="required-mark">*</span>Choose File
            </label>
            <input id="interface-file" type="file" onChange={onFileChange} />
            <small>Support JSON, YAML, TXT, XML, OpenAPI, Postman collection, or other message specification files.</small>
            <FilePreview fileName={fileName} />
          </div>
          <TextField id="github-folder" label="GitHub Folder Path" required placeholder="Enter GitHub folder path" />
          <TextField id="test-case-count" label="Test Case Count" type="number" placeholder="Optional" />
          <TextField id="commit-message" label="Commit Message" placeholder="Leave blank to use default commit message" />
          <button className="primary" type="button" onClick={() => onStatus("Generating test case with the selected language model...")}>
            Upload and Generate
          </button>
        </section>

        <section className="card panel">
          <SectionHeader icon="RE" eyebrow="Records" title="Generated Test Case Records" />
          <p className="card-desc">Refresh generated records, run a test case, generate reports, and open generated report output.</p>
          <div className="button-row">
            <button className="secondary" type="button" onClick={() => onStatus("Records refreshed.")}>
              Refresh Records
            </button>
          </div>
          <div className="list-panel">
            <article className="record-item">
              <span className="report-status">Ready</span>
              <div className="record-main">
                <strong className="record-title">user-upload-test-case-mq-simple-xml.csv</strong>
                <span className="record-meta">2026-06-09</span>
              </div>
              <p className="muted">Path: github/folder/generated-test-cases</p>
              <div className="record-actions">
                <button className="secondary" type="button" onClick={onOpenRun}>
                  Run
                </button>
                <button className="secondary" type="button" onClick={() => onStatus("Report refreshed.")}>
                  Refresh Report
                </button>
                <button className="secondary" type="button" onClick={() => onStatus("Opening generated report.")}>
                  View Report
                </button>
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}

function WorkspaceHero({
  icon,
  caption,
  title,
  description,
  stats,
  variant = "dark",
  children,
}: {
  icon: string;
  caption: string;
  title: string;
  description: string;
  stats: readonly (readonly [string, string])[];
  variant?: "dark" | "light";
  children?: ReactNode;
}) {
  return (
    <div className={`workspace-hero ${variant === "light" ? "intelligent-hero" : ""}`}>
      <div className="workspace-hero-header">
        <span className="workspace-hero-icon">{icon}</span>
        <div>
          <span className={`workspace-caption-pill ${variant === "light" ? "workspace-caption-pill--light" : ""}`}>{caption}</span>
          <h2>{title}</h2>
          <p>{description}</p>
          {children}
        </div>
      </div>
      <div className="hero-stats" aria-label={`${title} summary`}>
        {stats.map(([value, label]) => (
          <div className="hero-stat" key={`${value}-${label}`}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ icon, eyebrow, title }: { icon: string; eyebrow: string; title: string }) {
  return (
    <div className="section-header">
      <span className="section-header__icon">{icon}</span>
      <div>
        <span className="muted">{eyebrow}</span>
        <h2 className="card-title">{title}</h2>
      </div>
    </div>
  );
}

function TextField({
  id,
  label,
  placeholder,
  required = false,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: "text" | "number";
}) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {required ? <span className="required-mark">*</span> : null}
        {label}
      </label>
      <input id={id} type={type} min={type === "number" ? 1 : undefined} placeholder={placeholder} />
    </div>
  );
}

function FilePreview({ fileName }: { fileName: string }) {
  return fileName ? <div className="file-preview active">Selected: {fileName}</div> : null;
}

function MetricGrid({ metrics }: { metrics: readonly (readonly [string, string])[] }) {
  return (
    <div className="summary-grid">
      {metrics.map(([value, label]) => (
        <div className="workspace-metric" key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function RunModal({
  onClose,
  onBackdropClick,
  onKeyDown,
  onStatus,
}: {
  onClose: () => void;
  onBackdropClick: (event: MouseEvent<HTMLDivElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onStatus: (message: string) => void;
}) {
  function confirmRun() {
    onClose();
    onStatus("Running selected test case...");
  }

  return (
    <div className="modal-backdrop active" id="runModal" aria-hidden="false" onClick={onBackdropClick} onKeyDown={onKeyDown}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="run-title">
        <div className="modal-header">
          <h2 className="card-title" id="run-title">
            Run Test Case
          </h2>
          <button className="secondary" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="field">
          <label htmlFor="integration-pattern">Integration Pattern</label>
          <select id="integration-pattern" autoFocus>
            <option>ingress_api</option>
            <option>mq_connector</option>
          </select>
        </div>
        <TextField id="run-tenant" label="Tenant ID" placeholder="Enter Tenant ID" />
        <TextField id="run-usecase" label="UseCase" placeholder="Enter UseCase" />
        <div className="actions">
          <button className="primary" type="button" onClick={confirmRun}>
            Confirm Run
          </button>
          <button className="secondary" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;

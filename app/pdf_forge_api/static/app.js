const outputNameField = {
  id: "output_name",
  label: "Output name",
  type: "text",
  placeholder: "Auto",
  value: "",
};

const operations = {
  merge: {
    label: "Merge",
    noun: "PDF stack",
    title: "Merge PDFs",
    tagline: "Combine documents into a clean output file.",
    endpoint: "/jobs/merge",
    demoEndpoint: "/jobs/demo/merge",
    accept: "application/pdf,.pdf",
    allowedExtensions: [".pdf"],
    multiple: true,
    stagingHint: "Merge order runs top to bottom.",
    requirement: "2+ PDFs",
    routeLabel: "Combine",
    routeTarget: "One PDF",
    minFiles: 2,
    fields: [outputNameField],
    icon: "layers",
    compare: {
      action: "Choose merge",
      guidance: "Best when several PDFs should become one ordered PDF.",
      intent: "combine",
      tradeoff: "Keeps every page from every staged PDF.",
    },
  },
  split: {
    label: "Split",
    noun: "Page range",
    title: "Split PDF",
    tagline: "Extract single pages or selected ranges.",
    endpoint: "/jobs/split",
    demoEndpoint: "/jobs/demo/split",
    accept: "application/pdf,.pdf",
    allowedExtensions: [".pdf"],
    multiple: false,
    stagingHint: "One source PDF creates page files.",
    requirement: "1 PDF",
    routeLabel: "Extract",
    routeTarget: "Pages",
    minFiles: 1,
    fields: [
      {
        id: "pages",
        label: "Pages",
        type: "text",
        placeholder: "1,3-5",
        value: "",
      },
      outputNameField,
    ],
    icon: "split",
    compare: {
      action: "Choose split",
      guidance: "Best when one PDF needs selected pages pulled out.",
      intent: "extract",
      tradeoff: "Creates separate page files, bundled when there is more than one.",
    },
  },
  rotate: {
    label: "Rotate",
    noun: "Orientation",
    title: "Rotate PDF",
    tagline: "Turn every page into the right orientation.",
    endpoint: "/jobs/rotate",
    demoEndpoint: "/jobs/demo/rotate",
    accept: "application/pdf,.pdf",
    allowedExtensions: [".pdf"],
    multiple: false,
    stagingHint: "One source PDF is rotated.",
    requirement: "1 PDF",
    routeLabel: "Turn",
    routeTarget: "Orientation",
    minFiles: 1,
    fields: [
      {
        id: "degrees",
        label: "Degrees",
        type: "select",
        value: "90",
        options: ["90", "180", "270"],
      },
      outputNameField,
    ],
    icon: "rotate",
    compare: {
      action: "Choose rotate",
      guidance: "Best when the pages are sideways or upside down.",
      intent: "fix",
      tradeoff: "Changes orientation without extracting or converting pages.",
    },
  },
  compress: {
    label: "Compress",
    noun: "File size",
    title: "Compress PDF",
    tagline: "Reduce PDF size with local Ghostscript profiles.",
    endpoint: "/jobs/compress",
    demoEndpoint: "/jobs/demo/compress",
    accept: "application/pdf,.pdf",
    allowedExtensions: [".pdf"],
    multiple: false,
    stagingHint: "One source PDF creates a smaller PDF when Ghostscript is installed.",
    requirement: "1 PDF",
    routeLabel: "Shrink",
    routeTarget: "Smaller PDF",
    minFiles: 1,
    fields: [
      {
        id: "profile",
        label: "Profile",
        type: "select",
        value: "ebook",
        options: ["screen", "ebook", "printer", "prepress"],
      },
      outputNameField,
    ],
    icon: "compress",
    compare: {
      action: "Choose compress",
      guidance: "Best when a PDF needs to be smaller for upload or sharing.",
      intent: "reduce",
      tradeoff: "Requires Ghostscript locally; stronger compression can soften images.",
    },
  },
  "images-to-pdf": {
    label: "Images",
    noun: "Image set",
    title: "Images to PDF",
    tagline: "Turn image batches into one document.",
    endpoint: "/jobs/images-to-pdf",
    demoEndpoint: "/jobs/demo/images-to-pdf",
    accept: "image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp",
    allowedExtensions: [".png", ".jpg", ".jpeg", ".webp"],
    multiple: true,
    stagingHint: "PDF page order runs top to bottom.",
    requirement: "1+ image",
    routeLabel: "Build",
    routeTarget: "Image PDF",
    minFiles: 1,
    fields: [outputNameField],
    icon: "image",
    compare: {
      action: "Choose images",
      guidance: "Best when photos or scans should become a PDF.",
      intent: "convert",
      tradeoff: "Uses the staged image order as the PDF page order.",
    },
  },
  "pdf-to-images": {
    label: "Render",
    noun: "Page images",
    title: "PDF to Images",
    tagline: "Render pages as crisp PNG files.",
    endpoint: "/jobs/pdf-to-images",
    demoEndpoint: "/jobs/demo/pdf-to-images",
    accept: "application/pdf,.pdf",
    allowedExtensions: [".pdf"],
    multiple: false,
    stagingHint: "One source PDF renders to images.",
    requirement: "1 PDF",
    routeLabel: "Render",
    routeTarget: "PNGs",
    minFiles: 1,
    fields: [
      {
        id: "dpi",
        label: "DPI",
        type: "number",
        min: 72,
        max: 600,
        value: "144",
      },
      outputNameField,
    ],
    icon: "render",
    compare: {
      action: "Choose render",
      guidance: "Best when PDF pages need to become PNG images.",
      intent: "convert",
      tradeoff: "Exports page images instead of changing the source PDF.",
    },
  },
};

const compareIntents = [
  {
    detail: "Show every local route.",
    key: "all",
    label: "All",
  },
  {
    detail: "Make one PDF from staged files.",
    key: "combine",
    label: "Combine",
  },
  {
    detail: "Pull pages out of one PDF.",
    key: "extract",
    label: "Extract",
  },
  {
    detail: "Correct page orientation.",
    key: "fix",
    label: "Fix",
  },
  {
    detail: "Shrink a PDF for sharing.",
    key: "reduce",
    label: "Reduce",
  },
  {
    detail: "Move between PDFs and image files.",
    key: "convert",
    label: "Convert",
  },
];

const sampleAssets = {
  pdf:
    "JVBERi0xLjMKJeLjz9MKMSAwIG9iago8PAovUHJvZHVjZXIgKHB5cGRmKQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWyA0IDAgUiBdCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoKNCAwIG9iago8PAovVHlwZSAvUGFnZQovUmVzb3VyY2VzIDw8Cj4+Ci9NZWRpYUJveCBbIDAuMCAwLjAgMjAwIDIwMCBdCi9QYXJlbnQgMiAwIFIKPj4KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDU0IDAwMDAwIG4gCjAwMDAwMDAxMTMgMDAwMDAgbiAKMDAwMDAwMDE2MiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMyAwIFIKL0luZm8gMSAwIFIKPj4Kc3RhcnR4cmVmCjI1NgolJUVPRgo=",
  pngs: [
    "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAgUlEQVR4nNXOMREAIBDAsFL//thQgQBE/MA1CrLu2ZRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMRJnMT5OzD1AJ1/AymawcWGAAAAAElFTkSuQmCC",
    "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAgElEQVR4nNXOQQ0AIBDAsDH/Ogk/LCDiHmRV0LXvoUziJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJE7iJM7fgakHYnQDPUVB2hYAAAAASUVORK5CYII=",
    "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAgElEQVR4nNXOMREAIBDAsFL/QlkY2RHxA9coyNrnUiZxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEidxEufvwNQD1a0DSoK2NQgAAAAASUVORK5CYII=",
  ],
};

const pathCopy = [
  {
    copy: "Pick the operation.",
    focus: "#operationNav button",
    icon: "bundle",
    label: "Choose",
    action: "Pick",
    hint: "1",
  },
  {
    copy: "Add files that match the route.",
    focus: "#dropZone",
    icon: "up",
    label: "Stage",
    action: "Browse",
    hint: "2",
  },
  {
    copy: "Set output name and options.",
    focus: "#settingsForm input, #settingsForm select",
    icon: "render",
    label: "Tune",
    action: "Adjust",
    hint: "3",
  },
  {
    copy: "Run a clean build.",
    focus: "#runButton",
    icon: "spark",
    label: "Build",
    action: "Build",
    hint: "Enter",
  },
  {
    copy: "Collect and download.",
    focus: ".results-list .claim-primary, .results-list .claim-secondary",
    icon: "download",
    label: "Claim",
    action: "Download",
    hint: "Done",
  },
];

const state = {
  lastReceipt: null,
  operationKey: "merge",
  bundle: null,
  compareIntent: "all",
  compareOpen: false,
  compressionTool: {
    available: false,
    command: null,
    loading: true,
    message: "Checking Ghostscript...",
    profiles: [],
    source: null,
  },
  dragFileIndex: null,
  fileDetails: [],
  files: [],
  outputNameTouched: false,
  outputJobs: [],
  outputJobsLoading: false,
  pendingCleanupJobId: null,
  presets: {},
  recent: [],
  recentLimit: 5,
  recovery: null,
  results: [],
  running: false,
  welcomeDismissed: false,
};

let pendingReceipt = null;

const orderSensitiveRoutes = new Set(["merge", "images-to-pdf"]);

const dom = {
  operationNav: document.querySelector("#operationNav"),
  routeBoard: document.querySelector("#routeBoard"),
  routeCompareDetail: document.querySelector("#routeCompareDetail"),
  routeCompareFilters: document.querySelector("#routeCompareFilters"),
  routeCompareList: document.querySelector("#routeCompareList"),
  routeComparePanel: document.querySelector("#routeComparePanel"),
  routeCompareToggle: document.querySelector("#routeCompareToggle"),
  routePulse: document.querySelector("#routePulse"),
  routeIntelLabel: document.querySelector("#routeIntelLabel"),
  routeIntelTitle: document.querySelector("#routeIntelTitle"),
  routeIntelDetail: document.querySelector("#routeIntelDetail"),
  routeIntelFacts: document.querySelector("#routeIntelFacts"),
  routeIntelPrimaryButton: document.querySelector("#routeIntelPrimaryButton"),
  routeIntelSecondaryButton: document.querySelector("#routeIntelSecondaryButton"),
  routeSuggestion: document.querySelector("#routeSuggestion"),
  routeSuggestionLabel: document.querySelector("#routeSuggestionLabel"),
  routeSuggestionButton: document.querySelector("#routeSuggestionButton"),
  operationTitle: document.querySelector("#operationTitle"),
  operationTagline: document.querySelector("#operationTagline"),
  fileRequirement: document.querySelector("#fileRequirement"),
  fileInput: document.querySelector("#fileInput"),
  browseButton: document.querySelector("#browseButton"),
  sampleButton: document.querySelector("#sampleButton"),
  stageSampleButton: document.querySelector("#stageSampleButton"),
  missionStrip: document.querySelector("#missionStrip"),
  missionLabel: document.querySelector("#missionLabel"),
  missionTitle: document.querySelector("#missionTitle"),
  missionDetail: document.querySelector("#missionDetail"),
  missionProgress: document.querySelector("#missionProgress"),
  missionActionButton: document.querySelector("#missionActionButton"),
  missionControl: document.querySelector("#missionControl"),
  missionControlTitle: document.querySelector("#missionControlTitle"),
  missionControlScore: document.querySelector("#missionControlScore"),
  missionChecks: document.querySelector("#missionChecks"),
  clearButton: document.querySelector("#clearButton"),
  dropZone: document.querySelector("#dropZone"),
  fileList: document.querySelector("#fileList"),
  settingsForm: document.querySelector("#settingsForm"),
  presetPanel: document.querySelector("#presetPanel"),
  presetTitle: document.querySelector("#presetTitle"),
  presetApplyButton: document.querySelector("#presetApplyButton"),
  presetSaveButton: document.querySelector("#presetSaveButton"),
  jobPreview: document.querySelector("#jobPreview"),
  previewTitle: document.querySelector("#previewTitle"),
  previewChip: document.querySelector("#previewChip"),
  previewSteps: document.querySelector("#previewSteps"),
  runButton: document.querySelector("#runButton"),
  jobMessage: document.querySelector("#jobMessage"),
  recoveryPanel: document.querySelector("#recoveryPanel"),
  recoveryTitle: document.querySelector("#recoveryTitle"),
  recoveryDetail: document.querySelector("#recoveryDetail"),
  recoverySampleButton: document.querySelector("#recoverySampleButton"),
  recoveryClearButton: document.querySelector("#recoveryClearButton"),
  recoverySwitchButton: document.querySelector("#recoverySwitchButton"),
  resultsList: document.querySelector("#resultsList"),
  resultCount: document.querySelector("#resultCount"),
  recentList: document.querySelector("#recentList"),
  recentSummary: document.querySelector("#recentSummary"),
  recentLimitSelect: document.querySelector("#recentLimitSelect"),
  clearRecentButton: document.querySelector("#clearRecentButton"),
  cleanupList: document.querySelector("#cleanupList"),
  cleanupRefreshButton: document.querySelector("#cleanupRefreshButton"),
  cleanupSummary: document.querySelector("#cleanupSummary"),
  pathSteps: document.querySelector("#pathSteps"),
  pathNextHint: document.querySelector("#pathNextHint"),
  pathQuickActions: document.querySelector("#pathQuickActions"),
  pathWelcome: document.querySelector("#pathWelcome"),
  pathWelcomeDismiss: document.querySelector("#pathWelcomeDismiss"),
  storageStatus: document.querySelector("#storageStatus"),
};

const PATH_WELCOME_KEY = "pdfForgePathWelcomeDismissed";

function icon(name) {
  const icons = {
    layers: '<path d="m12 3 8 4.5-8 4.5-8-4.5z"/><path d="m4 12 8 4.5 8-4.5"/><path d="m4 16.5 8 4.5 8-4.5"/>',
    split: '<path d="M12 3v18"/><path d="M5 6.5h4"/><path d="M5 12h4"/><path d="M5 17.5h4"/><path d="M15 6.5h4"/><path d="M15 12h4"/><path d="M15 17.5h4"/>',
    rotate: '<path d="M5.5 9.5A7 7 0 1 1 7 17.5"/><path d="M5.5 4.8v4.7H10"/>',
    compress: '<path d="M8 4h8v16H8z"/><path d="m4 8 4 4-4 4"/><path d="m20 8-4 4 4 4"/>',
    image: '<path d="M5 5h14v14H5z"/><path d="m8 15 2.8-3 2.2 2.3 1.3-1.4L17 16"/><path d="M8.5 8.8h.1"/>',
    render: '<path d="M5 4.8h14v10.4H5z"/><path d="M8 19.2h8"/><path d="M12 15.2v4"/><path d="M8.5 8.5h7"/><path d="M8.5 11.5h4"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    file: '<path d="M6 4.8h8.2L18 8.6v10.6H6z"/><path d="M14.2 4.8v3.8H18"/>',
    bundle: '<path d="M5 8.4 12 4l7 4.4-7 4.4z"/><path d="M5 8.4v7.2L12 20l7-4.4V8.4"/><path d="M12 12.8V20"/>',
    up: '<path d="m7 11 5-5 5 5"/><path d="M12 18V6"/>',
    down: '<path d="m7 13 5 5 5-5"/><path d="M12 6v12"/>',
    download: '<path d="M12 4v10"/><path d="m8.5 10.5 3.5 3.5 3.5-3.5"/><path d="M5.5 18.5h13"/>',
    spark: '<path d="m12 3 1.2 4 3.8 1.2-3.8 1.2L12 13l-1.2-3.6L7 8.2 10.8 7z"/><path d="m17.5 13 .8 2.5 2.2.8-2.2.8-.8 2.4-.8-2.4-2.2-.8 2.2-.8z"/><path d="m6.5 14 .6 1.8 1.6.6-1.6.6-.6 1.7-.6-1.7-1.6-.6 1.6-.6z"/>',
    check: '<path d="m5 12.5 4 4L19 6.5"/>',
    alert: '<path d="M12 8v5"/><path d="M12 17h.1"/><path d="M10.3 4.9h3.4L21 18H3z"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] ?? icons.file}</svg>`;
}

function renderOperationNav() {
  dom.operationNav.innerHTML = Object.entries(operations)
    .map(([key, operation]) => {
      const current = key === state.operationKey ? "true" : "false";
      return `
        <button class="operation-button" type="button" data-operation="${key}" aria-current="${current}">
          <span class="operation-icon">${icon(operation.icon)}</span>
          <span>
            <span class="operation-name">${operation.label}</span>
            <span class="operation-type">${operation.noun}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderRouteBoard() {
  dom.routePulse.textContent = `${currentOperation().label} ready`;
  dom.routeBoard.innerHTML = Object.entries(operations)
    .map(([key, operation]) => {
      const current = key === state.operationKey ? "true" : "false";
      return `
        <button class="route-button" type="button" data-route="${key}" aria-current="${current}" aria-label="${operation.routeLabel} route: ${operation.title}">
          <span class="route-icon">${icon(operation.icon)}</span>
          <span class="route-copy">
            <span class="route-label">${operation.routeLabel}</span>
            <span class="route-target">${operation.routeTarget}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderRouteCompare() {
  dom.routeComparePanel.hidden = !state.compareOpen;
  dom.routeCompareToggle.dataset.active = state.compareOpen ? "true" : "false";
  dom.routeCompareToggle.setAttribute("aria-expanded", String(state.compareOpen));
  if (!state.compareOpen) return;

  const activeIntent = compareIntents.find((intent) => intent.key === state.compareIntent) || compareIntents[0];
  dom.routeCompareDetail.textContent = activeIntent.detail;
  dom.routeCompareFilters.innerHTML = compareIntents
    .map((intent) => {
      const active = intent.key === activeIntent.key ? "true" : "false";
      return `
        <button class="route-compare-filter" type="button" data-compare-intent="${intent.key}" aria-pressed="${active}">
          ${intent.label}
        </button>
      `;
    })
    .join("");

  dom.routeCompareList.innerHTML = Object.entries(operations)
    .filter(([, operation]) => activeIntent.key === "all" || operation.compare.intent === activeIntent.key)
    .map(([key, operation]) => renderCompareCard(key, operation))
    .join("");
}

function renderCompareCard(key, operation) {
  const current = key === state.operationKey;
  return `
    <article class="compare-card" aria-current="${current}">
      <div class="compare-card-heading">
        <span class="compare-icon">${icon(operation.icon)}</span>
        <div class="compare-copy">
          <h4>${operation.title}</h4>
          <p>${operation.compare.guidance}</p>
        </div>
      </div>
      <div class="compare-facts">
        <span><small>Input</small><strong>${operation.requirement}</strong></span>
        <span><small>Output</small><strong>${operation.routeTarget}</strong></span>
      </div>
      <div class="compare-note">${operation.compare.tradeoff}</div>
      <div class="compare-actions">
        <button class="compare-primary" type="button" data-compare-route="${key}" ${current ? "disabled" : ""}>
          ${current ? "Selected" : operation.compare.action}
        </button>
        <button class="compare-secondary" type="button" data-compare-sample="${key}">
          Try sample
        </button>
      </div>
    </article>
  `;
}

function renderOperation() {
  const operation = currentOperation();
  dom.operationTitle.textContent = operation.title;
  dom.operationTagline.textContent = operation.tagline;
  dom.fileRequirement.textContent = operation.requirement;
  dom.fileInput.accept = operation.accept;
  dom.fileInput.multiple = operation.multiple;
  renderSettingsForm();
  renderPresetPanel();
  renderOperationNav();
  renderRouteBoard();
  renderRouteCompare();
  renderRouteIntel();
  renderFiles();
  renderResults();
  renderRecent();
  renderMessage();
  renderPath();
  renderMission();
}

function renderSettingsForm() {
  const operation = currentOperation();
  const preserveValues = dom.settingsForm.dataset.operationKey === state.operationKey;
  const existingValues = preserveValues ? getCurrentFieldValues(operation) : {};
  const fieldsMarkup = operation.fields.map(renderField).join("");
  const toolMarkup = state.operationKey === "compress" ? renderCompressionToolStatus() : "";
  dom.settingsForm.innerHTML = fieldsMarkup + toolMarkup;
  dom.settingsForm.dataset.operationKey = state.operationKey;

  if (preserveValues) {
    for (const [fieldId, value] of Object.entries(existingValues)) {
      const field = dom.settingsForm.elements[fieldId];
      if (field) field.value = value;
    }
  }
}

function renderCompressionToolStatus() {
  const status = state.compressionTool;
  const stateLabel = status.loading ? "checking" : status.available ? "ready" : "missing";
  const title = status.loading
    ? "Checking Ghostscript"
    : status.available
    ? "Ghostscript ready"
    : "Ghostscript needed";
  const detail =
    status.message ||
    "Set PAGEWRIGHT_GHOSTSCRIPT_PATH to a Ghostscript executable or add Ghostscript to PATH.";
  const command = status.command ? `<span>Command ${escapeHtml(status.command)}</span>` : "";
  const profiles =
    status.profiles?.length > 0 ? `<span>Profiles ${escapeHtml(status.profiles.join(", "))}</span>` : "";

  return `
    <div class="tool-status" data-state="${stateLabel}" role="status">
      <div class="tool-status-heading">
        <span>${icon(status.available ? "check" : "alert")}</span>
        <strong>${escapeHtml(title)}</strong>
      </div>
      <p>${escapeHtml(detail)}</p>
      <div class="tool-status-facts">
        ${command}
        ${profiles}
      </div>
    </div>
  `;
}

function renderPresetPanel() {
  const operation = currentOperation();
  if (operation.fields.length === 0) {
    dom.presetPanel.hidden = true;
    return;
  }

  const preset = state.presets[state.operationKey];
  dom.presetPanel.hidden = false;
  dom.presetApplyButton.disabled = !preset;
  dom.presetTitle.textContent = preset
    ? `Saved: ${formatPresetSummary(operation, preset.fields)}`
    : "No preset saved";
}

function renderRouteIntel() {
  const operation = currentOperation();
  const mission = getMissionState();
  const suggestion = getRouteSuggestion();
  const staged =
    state.files.length >= operation.minFiles
      ? `${state.files.length} staged`
      : `${state.files.length}/${operation.minFiles} staged`;
  dom.routeIntelLabel.textContent = `${operation.routeLabel} Route`;
  dom.routeIntelTitle.textContent = operation.title;
  dom.routeIntelDetail.textContent = operation.tagline;
  dom.routeIntelFacts.innerHTML = [
    ["Input", operation.requirement],
    ["Output", operation.routeTarget],
    ["Stage", staged],
  ]
    .map(
      ([label, value]) => `
        <span class="route-intel-fact">
          <span>${label}</span>
          <strong>${value}</strong>
        </span>
      `,
    )
    .join("");
  dom.routeIntelPrimaryButton.textContent = mission.actionLabel;
  dom.routeIntelPrimaryButton.dataset.routeAction = mission.action;
  dom.routeIntelPrimaryButton.setAttribute("data-route-action", mission.action);
  dom.routeIntelPrimaryButton.disabled = mission.disabled;

  if (dom.routeSuggestion && suggestion) {
    dom.routeSuggestion.hidden = false;
    dom.routeSuggestionLabel.textContent = "Guided path hint";
    dom.routeSuggestionButton.textContent = suggestion.label;
    dom.routeSuggestionButton.dataset.routeSuggestion = suggestion.routeKey;
    dom.routeSuggestionButton.title = suggestion.detail;
  } else if (dom.routeSuggestion) {
    dom.routeSuggestion.hidden = true;
    dom.routeSuggestionButton.removeAttribute("data-route-suggestion");
    dom.routeSuggestionButton.textContent = "";
    dom.routeSuggestionButton.title = "";
  }
}

function renderField(field) {
  if (field.type === "select") {
    return `
      <div class="field">
        <label for="${field.id}">${field.label}</label>
        <select id="${field.id}" name="${field.id}">
          ${field.options
            .map((option) => `<option value="${option}" ${option === field.value ? "selected" : ""}>${option}</option>`)
            .join("")}
        </select>
      </div>
    `;
  }

  const attributes = [
    `type="${field.type}"`,
    `id="${field.id}"`,
    `name="${field.id}"`,
    `value="${field.value ?? ""}"`,
    field.placeholder ? `placeholder="${field.placeholder}"` : "",
    field.min ? `min="${field.min}"` : "",
    field.max ? `max="${field.max}"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `
    <div class="field">
      <label for="${field.id}">${field.label}</label>
      <input ${attributes} />
    </div>
  `;
}

function renderFiles() {
  syncSuggestedOutputName();
  if (state.files.length === 0) {
    dom.fileList.innerHTML = `
      <div class="staging-summary">
        <span>${currentOperation().stagingHint}</span>
        <span>${currentOperation().requirement}</span>
      </div>
      <div class="empty-state">No files staged</div>
    `;
  } else {
    const operation = currentOperation();
    const totalSize = state.files.reduce((sum, file) => sum + file.size, 0);
    const reorderable = operation.multiple && state.files.length > 1;
    const fileRows = state.files
      .map((file, index) => {
        const position = index + 1;
        return `
          <div class="file-row" draggable="${reorderable ? "true" : "false"}" data-file-index="${index}">
            <div class="file-order">${position}</div>
            <div class="file-meta">
              <div class="file-name">${escapeHtml(file.name)}</div>
              <div class="file-size">${formatFileMeta(file, index)}</div>
              ${reorderable ? '<div class="file-drag-hint">Drag to reorder</div>' : ""}
            </div>
            <div class="file-actions">
              ${
                reorderable
                  ? `
                    <button class="icon-button" type="button" data-move-file="${index}" data-direction="-1" aria-label="Move ${escapeHtml(file.name)} up" ${index === 0 ? "disabled" : ""}>
                      ${icon("up")}
                      <span>Earlier</span>
                    </button>
                    <button class="icon-button" type="button" data-move-file="${index}" data-direction="1" aria-label="Move ${escapeHtml(file.name)} down" ${index === state.files.length - 1 ? "disabled" : ""}>
                      ${icon("down")}
                      <span>Later</span>
                    </button>
                  `
                  : ""
              }
              <button class="icon-button" type="button" data-remove-file="${index}" aria-label="Remove ${escapeHtml(file.name)}">
                ${icon("close")}
                <span>Remove</span>
              </button>
            </div>
          </div>
        `;
      })
      .join("");
    dom.fileList.innerHTML = `
      <div class="staging-summary">
        <span>${state.files.length} staged - ${formatBytes(totalSize)}</span>
        <span>${operation.stagingHint}</span>
      </div>
      ${renderOrderGuide(operation)}
      ${fileRows}
    `;
  }

  dom.runButton.disabled = !canRunJob();
  dom.runButton.dataset.state = state.running ? "running" : "idle";
  dom.runButton.innerHTML = state.running
    ? `${icon("spark")}Building`
    : `${icon("spark")}Build`;
  renderPath();
  renderMission();
  renderRouteIntel();
  renderJobPreview();
}

function renderJobPreview() {
  const operation = currentOperation();
  if (state.running || state.results.length > 0 || state.files.length < operation.minFiles) {
    dom.jobPreview.hidden = true;
    return;
  }

  const settings = getSettingsSummary(operation);
  const fileLabel = `${state.files.length} ${operation.multiple ? "files" : "file"}`;
  const steps = [
    ["Route", operation.title],
    ["Input", `${fileLabel} staged`],
  ];
  if (isOrderSensitive(operation)) {
    steps.push(["Order", getOrderSummary()]);
  }
  steps.push(["Settings", settings], ["Output", getPreviewOutput(operation)]);
  dom.jobPreview.hidden = false;
  dom.previewTitle.textContent = `${operation.routeLabel} ${fileLabel}`;
  dom.previewChip.textContent = operation.routeTarget;
  dom.previewSteps.innerHTML = steps
    .map(
      ([label, value]) => `
        <div class="preview-step">
          <span>${label}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `,
    )
    .join("");
}

function canRunJob() {
  const operation = currentOperation();
  return (
    !state.running &&
    state.files.length >= operation.minFiles &&
    getSettingIssues(operation).length === 0
  );
}

function renderOrderGuide(operation) {
  if (!isOrderSensitive(operation) || state.files.length < 2) return "";
  const firstFile = state.files[0]?.name || "Top file";
  return `
    <div class="order-guide">
      <span class="order-guide-label">Order path</span>
      <span class="order-guide-copy">Current first: ${escapeHtml(firstFile)}. Move files to change the output sequence.</span>
    </div>
  `;
}

function isOrderSensitive(operation) {
  return orderSensitiveRoutes.has(state.operationKey) && operation.multiple;
}

function getOrderSummary() {
  if (state.files.length < 2) return "Single item";
  const names = state.files.map((file) => file.name);
  if (names.length <= 4) return names.join(" > ");
  return `${names.slice(0, 3).join(" > ")} > ... > ${names[names.length - 1]}`;
}

function getSettingsSummary(operation) {
  if (operation.fields.length === 0) return "No extra settings";
  return operation.fields
    .map((field) => {
      const value = getCurrentFieldValues(operation)[field.id] || "";
      if (field.id === "pages") return `Pages ${value || "all"}`;
      if (field.id === "output_name") return `Name ${value || "auto"}`;
      return `${field.label} ${value}`;
    })
    .join(", ");
}

function getCurrentFieldValues(operation = currentOperation()) {
  return Object.fromEntries(
    operation.fields.map((field) => [
      field.id,
      dom.settingsForm.elements[field.id]?.value ?? field.value ?? "",
    ]),
  );
}

function applyFieldValues(values) {
  for (const [fieldId, value] of Object.entries(values)) {
    const field = dom.settingsForm.elements[fieldId];
    if (field) field.value = value;
  }
  state.outputNameTouched = Boolean(values.output_name);
  handleSettingsChange();
}

function formatPresetSummary(operation, fields) {
  return operation.fields
    .map((field) => {
      const value = fields[field.id] || field.value || "";
      if (field.id === "pages") return `${field.label}: ${value || "all"}`;
      if (field.id === "output_name") return `${field.label}: ${value || "auto"}`;
      return `${field.label}: ${value}`;
    })
    .join(", ");
}

function saveRoutePreset() {
  const operation = currentOperation();
  if (operation.fields.length === 0) return;
  state.presets[state.operationKey] = {
    fields: getCurrentFieldValues(operation),
    savedAt: new Date().toISOString(),
  };
  savePresets();
  renderPresetPanel();
  renderMessage(`Saved ${operation.label.toLowerCase()} preset.`, "success");
}

function applyRoutePreset() {
  const preset = state.presets[state.operationKey];
  if (!preset) return;
  state.bundle = null;
  state.lastReceipt = null;
  state.recovery = null;
  state.results = [];
  state.running = false;
  applyFieldValues(preset.fields);
  renderFiles();
  renderResults();
  renderMessage(`Applied ${currentOperation().label.toLowerCase()} preset.`, "success");
}

function handleSettingsChange(event) {
  if (event?.target?.name === "output_name") {
    state.outputNameTouched = true;
    event.target.dataset.suggested = "false";
  }
  renderPresetPanel();
  renderJobPreview();
  renderMission();
}

function getPreviewOutput(operation) {
  const outputName = getOutputNameValue();
  if (operation.multiple && operation.routeTarget === "One PDF") return outputName ? `${outputName}.pdf` : "One combined PDF";
  if (operation.routeTarget === "Pages") return outputName ? `${outputName} page PDFs plus a zip` : "Page PDFs plus a zip when needed";
  if (operation.routeTarget === "Orientation") return outputName ? `${outputName}.pdf` : "One rotated PDF";
  if (operation.routeTarget === "Smaller PDF") return outputName ? `${outputName}.pdf` : "One compressed PDF";
  if (operation.routeTarget === "Image PDF") return outputName ? `${outputName}.pdf` : "One PDF from the image order";
  if (operation.routeTarget === "PNGs") return outputName ? `${outputName} PNG pages plus a zip` : "PNG pages plus a zip when needed";
  return operation.routeTarget;
}

function getOutputNameValue() {
  return dom.settingsForm.elements.output_name?.value.trim() || "";
}

function syncSuggestedOutputName() {
  const outputName = dom.settingsForm.elements.output_name;
  if (!outputName) return;

  if (state.files.length === 0) {
    if (!state.outputNameTouched) outputName.value = "";
    outputName.dataset.suggested = "false";
    return;
  }

  if (state.outputNameTouched) {
    outputName.dataset.suggested = "false";
    return;
  }

  const suggestedName = getSuggestedOutputName();
  if (!suggestedName) return;
  outputName.value = suggestedName;
  outputName.dataset.suggested = "true";
}

function getSuggestedOutputName(operation = currentOperation()) {
  const sourceName = state.files[0]?.name || "";
  const sourceStem = sanitizeOutputStem(sourceName.replace(/\.[^.]+$/, ""));
  if (!sourceStem) return "";

  const suffixes = {
    merge: "merged",
    split: "pages",
    rotate: "rotated",
    compress: "compressed",
    "images-to-pdf": "document",
    "pdf-to-images": "images",
  };
  const suffix = suffixes[state.operationKey] || operation.label.toLowerCase();
  return `${sourceStem}-${suffix}`;
}

function sanitizeOutputStem(value) {
  return value.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^[._\s]+|[._\s]+$/g, "");
}

function renderResults() {
  dom.resultCount.textContent =
    state.running
      ? "Building"
      : state.bundle && state.results.length > 1
      ? `${state.results.length} files + bundle`
      : `${state.results.length} ready`;
  if (state.running) {
    dom.resultsList.innerHTML = renderBuildStatus("running");
    return;
  }
  if (state.results.length === 0) {
    dom.resultsList.innerHTML = '<div class="empty-state">Outputs land here</div>';
    return;
  }

  const claim = getClaimSummary();
  const buildMarkup = renderBuildStatus("complete");
  const receiptMarkup = renderReceipt();
  const claimMarkup = `
    <div class="claim-card">
      <div class="claim-icon">${icon(claim.icon)}</div>
      <div class="claim-copy">
        <div class="claim-label">Claim Ready</div>
        <div class="claim-title">${claim.title}</div>
        <div class="claim-detail">${claim.detail}</div>
      </div>
      <div class="claim-actions">
        <a class="claim-primary" href="${claim.href}" download>
          ${icon("download")}
          ${claim.action}
        </a>
        <button class="claim-secondary" type="button" data-new-job>
          ${icon("spark")}
          New job
        </button>
      </div>
    </div>
  `;

  const bundleMarkup = state.bundle
    ? `
        <div class="bundle-row">
          <div class="bundle-icon">${icon("bundle")}</div>
          <div class="result-meta">
            <div class="result-name">Download all</div>
            <div class="result-size">${state.bundle.file_count} files, ${formatBytes(state.bundle.size_bytes)}</div>
          </div>
          <a class="download-button bundle-download" href="${state.bundle.download_url}" download>
            ${icon("download")}
            Bundle
          </a>
        </div>
      `
    : "";

  const fileMarkup = state.results
    .map(
      (result) => `
        <div class="result-row">
          ${icon("download")}
          <div class="result-meta">
            <div class="result-name">${escapeHtml(result.file_name)}</div>
            <div class="result-size">${renderResultSize(result)}</div>
          </div>
          <a class="download-button" href="${result.download_url}" download>
            ${icon("download")}
            Download
          </a>
        </div>
      `,
    )
    .join("");
  dom.resultsList.innerHTML = buildMarkup + receiptMarkup + claimMarkup + bundleMarkup + fileMarkup;
  renderPath();
  renderMission();
}

function renderResultSize(result) {
  const savings = formatCompressionSavings(result);
  return `${formatBytes(result.size_bytes)}${savings ? `<span class="result-saving">${savings}</span>` : ""}`;
}

function formatCompressionSavings(result) {
  if (
    typeof result.source_size_bytes !== "number" ||
    typeof result.size_delta_bytes !== "number" ||
    typeof result.size_reduction_percent !== "number"
  ) {
    return "";
  }

  if (result.size_delta_bytes > 0) {
    return `Saved ${formatBytes(result.size_delta_bytes)} (${result.size_reduction_percent.toFixed(1)}%)`;
  }

  if (result.size_delta_bytes < 0) {
    return `Larger by ${formatBytes(Math.abs(result.size_delta_bytes))}`;
  }

  return "No size change";
}

function renderBuildStatus(phase) {
  const operation = currentOperation();
  const complete = phase === "complete";
  const steps = [
    ["Validate", "Inputs checked"],
    ["Build", operation.routeTarget],
    ["Package", complete ? getPackageLabel() : "Preparing output"],
    ["Claim", complete ? getClaimSummary().action : "Almost ready"],
  ];
  return `
    <article class="build-status-card" data-phase="${phase}">
      <div class="build-status-icon">${icon(complete ? "check" : "spark")}</div>
      <div class="build-status-copy">
        <div class="build-status-label">${complete ? "Build Complete" : "Building Locally"}</div>
        <div class="build-status-title">${complete ? getBuildCompleteTitle() : `${operation.title} in progress`}</div>
        <div class="build-status-detail">${complete ? getBuildCompleteDetail() : "The engine is validating, building, and packaging your output."}</div>
        <div class="build-status-meter" aria-hidden="true"><span></span></div>
      </div>
      <div class="build-status-steps">
        ${steps
          .map(
            ([label, detail], index) => `
              <span class="build-status-step" data-state="${complete ? "done" : index === 0 ? "done" : index === 1 ? "active" : "waiting"}">
                <strong>${escapeHtml(label)}</strong>
                <small>${escapeHtml(detail)}</small>
              </span>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function getPackageLabel() {
  if (state.bundle) return `${state.bundle.file_count} files bundled`;
  return `${state.results.length} file${state.results.length === 1 ? "" : "s"}`;
}

function getBuildCompleteTitle() {
  if (state.bundle) return "Bundle ready";
  return state.results[0]?.file_name || "Output ready";
}

function getBuildCompleteDetail() {
  const totalBytes = state.results.reduce((sum, result) => sum + result.size_bytes, 0);
  if (state.bundle) {
    return `${state.bundle.file_count} files packaged, ${formatBytes(state.bundle.size_bytes)} total.`;
  }
  return `${state.results.length} file${state.results.length === 1 ? "" : "s"}, ${formatBytes(totalBytes)} total.`;
}

function renderReceipt() {
  if (!state.lastReceipt) return "";
  const receipt = state.lastReceipt;
  return `
    <article class="receipt-card">
      <div class="receipt-heading">
        <div>
          <div class="receipt-label">Output Receipt</div>
          <div class="receipt-title">${escapeHtml(receipt.operationTitle)}</div>
        </div>
        <span class="receipt-chip">${escapeHtml(receipt.outputLabel)}</span>
      </div>
      <div class="receipt-grid">
        <span><small>Input</small> <strong>${escapeHtml(receipt.inputLabel)}</strong></span>
        <span><small>Settings</small> <strong>${escapeHtml(receipt.settingsLabel)}</strong></span>
        <span><small>Output</small> <strong>${escapeHtml(receipt.outputCountLabel)}</strong></span>
      </div>
      <div class="receipt-actions">
        <button class="receipt-repeat" type="button" data-repeat-job>
          ${icon("spark")}
          Repeat setup
        </button>
      </div>
    </article>
  `;
}

function getClaimSummary() {
  const totalBytes = state.results.reduce((sum, result) => sum + result.size_bytes, 0);
  if (state.bundle) {
    return {
      action: "Download all",
      detail: `${state.bundle.file_count} files bundled - ${formatBytes(state.bundle.size_bytes)}`,
      href: state.bundle.download_url,
      icon: "bundle",
      title: "Bundle ready",
    };
  }

  const firstResult = state.results[0];
  return {
    action: "Download",
    detail: `${state.results.length} file${state.results.length === 1 ? "" : "s"} - ${formatBytes(totalBytes)}`,
    href: firstResult.download_url,
    icon: "download",
    title: firstResult.file_name,
  };
}

function captureReceipt(operation, formData) {
  const fileLabel = `${state.files.length} ${operation.multiple ? "files" : "file"}`;
  return {
    fields: Object.fromEntries(operation.fields.map((field) => [field.id, formData.get(field.id) || field.value || ""])),
    inputLabel: fileLabel,
    operationKey: state.operationKey,
    operationTitle: operation.title,
    outputLabel: operation.routeTarget,
    settingsLabel: getSettingsSummary(operation),
  };
}

function completeReceipt(payload) {
  if (!pendingReceipt) return;
  state.lastReceipt = {
    ...pendingReceipt,
    outputCountLabel:
      payload.bundle && payload.files.length > 1
        ? `${payload.files.length} files plus bundle`
        : `${payload.files.length} file${payload.files.length === 1 ? "" : "s"}`,
  };
  pendingReceipt = null;
}

function repeatReceiptSetup() {
  if (!state.lastReceipt) return;
  const receipt = state.lastReceipt;
  state.operationKey = receipt.operationKey;
  state.bundle = null;
  state.fileDetails = [];
  state.files = [];
  state.recovery = null;
  state.results = [];
  state.running = false;
  dom.fileInput.value = "";
  renderOperation();
  applyFieldValues(receipt.fields);
  renderMessage(`Ready to repeat ${currentOperation().label.toLowerCase()} setup.`);
  focusStageStart();
}

function renderRecent() {
  dom.recentLimitSelect.value = String(state.recentLimit);
  if (state.recent.length === 0) {
    dom.recentSummary.textContent = "No local jobs pinned yet.";
    dom.recentList.innerHTML = '<div class="recent-empty">No recent outputs</div>';
    dom.clearRecentButton.disabled = true;
    return;
  }

  dom.clearRecentButton.disabled = false;
  dom.recentSummary.textContent = `${state.recent.length} local job${state.recent.length === 1 ? "" : "s"} kept for quick access.`;
  dom.recentList.innerHTML = state.recent
    .map(
      (job, index) => {
        const route = operations[job.operation]?.routeLabel || "Route";
        const operationLabel = job.operationLabel || operations[job.operation]?.title || "Recent job";
        const createdAt = job.createdAt || "recent";
        const outputCount = recentOutputCount(job);
        const outputLabel = `${outputCount} output${outputCount === 1 ? "" : "s"}`;
        return `
        <article class="recent-job">
          <button class="recent-load" type="button" data-load-recent="${index}">
            <span class="recent-route">${escapeHtml(route)}</span>
            <span class="recent-operation">${escapeHtml(operationLabel)}</span>
            <span class="recent-meta">${escapeHtml(outputLabel)} - ${escapeHtml(createdAt)}</span>
          </button>
          <button class="recent-remove" type="button" data-remove-recent="${index}" aria-label="Remove ${escapeHtml(operationLabel)} from recent">
            ${icon("close")}
            <span>Remove</span>
          </button>
          ${renderRecentFiles(job)}
        </article>
      `;
      },
    )
    .join("");
  dom.recentList.querySelectorAll("[data-remove-recent]").forEach((button) => {
    button.addEventListener("click", handleRecentRemoveClick);
  });
}

function renderRecentFiles(job) {
  const files = Array.isArray(job.files) ? job.files : [];
  const visibleFiles = files.slice(0, 3);
  const remainingCount = Math.max(0, files.length - visibleFiles.length);
  return `
    <div class="recent-files">
      ${
        job.bundle
          ? `
            <a class="recent-bundle" href="${job.bundle.download_url}" download>
              ${icon("bundle")}
              Download all
            </a>
          `
          : ""
      }
      ${visibleFiles
        .map(
          (file) => `
            <a href="${file.download_url}" download>
              ${icon("download")}
              ${escapeHtml(file.file_name)}
            </a>
          `,
        )
        .join("")}
      ${remainingCount ? `<span class="recent-more">+${remainingCount} more</span>` : ""}
    </div>
  `;
}

function recentOutputCount(job) {
  return Array.isArray(job.files) ? job.files.length : 0;
}

function handleRecentRemoveClick(event) {
  event.preventDefault();
  event.stopPropagation();
  const removeButton = event.currentTarget.closest("[data-remove-recent]");
  if (!removeButton) return;
  removeRecentJob(Number(removeButton.dataset.removeRecent));
}

function removeRecentJob(recentIndex) {
  if (!Number.isInteger(recentIndex) || !state.recent[recentIndex]) return;
  state.recent.splice(recentIndex, 1);
  saveRecent();
  renderRecent();
  renderMessage("Removed recent job from the rail.");
  focusElement(dom.recentLimitSelect);
}

function renderOutputCleanup() {
  dom.cleanupRefreshButton.disabled = state.outputJobsLoading;
  if (state.outputJobsLoading) {
    dom.cleanupSummary.textContent = "Checking local output folders...";
    dom.cleanupList.innerHTML = '<div class="recent-empty">Scanning outputs</div>';
    return;
  }

  if (state.outputJobs.length === 0) {
    dom.cleanupSummary.textContent = "No local output folders to clean.";
    dom.cleanupList.innerHTML = '<div class="recent-empty">Outputs are tidy</div>';
    return;
  }

  const totalSize = state.outputJobs.reduce((sum, job) => sum + job.size_bytes, 0);
  const totalFiles = state.outputJobs.reduce((sum, job) => sum + job.file_count, 0);
  dom.cleanupSummary.textContent = `${state.outputJobs.length} local folders - ${totalFiles} files - ${formatBytes(totalSize)}`;
  dom.cleanupList.innerHTML = state.outputJobs
    .map(
      (job, index) => {
        const confirming = state.pendingCleanupJobId === job.job_id;
        const label = index === 0 ? "Newest local folder" : "Local output folder";
        return `
        <article class="cleanup-job">
          <div class="cleanup-copy">
            <div class="cleanup-label">${label}</div>
            <div class="cleanup-name">${escapeHtml(job.job_id)}</div>
            <div class="cleanup-meta">${job.file_count} file${job.file_count === 1 ? "" : "s"} - ${formatBytes(job.size_bytes)}</div>
          </div>
          <button
            class="cleanup-delete"
            type="button"
            data-delete-output="${escapeHtml(job.job_id)}"
            data-state="${confirming ? "confirm" : "idle"}"
            aria-label="${confirming ? "Confirm delete" : "Prepare to delete"} output folder ${escapeHtml(job.job_id)}"
          >
            ${icon("close")}
            <span>${confirming ? "Confirm" : "Delete"}</span>
          </button>
        </article>
      `;
      },
    )
    .join("");
}

async function refreshOutputCleanup() {
  state.outputJobsLoading = true;
  state.pendingCleanupJobId = null;
  renderOutputCleanup();
  try {
    const response = await fetch("/outputs/jobs");
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.detail || "Could not list output folders.");
    }
    state.outputJobs = payload.jobs || [];
    renderOutputCleanup();
  } catch (error) {
    state.outputJobs = [];
    renderOutputCleanup();
    renderMessage(error.message || "Could not list output folders.", "error");
  } finally {
    state.outputJobsLoading = false;
    renderOutputCleanup();
  }
}

function requestOutputDelete(jobId) {
  if (!jobId || state.outputJobsLoading) return;
  if (state.pendingCleanupJobId !== jobId) {
    state.pendingCleanupJobId = jobId;
    renderOutputCleanup();
    renderMessage("Select Confirm to delete this local output folder.", "error");
    const pendingButton = [...dom.cleanupList.querySelectorAll("[data-delete-output]")].find(
      (button) => button.dataset.deleteOutput === jobId,
    );
    focusElement(pendingButton);
    return;
  }
  deleteOutputJob(jobId);
}

async function deleteOutputJob(jobId) {
  if (!jobId || state.outputJobsLoading) return;
  state.outputJobsLoading = true;
  state.pendingCleanupJobId = null;
  renderOutputCleanup();
  try {
    const response = await fetch(`/outputs/jobs/${encodeURIComponent(jobId)}`, { method: "DELETE" });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.detail || "Could not delete output folder.");
    }
    removeRecentJobById(jobId);
    clearDeletedOutputReferences(jobId);
    await refreshOutputCleanup();
    renderMessage(`Deleted output folder ${jobId}.`, "success");
    focusElement(dom.cleanupRefreshButton);
  } catch (error) {
    renderMessage(error.message || "Could not delete output folder.", "error");
    await refreshOutputCleanup();
  }
}

function clearDeletedOutputReferences(jobId) {
  if (!currentOutputsBelongToJob(jobId)) return;
  state.bundle = null;
  state.lastReceipt = null;
  state.results = [];
  renderResults();
  renderRouteIntel();
}

function currentOutputsBelongToJob(jobId) {
  const marker = `/outputs/${jobId}/`;
  return [state.bundle, ...state.results].some((output) => output?.download_url?.includes(marker));
}

function removeRecentJobById(jobId) {
  const nextRecent = state.recent.filter((job) => job.jobId !== jobId);
  if (nextRecent.length === state.recent.length) return;
  state.recent = nextRecent;
  saveRecent();
  renderRecent();
}

function renderMessage(text = "", tone = "") {
  const operation = currentOperation();
  dom.jobMessage.dataset.tone = tone;
  dom.jobMessage.textContent =
    text ||
    (operation.multiple
      ? `${operation.requirement} can be staged.`
      : `${operation.requirement} can be staged.`);
  renderRecovery();
}

function renderRecovery() {
  if (!state.recovery) {
    dom.recoveryPanel.hidden = true;
    dom.recoverySwitchButton.hidden = true;
    dom.recoverySwitchButton.removeAttribute("data-route");
    return;
  }

  dom.recoveryPanel.hidden = false;
  dom.recoveryTitle.textContent = state.recovery.title;
  dom.recoveryDetail.textContent = state.recovery.detail;
  const suggestedOperation =
    state.recovery.suggestedOperation && operations[state.recovery.suggestedOperation]
      ? state.recovery.suggestedOperation
      : null;
  const shouldShowRecoverySwitch = Boolean(suggestedOperation);
  if (shouldShowRecoverySwitch) {
    const suggested = operations[suggestedOperation];
    dom.recoverySwitchButton.textContent = `Switch to ${suggested.routeLabel} route`;
    dom.recoverySwitchButton.dataset.route = suggestedOperation;
    dom.recoverySwitchButton.hidden = false;
    dom.recoverySampleButton.textContent = "Stage sample for this route";
  } else {
    dom.recoverySwitchButton.hidden = true;
    dom.recoverySwitchButton.removeAttribute("data-route");
    dom.recoverySampleButton.textContent = "Stage sample";
  }
}

function renderPath() {
  const activeIndex = getActiveStepIndex();
  const mission = getMissionState();
  const activeStep = pathCopy[Math.min(activeIndex, pathCopy.length - 1)];
  const nextCopy = activeStep?.action ?? "Next";
  const nextHint = activeStep?.hint ?? "";
  if (dom.pathNextHint) {
    dom.pathNextHint.textContent = `${nextCopy} ${nextHint}`.trim();
  }

  dom.pathSteps.innerHTML = pathCopy
    .map((step, index) => {
      const stepNumber = index + 1;
      const stepState = index < activeIndex ? "done" : index === activeIndex ? "active" : "waiting";
      const label = step.label ?? "Path";
      const copy = step.copy ?? "";
      const action = step.action ?? "Go";
      const hint = step.hint ?? "";
      return `
        <li
          class="path-step"
          data-state="${stepState}"
          data-path-step="${index}"
          data-action="${action}"
          tabindex="0"
          role="button"
          aria-label="Go to ${label}"
          aria-current="${index === activeIndex ? "step" : "false"}"
        >
          <span class="step-icon">${icon(step.icon || "spark")}</span>
          <span class="step-index">${stepNumber}</span>
          <span>
            <span class="step-label">${label}</span>
            <span class="step-copy">${copy}</span>
            <span class="step-action">${action}</span>
          </span>
          <span class="step-hint" aria-hidden="true">${hint}</span>
        </li>
      `;
    })
    .join("");

  if (dom.pathQuickActions) {
    dom.pathQuickActions.innerHTML = getPathQuickActions(activeIndex, mission)
      .map((action) => {
        const routeSuggestion = action.routeKey ? ` data-route-suggestion="${action.routeKey}"` : "";
        return `<button class="path-quick-action" type="button" data-path-action="${action.action}"${routeSuggestion}>${action.label}</button>`;
      })
      .join("");
  }

  if (dom.pathWelcome) {
    dom.pathWelcome.hidden = state.welcomeDismissed;
  }
}

function goToPathStep(index) {
  const step = pathCopy[index];
  if (!step) return;

  if (index === 0) {
    focusPathTarget(step.focus, "#operationNav");
    return;
  }

  if (index === 1) {
    focusPathTarget(step.focus, "#dropZone", "#browseButton", "#fileInput");
    return;
  }

  if (index === 2) {
    focusPathTarget(step.focus, "#settingsForm .field input, #settingsForm .field select", "#runButton");
    return;
  }

  if (index === 3) {
    focusPathTarget(step.focus, "#runButton");
    return;
  }

  if (index === 4) {
    if (state.results.length > 0) {
      const claimTarget = state.bundle ? ".claim-card .claim-primary" : ".result-row .download-button";
      focusPathTarget(claimTarget, "#resultsList");
      return;
    }

    focusPathTarget("#runButton");
    renderMessage("Build first to unlock outputs.", "error");
    return;
  }

  focusPathTarget(step.focus, "#runButton");
}

function getPathQuickActions(activeIndex, mission) {
  const actions = [];
  const operation = currentOperation();
  const suggestion = getRouteSuggestion();

  if (state.running) {
    return [
      { action: "pause", label: "Building..." },
      { action: "view-path", label: "Path map" },
    ];
  }

  if (state.results.length > 0) {
    actions.push({
      action: "outputs",
      label: "Open outputs",
    });
    actions.push({
      action: "new-job",
      label: "New job",
    });
    actions.push({
      action: "compare-routes",
      label: "Compare routes",
    });
    return actions;
  }

  if (
    state.recovery &&
    mission.action === "switch-route" &&
    mission.routeKey &&
    operations[mission.routeKey]
  ) {
    actions.push({
      action: "switch-route",
      label: `Switch to ${operations[mission.routeKey].routeLabel}`,
    });
    actions.push({
      action: "browse",
      label: "Browse files",
    });
    actions.push({
      action: "compare-routes",
      label: "Compare routes",
    });
    return actions;
  }

  if (suggestion) {
    actions.push({
      action: "suggest-route",
      routeKey: suggestion.routeKey,
      label: suggestion.quickActionLabel,
    });
  }

  if (state.files.length >= operation.minFiles) {
    actions.push({
      action: "forge",
      label: mission.actionLabel || "Build now",
    });
    actions.push({
      action: "browse",
      label: "Add more files",
    });
    if (activeIndex >= 2) {
      actions.push({
        action: "new-route",
        label: "Try another route",
      });
    } else {
      actions.push({
        action: "compare-routes",
        label: "Compare routes",
      });
    }
    return actions;
  }

  if (state.files.length > 0) {
    actions.push({
      action: "stage-sample",
      label: "Fill with sample",
    });
    actions.push({
      action: "browse",
      label: "Browse files",
    });
    actions.push({
      action: "path-ops",
      label: "Try another route",
    });
    return actions;
  }

  actions.push({
    action: "stage-sample",
    label: `Stage ${operation.requirement} sample`,
  });
  actions.push({
    action: "compare-routes",
    label: "Compare routes",
  });
  actions.push({
    action: "browse",
    label: "Browse files",
  });
  return actions;
}

function getRouteSuggestion() {
  if (state.results.length > 0 || state.running || state.files.length === 0) {
    return null;
  }

  if (
    state.recovery &&
    state.recovery.title === "Wrong file type" &&
    state.recovery.suggestedOperation &&
    operations[state.recovery.suggestedOperation]
  ) {
    const suggested = operations[state.recovery.suggestedOperation];
    return {
      routeKey: state.recovery.suggestedOperation,
      label: `Try ${suggested.routeLabel} route`,
      quickActionLabel: `Switch to ${suggested.routeLabel}`,
      detail: state.recovery.detail,
    };
  }

  const fileProfile = getStagedFileProfile();
  if (fileProfile.totalFiles === 0 || fileProfile.hasMixed) return null;

  if (!fileProfile.hasImage && fileProfile.pdfCount > 1 && state.operationKey !== "merge") {
    return {
      routeKey: "merge",
      label: "Try Merge route",
      quickActionLabel: "Try Merge",
      detail: "Your staged files are all PDFs. Combine route can join them into one file.",
    };
  }

  if (!fileProfile.hasPdf && fileProfile.imageCount > 0 && state.operationKey !== "images-to-pdf") {
    return {
      routeKey: "images-to-pdf",
      label: "Try Images route",
      quickActionLabel: "Try Images route",
      detail: "Your staged files are images. Images-to-PDF route is the direct fit.",
    };
  }

  return null;
}

function getStagedFileProfile() {
  const pdfExtensions = new Set([".pdf"]);
  const imageExtensionsSet = new Set([".png", ".jpg", ".jpeg", ".webp"]);
  const counts = {
    totalFiles: state.files.length,
    pdfCount: 0,
    imageCount: 0,
    hasPdf: false,
    hasImage: false,
    hasMixed: false,
  };

  for (const file of state.files) {
    const extension = fileExtension(file.name).toLowerCase();
    const isPdf = pdfExtensions.has(extension);
    const isImage = imageExtensionsSet.has(extension);
    counts.hasPdf = counts.hasPdf || isPdf;
    counts.hasImage = counts.hasImage || isImage;
    if (isPdf) {
      counts.pdfCount += 1;
    }
    if (isImage) {
      counts.imageCount += 1;
    }
  }

  counts.hasMixed = counts.hasPdf && counts.hasImage;
  return counts;
}

function handlePathQuickAction(action, routeKey = null) {
  if (action === "pause") return;

  if (action === "view-path") {
    goToPathStep(0);
    return;
  }

  if (action === "stage-sample") {
    stageSampleFiles();
    return;
  }

  if (action === "browse") {
    dom.fileInput.click();
    return;
  }

  if (action === "forge") {
    runJob();
    return;
  }

  if (action === "outputs") {
    document.querySelector(".results-panel").scrollIntoView({ block: "start", behavior: "smooth" });
    return;
  }

  if (action === "new-job") {
    startNewJob();
    return;
  }

  if (action === "compare-routes") {
    if (dom.routeComparePanel.hidden) {
      dom.routeCompareToggle.click();
    } else {
      renderRouteCompare();
    }
    focusElement(dom.routeComparePanel);
    return;
  }

  if (action === "switch-route") {
    const routeKey = getMissionState().routeKey;
    if (routeKey) {
      setOperation(routeKey);
      renderMessage(`Switched to ${operations[routeKey]?.title || "selected"} route.`);
      return;
    }
  }

  if (action === "new-route") {
    goToPathStep(0);
    return;
  }

  if (action === "path-ops") {
    document.querySelector(".operation-rail").scrollIntoView({ block: "start", behavior: "smooth" });
    return;
  }

  if (action === "suggest-route") {
    if (!routeKey) return;
    setOperation(routeKey);
    renderMessage(`Switched to ${operations[routeKey]?.title || "selected"} route.`);
    return;
  }
}

function handleMissionControlAction(action) {
  if (["stage-sample", "browse", "forge", "outputs", "compare-routes"].includes(action)) {
    handlePathQuickAction(action);
    return;
  }

  if (action === "settings") {
    const target =
      currentOperation()
        .fields.map((field) => dom.settingsForm.elements[field.id])
        .find(Boolean) || dom.runButton;
    focusPathTarget(null, target ? `#${target.id || target.name}` : "#runButton", "#runButton");
    return;
  }

  if (action === "output-name") {
    const outputName = dom.settingsForm.elements.output_name;
    if (outputName) {
      outputName.scrollIntoView({ block: "center", behavior: "smooth" });
      focusElement(outputName);
      return;
    }
    focusPathTarget("#runButton");
  }
}

function focusPathTarget(primarySelector, ...fallbackSelectors) {
  const primary = primarySelector ? document.querySelector(primarySelector) : null;
  const fallback = fallbackSelectors.find((selector) => document.querySelector(selector));
  const fallbackTarget = fallback ? document.querySelector(fallback) : null;
  const target = primary || fallbackTarget;
  if (!target) return;

  target.scrollIntoView({ block: "center", behavior: "smooth" });
  focusElement(target);
}

function renderMission() {
  const mission = getMissionState();
  dom.missionStrip.dataset.state = mission.state;
  dom.missionLabel.textContent = mission.label;
  dom.missionTitle.textContent = mission.title;
  dom.missionDetail.textContent = mission.detail;
  dom.missionProgress.style.width = `${mission.progress}%`;
  dom.missionActionButton.dataset.action = mission.action;
  if (mission.routeKey) {
    dom.missionActionButton.dataset.route = mission.routeKey;
  } else {
    dom.missionActionButton.removeAttribute("data-route");
  }
  dom.missionActionButton.disabled = mission.disabled;
  dom.missionActionButton.innerHTML = `${icon(mission.icon)}${mission.actionLabel}`;
  renderMissionControl(mission);
}

function renderMissionControl(mission = getMissionState()) {
  const items = getMissionControlItems();
  const readyCount = items.filter((item) => item.status === "ready").length;
  dom.missionControl.dataset.state = mission.state;
  dom.missionControlTitle.textContent = mission.title;
  dom.missionControlScore.textContent = `${readyCount}/${items.length}`;
  dom.missionChecks.innerHTML = items
    .map((item) => {
      const actionAttribute = item.action ? ` data-check-action="${item.action}"` : "";
      const disabledAttribute = item.action ? "" : " disabled";
      return `
        <button
          class="mission-check"
          type="button"
          data-status="${item.status}"
          ${actionAttribute}
          ${disabledAttribute}
          aria-label="${escapeHtml(item.label)}: ${escapeHtml(item.detail)}"
        >
          <span class="mission-check-icon">${icon(item.icon)}</span>
          <span class="mission-check-copy">
            <span class="mission-check-label">${escapeHtml(item.label)}</span>
            <span class="mission-check-detail">${escapeHtml(item.detail)}</span>
          </span>
          <span class="mission-check-state">${escapeHtml(item.stateLabel)}</span>
        </button>
      `;
    })
    .join("");
}

function getMissionControlItems() {
  const operation = currentOperation();
  const settingIssues = getSettingIssues(operation);
  const hasEnoughFiles = state.files.length >= operation.minFiles;
  const hasOutputs = state.results.length > 0;
  const canBuild = !hasOutputs && canRunJob() && settingIssues.length === 0;
  const fileDetail =
    state.files.length === 0
      ? `Need ${operation.requirement}`
      : `${state.files.length}/${operation.minFiles} staged`;

  return [
    {
      action: "compare-routes",
      detail: operation.title,
      icon: operation.icon,
      label: "Route",
      stateLabel: operation.routeLabel,
      status: "ready",
    },
    {
      action: hasEnoughFiles ? "browse" : "stage-sample",
      detail: state.recovery?.title === "Wrong file type" ? "Recovery available" : fileDetail,
      icon: state.recovery ? "alert" : "file",
      label: "Files",
      stateLabel: hasEnoughFiles ? "Ready" : "Stage",
      status: state.recovery ? "warn" : hasEnoughFiles ? "ready" : "active",
    },
    {
      action: "settings",
      detail: settingIssues[0] || getSettingsSummary(operation),
      icon: settingIssues.length > 0 ? "alert" : "spark",
      label: "Settings",
      stateLabel: settingIssues.length > 0 ? "Fix" : "Ready",
      status: settingIssues.length > 0 ? "warn" : "ready",
    },
    {
      action: hasOutputs ? "outputs" : "output-name",
      detail: hasOutputs ? `${state.results.length} ready` : getPreviewOutput(operation),
      icon: hasOutputs ? "download" : "bundle",
      label: "Output",
      stateLabel: hasOutputs ? "Claim" : "Planned",
      status: hasOutputs ? "ready" : hasEnoughFiles ? "active" : "waiting",
    },
    {
      action: canBuild ? "forge" : null,
      detail: hasOutputs ? "Finished" : state.running ? "Engine running" : canBuild ? "Ready to build" : "Waiting",
      icon: hasOutputs ? "check" : "spark",
      label: "Build",
      stateLabel: hasOutputs ? "Done" : state.running ? "Run" : canBuild ? "Go" : "Wait",
      status: hasOutputs ? "ready" : state.running ? "active" : canBuild ? "active" : "waiting",
    },
  ];
}

function getSettingIssues(operation = currentOperation()) {
  const issues = operation.fields
    .map((field) => {
      const element = dom.settingsForm.elements[field.id];
      const value = element?.value ?? field.value ?? "";
      if (field.type === "number") {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) return `${field.label} needs a number`;
        if (field.min !== undefined && parsed < field.min) return `${field.label} is below ${field.min}`;
        if (field.max !== undefined && parsed > field.max) return `${field.label} is above ${field.max}`;
      }
      if (field.type === "select" && field.options && !field.options.includes(value)) {
        return `${field.label} needs a valid choice`;
      }
      return "";
    })
    .filter(Boolean);

  const toolIssue = getCompressionToolIssue();
  if (toolIssue) issues.push(toolIssue);
  return issues;
}

function getCompressionToolIssue() {
  if (state.operationKey !== "compress") return "";
  if (state.compressionTool.loading) return "Ghostscript check still running";
  if (!state.compressionTool.available) return "Ghostscript not detected";
  return "";
}

function getMissionState() {
  const operation = currentOperation();
  const activeIndex = getActiveStepIndex();
  const progress = activeIndex === pathCopy.length - 1 ? 100 : Math.max(18, activeIndex * 25);

  if (state.running) {
    return {
      action: "wait",
      actionLabel: "Building",
      detail: "The local engine is building your output.",
      disabled: true,
      icon: "spark",
      label: "Building",
      progress: 75,
      state: "running",
      title: "Engine running",
    };
  }

  if (state.results.length > 0) {
    const outputLabel =
      state.bundle && state.results.length > 1
        ? `${state.results.length} files plus bundle`
        : `${state.results.length} output${state.results.length === 1 ? "" : "s"}`;
    return {
      action: "outputs",
      actionLabel: "View outputs",
      detail: outputLabel,
      disabled: false,
      icon: "download",
      label: "Claim",
      progress: 100,
      state: "complete",
      title: "Ready to download",
    };
  }

  if (
    state.recovery &&
    state.recovery.title === "Wrong file type" &&
    state.recovery.suggestedOperation &&
    operations[state.recovery.suggestedOperation]
  ) {
    const suggested = operations[state.recovery.suggestedOperation];
    return {
      action: "switch-route",
      actionLabel: `Switch to ${suggested.routeLabel}`,
      detail: state.recovery.detail,
      disabled: false,
      icon: suggested.icon,
      label: "Recovery",
      progress,
      state: "staging",
      title: state.recovery.title,
      routeKey: state.recovery.suggestedOperation,
    };
  }

  if (state.files.length >= operation.minFiles) {
    return {
      action: "forge",
      actionLabel: "Build now",
      detail: operation.stagingHint,
      disabled: false,
      icon: "spark",
      label: "Ready",
      progress,
      state: "ready",
      title: `${state.files.length} staged`,
    };
  }

  if (state.files.length > 0) {
    const remaining = operation.minFiles - state.files.length;
    return {
      action: "stage-sample",
      actionLabel: "Fill with sample",
      detail: `${state.files.length} staged. ${remaining} more needed.`,
      disabled: false,
      icon: "bundle",
      label: "Stage",
      progress,
      state: "staging",
      title: `Need ${remaining} more`,
    };
  }

  return {
    action: "stage-sample",
    actionLabel: "Stage sample",
    detail: operation.stagingHint,
    disabled: false,
    icon: "bundle",
    label: "Next Move",
    progress,
    state: "idle",
    title: `Stage ${operation.requirement}`,
  };
}

function getActiveStepIndex() {
  if (state.results.length > 0) return 4;
  if (state.running) return 3;
  if (state.files.length >= currentOperation().minFiles) return 2;
  return 1;
}

function resetWorkbench(message = "") {
  pendingReceipt = null;
  state.bundle = null;
  state.fileDetails = [];
  state.files = [];
  state.lastReceipt = null;
  state.outputNameTouched = false;
  state.recovery = null;
  state.results = [];
  state.running = false;
  dom.fileInput.value = "";
  renderOperation();
  renderMessage(message);
  focusStageStart();
}

function hasWorkbenchState() {
  return Boolean(
    state.bundle ||
      state.files.length > 0 ||
      state.lastReceipt ||
      state.recovery ||
      state.results.length > 0,
  );
}

function focusElement(element) {
  if (!element || element.disabled) return;
  requestAnimationFrame(() => element.focus({ preventScroll: true }));
}

function focusStageStart() {
  focusElement(dom.browseButton);
}

function focusNextStep() {
  if (!canRunJob()) {
    focusStageStart();
    return;
  }

  const tuneTarget = currentOperation()
    .fields.map((field) => dom.settingsForm.elements[field.id])
    .find((element) => element && !element.value);
  focusElement(tuneTarget || dom.runButton);
}

function handleGlobalKeydown(event) {
  if (event.defaultPrevented) return;

  if (event.key === "Enter") {
    handleEnterShortcut(event);
    return;
  }

  if (event.key === "Escape") {
    handleEscapeShortcut(event);
  }
}

function handleEnterShortcut(event) {
  if (!canRunJob() || !canForgeFromTarget(event.target)) return;
  event.preventDefault();
  runJob();
}

function canForgeFromTarget(target) {
  if (!target || target === document.body || target === document.documentElement) return false;
  const tagName = target.tagName;
  if (tagName === "TEXTAREA" || tagName === "SELECT") return false;
  if (target.closest?.("button, a")) return false;
  return Boolean(
    target.closest?.("#settingsForm") ||
      target.closest?.("#runButton") ||
      target.closest?.("#missionStrip") ||
      target.closest?.(".job-stage") ||
      target.closest?.("#pathSteps"),
  );
}

function handleEscapeShortcut(event) {
  if (state.running) return;
  const target = event.target;
  if (target?.matches?.("input, select, textarea")) {
    event.preventDefault();
    target.blur();
    focusElement(canRunJob() ? dom.runButton : dom.browseButton);
    return;
  }

  if (state.compareOpen) {
    event.preventDefault();
    state.compareOpen = false;
    renderRouteCompare();
    focusElement(dom.routeCompareToggle);
    return;
  }

  if (!hasWorkbenchState()) return;
  event.preventDefault();
  resetWorkbench("Workbench reset.");
}

function setOperation(key) {
  if (!operations[key]) return;
  pendingReceipt = null;
  state.lastReceipt = null;
  state.operationKey = key;
  state.bundle = null;
  state.fileDetails = [];
  state.files = [];
  state.outputNameTouched = false;
  state.recovery = null;
  state.results = [];
  state.running = false;
  dom.fileInput.value = "";
  renderOperation();
  focusStageStart();
}

function chooseComparedRoute(key) {
  const operation = operations[key];
  if (!operation) return;
  setOperation(key);
  renderMessage(`${operation.title} selected from compare.`, "success");
}

function runComparedSample(key) {
  if (!operations[key]) return;
  setOperation(key);
  runDemoJob();
}

function imageExtensions() {
  return [".png", ".jpg", ".jpeg", ".webp"];
}

function isImageFile(file) {
  return imageExtensions().includes(fileExtension(file.name));
}

function recoveryRouteForFiles(files) {
  const acceptedFileNames = files.filter(Boolean);
  if (acceptedFileNames.length === 0) return null;
  const hasPdf = acceptedFileNames.some((file) => fileExtension(file.name) === ".pdf");
  const hasImage = acceptedFileNames.some((file) => isImageFile(file));
  if (hasImage) return "images-to-pdf";
  if (hasPdf) return acceptedFileNames.length > 1 ? "merge" : "split";
  return null;
}

function buildWrongTypeRecovery(rejectedFiles, operation) {
  if (rejectedFiles.length === 0) return null;
  const suggestedOperation = recoveryRouteForFiles(rejectedFiles);
  const routeCopy = suggestedOperation
    ? ` Try ${operations[suggestedOperation]?.routeLabel || "a supported"} route instead.`
    : "";
  return {
    detail: `Use files that match ${operation.accept.replaceAll(",", ", ")}.${routeCopy}`,
    suggestedOperation,
  };
}

function addFiles(fileList) {
  const operation = currentOperation();
  const nextFiles = Array.from(fileList || []);
  const acceptedFiles = nextFiles.filter((file) => isAcceptedFile(file, operation));
  const rejectedCount = nextFiles.length - acceptedFiles.length;
  const rejectedFiles = nextFiles.filter((file) => !isAcceptedFile(file, operation));
  const wrongTypeRecovery = buildWrongTypeRecovery(rejectedFiles, operation);
  if (operation.multiple) {
    state.files = [...state.files, ...acceptedFiles];
    state.fileDetails = [...state.fileDetails, ...acceptedFiles.map(createFileDetail)];
  } else {
    state.files = acceptedFiles.slice(0, 1);
    state.fileDetails = state.files.map(createFileDetail);
  }
  state.bundle = null;
  state.lastReceipt = null;
  state.recovery =
    rejectedCount > 0
      ? {
          detail: `${rejectedCount} file${rejectedCount === 1 ? "" : "s"} did not match ${operation.requirement}. ${wrongTypeRecovery?.detail || ""}`,
          suggestedOperation: wrongTypeRecovery?.suggestedOperation,
          title: "Wrong file type",
        }
      : null;
  state.results = [];
  renderFiles();
  renderResults();
  renderRouteIntel();
  renderMessage(
    rejectedCount > 0
      ? `${state.files.length} staged. ${rejectedCount} file${rejectedCount === 1 ? "" : "s"} skipped.`
      : `${state.files.length} staged.`,
    rejectedCount > 0 ? "error" : "",
  );
  inspectStagedFiles();
  focusNextStep();
}

function moveStagedFile(index, direction) {
  reorderStagedFile(index, index + direction);
}

function reorderStagedFile(index, targetIndex) {
  if (targetIndex < 0 || targetIndex >= state.files.length || index === targetIndex) return;
  const nextFiles = [...state.files];
  const nextDetails = [...state.fileDetails];
  const [file] = nextFiles.splice(index, 1);
  const [detail] = nextDetails.splice(index, 1);
  nextFiles.splice(targetIndex, 0, file);
  nextDetails.splice(targetIndex, 0, detail || createFileDetail(file));
  state.files = nextFiles;
  state.fileDetails = nextDetails;
  clearStagedOutputState();
  renderFiles();
  renderResults();
  renderRouteIntel();
  renderMessage("Stage order updated.");
  focusNextStep();
}

function clearStagedOutputState() {
  state.bundle = null;
  state.lastReceipt = null;
  state.recovery = null;
  state.results = [];
}

function handleFileDragStart(event) {
  const row = event.target.closest(".file-row[draggable='true']");
  if (!row) return;
  const index = Number(row.dataset.fileIndex);
  if (!Number.isInteger(index)) return;
  state.dragFileIndex = index;
  row.dataset.dragging = "true";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", String(index));
}

function handleFileDragOver(event) {
  const row = event.target.closest(".file-row[draggable='true']");
  if (state.dragFileIndex === null || !row) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  clearFileDropTargets();
  row.dataset.dropTarget = "true";
}

function handleFileDrop(event) {
  const row = event.target.closest(".file-row[draggable='true']");
  if (state.dragFileIndex === null || !row) return;
  event.preventDefault();
  const fromIndex = Number(event.dataTransfer.getData("text/plain") || state.dragFileIndex);
  const targetIndex = Number(row.dataset.fileIndex);
  clearFileDragState();
  if (!Number.isInteger(fromIndex) || !Number.isInteger(targetIndex)) return;
  reorderStagedFile(fromIndex, targetIndex);
}

function handleFileDragEnd() {
  clearFileDragState();
}

function clearFileDragState() {
  state.dragFileIndex = null;
  clearFileDropTargets();
  dom.fileList.querySelectorAll("[data-dragging]").forEach((row) => {
    delete row.dataset.dragging;
  });
}

function clearFileDropTargets() {
  dom.fileList.querySelectorAll("[data-drop-target]").forEach((row) => {
    delete row.dataset.dropTarget;
  });
}

async function runJob() {
  const operation = currentOperation();
  if (!canRunJob()) return;

  state.running = true;
  state.bundle = null;
  state.lastReceipt = null;
  state.recovery = null;
  state.results = [];
  renderFiles();
  renderResults();
  renderRouteIntel();
  renderMessage("Building...", "");

  const formData = new FormData();
  if (operation.multiple) {
    state.files.forEach((file) => formData.append("files", file));
  } else {
    formData.append("file", state.files[0]);
  }

  for (const field of operation.fields) {
    const input = dom.settingsForm.elements[field.id];
    if (input?.value) {
      formData.append(field.id, input.value);
    }
  }
  pendingReceipt = captureReceipt(operation, formData);

  try {
    const response = await fetch(operation.endpoint, {
      method: "POST",
      body: formData,
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.detail || "The engine refused the job.");
    }
    state.bundle = payload.bundle || null;
    state.results = payload.files || [];
    completeReceipt(payload);
    rememberJob(payload);
    await refreshOutputCleanup();
    state.running = false;
    renderResults();
    renderRecent();
    renderRouteIntel();
    renderMessage(`${state.results.length} output${state.results.length === 1 ? "" : "s"} ready.`, "success");
    focusClaimResults();
  } catch (error) {
    pendingReceipt = null;
    state.running = false;
    state.recovery = {
      detail: "Check the staged files or use sample files to confirm the route still works.",
      title: "Build could not finish",
    };
    renderResults();
    renderMessage(error.message || "Job failed.", "error");
    focusElement(dom.recoverySampleButton);
  } finally {
    state.running = false;
    renderFiles();
  }
}

async function runDemoJob() {
  const operation = currentOperation();
  state.running = true;
  state.bundle = null;
  state.fileDetails = [];
  state.files = [];
  state.lastReceipt = null;
  state.recovery = null;
  state.results = [];
  dom.fileInput.value = "";
  renderFiles();
  renderResults();
  renderRouteIntel();
  renderMessage(`Running a real ${operation.label.toLowerCase()} sample...`);

  try {
    const response = await fetch(operation.demoEndpoint, { method: "POST" });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.detail || "The sample job failed.");
    }
    state.bundle = payload.bundle || null;
    state.results = payload.files || [];
    state.lastReceipt = {
      fields: Object.fromEntries(operation.fields.map((field) => [field.id, field.value || ""])),
      inputLabel: "Sample files",
      operationKey: state.operationKey,
      operationTitle: operation.title,
      outputCountLabel:
        payload.bundle && payload.files.length > 1
          ? `${payload.files.length} files plus bundle`
          : `${payload.files.length} file${payload.files.length === 1 ? "" : "s"}`,
      outputLabel: operation.routeTarget,
      settingsLabel: operation.fields.length === 0 ? "No extra settings" : "Sample defaults",
    };
    rememberJob(payload);
    await refreshOutputCleanup();
    state.running = false;
    renderResults();
    renderRecent();
    renderRouteIntel();
    renderMessage(`Sample complete. ${state.results.length} output${state.results.length === 1 ? "" : "s"} ready.`, "success");
    focusClaimResults();
  } catch (error) {
    state.running = false;
    renderResults();
    renderMessage(error.message || "Sample job failed.", "error");
  } finally {
    state.running = false;
    renderFiles();
  }
}

function focusClaimResults() {
  document.querySelector(".results-panel")?.scrollIntoView({ block: "start", behavior: "smooth" });
  focusElement(document.querySelector(".claim-primary"));
}

function stageSampleFiles() {
  state.bundle = null;
  state.lastReceipt = null;
  state.outputNameTouched = false;
  state.recovery = null;
  state.results = [];
  state.files = sampleFilesForOperation(state.operationKey);
  state.fileDetails = state.files.map(createFileDetail);
  dom.fileInput.value = "";
  renderFiles();
  renderResults();
  renderRouteIntel();
  renderMessage(`${state.files.length} sample file${state.files.length === 1 ? "" : "s"} staged.`);
  inspectStagedFiles();
  focusNextStep();
}

function clearStage() {
  state.bundle = null;
  state.fileDetails = [];
  state.files = [];
  state.lastReceipt = null;
  state.outputNameTouched = false;
  state.recovery = null;
  state.results = [];
  state.running = false;
  dom.fileInput.value = "";
  renderFiles();
  renderResults();
  renderRouteIntel();
  renderMessage();
  focusStageStart();
}

function sampleFilesForOperation(operationKey) {
  if (operationKey === "images-to-pdf") {
    return [
      base64ToFile(sampleAssets.pngs[0], "cover.png", "image/png"),
      base64ToFile(sampleAssets.pngs[1], "diagram.png", "image/png"),
      base64ToFile(sampleAssets.pngs[2], "notes.png", "image/png"),
    ];
  }

  if (operationKey === "merge") {
    return [
      base64ToFile(sampleAssets.pdf, "field-guide.pdf", "application/pdf"),
      base64ToFile(sampleAssets.pdf, "launch-plan.pdf", "application/pdf"),
      base64ToFile(sampleAssets.pdf, "appendix.pdf", "application/pdf"),
    ];
  }

  return [base64ToFile(sampleAssets.pdf, "source.pdf", "application/pdf")];
}

function rememberJob(payload) {
  const operation = operations[payload.operation] || currentOperation();
  const record = {
    createdAt: new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date()),
    bundle: payload.bundle || null,
    files: payload.files || [],
    jobId: payload.job_id,
    operation: payload.operation,
    operationLabel: operation.title,
  };
  state.recent = trimRecent([record, ...state.recent.filter((job) => job.jobId !== record.jobId)]);
  saveRecent();
}

function trimRecent(recent = state.recent) {
  return recent.slice(0, state.recentLimit);
}

function currentOperation() {
  return operations[state.operationKey];
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function fileExtension(fileName) {
  const match = fileName.toLowerCase().match(/\.[^.]+$/);
  return match ? match[0] : "";
}

function createFileDetail(file) {
  return {
    pageCount: null,
    status: fileExtension(file.name) === ".pdf" ? "pending" : "unavailable",
  };
}

function formatFileMeta(file, index) {
  const extension = fileExtension(file.name).toUpperCase() || "FILE";
  const parts = [formatBytes(file.size), extension];
  if (fileExtension(file.name) === ".pdf") {
    const detail = state.fileDetails[index] || createFileDetail(file);
    if (detail.status === "ready" && detail.pageCount > 0) {
      parts.push(`${detail.pageCount} page${detail.pageCount === 1 ? "" : "s"} detected`);
    } else if (detail.status === "pending") {
      parts.push("page count pending");
    } else {
      parts.push("page count unavailable");
    }
  }
  return escapeHtml(parts.join(" - "));
}

async function inspectStagedFiles() {
  const inspectionTargets = state.files
    .map((file, index) => ({ file, index }))
    .filter(({ file, index }) => fileExtension(file.name) === ".pdf" && state.fileDetails[index]?.status === "pending");

  for (const { file, index } of inspectionTargets) {
    try {
      const pageCount = await countPdfPages(file);
      if (state.files[index] !== file) continue;
      state.fileDetails[index] = {
        pageCount,
        status: pageCount > 0 ? "ready" : "unavailable",
      };
    } catch {
      if (state.files[index] !== file) continue;
      state.fileDetails[index] = { pageCount: null, status: "unavailable" };
    }
    renderFiles();
  }
}

async function countPdfPages(file) {
  const content = new TextDecoder("latin1").decode(await file.arrayBuffer());
  const matches = content.match(/\/Type\s*\/Page\b/g);
  return matches ? matches.length : 0;
}

function isAcceptedFile(file, operation) {
  return operation.allowedExtensions.includes(fileExtension(file.name));
}

function base64ToFile(base64, fileName, type) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new File([bytes], fileName, { type });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return replacements[character];
  });
}

async function hydrateStatus() {
  try {
    const response = await fetch("/health");
    const data = await response.json();
    dom.storageStatus.dataset.state = "ready";
    dom.storageStatus.querySelector("span:last-child").textContent = data.outputs_dir;
  } catch {
    dom.storageStatus.dataset.state = "error";
    dom.storageStatus.querySelector("span:last-child").textContent = "Engine offline";
  }
}

async function hydrateCompressionToolStatus() {
  try {
    const response = await fetch("/tools/ghostscript");
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Ghostscript status unavailable");
    }
    state.compressionTool = {
      available: Boolean(data.available),
      command: data.command || null,
      loading: false,
      message: data.message || "",
      profiles: Array.isArray(data.profiles) ? data.profiles : [],
      source: data.source || null,
    };
  } catch {
    state.compressionTool = {
      available: false,
      command: null,
      loading: false,
      message: "Ghostscript status unavailable. Check the local API before compressing.",
      profiles: [],
      source: null,
    };
  }

  if (state.operationKey === "compress") {
    renderSettingsForm();
    renderFiles();
    renderRouteIntel();
    renderMission();
    renderJobPreview();
  }
}

function loadRecent() {
  try {
    state.recentLimit = readRecentLimit();
    const parsed = JSON.parse(localStorage.getItem("pdfForgeRecent") || "[]");
    state.recent = Array.isArray(parsed) ? trimRecent(parsed) : [];
  } catch {
    state.recent = [];
  }
}

function loadWelcomeState() {
  try {
    state.welcomeDismissed = localStorage.getItem(PATH_WELCOME_KEY) === "true";
  } catch {
    state.welcomeDismissed = false;
  }
}

function saveRecent() {
  localStorage.setItem("pdfForgeRecent", JSON.stringify(state.recent));
}

function readRecentLimit() {
  const parsed = Number(localStorage.getItem("pdfForgeRecentLimit") || "5");
  return [3, 5, 10].includes(parsed) ? parsed : 5;
}

function saveRecentLimit() {
  localStorage.setItem("pdfForgeRecentLimit", String(state.recentLimit));
}

function saveWelcomeState() {
  localStorage.setItem(PATH_WELCOME_KEY, String(state.welcomeDismissed));
}

function dismissPathWelcome() {
  state.welcomeDismissed = true;
  saveWelcomeState();
  renderPath();
}

function loadPresets() {
  try {
    const parsed = JSON.parse(localStorage.getItem("pdfForgePresets") || "{}");
    state.presets = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    state.presets = {};
  }
}

function savePresets() {
  localStorage.setItem("pdfForgePresets", JSON.stringify(state.presets));
}

dom.operationNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-operation]");
  if (!button) return;
  setOperation(button.dataset.operation);
});

dom.routeBoard.addEventListener("click", (event) => {
  const button = event.target.closest("[data-route]");
  if (!button) return;
  setOperation(button.dataset.route);
});

dom.routeCompareToggle.addEventListener("click", () => {
  state.compareOpen = !state.compareOpen;
  renderRouteCompare();
  if (state.compareOpen) {
    focusElement(dom.routeCompareFilters.querySelector("[aria-pressed='true']"));
  }
});

dom.routeCompareFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-compare-intent]");
  if (!button) return;
  state.compareIntent = button.dataset.compareIntent;
  renderRouteCompare();
  focusElement(dom.routeCompareFilters.querySelector(`[data-compare-intent="${state.compareIntent}"]`));
});

dom.routeCompareList.addEventListener("click", (event) => {
  const sampleButton = event.target.closest("[data-compare-sample]");
  if (sampleButton) {
    runComparedSample(sampleButton.dataset.compareSample);
    return;
  }

  const routeButton = event.target.closest("[data-compare-route]");
  if (!routeButton) return;
  chooseComparedRoute(routeButton.dataset.compareRoute);
});

dom.browseButton.addEventListener("click", () => dom.fileInput.click());
dom.sampleButton.addEventListener("click", runDemoJob);
dom.stageSampleButton.addEventListener("click", stageSampleFiles);
dom.routeIntelPrimaryButton.addEventListener("click", () => {
  const action = dom.routeIntelPrimaryButton.dataset.routeAction;
  if (action === "outputs") {
    document.querySelector(".results-panel").scrollIntoView({ block: "start", behavior: "smooth" });
    return;
  }

  if (action === "forge") {
    runJob();
    return;
  }
  stageSampleFiles();
});
dom.routeIntelSecondaryButton.addEventListener("click", runDemoJob);
dom.routeSuggestionButton?.addEventListener("click", () => {
  const routeSuggestion = dom.routeSuggestionButton.dataset.routeSuggestion;
  if (routeSuggestion) {
    clearStage();
    setOperation(routeSuggestion);
    renderMessage(`Switched to ${operations[routeSuggestion]?.title || "suggested"} route.`);
  }
});
dom.recoverySampleButton.addEventListener("click", stageSampleFiles);
dom.recoverySwitchButton.addEventListener("click", () => {
  const route = dom.recoverySwitchButton.dataset.route;
  if (route) {
    clearStage();
    setOperation(route);
    renderMessage(`Recovered to ${operations[route]?.title || "selected"} route.`);
    return;
  }

  renderMessage("No recovery route available.", "error");
  focusStageStart();
});
dom.recoveryClearButton.addEventListener("click", clearStage);
dom.presetApplyButton.addEventListener("click", applyRoutePreset);
dom.presetSaveButton.addEventListener("click", saveRoutePreset);
dom.missionActionButton.addEventListener("click", () => {
  const action = dom.missionActionButton.dataset.action;
  if (action === "stage-sample") {
    stageSampleFiles();
    return;
  }

  if (action === "forge") {
    runJob();
    return;
  }

  if (action === "outputs") {
    document.querySelector(".results-panel").scrollIntoView({ block: "start", behavior: "smooth" });
    return;
  }

  if (action === "switch-route") {
    const route = dom.missionActionButton.dataset.route;
    if (route) {
      setOperation(route);
      renderMessage(`Switched to ${operations[route]?.title || "selected"} route.`);
      focusStageStart();
    }
  }
});
dom.missionChecks.addEventListener("click", (event) => {
  const checkButton = event.target.closest("[data-check-action]");
  if (!checkButton) return;
  handleMissionControlAction(checkButton.dataset.checkAction);
});
dom.fileInput.addEventListener("change", (event) => addFiles(event.target.files));
dom.settingsForm.addEventListener("input", handleSettingsChange);
dom.settingsForm.addEventListener("change", handleSettingsChange);

dom.clearButton.addEventListener("click", () => resetWorkbench());

dom.fileList.addEventListener("click", (event) => {
  const moveButton = event.target.closest("[data-move-file]");
  if (moveButton) {
    moveStagedFile(Number(moveButton.dataset.moveFile), Number(moveButton.dataset.direction));
    return;
  }

  const button = event.target.closest("[data-remove-file]");
  if (!button) return;
  const removeIndex = Number(button.dataset.removeFile);
  state.files.splice(removeIndex, 1);
  state.fileDetails.splice(removeIndex, 1);
  state.bundle = null;
  state.lastReceipt = null;
  state.recovery = null;
  state.results = [];
  renderFiles();
  renderResults();
  renderMessage();
});
dom.fileList.addEventListener("dragstart", handleFileDragStart);
dom.fileList.addEventListener("dragover", handleFileDragOver);
dom.fileList.addEventListener("drop", handleFileDrop);
dom.fileList.addEventListener("dragend", handleFileDragEnd);
dom.pathSteps.addEventListener("click", (event) => {
  const stepItem = event.target.closest("[data-path-step]");
  if (!stepItem) return;
  const pathStep = Number(stepItem.dataset.pathStep);
  if (!Number.isInteger(pathStep)) return;
  goToPathStep(pathStep);
});
dom.pathSteps.addEventListener("keydown", (event) => {
  if (!(event.key === "Enter" || event.key === " ")) return;
  event.preventDefault();
  const stepItem = event.target.closest("[data-path-step]");
  if (!stepItem) return;
  const pathStep = Number(stepItem.dataset.pathStep);
  if (!Number.isInteger(pathStep)) return;
  goToPathStep(pathStep);
});
dom.pathQuickActions.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-path-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.pathAction;
  if (!action) return;
  const routeSuggestion = actionButton.dataset.routeSuggestion || null;
  handlePathQuickAction(action, routeSuggestion);
});
dom.pathWelcomeDismiss?.addEventListener("click", dismissPathWelcome);

dom.resultsList.addEventListener("click", (event) => {
  const repeatButton = event.target.closest("[data-repeat-job]");
  if (repeatButton) {
    repeatReceiptSetup();
    return;
  }

  const newJobButton = event.target.closest("[data-new-job]");
  if (!newJobButton) return;
  startNewJob();
});

dom.recentList.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-recent]");
  if (removeButton) {
    removeRecentJob(Number(removeButton.dataset.removeRecent));
    return;
  }

  const button = event.target.closest("[data-load-recent]");
  if (!button) return;
  const job = state.recent[Number(button.dataset.loadRecent)];
  if (!job) return;
  state.operationKey = job.operation;
  state.bundle = job.bundle || null;
  state.fileDetails = [];
  state.files = [];
  state.lastReceipt = null;
  state.recovery = null;
  state.results = job.files;
  state.running = false;
  renderOperation();
  renderMessage(`Loaded ${job.operationLabel} from recent outputs.`, "success");
  focusElement(document.querySelector(".claim-primary"));
});

dom.clearRecentButton.addEventListener("click", () => {
  state.recent = [];
  saveRecent();
  renderRecent();
  renderMessage("Recent rail cleared.");
  focusElement(dom.recentLimitSelect);
});

dom.cleanupRefreshButton.addEventListener("click", refreshOutputCleanup);
dom.cleanupList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-output]");
  if (!deleteButton) return;
  requestOutputDelete(deleteButton.dataset.deleteOutput);
});

dom.recentLimitSelect.addEventListener("change", () => {
  state.recentLimit = Number(dom.recentLimitSelect.value);
  state.recent = trimRecent();
  saveRecentLimit();
  saveRecent();
  renderRecent();
  renderMessage(`Recent rail now keeps ${state.recentLimit} jobs.`);
});

dom.runButton.addEventListener("click", runJob);
document.addEventListener("keydown", handleGlobalKeydown);

function startNewJob() {
  resetWorkbench(`Ready for another ${currentOperation().label.toLowerCase()} job.`);
}

for (const eventName of ["dragenter", "dragover"]) {
  dom.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dom.dropZone.dataset.active = "true";
  });
}

for (const eventName of ["dragleave", "drop"]) {
  dom.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dom.dropZone.dataset.active = "false";
  });
}

dom.dropZone.addEventListener("drop", (event) => {
  addFiles(event.dataTransfer.files);
});

loadRecent();
loadPresets();
loadWelcomeState();
renderOperation();
renderOutputCleanup();
hydrateStatus();
hydrateCompressionToolStatus();
refreshOutputCleanup();


// import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Ensure Chart.js is globally available
declare var Chart: any;

interface Capsule {
    id: string;
    tenant: string;
    version: string;
    status: 'Pending' | 'Executing' | 'Completed' | 'Failed' | 'Refused';
    executed_at: string;
    log_summary?: string;
    ipfs_hash?: string;
    ethereum_tx_id?: string;
    esgScore: number | null;
    refusalLog: string;
    esgQualitativeInsights?: string;
    financialDisclosures?: string;
}

interface User {
    name: string;
    email: string;
    role: 'Admin' | 'Developer' | 'Student';
    supabase_api_key_ref?: string;
    firebase_api_token_ref?: string;
    gemini_api_key_ref?: string;
    github_portfolio_link?: string;
    purpose_statement?: string;
}

interface AIChatMessage {
    role: 'user' | 'model' | 'system';
    message: string;
}

interface SmartManufacturingData {
    statusText: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';
    productionCapsules: number;
    esgCompliance: number; // Percentage
    autoRefusals: number;
    executionEngine: {
        status: 'ACTIVE' | 'PAUSED';
        executionCycles: number;
        currentCapsuleId: string;
        processingEfficiency: number; // Percentage
    };
    decisionLog: Array<{ id: string, status: 'APPROVED' | 'REFUSED', message: string, timestamp: string, details?: string }>;
    pipeline: {
        rawMaterial: { progress: number, activeCapsules: number, status: 'Active' | 'Waiting' | 'Issue' };
        smartManufacturing: { progress: number, activeCapsules: number, status: 'Active' | 'Waiting' | 'Issue' };
        qualityControl: { progress: number, activeCapsules: number, status: 'Active' | 'Waiting' | 'Issue' };
        packaging: { progress: number, activeCapsules: number, status: 'Active' | 'Waiting' | 'Issue' };
    };
    productionMetrics: {
        biodegradableOutputTons: number;
        esgComplianceRate: number; // Percentage
    };
    efficiencyMetrics: {
        avgDecisionTimeSec: number;
        uptimePercentage: number;
    };
    qualityRefusals: {
        batchesToday: number;
        rateThisWeek: number; // Percentage
    };
}

interface AppData {
    capsules: Capsule[];
    chatHistory: AIChatMessage[];
    currentUser: User | null;
    selectedCapsuleFile: File | null;
    pillarDetails: Record<string, { title: string, content: string, concept: string }>;
    strategicTabsContent: Record<string, { title: string, content: string }>;
    smartManufacturingData: SmartManufacturingData;
}

const appData: AppData = {
    capsules: [
        { id: 'cap_1a2b3c', tenant: 'SmartAgro', version: '1.2.1', status: 'Completed', executed_at: '2025-06-19T10:00:00Z', esgScore: 85, refusalLog: 'N/A', ipfs_hash: 'QmXoW8sABCDEFG123HIJKL', ethereum_tx_id: '0xabc123xyz789qrst', esgQualitativeInsights: "Positive impact on soil health through sustainable practices.", financialDisclosures: "Fully compliant with TCFD recommendations." },
        { id: 'cap_4d5e6f', tenant: 'FinCorp', version: '2.0.0', status: 'Refused', executed_at: '2025-06-19T09:45:12Z', esgScore: 45, refusalLog: 'Execution refused: Investment in non-compliant energy sector detected. Fails to meet minimum carbon footprint standards.', ipfs_hash: 'QmYpQ7tHIJKLMN456OPQRS', ethereum_tx_id: '0xdef456uvw012jklm', esgQualitativeInsights: "High exposure to fossil fuels and lacks transition plan.", financialDisclosures: "Partial disclosure on carbon emissions; improvements needed." },
        { id: 'cap_7g8h9i', tenant: 'CityGrid', version: '0.9.3', status: 'Executing', executed_at: '2025-06-19T10:02:30Z', esgScore: 72, refusalLog: 'N/A', ipfs_hash: 'QmZkR6uPQRSTU789VXYZA', ethereum_tx_id: '0xghi789nop345defg' },
        { id: 'cap_j1k2l3', tenant: 'SmartAgro', version: '1.2.0', status: 'Failed', executed_at: '2025-06-18T15:20:05Z', esgScore: null, refusalLog: 'Error: Upstream data provider API timeout. Unable to fetch critical weather data.' },
        { id: 'cap_m4n5o6', tenant: 'HealthSys', version: '3.1.4', status: 'Pending', executed_at: '2025-06-20T11:00:00Z', esgScore: 92, refusalLog: 'N/A', ipfs_hash: 'QmArS5vWXYZAB012CDEFG', ethereum_tx_id: '0xjkl012abc678qrst', esgQualitativeInsights: "Excellent patient data privacy measures.", financialDisclosures: "Transparent reporting on governance." }
    ],
    chatHistory: [],
    currentUser: null,
    selectedCapsuleFile: null,
    pillarDetails: {
        ingestion: { title: "BonnieX Data Ingestion & Normalization", content: "This pillar focuses on reliably collecting data from various sources like APIs, webhooks, IoT devices, and databases. It validates the incoming data for correctness and transforms it into a standardized format that other parts of the Bonnie 2.0 system can understand and process efficiently. This ensures data quality and consistency from the very beginning.", concept: "Data Ingestion and Normalization" },
        decision: { title: "Clyde Alpha Decision Relay", content: "Once data is ingested and normalized, this pillar uses predefined rules, policies (often managed by an Open Policy Agent - OPA), and potentially machine learning models to make decisions. It determines the appropriate actions to take based on the input data and the organization's operational logic, including whether an action should be refused due to compliance or ethical concerns.", concept: "Automated Decision Making and Policy Enforcement" },
        traceability: { title: "Blockchain & ESG Traceability Layer", content: "For critical actions and decisions, especially those with ESG (Environmental, Social, Governance) implications, this pillar ensures transparency and immutability. It records a hash or summary of the action and its outcome onto a public or private blockchain (like Ethereum using IPFS for larger data). This creates an auditable, tamper-proof trail for compliance and accountability.", concept: "Blockchain for Auditability and ESG Tracking" },
        orchestration: { title: "API Orchestration (Powered by n8n)", content: "Modern operations often involve multiple software systems. This pillar, often leveraging tools like n8n, allows Bonnie 2.0 to coordinate complex workflows across different APIs and services. It can chain API calls, transform data between systems, and implement conditional logic to manage sophisticated autonomous processes.", concept: "Workflow Automation and API Integration" },
        execution: { title: "Real-time Sovereign Execution Layer", content: "This is the engine that carries out the decided actions. It's built on scalable and resilient infrastructure, often using serverless functions (like AWS Lambda or Vercel Edge Functions), to ensure high availability and efficient resource use. It supports multi-tenant operations, meaning different users or departments can run their capsules in isolation and securely.", concept: "Scalable and Secure Action Execution" }
    },
    strategicTabsContent: {
        "supply-chain": { title: "Automated Supply Chain Optimization", content: "In automated supply chains, Bonnie 2.0 can autonomously execute procurement orders when inventory levels fall. Concurrently, it can cross-reference supplier ESG scores in real-time. If a supplier's rating drops below a set threshold, the system will proactively refuse the order and log the refusal on a blockchain for a transparent audit trail." },
        "financial-trading": { title: "Compliant Algorithmic Trading", content: "Bonnie 2.0 can execute algorithmic trading strategies while ensuring adherence to regulatory compliance (e.g., MiFID II) and internal risk policies. It can proactively halt trades that might violate these rules and provide a full audit log of all decisions, including refused trades due to compliance breaches." },
        "smart-manufacturing": { title: "Predictive Maintenance & Quality Control", content: "In smart manufacturing, Bonnie 2.0 can monitor sensor data from machinery. If predictive analytics indicate an impending failure or a drop in quality standards, it can autonomously schedule maintenance or adjust production parameters, logging all actions and sensor readings for traceability and ESG impact assessment (e.g., energy consumption changes)." },
        "healthcare": { title: "Personalized Medicine & Patient Adherence", content: "Bonnie 2.0 can manage personalized treatment plans, adjusting medication dosages based on real-time patient data from wearables, while ensuring HIPAA compliance. It can send reminders, track adherence, and alert healthcare providers to critical deviations, all while maintaining an auditable record of patient interactions and data handling." }
    },
    smartManufacturingData: {
        statusText: 'ACTIVE',
        productionCapsules: 847,
        esgCompliance: 99.7,
        autoRefusals: 23,
        executionEngine: {
            status: 'ACTIVE',
            executionCycles: 24893,
            currentCapsuleId: 'CAP-2024-001247',
            processingEfficiency: 98,
        },
        decisionLog: [
            { id: 'CAP-001247', status: 'APPROVED', message: 'ESG Score: 9.7/10, Quality Index: 98%', timestamp: '14:23:45' },
            { id: 'CAP-001246', status: 'REFUSED', message: 'Gelatinization Index Below Threshold (4.2 < 6.0)', timestamp: '14:23:12' },
            { id: 'CAP-001245', status: 'APPROVED', message: 'Carbon Negative Verified, Biodegradability 99.2%', timestamp: '14:22:58' },
            { id: 'CAP-001244', status: 'APPROVED', message: 'Batch parameters nominal, energy use optimal.', timestamp: '14:21:30' },
        ],
        pipeline: {
            rawMaterial: { progress: 95, activeCapsules: 12, status: 'Active' },
            smartManufacturing: { progress: 78, activeCapsules: 8, status: 'Active' },
            qualityControl: { progress: 85, activeCapsules: 6, status: 'Active' },
            packaging: { progress: 0, activeCapsules: 0, status: 'Waiting' },
        },
        productionMetrics: {
            biodegradableOutputTons: 2847,
            esgComplianceRate: 99.7,
        },
        efficiencyMetrics: {
            avgDecisionTimeSec: 2.3,
            uptimePercentage: 99.98,
        },
        qualityRefusals: {
            batchesToday: 23,
            rateThisWeek: 0.3,
        }
    }
};

let esgChartInstance: any = null;
// let ai: GoogleGenAI | null = null; // Temporarily disabled
// let geminiChat: Chat | null = null; // Temporarily disabled

const dom = {
    navLinks: null as NodeListOf<HTMLAnchorElement> | null,
    views: null as NodeListOf<HTMLDivElement> | null,
    mobileMenuButton: null as HTMLButtonElement | null,
    mobileMenu: null as HTMLDivElement | null,
    mainHeader: null as HTMLElement | null,
    dashboardTitleHeader: null as HTMLElement | null,
    dashboardSubtitleHeader: null as HTMLElement | null,
    chatInput: null as HTMLInputElement | null,
    chatSendButton: null as HTMLButtonElement | null,
    chatHistoryContainer: null as HTMLDivElement | null,
    
    pillarItems: null as NodeListOf<HTMLDivElement> | null,
    pillarDetailTitle: null as HTMLElement | null,
    pillarDetailContent: null as HTMLElement | null,
    pillarAIExplanationDiv: null as HTMLElement | null,
    pillarAIExplanationContent: null as HTMLElement | null,
    aiExplanationModal: null as HTMLElement | null,
    aiExplanationModalTitle: null as HTMLElement | null,
    aiExplanationModalContent: null as HTMLElement | null,
    closeAIExplanationModalBtn: null as HTMLButtonElement | null,
    strategicValueTabs: null as NodeListOf<HTMLButtonElement> | null,
    strategicValueTabPanesContainer: null as HTMLElement | null,
    homeExploreCapabilitiesBtn: null as HTMLButtonElement | null,
    homeGenerateUsecaseBtn: null as HTMLButtonElement | null,
    bonnie2LaunchBtn: null as HTMLButtonElement | null,
    simulatorLaunchDashboardBtn: null as HTMLButtonElement | null,
    simulatorPolycassavaBtn: null as HTMLButtonElement | null,
    simulatorUseGptBtn: null as HTMLButtonElement | null,
    simulatorEnterControlDashboardBtn: null as HTMLButtonElement | null,

    // Smart Manufacturing View Elements
    smStatusText: null as HTMLElement | null,
    smStatusIcon: null as HTMLElement | null,
    smProdCapsules: null as HTMLElement | null,
    smEsgCompliance: null as HTMLElement | null,
    smAutoRefusals: null as HTMLElement | null,
    smEngineStatus: null as HTMLElement | null,
    smExecCycles: null as HTMLElement | null,
    smCurrentCapsule: null as HTMLElement | null,
    smProcEfficiencyValue: null as HTMLElement | null,
    smProcEfficiencyBar: null as HTMLElement | null,
    smPauseExecutionBtn: null as HTMLButtonElement | null,
    smDecisionLog: null as HTMLElement | null,
    smPipelineTabsContainer: null as HTMLElement | null,
    smPipelineTabButtons: null as NodeListOf<HTMLButtonElement> | null,
    smPipelineTabPanes: null as NodeListOf<HTMLDivElement> | null,
    smPipelineRawStatus: null as HTMLElement | null,
    smPipelineRawProgress: null as HTMLElement | null,
    smPipelineRawProgressVal: null as HTMLElement | null,
    smPipelineRawCapsules: null as HTMLElement | null,
    smPipelineMfgStatus: null as HTMLElement | null,
    smPipelineMfgProgress: null as HTMLElement | null,
    smPipelineMfgProgressVal: null as HTMLElement | null,
    smPipelineMfgCapsules: null as HTMLElement | null,
    smPipelineQcStatus: null as HTMLElement | null,
    smPipelineQcProgress: null as HTMLElement | null,
    smPipelineQcProgressVal: null as HTMLElement | null,
    smPipelineQcCapsules: null as HTMLElement | null,
    smPipelinePkgStatus: null as HTMLElement | null,
    smPipelinePkgProgress: null as HTMLElement | null,
    smPipelinePkgProgressVal: null as HTMLElement | null,
    smPipelinePkgCapsules: null as HTMLElement | null,
    smProdMetricsTons: null as HTMLElement | null,
    smProdMetricsEsgRate: null as HTMLElement | null,
    smEfficiencyTime: null as HTMLElement | null,
    smEfficiencyUptime: null as HTMLElement | null,
    smQualityRefusalsBatches: null as HTMLElement | null,
    smQualityRefusalsRate: null as HTMLElement | null,
    smFloatingChatBtn: null as HTMLButtonElement | null,

    // Capsule Uploader
    capsuleFileInput: null as HTMLInputElement | null,
    browseFilesButton: null as HTMLButtonElement | null,
    fileNameDisplay: null as HTMLElement | null,
    fileUploaderSection: null as HTMLElement | null,
    capsulePreviewModal: null as HTMLElement | null,
    jsonPreviewContent: null as HTMLElement | null,
    cancelUploadButton: null as HTMLButtonElement | null,
    confirmUploadButton: null as HTMLButtonElement | null,

    // Monitor View
    monitorFilterTenant: null as HTMLInputElement | null,
    monitorFilterDate: null as HTMLInputElement | null,
    monitorFilterStatus: null as HTMLSelectElement | null,
    monitorCapsuleTable: null as HTMLTableSectionElement | null,
    monitorDetailsPane: null as HTMLElement | null,
    monitorSelectedCapsuleInfo: null as HTMLElement | null,
    monitorEsgPane: null as HTMLElement | null,
    esgChartCanvas: null as HTMLCanvasElement | null,
    esgQualitativeInfo: null as HTMLElement | null,
    monitorRefusalLogPane: null as HTMLElement | null,
    refusalLogDisplay: null as HTMLElement | null,

    // Dashboard Tabs
    dashboardTabs: null as HTMLElement | null,
    dashboardTabContent: null as HTMLElement | null,
    dashboardCapsuleTable: null as HTMLTableSectionElement | null,
    // (add other dashboard tab buttons/forms if needed for specific listeners)
    connectSupabaseBtn: null as HTMLButtonElement | null,
    connectFirebaseBtn: null as HTMLButtonElement | null,
    triggerVercelBtn: null as HTMLButtonElement | null,
    validateJsonBtn: null as HTMLButtonElement | null,
    loadJsonSimulatorBtn: null as HTMLButtonElement | null,

    // Forms
    loginButton: null as HTMLButtonElement | null,
    signupButton: null as HTMLButtonElement | null,
    studentApplicationForm: null as HTMLFormElement | null,
    contactSupportForm: null as HTMLFormElement | null,
    userProfileForm: null as HTMLFormElement | null,
    passwordChangeForm: null as HTMLFormElement | null,
    apiKeysForm: null as HTMLFormElement | null,

    // Accordions
    integrationsAccordion: null as HTMLElement | null,
    supportAccordion: null as HTMLElement | null,
};

function queryDomElements() {
    console.log("Querying DOM elements...");
    dom.navLinks = document.querySelectorAll('.nav-link');
    dom.views = document.querySelectorAll('.view');
    dom.mobileMenuButton = document.getElementById('mobile-menu-button') as HTMLButtonElement;
    dom.mobileMenu = document.getElementById('mobile-menu') as HTMLDivElement;
    dom.mainHeader = document.getElementById('main-header');
    dom.dashboardTitleHeader = document.getElementById('dashboard-title-header');
    dom.dashboardSubtitleHeader = document.getElementById('dashboard-subtitle-header');
    
    dom.chatInput = document.getElementById('chat-input') as HTMLInputElement;
    dom.chatSendButton = document.getElementById('chat-send-button') as HTMLButtonElement;
    dom.chatHistoryContainer = document.getElementById('chat-history') as HTMLDivElement;

    dom.pillarItems = document.querySelectorAll('.pillar-item');
    dom.pillarDetailTitle = document.getElementById('pillar-detail-title');
    dom.pillarDetailContent = document.getElementById('pillar-detail-content');
    dom.pillarAIExplanationDiv = document.getElementById('pillar-ai-explanation');
    dom.pillarAIExplanationContent = document.getElementById('pillar-ai-explanation-content');
    
    dom.aiExplanationModal = document.getElementById('ai-explanation-modal');
    dom.aiExplanationModalTitle = document.getElementById('ai-explanation-modal-title');
    dom.aiExplanationModalContent = document.getElementById('ai-explanation-modal-content');
    dom.closeAIExplanationModalBtn = document.getElementById('close-ai-explanation-modal-btn') as HTMLButtonElement;

    dom.strategicValueTabs = document.querySelectorAll('#strategic-value-tabs .strategic-tab');
    dom.strategicValueTabPanesContainer = document.getElementById('strategic-value-content');

    dom.homeExploreCapabilitiesBtn = document.getElementById('home-explore-capabilities-btn') as HTMLButtonElement;
    dom.homeGenerateUsecaseBtn = document.getElementById('home-generate-usecase-btn') as HTMLButtonElement;
    dom.bonnie2LaunchBtn = document.getElementById('bonnie-2-launch-button') as HTMLButtonElement; // Corrected ID
    dom.simulatorLaunchDashboardBtn = document.getElementById('simulator-launch-dashboard-btn') as HTMLButtonElement;
    dom.simulatorPolycassavaBtn = document.getElementById('simulator-polycassava-btn') as HTMLButtonElement;
    dom.simulatorUseGptBtn = document.getElementById('simulator-use-gpt-btn') as HTMLButtonElement;
    dom.simulatorEnterControlDashboardBtn = document.getElementById('simulator-enter-control-dashboard-btn') as HTMLButtonElement;

    // Smart Manufacturing View Elements
    dom.smStatusText = document.getElementById('sm-status-text');
    dom.smStatusIcon = document.getElementById('sm-status-icon');
    dom.smProdCapsules = document.getElementById('sm-prod-capsules');
    dom.smEsgCompliance = document.getElementById('sm-esg-compliance');
    dom.smAutoRefusals = document.getElementById('sm-auto-refusals');
    dom.smEngineStatus = document.getElementById('sm-engine-status');
    dom.smExecCycles = document.getElementById('sm-exec-cycles');
    dom.smCurrentCapsule = document.getElementById('sm-current-capsule');
    dom.smProcEfficiencyValue = document.getElementById('sm-proc-efficiency-value');
    dom.smProcEfficiencyBar = document.getElementById('sm-proc-efficiency-bar');
    dom.smPauseExecutionBtn = document.getElementById('sm-pause-execution-btn') as HTMLButtonElement;
    dom.smDecisionLog = document.getElementById('sm-decision-log');
    dom.smPipelineTabsContainer = document.getElementById('sm-pipeline-tabs');
    dom.smPipelineTabButtons = dom.smPipelineTabsContainer?.querySelectorAll('.sm-tab-button') as NodeListOf<HTMLButtonElement>;
    const smPipelineTabContent = document.getElementById('sm-pipeline-tab-content');
    if (smPipelineTabContent) {
        dom.smPipelineTabPanes = smPipelineTabContent.querySelectorAll('.sm-tab-pane') as NodeListOf<HTMLDivElement>;
    }
    
    dom.smPipelineRawStatus = document.getElementById('sm-pipeline-raw-status');
    dom.smPipelineRawProgress = document.getElementById('sm-pipeline-raw-progress');
    dom.smPipelineRawProgressVal = document.getElementById('sm-pipeline-raw-progress-val');
    dom.smPipelineRawCapsules = document.getElementById('sm-pipeline-raw-capsules');
    dom.smPipelineMfgStatus = document.getElementById('sm-pipeline-mfg-status');
    dom.smPipelineMfgProgress = document.getElementById('sm-pipeline-mfg-progress');
    dom.smPipelineMfgProgressVal = document.getElementById('sm-pipeline-mfg-progress-val');
    dom.smPipelineMfgCapsules = document.getElementById('sm-pipeline-mfg-capsules');
    dom.smPipelineQcStatus = document.getElementById('sm-pipeline-qc-status');
    dom.smPipelineQcProgress = document.getElementById('sm-pipeline-qc-progress');
    dom.smPipelineQcProgressVal = document.getElementById('sm-pipeline-qc-progress-val');
    dom.smPipelineQcCapsules = document.getElementById('sm-pipeline-qc-capsules');
    dom.smPipelinePkgStatus = document.getElementById('sm-pipeline-pkg-status');
    dom.smPipelinePkgProgress = document.getElementById('sm-pipeline-pkg-progress');
    dom.smPipelinePkgProgressVal = document.getElementById('sm-pipeline-pkg-progress-val');
    dom.smPipelinePkgCapsules = document.getElementById('sm-pipeline-pkg-capsules');
    dom.smProdMetricsTons = document.getElementById('sm-prod-metrics-tons');
    dom.smProdMetricsEsgRate = document.getElementById('sm-prod-metrics-esg-rate');
    dom.smEfficiencyTime = document.getElementById('sm-efficiency-time');
    dom.smEfficiencyUptime = document.getElementById('sm-efficiency-uptime');
    dom.smQualityRefusalsBatches = document.getElementById('sm-quality-refusals-batches');
    dom.smQualityRefusalsRate = document.getElementById('sm-quality-refusals-rate');
    dom.smFloatingChatBtn = document.getElementById('sm-floating-chat-btn') as HTMLButtonElement;

    // Capsule Uploader
    dom.capsuleFileInput = document.getElementById('capsule-file-input') as HTMLInputElement;
    dom.browseFilesButton = document.getElementById('browse-files-button') as HTMLButtonElement;
    dom.fileNameDisplay = document.getElementById('file-name-display');
    dom.fileUploaderSection = document.getElementById('file-uploader-section');
    dom.capsulePreviewModal = document.getElementById('capsule-preview-modal');
    dom.jsonPreviewContent = document.getElementById('json-preview-content');
    dom.cancelUploadButton = document.getElementById('cancel-upload-button') as HTMLButtonElement;
    dom.confirmUploadButton = document.getElementById('confirm-upload-button') as HTMLButtonElement;

    // Monitor View
    dom.monitorFilterTenant = document.getElementById('monitor-filter-tenant') as HTMLInputElement;
    dom.monitorFilterDate = document.getElementById('monitor-filter-date') as HTMLInputElement;
    dom.monitorFilterStatus = document.getElementById('monitor-filter-status') as HTMLSelectElement;
    dom.monitorCapsuleTable = document.getElementById('monitor-capsule-table') as HTMLTableSectionElement;
    dom.monitorDetailsPane = document.getElementById('monitor-details-pane');
    dom.monitorSelectedCapsuleInfo = document.getElementById('monitor-selected-capsule-info');
    dom.monitorEsgPane = document.getElementById('monitor-esg-pane');
    dom.esgChartCanvas = document.getElementById('esg-chart') as HTMLCanvasElement;
    dom.esgQualitativeInfo = document.getElementById('esg-qualitative-info');
    dom.monitorRefusalLogPane = document.getElementById('monitor-refusal-log-pane');
    dom.refusalLogDisplay = document.getElementById('refusal-log-display');

    // Dashboard Tabs
    dom.dashboardTabs = document.getElementById('dashboard-tabs');
    dom.dashboardTabContent = document.getElementById('dashboard-tab-content');
    dom.dashboardCapsuleTable = document.getElementById('dashboard-capsule-table') as HTMLTableSectionElement;
    dom.connectSupabaseBtn = document.getElementById('connect-supabase-btn') as HTMLButtonElement;
    dom.connectFirebaseBtn = document.getElementById('connect-firebase-btn') as HTMLButtonElement;
    dom.triggerVercelBtn = document.getElementById('trigger-vercel-btn') as HTMLButtonElement;
    dom.validateJsonBtn = document.getElementById('validate-json-btn') as HTMLButtonElement;
    dom.loadJsonSimulatorBtn = document.getElementById('load-json-simulator-btn') as HTMLButtonElement;
    
    // Forms
    dom.loginButton = document.getElementById('login-button') as HTMLButtonElement;
    dom.signupButton = document.getElementById('signup-button') as HTMLButtonElement;
    dom.studentApplicationForm = document.getElementById('student-application-form') as HTMLFormElement;
    dom.contactSupportForm = document.getElementById('contact-support-form') as HTMLFormElement;
    dom.userProfileForm = document.getElementById('user-profile-form') as HTMLFormElement; // Corrected - user-profile-form
    dom.passwordChangeForm = document.getElementById('password-change-form') as HTMLFormElement;
    dom.apiKeysForm = document.getElementById('api-keys-form') as HTMLFormElement;

    // Accordions
    dom.integrationsAccordion = document.getElementById('integrations-accordion');
    dom.supportAccordion = document.getElementById('support-accordion');
    console.log("DOM elements queried.");
}

function updateHeaderNav(currentViewId: string) {
    const isHomePage = currentViewId === 'home';
    
    document.querySelectorAll('.home-page-element').forEach(el => el.classList.toggle('hidden', !isHomePage));
    document.querySelectorAll('.dashboard-element').forEach(el => el.classList.toggle('hidden', isHomePage));
    
    if (dom.mainHeader) {
        dom.mainHeader.classList.toggle('bg-gray-800', isHomePage); // Darker header for home
        dom.mainHeader.classList.toggle('bg-white/80', !isHomePage); // Lighter header for dashboard
    }
    if (dom.dashboardTitleHeader) dom.dashboardTitleHeader.classList.toggle('hidden', isHomePage);
    if (dom.dashboardSubtitleHeader) dom.dashboardSubtitleHeader.classList.toggle('hidden', isHomePage);

    if (dom.mobileMenu && dom.mobileMenuButton) {
        dom.mobileMenu.innerHTML = ''; 
        const linksToDisplayQuery = isHomePage ? 
            '#main-header .home-page-element.nav-link, #main-header .home-page-element.btn-primary-home' :
            '#main-header .dashboard-element.nav-link';
        const linksToDisplay = Array.from(document.querySelectorAll<HTMLElement>(linksToDisplayQuery));

        linksToDisplay.forEach(link => {
            const mobileLink = link.cloneNode(true) as HTMLElement;
            mobileLink.className = 'block px-3 py-2 text-base font-medium transition-colors duration-150 ease-in-out'; // Base classes
            
            if (isHomePage) {
                mobileLink.classList.add('text-gray-300', 'hover:text-white', 'hover:bg-gray-700'); 
            } else {
                mobileLink.classList.add('text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-100');
            }
            // Ensure nav-link class for view switching if it's a view switcher
            if (link.classList.contains('nav-link') || link.dataset.view) {
                mobileLink.classList.add('nav-link');
            }
            
            if (mobileLink.id === 'bonnie-2-launch-button' && mobileLink instanceof HTMLButtonElement) {
                 mobileLink.addEventListener('click', () => switchView('dashboard')); // Special case for this button
            } else if (mobileLink.dataset.view) {
                 mobileLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    if(mobileLink.dataset.view) switchView(mobileLink.dataset.view);
                });
            } else if (mobileLink.tagName === 'A' && (mobileLink as HTMLAnchorElement).href && (mobileLink as HTMLAnchorElement).href.includes('#')) {
                (mobileLink as HTMLAnchorElement).addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = (mobileLink as HTMLAnchorElement).hash.substring(1);
                    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                    dom.mobileMenu?.classList.add('hidden');
                    dom.mobileMenuButton?.setAttribute('aria-expanded', 'false');
                });
            }
            dom.mobileMenu?.appendChild(mobileLink);
        });
    }
}


function showToast(message: string, duration: number = 3000): void { 
    const toastContainer = document.getElementById('toast-notification');
    if (toastContainer) {
        const p = toastContainer.querySelector('p');
        if (p) p.textContent = message;
        toastContainer.classList.remove('hidden');
        toastContainer.classList.add('opacity-100');
        setTimeout(() => {
            toastContainer.classList.remove('opacity-100');
            toastContainer.classList.add('opacity-0');
            setTimeout(() => {
                toastContainer.classList.add('hidden');
            }, 300); // Wait for fade out
        }, duration);
    } else { // Fallback if main toast element is missing for some reason
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-5 right-5 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 z-50 opacity-0';
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '1'; }, 100);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { toast.remove(); }, 300);
        }, duration);
    }
}

function switchView(viewId: string): void {
    console.log(`Switching to view: ${viewId}`);
    if (!dom.views) {
        console.error("dom.views is not initialized.");
        return;
    }
    dom.views.forEach(view => view.classList.remove('active'));
    const targetView = document.getElementById(`${viewId}-view`);
    if (targetView) {
        targetView.classList.add('active');
        dom.views.forEach(v => v.setAttribute('aria-hidden', v !== targetView ? 'true' : 'false'));
        console.log(`View ${viewId}-view activated.`);
    } else {
        console.error(`Target view ${viewId}-view not found.`);
    }
    
    updateHeaderNav(viewId); 

    document.querySelectorAll<HTMLElement>('#main-header .nav-link, #main-header .btn-primary-home').forEach(link => {
        const isActive = link.dataset.view === viewId || (link.id === 'bonnie-2-launch-button' && viewId === 'dashboard');
        link.classList.toggle('active', isActive);
         if (link.tagName === 'A') {
            (link as HTMLAnchorElement).setAttribute('aria-current', isActive ? 'page' : 'false');
        }
    });

    window.scrollTo(0, 0);
    if (dom.mobileMenu && dom.mobileMenuButton) {
        dom.mobileMenu.classList.add('hidden');
        dom.mobileMenuButton.setAttribute('aria-expanded', 'false');
    }

    // Specific rendering for views
    if (viewId === 'dashboard') {
        renderTable('dashboard-capsule-table', appData.capsules);
        switchTab('dashboard-tab-content', 'logs'); // Default to logs tab
    } else if (viewId === 'monitor') {
        renderTable('monitor-capsule-table', appData.capsules);
        if (dom.monitorDetailsPane) dom.monitorDetailsPane.classList.remove('hidden');
        if (dom.monitorSelectedCapsuleInfo) dom.monitorSelectedCapsuleInfo.classList.add('hidden');
    } else if (viewId === 'smart-manufacturing') {
        renderSmartManufacturingView();
        switchSmartManufacturingTab('production-pipeline'); // Default tab
    } else if (viewId === 'home') {
        displayPillarDetail(Object.keys(appData.pillarDetails)[0]); // Display first pillar
        switchStrategicValueTab(Object.keys(appData.strategicTabsContent)[0]); // Display first strategic tab
    }
}

function switchTab(containerId: string, tabId: string): void { 
    console.log(`Switching tab in ${containerId} to ${tabId}`);
    const tabContentContainer = document.getElementById(containerId);
    if (!tabContentContainer) {
        console.error(`Tab content container ${containerId} not found.`);
        return;
    }

    tabContentContainer.querySelectorAll<HTMLElement>('.tab-pane').forEach(pane => {
        pane.classList.add('hidden');
        pane.setAttribute('aria-hidden', 'true');
    });
    const activePane = tabContentContainer.querySelector<HTMLElement>(`#${tabId}-tab-pane`);
    if (activePane) {
        activePane.classList.remove('hidden');
        activePane.setAttribute('aria-hidden', 'false');
    } else {
        // Handle special case for deploy-capsule-nav which links to a view
        if(tabId === 'deploy-capsule-nav') {
            switchView('capsule-uploader');
            return; // Exit early as it's a view switch not tab switch
        }
        console.warn(`Tab pane for ${tabId} in ${containerId} not found.`);
    }
    
    const tabsContainerId = containerId.replace('-content', 's'); 
    const tabsContainer = document.getElementById(tabsContainerId);
    if (!tabsContainer) {
        console.error(`Tabs container ${tabsContainerId} not found.`);
        return;
    }

    tabsContainer.querySelectorAll<HTMLButtonElement>('.tab-button').forEach(btn => {
        const isActive = btn.dataset.tab === tabId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive.toString());
    });
 }

function renderTable(tableId: string, data: Capsule[]): void {
    const tableBody = document.getElementById(tableId) as HTMLTableSectionElement;
    if (!tableBody) {
        console.warn(`Table body with ID ${tableId} not found.`);
        return;
    }
    tableBody.innerHTML = ''; // Clear existing rows
    data.forEach(capsule => {
        const row = tableBody.insertRow();
        row.className = 'hover:bg-gray-100 cursor-pointer';
        row.setAttribute('role', 'row');
        row.dataset.capsuleId = capsule.id;

        let statusColor = 'bg-gray-100 text-gray-800';
        if (capsule.status === 'Completed') statusColor = 'bg-green-100 text-green-800 status-completed';
        else if (capsule.status === 'Refused' || capsule.status === 'Failed') statusColor = 'bg-red-100 text-red-800 status-failed';
        else if (capsule.status === 'Executing') statusColor = 'bg-blue-100 text-blue-800 status-executing';
        else if (capsule.status === 'Pending') statusColor = 'bg-yellow-100 text-yellow-800 status-pending';

        const commonColumns = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${capsule.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}">${capsule.status}</span></td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(capsule.executed_at).toLocaleString()}</td>
        `;

        if (tableId.includes('monitor')) {
            row.innerHTML = `
                ${commonColumns.replace(`>${capsule.id}<`, `>${capsule.id}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${capsule.tenant}`)}
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${capsule.ipfs_hash || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${capsule.ethereum_tx_id || 'N/A'}</td>
            `;
            row.addEventListener('click', () => handleMonitorRowClick(capsule.id));
        } else { // Dashboard table
             row.innerHTML = `
                ${commonColumns.replace(`>${capsule.id}<`, `>${capsule.id}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${capsule.version}`)}
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${capsule.ipfs_hash || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${capsule.ethereum_tx_id || 'N/A'}</td>
            `;
        }
    });
}

function createEsgChart(score: number | null): void {
    if (!dom.esgChartCanvas) {
        console.warn("ESG Chart canvas not found.");
        return;
    }
    const ctx = dom.esgChartCanvas.getContext('2d');
    if (!ctx) {
         console.warn("Could not get 2D context for ESG chart.");
        return;
    }

    if (esgChartInstance) {
        esgChartInstance.destroy();
    }
    
    const validScore = score !== null ? Math.max(0, Math.min(100, score)) : 0;

    const data = {
        labels: ['ESG Score', 'Remainder'],
        datasets: [{
            data: [validScore, 100 - validScore],
            backgroundColor: ['#8a6d3b', '#e0e0e0'],
            borderColor: '#ffffff',
            borderWidth: 2,
            circumference: 180,
            rotation: 270,
        }]
    };

    esgChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            cutout: '70%',
        },
        plugins: [{
            id: 'gaugeText',
            beforeDraw(chart: any) { // Chart.js Chart instance
                const { width, height, ctx: chartCtx } = chart;
                chartCtx.restore();
                const fontSize = (height / 114).toFixed(2);
                chartCtx.font = `bold ${fontSize}em Inter, sans-serif`;
                chartCtx.fillStyle = '#4a4a4a';
                chartCtx.textBaseline = 'middle';
                const text = score !== null ? `${validScore}` : "N/A";
                const textX = Math.round((width - chartCtx.measureText(text).width) / 2);
                const textY = height / 1.5; // Adjust Y position for semi-circle
                chartCtx.fillText(text, textX, textY);
                chartCtx.save();
            }
        }]
    });
}

function updateMonitorDetails(capsule: Capsule | undefined): void {
    if (!capsule) {
        if (dom.monitorDetailsPane) dom.monitorDetailsPane.classList.remove('hidden');
        if (dom.monitorSelectedCapsuleInfo) dom.monitorSelectedCapsuleInfo.classList.add('hidden');
        return;
    }

    if (dom.monitorDetailsPane) dom.monitorDetailsPane.classList.add('hidden');
    if (dom.monitorSelectedCapsuleInfo) dom.monitorSelectedCapsuleInfo.classList.remove('hidden');
    
    createEsgChart(capsule.esgScore);
    if (dom.esgQualitativeInfo) {
        dom.esgQualitativeInfo.innerHTML = `
            <p><strong>Qualitative Insights:</strong> ${capsule.esgQualitativeInsights || 'Not available.'}</p>
            <p><strong>Financial Disclosures:</strong> ${capsule.financialDisclosures || 'Not available.'}</p>
        `;
    }
    if (dom.refusalLogDisplay) {
        dom.refusalLogDisplay.textContent = capsule.refusalLog || 'No refusal log available.';
    }
}

function handleMonitorRowClick(capsuleId: string): void {
    const capsule = appData.capsules.find(c => c.id === capsuleId);
    updateMonitorDetails(capsule);
}

function addMessageToChat(role: AIChatMessage['role'], message: string): void {
    if (!dom.chatHistoryContainer) return;

    const messageWrapper = document.createElement('div');
    const messageBubble = document.createElement('div');
    const messageText = document.createElement('p');

    messageWrapper.className = `flex mb-4 ${role === 'user' ? 'justify-end' : 'justify-start'}`;
    messageBubble.className = `p-3 rounded-lg max-w-lg shadow-md ${role === 'user' ? 'bg-[#8a6d3b] text-white' : 'bg-gray-200 text-gray-800'}`;
    messageText.className = 'text-sm';
    messageText.textContent = message;

    messageBubble.appendChild(messageText);
    messageWrapper.appendChild(messageBubble);
    dom.chatHistoryContainer.appendChild(messageWrapper);
    dom.chatHistoryContainer.scrollTop = dom.chatHistoryContainer.scrollHeight;
    
    appData.chatHistory.push({ role, message });
}

async function handleChatSend(): Promise<void> {
    if (!dom.chatInput || !dom.chatSendButton) return;
    const userMessage = dom.chatInput.value.trim();
    if (!userMessage) return;

    addMessageToChat('user', userMessage);
    dom.chatInput.value = '';
    dom.chatSendButton.disabled = true;
    addMessageToChat('system', 'Bonnie is thinking...');

    // Simulate AI response since Gemini is disabled
    setTimeout(() => {
        const aiResponse = `Simulated AI response to: "${userMessage}". (AI features are temporarily disabled for troubleshooting).`;
        // Remove "thinking" message
        if (dom.chatHistoryContainer && dom.chatHistoryContainer.lastChild) {
             const lastMessageBubble = dom.chatHistoryContainer.lastChild as HTMLElement;
             if (lastMessageBubble.textContent?.includes('thinking...')) {
                lastMessageBubble.remove();
             }
        }
        addMessageToChat('model', aiResponse);
        if (dom.chatSendButton) dom.chatSendButton.disabled = false;
    }, 1000);
}

function initGemini(): void {
    // AI features temporarily disabled
    console.log("Gemini AI initialization skipped (temporarily disabled).");
    addMessageToChat('system', "AI Companion features are temporarily disabled for troubleshooting.");
    if (dom.chatInput) dom.chatInput.disabled = true;
    if (dom.chatSendButton) dom.chatSendButton.disabled = true;
    // Hide simplify explanation buttons
    document.querySelectorAll('.simplify-explanation-btn').forEach(btn => (btn as HTMLElement).style.display = 'none');
}

async function getSimplifiedExplanation(concept: string, pillarTitle: string): Promise<string> {
    // AI features temporarily disabled
    return `Simplified explanation for "${concept}" related to "${pillarTitle}" is unavailable as AI features are temporarily disabled.`;
}

function displayPillarDetail(pillarKey: string | null) {
    if (!dom.pillarDetailTitle || !dom.pillarDetailContent || !dom.pillarAIExplanationDiv) return;
    if (!pillarKey || !appData.pillarDetails[pillarKey]) {
        dom.pillarDetailTitle.textContent = 'Select a pillar on the left to view its details.';
        dom.pillarDetailContent.textContent = '';
        dom.pillarAIExplanationDiv.classList.add('hidden');
        return;
    }
    const detail = appData.pillarDetails[pillarKey];
    dom.pillarDetailTitle.textContent = detail.title;
    dom.pillarDetailContent.textContent = detail.content;
    dom.pillarAIExplanationDiv.classList.add('hidden'); // Hide AI explanation initially

    dom.pillarItems?.forEach(item => {
        item.classList.toggle('active', item.dataset.pillar === pillarKey);
    });
}

async function handleSimplifyPillarExplanation(event: Event) {
    const button = event.currentTarget as HTMLButtonElement;
    const pillarItem = button.closest('.pillar-item') as HTMLElement;
    const pillarKey = pillarItem?.dataset.pillar;

    if (!pillarKey || !dom.aiExplanationModal || !dom.aiExplanationModalTitle || !dom.aiExplanationModalContent) return;

    const pillarData = appData.pillarDetails[pillarKey];
    if (!pillarData) return;

    dom.aiExplanationModalTitle.textContent = `Simplified: ${pillarData.title}`;
    dom.aiExplanationModalContent.innerHTML = '<p>Generating explanation...</p>';
    dom.aiExplanationModal.classList.remove('hidden');
    
    // Simulate AI explanation
    const explanation = await getSimplifiedExplanation(pillarData.concept, pillarData.title);
    dom.aiExplanationModalContent.innerHTML = `<p>${explanation}</p>`;
}

function switchStrategicValueTab(tabKey: string | null) {
    if (!dom.strategicValueTabPanesContainer || !dom.strategicValueTabs) return;

    dom.strategicValueTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabKey);
        tab.setAttribute('aria-selected', (tab.dataset.tab === tabKey).toString());
    });

    dom.strategicValueTabPanesContainer.querySelectorAll<HTMLElement>('.strategic-tab-pane').forEach(pane => {
        const isActive = pane.dataset.tabContent === tabKey;
        pane.classList.toggle('hidden', !isActive);
        pane.setAttribute('aria-hidden', (!isActive).toString());
    });
}

function renderSmartManufacturingView() {
    const data = appData.smartManufacturingData;

    if (dom.smStatusText) dom.smStatusText.textContent = data.statusText;
    if (dom.smStatusIcon) dom.smStatusIcon.innerHTML = data.statusText === 'ACTIVE' ? 
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' : 
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';

    if (dom.smProdCapsules) dom.smProdCapsules.textContent = data.productionCapsules.toLocaleString();
    if (dom.smEsgCompliance) dom.smEsgCompliance.textContent = `${data.esgCompliance}%`;
    if (dom.smAutoRefusals) dom.smAutoRefusals.textContent = data.autoRefusals.toLocaleString();

    if (dom.smEngineStatus) dom.smEngineStatus.textContent = data.executionEngine.status;
    if (dom.smEngineStatus) {
      dom.smEngineStatus.className = `text-xs px-2 py-0.5 rounded-full ${data.executionEngine.status === 'ACTIVE' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`;
    }
    if (dom.smExecCycles) dom.smExecCycles.textContent = data.executionEngine.executionCycles.toLocaleString();
    if (dom.smCurrentCapsule) dom.smCurrentCapsule.textContent = data.executionEngine.currentCapsuleId;
    if (dom.smProcEfficiencyValue) dom.smProcEfficiencyValue.textContent = `${data.executionEngine.processingEfficiency}%`;
    if (dom.smProcEfficiencyBar) dom.smProcEfficiencyBar.style.width = `${data.executionEngine.processingEfficiency}%`;

    if (dom.smDecisionLog) {
        dom.smDecisionLog.innerHTML = data.decisionLog.map(log => `
            <div class="flex items-start text-xs p-1.5 border-b border-gray-100">
                <span class="mr-2 ${log.status === 'APPROVED' ? 'text-green-500' : 'text-red-500'}">
                    ${log.status === 'APPROVED' ? 
                        '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>' : 
                        '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>'}
                </span>
                <div class="flex-grow">
                    <span class="font-medium ${log.status === 'APPROVED' ? 'text-green-700' : 'text-red-700'}">${log.id} ${log.status}</span>
                    <p class="text-gray-600">${log.message}</p>
                </div>
                <span class="text-gray-400 whitespace-nowrap">${log.timestamp}</span>
            </div>
        `).join('');
    }
    
    const pipeline = data.pipeline;
    const updatePipelineCard = (prefix: string, cardData: any) => {
        const statusEl = dom[`smPipeline${prefix}Status` as keyof typeof dom] as HTMLElement;
        const progressEl = dom[`smPipeline${prefix}Progress` as keyof typeof dom] as HTMLElement;
        const progressValEl = dom[`smPipeline${prefix}ProgressVal` as keyof typeof dom] as HTMLElement;
        const capsulesEl = dom[`smPipeline${prefix}Capsules` as keyof typeof dom] as HTMLElement;

        if(statusEl) { statusEl.textContent = cardData.status; statusEl.className = `status-badge status-${cardData.status.toLowerCase()}`; }
        if(progressEl) progressEl.style.width = `${cardData.progress}%`;
        if(progressValEl) progressValEl.textContent = `${cardData.progress}%`;
        if(capsulesEl) capsulesEl.textContent = cardData.activeCapsules.toString();
    };

    updatePipelineCard('Raw', pipeline.rawMaterial);
    updatePipelineCard('Mfg', pipeline.smartManufacturing);
    updatePipelineCard('Qc', pipeline.qualityControl);
    updatePipelineCard('Pkg', pipeline.packaging);

    if (dom.smProdMetricsTons) dom.smProdMetricsTons.textContent = `${data.productionMetrics.biodegradableOutputTons.toLocaleString()} tons`;
    if (dom.smProdMetricsEsgRate) dom.smProdMetricsEsgRate.textContent = `${data.productionMetrics.esgComplianceRate}%`;
    if (dom.smEfficiencyTime) dom.smEfficiencyTime.textContent = `${data.efficiencyMetrics.avgDecisionTimeSec} sec`;
    if (dom.smEfficiencyUptime) dom.smEfficiencyUptime.textContent = `${data.efficiencyMetrics.uptimePercentage}%`;
    if (dom.smQualityRefusalsBatches) dom.smQualityRefusalsBatches.textContent = data.qualityRefusals.batchesToday.toLocaleString();
    if (dom.smQualityRefusalsRate) dom.smQualityRefusalsRate.textContent = `${data.qualityRefusals.rateThisWeek}%`;
}

function switchSmartManufacturingTab(tabId: string) {
    if (!dom.smPipelineTabButtons || !dom.smPipelineTabPanes) return;
    dom.smPipelineTabButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.tab === tabId);
        button.setAttribute('aria-selected', (button.dataset.tab === tabId).toString());
    });
    dom.smPipelineTabPanes.forEach(pane => {
        const isActive = pane.dataset.tabContent === tabId;
        pane.classList.toggle('hidden', !isActive);
        pane.setAttribute('aria-hidden', (!isActive).toString());
    });
}


function handleGenericFormSubmit(event: Event, formName: string): void {
    event.preventDefault();
    showToast(`${formName} submitted successfully (simulated).`);
    (event.target as HTMLFormElement).reset();
}

function handleLoginSignup(event: Event, type: 'login' | 'signup'): void {
    event.preventDefault();
    const email = (document.getElementById('email-input') as HTMLInputElement)?.value;
    const roleSelect = (document.getElementById('role-select') as HTMLSelectElement);
    const role = roleSelect?.value || 'Student';

    if (!email) {
        showToast('Please enter your email.', 3000);
        return;
    }
    if (type === 'signup') {
        appData.currentUser = { email, name: "New User", role: role as User['role'] };
        showToast(`Signup successful as ${role}! Welcome, ${email}! (Simulated).`);
    } else {
        appData.currentUser = { email, name: "Existing User", role: 'Developer' }; // Simulate existing user
        showToast(`Login successful! Welcome back, ${email}! (Simulated).`);
    }
    // Potentially switch to dashboard or a user-specific view
    switchView('dashboard');
}

function handleCapsuleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        appData.selectedCapsuleFile = input.files[0];
        if (dom.fileNameDisplay) dom.fileNameDisplay.textContent = appData.selectedCapsuleFile.name;
        showCapsulePreviewModal();
    }
}

function handleCapsuleFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    dom.fileUploaderSection?.classList.remove('border-blue-500', 'bg-blue-50');
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
        if (event.dataTransfer.files[0].type === "application/json") {
            appData.selectedCapsuleFile = event.dataTransfer.files[0];
            if (dom.fileNameDisplay) dom.fileNameDisplay.textContent = appData.selectedCapsuleFile.name;
            showCapsulePreviewModal();
        } else {
            showToast("Invalid file type. Please upload a JSON file.", 3000);
        }
    }
}

function showCapsulePreviewModal(): void {
    if (!appData.selectedCapsuleFile || !dom.capsulePreviewModal || !dom.jsonPreviewContent) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const jsonContent = JSON.parse(e.target?.result as string);
            dom.jsonPreviewContent!.textContent = JSON.stringify(jsonContent, null, 2);
            dom.capsulePreviewModal!.classList.remove('hidden');
        } catch (err) {
            showToast("Error parsing JSON file.", 3000);
            if (dom.fileNameDisplay) dom.fileNameDisplay.textContent = "";
            appData.selectedCapsuleFile = null;
        }
    };
    reader.readAsText(appData.selectedCapsuleFile);
}

function hideCapsulePreviewModal(): void {
    if (dom.capsulePreviewModal) dom.capsulePreviewModal.classList.add('hidden');
    if (dom.fileNameDisplay) dom.fileNameDisplay.textContent = "";
    if (dom.capsuleFileInput) dom.capsuleFileInput.value = ""; // Reset file input
    appData.selectedCapsuleFile = null;
}

function confirmCapsuleUpload(): void {
    if (!appData.selectedCapsuleFile) return;
    showToast(`Capsule "${appData.selectedCapsuleFile.name}" deployed successfully (simulated).`);
    // Add to appData.capsules or trigger further logic
    hideCapsulePreviewModal();
}

function handleDashboardButtonClicks(event: Event): void {
    const target = event.target as HTMLButtonElement;
    if(target.id === 'connect-supabase-btn') showToast('Supabase connection test (simulated)...');
    else if(target.id === 'connect-firebase-btn') showToast('Firebase connection test (simulated)...');
    else if(target.id === 'trigger-vercel-btn') showToast('Vercel deployment triggered (simulated)...');
    else if(target.id === 'validate-json-btn') {
        const jsonInput = (document.getElementById('capsule-json-input') as HTMLTextAreaElement)?.value;
        try {
            JSON.parse(jsonInput);
            showToast('JSON is valid!');
        } catch(e) {
            showToast('Invalid JSON syntax.', 3000);
        }
    }
    else if(target.id === 'load-json-simulator-btn') showToast('JSON loaded into simulator (simulated).');
}

function initEventListeners(): void {
    console.log("Initializing event listeners...");

    dom.mobileMenuButton?.addEventListener('click', () => {
        if (!dom.mobileMenu || !dom.mobileMenuButton) return;
        const isExpanded = dom.mobileMenuButton.getAttribute('aria-expanded') === 'true';
        dom.mobileMenu.classList.toggle('hidden');
        dom.mobileMenuButton.setAttribute('aria-expanded', (!isExpanded).toString());
    });

    // Unified Nav Link Handling (both home and dashboard elements with data-view)
    document.querySelectorAll<HTMLElement>('#main-header [data-view]').forEach(link => {
        if (link.dataset.view) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                switchView(link.dataset.view!);
            });
        }
    });
    
    // Home page anchor links
    document.querySelectorAll<HTMLAnchorElement>('#main-header .home-page-element a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = (e.currentTarget as HTMLAnchorElement).hash.substring(1);
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        });
    });


    // Home page specific buttons
    dom.homeExploreCapabilitiesBtn?.addEventListener('click', () => document.getElementById('capabilities')?.scrollIntoView({behavior: 'smooth'}) );
    dom.homeGenerateUsecaseBtn?.addEventListener('click', () => showToast('Generating use case ideas (simulated)...'));
    // dom.bonnie2LaunchBtn is handled by general data-view listener now.
    dom.simulatorLaunchDashboardBtn?.addEventListener('click', () => switchView('dashboard'));
    dom.simulatorPolycassavaBtn?.addEventListener('click', () => showToast('Exploring Polycassava Ecosystem (simulated)...'));
    dom.simulatorUseGptBtn?.addEventListener('click', () => switchView('ai-companion'));
    dom.simulatorEnterControlDashboardBtn?.addEventListener('click', () => switchView('dashboard'));

    // Pillar items and simplify buttons
    dom.pillarItems?.forEach(item => {
        item.addEventListener('click', (e) => {
            if (!(e.target as HTMLElement).classList.contains('simplify-explanation-btn')) {
                displayPillarDetail(item.dataset.pillar || null);
            }
        });
        const simplifyBtn = item.querySelector<HTMLButtonElement>('.simplify-explanation-btn');
        simplifyBtn?.addEventListener('click', handleSimplifyPillarExplanation);
    });

    dom.closeAIExplanationModalBtn?.addEventListener('click', () => dom.aiExplanationModal?.classList.add('hidden'));

    // Strategic value tabs
    dom.strategicValueTabs?.forEach(tab => {
        tab.addEventListener('click', () => switchStrategicValueTab(tab.dataset.tab || null));
    });

    // Chat
    dom.chatSendButton?.addEventListener('click', handleChatSend);
    dom.chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChatSend();
    });

    // Smart Manufacturing
    dom.smPauseExecutionBtn?.addEventListener('click', () => showToast('Execution Paused (simulated).'));
    dom.smPipelineTabButtons?.forEach(button => {
        button.addEventListener('click', () => switchSmartManufacturingTab(button.dataset.tab!));
    });
    dom.smFloatingChatBtn?.addEventListener('click', () => switchView('ai-companion'));

    // Capsule Uploader
    dom.browseFilesButton?.addEventListener('click', () => dom.capsuleFileInput?.click());
    dom.capsuleFileInput?.addEventListener('change', handleCapsuleFileChange);
    dom.fileUploaderSection?.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); dom.fileUploaderSection?.classList.add('border-blue-500', 'bg-blue-50'); });
    dom.fileUploaderSection?.addEventListener('dragleave', (e) => { e.preventDefault(); e.stopPropagation(); dom.fileUploaderSection?.classList.remove('border-blue-500', 'bg-blue-50'); });
    dom.fileUploaderSection?.addEventListener('drop', handleCapsuleFileDrop);
    dom.cancelUploadButton?.addEventListener('click', hideCapsulePreviewModal);
    dom.confirmUploadButton?.addEventListener('click', confirmCapsuleUpload);

    // Monitor View Filters (example - can be expanded)
    [dom.monitorFilterTenant, dom.monitorFilterDate, dom.monitorFilterStatus].forEach(el => {
        el?.addEventListener('change', () => {
            // Add filtering logic here if needed, then re-render table
            showToast("Filter changed, re-rendering table (simulated).");
            renderTable('monitor-capsule-table', appData.capsules); 
        });
    });

    // Dashboard Tabs
    dom.dashboardTabs?.querySelectorAll<HTMLButtonElement>('.tab-button').forEach(button => {
        button.addEventListener('click', () => switchTab('dashboard-tab-content', button.dataset.tab!));
    });
    dom.connectSupabaseBtn?.addEventListener('click', handleDashboardButtonClicks);
    dom.connectFirebaseBtn?.addEventListener('click', handleDashboardButtonClicks);
    dom.triggerVercelBtn?.addEventListener('click', handleDashboardButtonClicks);
    dom.validateJsonBtn?.addEventListener('click', handleDashboardButtonClicks);
    dom.loadJsonSimulatorBtn?.addEventListener('click', handleDashboardButtonClicks);


    // Forms
    dom.loginButton?.addEventListener('click', (e) => handleLoginSignup(e, 'login'));
    dom.signupButton?.addEventListener('click', (e) => handleLoginSignup(e, 'signup'));
    dom.studentApplicationForm?.addEventListener('submit', (e) => handleGenericFormSubmit(e, 'Student Application'));
    dom.contactSupportForm?.addEventListener('submit', (e) => handleGenericFormSubmit(e, 'Support Message'));
    dom.userProfileForm?.addEventListener('submit', (e) => handleGenericFormSubmit(e, 'User Profile Update'));
    dom.passwordChangeForm?.addEventListener('submit', (e) => handleGenericFormSubmit(e, 'Password Change'));
    dom.apiKeysForm?.addEventListener('submit', (e) => handleGenericFormSubmit(e, 'API Keys Update'));

    // Accordions
    const setupAccordion = (accordionContainer: HTMLElement | null) => {
        if (!accordionContainer) return;
        accordionContainer.querySelectorAll<HTMLElement>('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling as HTMLElement;
                const arrow = header.querySelector('span:last-child');
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                
                content.classList.toggle('hidden');
                header.setAttribute('aria-expanded', (!isExpanded).toString());
                if (arrow) arrow.innerHTML = content.classList.contains('hidden') ? '&#9660;' : '&#9650;';
            });
        });
    };
    setupAccordion(dom.integrationsAccordion);
    setupAccordion(dom.supportAccordion);

    console.log("Event listeners initialized.");
}

function init(): void {
    console.log("Application initializing...");
    queryDomElements();
    initEventListeners();
    initGemini(); // Initialize Gemini (will be stubbed if SDK is commented out)
    
    // Default view
    switchView('home'); 
    console.log("Application initialized.");
}

document.addEventListener('DOMContentLoaded', init);
console.log("Script loaded, DOMContentLoaded listener added.");

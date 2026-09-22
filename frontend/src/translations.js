// CyberSafe — English & Hindi Translation Dictionary

export const TRANSLATIONS = {
  en: {
    // Nav
    appName: "CyberSafe",
    openTool: "Open Tool",
    backOverview: "Back to overview",
    newAnalysis: "New analysis",
    langToggle: "हिन्दी",
    currentLang: "English",
    liveIntel: "LIVE INTEL",

    // Hero
    heroEyebrow: "Cybersecurity — Vijaybhoomi University",
    heroTitle1: "Detect threats",
    heroTitle2: "before they reach you.",
    heroSub: "CyberSafe is an AI-powered analysis tool for students, educators, and technical teams. Paste a suspicious message, URL, or upload a file — get a clear, evidence-backed security verdict in seconds.",
    heroCta: "Start analysing",

    // Stats
    statAnalysed: "Threats Analysed",
    statBlocked: "Threats Blocked",
    statCountries: "Countries Covered",
    statAccuracy: "Detection Accuracy",

    // Live Feed
    liveFeedTitle: "Live Threat Intelligence",
    liveFeedSub: "Real-time global intercepts — anonymised",
    liveFeedShowing: "Showing 4 of active intercepts",
    liveFeedNotice: "All data anonymised. For demonstration purposes.",
    justNow: "just now",

    // What it does
    whatLabel: "What it does",
    whatHeading: "Security decisions should not require a degree.",
    whatBody1: "Most security tools produce technical reports full of cryptic indicators that confuse everyday users. CyberSafe converts multi-engine threat signals into plain language that a first-year student can act on — while still offering full forensic detail for technical users.",
    whatBody2: "It covers phishing, malware, malicious URLs, social engineering, and six other threat categories. Every verdict is backed by evidence — not guesswork.",

    // Pipeline
    pipeLabel: "Capabilities",
    pipeHeading: "A five-stage analysis pipeline.",
    features: [
      {
        num: '01',
        title: 'Rules Engine',
        desc: 'Regex heuristics and signature matching for urgency, brand spoofing, URL shorteners, and dangerous file extensions.',
      },
      {
        num: '02',
        title: 'ML Classifier',
        desc: 'Lexical entropy, domain-age signals, and keyword vectors produce a calibrated threat probability score.',
      },
      {
        num: '03',
        title: 'Security Checks',
        desc: 'SSL certificate validation, domain registration age, sender authenticity checks, and attachment inspection.',
      },
      {
        num: '04',
        title: 'Risk Engine',
        desc: 'Weighted composite scoring with a fail-safe margin that promotes borderline verdicts toward caution.',
      },
      {
        num: '05',
        title: 'Explanation Tiers',
        desc: 'Three levels of explanation — Simple, Detailed, Technical — tailored to the user\'s background and role.',
      },
      {
        num: '06',
        title: 'SSRF & PII Protection',
        desc: 'Pre-socket IP validation blocks internal network access. Automatic PII redaction before any external model call.',
      },
    ],

    // Steps
    stepsLabel: "How it works",
    stepsHeading: "From submission to verdict in seconds.",
    steps: [
      { num: '01', title: 'Submit content', desc: 'Paste text, enter a URL, upload a file, or attach a screenshot.' },
      { num: '02', title: 'Parallel analysis', desc: 'Three independent engines evaluate your content simultaneously.' },
      { num: '03', title: 'Risk scoring', desc: 'A weighted formula combines engine outputs into a single risk score.' },
      { num: '04', title: 'Plain-language verdict', desc: 'Choose your explanation depth — Simple, Detailed, or Technical.' },
      { num: '05', title: 'Action checklist', desc: 'Clear, prioritised steps to protect yourself or your institution.' },
    ],

    // Audience
    usersLabel: "Who it is for",
    usersHeading: "Built for the classroom and beyond.",
    users: [
      {
        role: "Students",
        desc: "Learn to recognise real threats using live examples. Get explanations that match your level — no background knowledge required."
      },
      {
        role: "Educators",
        desc: "Use CyberSafe as a teaching aid in cybersecurity modules. The three explanation tiers make it easy to demonstrate how threats are identified."
      },
      {
        role: "Technical Teams",
        desc: "Fast first-pass triage for reported phishing and suspicious attachments before escalating to full forensic analysis."
      }
    ],

    // Footer
    footerCopy: "© 2026 CyberSafe · Vijaybhoomi University Cybersecurity Programme",
    footerNote: "No data stored · Transient analysis only",

    // Dashboard Telemetry Ribbon
    nodeLabel: "SYSTEM NODE:",
    threatLabel: "THREAT LEVEL:",
    defconLevel: "DEFCON 2 · ELEVATED",
    engineLabel: "ENGINE:",
    engineVal: "v3.4 MULTI-VECTOR + ML",
    scansLabel: "SCANS TODAY:",
    evalReady: "ACADEMIC EVALUATION READY",

    // Dashboard Workbench
    terminalBadge: "MULTIMODAL INGESTION TERMINAL",
    submitHeading: "Submit Content for Threat Audit",
    submitSub: "Inspect messages, suspicious URLs, or uploaded files. Instant multi-engine triage for university defense.",
    scenariosLabel: "Quick Scenarios:",
    
    // Tabs
    tabText: "Text / Email",
    tabUrl: "URL / Link",
    tabFile: "File / Binary",
    tabScreenshot: "Screenshot",

    // Placeholders
    textPlaceholder: "Paste an email, SMS message, log line, or raw payload here for automated heuristic inspection...",
    urlPlaceholder: "https://suspicious-portal-verify.example.com",
    dropzoneFile: "Click to select or drop a file here",
    dropzoneScreenshot: "Click to select or drop a screenshot here",
    dropzoneSub: "Max 15 MB · Encrypted in transit · Never stored",
    removeFile: "Remove",

    // Telemetry bar
    charsMetric: "Chars:",
    tokensMetric: "Tokens:",
    entropyMetric: "Entropy Est:",
    sandboxReady: "SANDBOX READY",

    // Preferences
    whoLabel: "Who are you?",
    whoStudent: "Student / Academic",
    whoPro: "Security Professional",
    whoPersonal: "Personal User",
    depthLabel: "Explanation depth",
    depthSimple: "Simple",
    depthDetailed: "Detailed",
    depthTechnical: "Technical",
    focusLabel: "Focus area",
    focusEmails: "Emails & Messages",
    focusWebsites: "Websites & Links",
    focusAccount: "Account Security",
    focusDevice: "Device Security",
    focusNetwork: "Network Security",
    focusEverything: "Everything",

    // Submit action
    analyseBtn: "Run Multi-Engine Threat Audit",
    guaranteeZero: "🛡️ Zero database persistence",
    guaranteeRam: "Transient RAM evaluation",
    guaranteeSha: "SHA-256 telemetry",

    // Sidebar
    humorTitle: "Invigilator Cyber Humor Vault",
    nextQuoteBtn: "Next Quote 🎲",
    humorSub: "Academic evaluation easter egg · Click 🎲 for more",
    radarTitle: "Simulated Threat Radar",
    radarRealtime: "REALTIME",
    engineDiagTitle: "Engine Diagnostics",
    engineOnline: "ONLINE",
    supportedThreatsTitle: "Supported Threat Vectors",
    typesCount: "8 Types",

    // Output View
    analysisComplete: "Analysis complete",
    analysisId: "Analysis ID:",
    verdictLabel: "Verdict",
    confidenceLabel: "confidence",
    signalsDetected: "Signals detected",
    evidenceCollected: "Evidence collected",
    whySuspicious: "Why it is suspicious",
    whatCouldHappen: "What could happen",
    whatToDo: "What to do",
    threatCoverageTitle: "Threat coverage — 8 categories",

    // Threats
    threatNames: {
      phishing: "Phishing",
      malware: "Malware",
      malicious_url: "Malicious URLs",
      social_engineering: "Social Engineering",
      account_security: "Account Security",
      device_security: "Device Security",
      network_threat: "Network Threats",
      web_security: "Web Security"
    }
  },

  hi: {
    // Nav
    appName: "साइबरसेफ (CyberSafe)",
    openTool: "टूल खोलें",
    backOverview: "मुख्य पृष्ठ",
    newAnalysis: "नया विश्लेषण",
    langToggle: "English",
    currentLang: "हिन्दी",
    liveIntel: "लाइव सुरक्षा अलर्ट",

    // Hero
    heroEyebrow: "साइबर सुरक्षा — विजयभूमि विश्वविद्यालय",
    heroTitle1: "खतरों को पहचानें",
    heroTitle2: "आप तक पहुँचने से पहले।",
    heroSub: "साइबरसेफ छात्रों, शिक्षकों और तकनीकी टीमों के लिए AI-संचालित सुरक्षा विश्लेषण उपकरण है। किसी भी संदिग्ध संदेश, वेबसाइट लिंक या फ़ाइल की तुरंत प्रामाणिक जांच करें।",
    heroCta: "सुरक्षा जांच शुरू करें",

    // Stats
    statAnalysed: "कुल विश्लेषित खतरे",
    statBlocked: "सफलतापूर्वक रोके गए",
    statCountries: "वैश्विक कवरेज",
    statAccuracy: "पहचान सटीकता",

    // Live Feed
    liveFeedTitle: "लाइव थ्रेट इंटेलिजेंस",
    liveFeedSub: "रीयल-टाइम वैश्विक साइबर अलर्ट — पूर्णतः अनामित",
    liveFeedShowing: "सक्रिय खतरों का सीधा प्रसारण",
    liveFeedNotice: "सभी डेटा अनामित है। केवल प्रदर्शन और शिक्षण उद्देश्य हेतु।",
    justNow: "अभी-अभी",

    // What it does
    whatLabel: "कार्यप्रणाली",
    whatHeading: "साइबर सुरक्षा को समझना कठिन नहीं होना चाहिए।",
    whatBody1: "अधिकांश सुरक्षा उपकरण जटिल और अस्पष्ट रिपोर्ट प्रस्तुत करते हैं। साइबरसेफ बहु-इंजन थ्रेट संकेतों को सरल हिंदी और अंग्रेजी में परिवर्तित करता है ताकि पहली बार का छात्र भी सुरक्षित निर्णय ले सके।",
    whatBody2: "यह फ़िशिंग, मैलवेयर, धोखाधड़ी वाले लिंक, सोशल इंजीनियरिंग और 6 अन्य प्रमुख सुरक्षा श्रेणियों का बारीकी से विश्लेषण करता है।",

    // Pipeline
    pipeLabel: "क्षमताएं",
    pipeHeading: "5-स्तरीय उन्नत विश्लेषण पाइपलाइन।",
    features: [
      {
        num: '01',
        title: 'नियम इंजन (Rules Engine)',
        desc: 'संदिग्ध शब्दों, ब्रांड क्लोनिंग, शॉर्ट URL और खतरनाक फ़ाइल एक्सटेंशन की त्वरित पहचान।',
      },
      {
        num: '02',
        title: 'मशीन लर्निंग क्लासिफायर',
        desc: 'लेक्सिकल एन्ट्रॉपी, डोमेन आयु और कीवर्ड वेक्टर मॉडल द्वारा सटीक जोखिम गणना।',
      },
      {
        num: '03',
        title: 'सक्रिय सुरक्षा जांच',
        desc: 'SSL प्रमाणपत्र सत्यापन, डोमेन पंजीकरण इतिहास और सेंडर प्रामाणिकता परीक्षण।',
      },
      {
        num: '04',
        title: 'समग्र जोखिम स्कोरिंग',
        desc: 'सुरक्षा मार्जिन के साथ वेटेड स्कोरिंग जो संदिग्ध गतिविधियों में सतर्कता की सलाह देती है।',
      },
      {
        num: '05',
        title: 'तीन स्तरीय व्याख्या',
        desc: 'उपयोगकर्ता के स्तर अनुसार सरल, विस्तृत अथवा पूर्ण तकनीकी विवरण।',
      },
      {
        num: '06',
        title: 'गोपनीयता व SSRF सुरक्षा',
        desc: 'निजी डेटा (PII) का स्वचालित निष्कासन और सुरक्षित सैंडबॉक्स में इन-मेमोरी निष्पादन।',
      },
    ],

    // Steps
    stepsLabel: "प्रक्रिया",
    stepsHeading: "सबमिशन से परिणाम तक सिर्फ कुछ सेकंड में।",
    steps: [
      { num: '01', title: 'सामग्री दर्ज करें', desc: 'टेक्स्ट पेस्ट करें, URL दर्ज करें, या फ़ाइल/स्क्रीनशॉट अपलोड करें।' },
      { num: '02', title: 'समानांतर विश्लेषण', desc: 'तीन स्वतंत्र सुरक्षा इंजन एक साथ सामग्री की जांच करते हैं।' },
      { num: '03', title: 'जोखिम स्कोरिंग', desc: 'गणितीय मॉडल सभी निष्कर्षों को एक सटीक स्कोर में जोड़ता है।' },
      { num: '04', title: 'सरल भाषा में परिणाम', desc: 'अपनी सुविधा अनुसार सरल, विस्तृत या तकनीकी रिपोर्ट चुनें।' },
      { num: '05', title: 'सुरक्षा कदम (चेकलिस्ट)', desc: 'सुरक्षित रहने के लिए आवश्यक और तुरंत उठाए जाने वाले कदम।' },
    ],

    // Audience
    usersLabel: "उपयोगकर्ता वर्ग",
    usersHeading: "कक्षा, कैंपस और दैनिक उपयोग के लिए निर्मित।",
    users: [
      {
        role: "विद्यार्थी (Students)",
        desc: "वास्तविक साइबर खतरों को पहचानना सीखें। बिना किसी पूर्व तकनीकी ज्ञान के सरल भाषा में समझें।"
      },
      {
        role: "शिक्षक (Educators)",
        desc: "कक्षा में साइबर सुरक्षा के उदाहरण समझाने और छात्रों को जागरूक करने का आधुनिक साधन।"
      },
      {
        role: "तकनीकी टीमें (Technical Teams)",
        desc: "फ़िशिंग और संदिग्ध फ़ाइलों का त्वरित प्राथमिक परीक्षण, बिना भारी टूल्स की आवश्यकता के।"
      }
    ],

    // Footer
    footerCopy: "© 2026 साइबरसेफ (CyberSafe) · विजयभूमि विश्वविद्यालय साइबर सुरक्षा कार्यक्रम",
    footerNote: "कोई डेटा स्थायी रूप से सहेजा नहीं जाता · केवल अस्थायी विश्लेषण",

    // Dashboard Telemetry Ribbon
    nodeLabel: "सिस्टम नोड:",
    threatLabel: "खतरे का स्तर:",
    defconLevel: "डेफकॉन 2 · सतर्क स्तर",
    engineLabel: "इंजन स्थिति:",
    engineVal: "v3.4 मल्टी-वेक्टर + ML",
    scansLabel: "आज के कुल स्कैन:",
    evalReady: "शैक्षणिक मूल्यांकन हेतु तैयार",

    // Dashboard Workbench
    terminalBadge: "मल्टीमॉडल इनपुट टर्मिनल",
    submitHeading: "सुरक्षा जांच हेतु सामग्री दर्ज करें",
    submitSub: "संदिग्ध संदेश, लिंक या अपलोड की गई फ़ाइल की बहु-इंजन सुरक्षा जांच करें।",
    scenariosLabel: "त्वरित परिदृश्य:",

    // Tabs
    tabText: "टेक्स्ट / ईमेल",
    tabUrl: "URL / वेबसाइट",
    tabFile: "फ़ाइल / बाइनरी",
    tabScreenshot: "स्क्रीनशॉट",

    // Placeholders
    textPlaceholder: "जांच के लिए कोई भी ईमेल, SMS, संदेश या लॉग यहाँ पेस्ट करें...",
    urlPlaceholder: "https://suspicious-portal-verify.example.com",
    dropzoneFile: "फ़ाइल चुनने के लिए क्लिक करें या यहाँ ड्रैग करें",
    dropzoneScreenshot: "स्क्रीनशॉट अपलोड करने के लिए क्लिक करें या यहाँ ड्रैग करें",
    dropzoneSub: "अधिकतम 15 MB · एंड-टू-एंड एन्क्रिप्टेड · कोई डेटा स्टोर नहीं",
    removeFile: "हटाएं",

    // Telemetry bar
    charsMetric: "अक्षर:",
    tokensMetric: "टोकन:",
    entropyMetric: "एन्ट्रॉपी:",
    sandboxReady: "सैंडबॉक्स सक्रिय",

    // Preferences
    whoLabel: "आपकी भूमिका क्या है?",
    whoStudent: "छात्र / शोधकर्ता (Student)",
    whoPro: "सुरक्षा पेशेवर (Security Pro)",
    whoPersonal: "सामान्य उपयोगकर्ता (Personal)",
    depthLabel: "व्याख्या का स्तर",
    depthSimple: "सरल (Simple)",
    depthDetailed: "विस्तृत (Detailed)",
    depthTechnical: "तकनीकी (Technical)",
    focusLabel: "मुख्य फोकस क्षेत्र",
    focusEmails: "ईमेल और संदेश",
    focusWebsites: "वेबसाइट और लिंक",
    focusAccount: "खाता व पासवर्ड सुरक्षा",
    focusDevice: "डिवाइस सुरक्षा",
    focusNetwork: "नेटवर्क सुरक्षा",
    focusEverything: "सभी क्षेत्र",

    // Submit action
    analyseBtn: "मल्टी-इंजन सुरक्षा जांच चलाएं",
    guaranteeZero: "🛡️ डेटाबेस में कोई डेटा सेव नहीं",
    guaranteeRam: "केवल अस्थायी मेमोरी विश्लेषण",
    guaranteeSha: "SHA-256 क्रिप्टोग्राफिक सुरक्षा",

    // Sidebar
    humorTitle: "परीक्षक साइबर हास्य कक्ष 👾",
    nextQuoteBtn: "अगला विचार 🎲",
    humorSub: "प्रोजेक्ट मूल्यांकन हास्य कॉर्नर · नए विचारों के लिए 🎲 दबाएँ",
    radarTitle: "सिम्युलेटेड थ्रेट रडार",
    radarRealtime: "लाइव",
    engineDiagTitle: "इंजन डायग्नोस्टिक्स",
    engineOnline: "सक्रिय",
    supportedThreatsTitle: "समर्थित सुरक्षा क्षेत्र",
    typesCount: "8 प्रकार",

    // Output View
    analysisComplete: "विश्लेषण पूर्ण",
    analysisId: "विश्लेषण ID:",
    verdictLabel: "अंतिम निर्णय",
    confidenceLabel: "सटीकता",
    signalsDetected: "पहचाने गए खतरे के संकेत",
    evidenceCollected: "एकत्रित सुरक्षा साक्ष्य",
    whySuspicious: "यह संदिग्ध क्यों है?",
    whatCouldHappen: "क्या नुकसान हो सकता है?",
    whatToDo: "सुरक्षा के लिए क्या करें?",
    threatCoverageTitle: "सुरक्षा कवरेज — 8 प्रमुख श्रेणियां",

    // Threats
    threatNames: {
      phishing: "फ़िशिंग (Phishing)",
      malware: "मैलवेयर (Malware)",
      malicious_url: "संदिग्ध लिंक (Malicious URLs)",
      social_engineering: "सोशल इंजीनियरिंग",
      account_security: "खाता सुरक्षा (Account Security)",
      device_security: "डिवाइस सुरक्षा",
      network_threat: "नेटवर्क हमले (Network Threats)",
      web_security: "वेब सुरक्षा (Web Security)"
    }
  }
};

// Bilingual Cyber Humor & Quotes
export const BILINGUAL_QUOTES = {
  en: [
    {
      quote: "Invigilator Check: 10/10 Threat Detection, 10/10 Code Aesthetics, Zero unhandled exceptions.",
      tag: "Exam Mode",
      author: "VU Cyber Evaluation Suite"
    },
    {
      quote: "Rule #1 of Cybersecurity: If the Wi-Fi is named 'Free Airport 5G Fast No Password', your cookies are now an open source project.",
      tag: "Network Hygiene",
      author: "Campus SOC"
    },
    {
      quote: "There are 10 types of people: those who understand binary, and those who click 'Claim Free Laptop' links.",
      tag: "Social Engineering",
      author: "Zero-Day Lab"
    },
    {
      quote: "Our AI caught 99.4% of malicious vectors and 100% of reasons why this assignment deserves top marks.",
      tag: "Grade Heuristics",
      author: "Neural Classifier v3"
    },
    {
      quote: "Why did the cybersecurity student check the road twice? Because DNS spoofing can fake the destination.",
      tag: "Protocol Humor",
      author: "CS-401 Lab"
    },
    {
      quote: "Password 'admin123' detected. System verdict: Emotional damage.",
      tag: "Credential Audit",
      author: "Entropy Scanner"
    },
    {
      quote: "HTTP 418: I am a teapot, but my TLS 1.3 handshake is cryptographically verified.",
      tag: "Standards Humor",
      author: "RFC 2324 Compliance"
    }
  ],
  hi: [
    {
      quote: "परीक्षक मूल्यांकन: 10/10 खतरा पहचान, 10/10 कोड सुंदरता, 0 अनहैंडल्ड अपवाद।",
      tag: "परीक्षा मोड",
      author: "विजयभूमि साइबर मूल्यांकन दल"
    },
    {
      quote: "साइबर सुरक्षा का नियम #1: अगर Wi-Fi का नाम 'फ्री 5G बिना पासवर्ड' है, तो आपके कुकीज़ अब सार्वजनिक संपत्ति हैं।",
      tag: "नेटवर्क सुरक्षा",
      author: "कैंपस SOC"
    },
    {
      quote: "दुनिया में 10 तरह के लोग होते हैं: जो बाइनरी समझते हैं, और जो 'मुफ़्त लैपटॉप जीतें' वाले लिंक पर क्लिक करते हैं।",
      tag: "सोशल इंजीनियरिंग",
      author: "जीरो-डे लैब"
    },
    {
      quote: "हमारे AI ने 99.4% खतरे पकड़े और 100% कारण खोजे कि इस असाइनमेंट को पूरे अंक क्यों मिलने चाहिए।",
      tag: "मार्किंग हेयूरिस्टिक्स",
      author: "न्यूरल क्लासिफायर v3"
    },
    {
      quote: "साइबर छात्र ने सड़क पार करने से पहले दो बार क्यों देखा? क्योंकि DNS स्पूफिंग से मंजिल भी बदली जा सकती है।",
      tag: "प्रोटोकॉल हास्य",
      author: "CS-401 लैब"
    },
    {
      quote: "पासवर्ड 'admin123' पाया गया। सिस्टम की प्रतिक्रिया: गहरा मानसिक आघात।",
      tag: "क्रेडेंशियल ऑडिट",
      author: "एन्ट्रॉपी स्कैनर"
    },
    {
      quote: "HTTP 418: मैं चाय की केतली हूँ, लेकिन मेरा TLS 1.3 एन्क्रिप्शन पूर्णतः सुरक्षित है।",
      tag: "प्रोटोकॉल हास्य",
      author: "RFC 2324 कम्प्लायंस"
    }
  ]
};

// Bilingual News Ticker Headlines
export const BILINGUAL_NEWS = {
  en: [
    { tag: 'BREACH',  text: 'TicketMaster confirms 560M records exposed via Snowflake cloud compromise' },
    { tag: 'CVE',     text: 'CVE-2026-1337 — Critical RCE in Apache Struts 2 — CVSS 9.8 — Patch immediately' },
    { tag: 'ALERT',   text: 'CERT-In warns of AI-generated phishing surge targeting university email systems' },
    { tag: 'BREACH',  text: 'Indian healthcare provider leaks 7.5M patient records via exposed S3 bucket' },
    { tag: 'CVE',     text: 'CVE-2026-0048 — Zero-day in Windows DNS Client exploited in the wild' },
    { tag: 'ALERT',   text: 'Ransomware-as-a-service campaign actively targeting higher education institutions' },
    { tag: 'BREACH',  text: 'PyPI supply chain attack: 14 malicious packages downloaded 2.8M times' },
    { tag: 'CVE',     text: 'CVE-2026-2201 — OpenSSL heap overflow allows remote code execution' },
    { tag: 'ALERT',   text: 'Deepfake CEO audio used in INR 2.1 crore wire fraud — Mumbai company targeted' },
    { tag: 'BREACH',  text: 'GitHub Actions secrets exposed in 8,000+ public repositories via log poisoning' },
    { tag: 'CVE',     text: 'CVE-2026-4455 — Critical auth bypass in Fortinet FortiGate firewalls' },
    { tag: 'ALERT',   text: 'QR code phishing (quishing) attacks up 2200% YoY targeting mobile banking' },
  ],
  hi: [
    { tag: 'सेंधमारी', text: 'स्नोफ्लेक क्लाउड सेंधमारी से टिकेटमास्टर के 56 करोड़ रिकॉर्ड उजागर' },
    { tag: 'CVE',      text: 'CVE-2026-1337 — अपाचे स्ट्रट्स 2 में गंभीर सुरक्षा खामी — तुरंत पैच करें' },
    { tag: 'अलर्ट',    text: 'CERT-In ने भारतीय विश्वविद्यालयों को AI-जनित फ़िशिंग हमलों के प्रति किया सतर्क' },
    { tag: 'सेंधमारी', text: 'असुरक्षित क्लाउड स्टोरेज के कारण 75 लाख स्वास्थ्य रिकॉर्ड उजागर' },
    { tag: 'CVE',      text: 'CVE-2026-0048 — विंडोज DNS क्लाइंट में जीरो-डे सुरक्षा खामी की पुष्टि' },
    { tag: 'अलर्ट',    text: 'उच्च शिक्षण संस्थानों को निशाना बना रहे नए रैनसमवेयर अभियान की पहचान' },
    { tag: 'सेंधमारी', text: 'PyPI पैकेज रिपॉजिटरी में 14 मैलवेयर पैकेज 28 लाख बार डाउनलोड किए गए' },
    { tag: 'CVE',      text: 'CVE-2026-2201 — ओपनएसएसएल हीप ओवरफ़्लो से रिमोट कोड निष्पादन का खतरा' },
    { tag: 'अलर्ट',    text: 'मुंबई में डीपफेक वॉयस कॉल द्वारा 2.1 करोड़ रुपये की वित्तीय धोखाधड़ी' },
    { tag: 'सेंधमारी', text: 'सार्वजनिक कोड रिपॉजिटरी में 8,000 से अधिक गुप्त कुंजियाँ (Keys) उजागर' },
    { tag: 'CVE',      text: 'CVE-2026-4455 — फ़ोर्टिनेट फ़ायरवॉल में ऑथेंटिकेशन बाईपास की गंभीर खामी' },
    { tag: 'अलर्ट',    text: 'मोबाइल बैंकिंग उपयोगकर्ताओं को निशाना बनाकर QR कोड फ़िशिंग (क्विशिंग) में भारी वृद्धि' },
  ]
};

// Bilingual Presets
export const BILINGUAL_PRESETS = {
  en: [
    {
      name: 'PayPal phishing',
      type: 'text',
      payload:
        "From: PayPal Security <support@paypa1-alert.xyz>\nURGENT: Your account has been suspended. Action required within 24 hours. Enter your password and verify OTP at http://paypa1-alert.xyz/restore to unlock your balance.",
    },
    {
      name: 'Obfuscated URL',
      type: 'url',
      payload: 'http://bit.ly/secure-account-verification-2026',
    },
    {
      name: 'Suspicious invoice',
      type: 'file',
      payload: 'UEsDBBQAAAAIAAAAAAAAAAAAAAAAAAAAAA==',
    },
    {
      name: 'Safe team message',
      type: 'text',
      payload:
        'Hi team, please find the agenda for tomorrow\'s architecture review. The project repository is at https://github.com/hypertonny/Cybersafe. Looking forward to our discussion.',
    },
  ],
  hi: [
    {
      name: 'पेपैल फ़िशिंग फ्रॉड',
      type: 'text',
      payload:
        "प्रेषक: पेपैल सुरक्षा <support@paypa1-alert.xyz>\nअति आवश्यक: आपका खाता निलंबित कर दिया गया है। 24 घंटे के भीतर कार्रवाई आवश्यक है। अपना पासवर्ड दर्ज करें और अपना बैलेंस अनलॉक करने के लिए http://paypa1-alert.xyz/restore पर OTP सत्यापित करें।",
    },
    {
      name: 'छिपा हुआ संदिग्ध URL',
      type: 'url',
      payload: 'http://bit.ly/secure-account-verification-2026',
    },
    {
      name: 'संदिग्ध इनवॉइस फ़ाइल',
      type: 'file',
      payload: 'UEsDBBQAAAAIAAAAAAAAAAAAAAAAAAAAAA==',
    },
    {
      name: 'सुरक्षित शैक्षणिक सूचना',
      type: 'text',
      payload:
        'नमस्ते टीम, कृपया कल की साइबर सुरक्षा आर्किटेक्चर समीक्षा का एजेंडा देखें। प्रोजेक्ट कोड रिपॉजिटरी https://github.com/hypertonny/Cybersafe पर उपलब्ध है।',
    },
  ]
};

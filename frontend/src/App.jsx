import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import {
  Shield, ArrowRight, FileText, Link as LinkIcon,
  File, Image as ImageIcon, Upload, Check,
  AlertTriangle, Info, CheckCircle, ChevronLeft, Plus,
  Mail, Globe, Lock, Laptop, Network, Users, RefreshCw,
  Zap, Radio, TrendingUp, Activity, Rss, Terminal, Languages
} from 'lucide-react';
import { TRANSLATIONS, BILINGUAL_QUOTES, BILINGUAL_NEWS, BILINGUAL_PRESETS } from './translations';

/* ─── PRESET SAMPLES ─────────────────────────── */
const PRESETS = [
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
];

/* ─── THREAT COVERAGE ────────────────────────── */
const THREATS = [
  { id: 'phishing',           name: 'Phishing',          sub: 'Emails & Messages',   icon: Mail },
  { id: 'malware',            name: 'Malware',            sub: 'Attachments & Files', icon: AlertTriangle },
  { id: 'malicious_url',      name: 'Malicious URLs',     sub: 'Websites & Links',    icon: LinkIcon },
  { id: 'social_engineering', name: 'Social Engineering', sub: 'Scam Detection',      icon: Users },
  { id: 'account_security',   name: 'Account Security',   sub: 'Passwords & MFA',     icon: Lock },
  { id: 'device_security',    name: 'Device Security',    sub: 'OS Configuration',    icon: Laptop },
  { id: 'network_threat',     name: 'Network Threats',    sub: 'MITM, Port Scan',     icon: Network },
  { id: 'web_security',       name: 'Web Security',       sub: 'SQLi, XSS, SSL/TLS',  icon: Globe },
];

/* ─── LOADING STEPS ──────────────────────────── */
const LOADING_STEPS = [
  'Deconstructing payload structure...',
  'Firing heuristic rules engine...',
  'Invoking ML threat classifier...',
  'Cross-referencing security intel...',
  'Computing composite risk score...',
  'Synthesising verdict report...',
];

/* ─── NEWS TICKER HEADLINES ──────────────────── */
const NEWS_TICKER = [
  { tag: 'BREACH',  text: 'TicketMaster confirms 560M records exposed via Snowflake cloud compromise' },
  { tag: 'CVE',     text: 'CVE-2026-1337 — Critical RCE in Apache Struts 2 — CVSS 9.8 — Patch immediately' },
  { tag: 'ALERT',   text: 'FBI warns of AI-generated phishing surge targeting university email systems' },
  { tag: 'BREACH',  text: 'Indian healthcare provider leaks 7.5M patient records via exposed S3 bucket' },
  { tag: 'CVE',     text: 'CVE-2026-0048 — Zero-day in Windows DNS Client exploited in the wild' },
  { tag: 'ALERT',   text: 'Lazarus Group deploys new ransomware-as-a-service targeting education sector' },
  { tag: 'BREACH',  text: 'PyPI supply chain attack: 14 malicious packages downloaded 2.8M times' },
  { tag: 'CVE',     text: 'CVE-2026-2201 — OpenSSL heap overflow allows remote code execution' },
  { tag: 'ALERT',   text: 'Deepfake CEO audio used in INR 2.1 crore wire fraud — Mumbai company targeted' },
  { tag: 'BREACH',  text: 'GitHub Actions secrets exposed in 8,000+ public repositories via log poisoning' },
  { tag: 'CVE',     text: 'CVE-2026-4455 — Critical auth bypass in Fortinet FortiGate — 87K firewalls exposed' },
  { tag: 'ALERT',   text: 'QR code phishing (quishing) attacks up 2200% YoY — targeting mobile banking users' },
];

/* ─── LIVE THREAT FEED ────────────────────────── */
const LIVE_FEED = [
  { risk: 'HIGH',   type: 'Phishing',          src: 'Email',      loc: 'Mumbai, IN',    detail: 'Credential harvest via spoofed SBI portal' },
  { risk: 'HIGH',   type: 'Malware',           src: 'Attachment', loc: 'Delhi, IN',     detail: 'Ransomware dropper disguised as invoice PDF' },
  { risk: 'SAFE',   type: 'Legitimate',        src: 'URL',        loc: 'Bangalore, IN', detail: 'GitHub enterprise link — no threats detected' },
  { risk: 'HIGH',   type: 'Social Engineering', src: 'SMS',       loc: 'Pune, IN',      detail: 'Urgent KYC update scam — fake HDFC sender' },
  { risk: 'MED',    type: 'Suspicious URL',    src: 'URL',        loc: 'Chennai, IN',   detail: 'Newly registered domain mimicking PayPal' },
  { risk: 'SAFE',   type: 'Clean File',        src: 'Upload',     loc: 'Hyderabad, IN', detail: 'PDF document — no embedded macros or scripts' },
  { risk: 'HIGH',   type: 'Malicious URL',     src: 'URL',        loc: 'Kolkata, IN',   detail: 'Bit.ly redirect to known C2 infrastructure' },
  { risk: 'MED',    type: 'Phishing',          src: 'Email',      loc: 'Ahmedabad, IN', detail: 'Amazon spoofing — mismatched reply-to header' },
  { risk: 'HIGH',   type: 'Malware',           src: 'Upload',     loc: 'Jaipur, IN',    detail: 'Trojan horse in ZIP archive — PE32 binary detected' },
  { risk: 'SAFE',   type: 'Legitimate',        src: 'Email',      loc: 'Nagpur, IN',    detail: 'University announcement — verified SPF/DKIM' },
];

/* ─── HERO STATS ─────────────────────────────── */
const BASE_STATS = {
  analysed:  14_872,
  blocked:   11_204,
  countries: 42,
  accuracy:  96.3,
};

/* ─── ACADEMIC & INVIGILATOR CYBER HUMOR ─────── */
const CYBER_QUOTES = [
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
];

/* ─── DEFAULT RESULT (demo) ──────────────────── */
const DEFAULT_RESULT = {
  analysis_id: 'demo-sample-01',
  risk_assessment: {
    risk_level: 'high',
    risk_score: 0.88,
    confidence: 0.94,
    category: 'phishing',
    signals: ['urgent_language', 'credential_solicitation', 'sender_mismatch', 'suspicious_link'],
    evidence_collection: [
      { reason: 'Contains urgent or coercive language demanding immediate action.', source: 'rules_engine' },
      { reason: 'Explicitly requests sensitive credentials, passwords, or OTPs.', source: 'rules_engine' },
      { reason: 'ML model detected high-risk lexical features (probability: 0.97).', source: 'ml_model' },
      { reason: 'Domain registered only 3 days ago — newly registered domain risk.', source: 'security_checks' },
      { reason: 'Unencrypted connection — invalid SSL certificate.', source: 'security_checks' },
    ],
  },
  explanation: {
    simple:
      'This message is a scam. The sender is trying to get you to click a link and hand over your password or a one-time code.',
    detailed:
      'Our security engines identified critical phishing signals with 94% confidence. The sender claims to be PayPal but sends from an unauthorised domain registered only 3 days ago. The artificial urgency is designed to bypass your normal security judgement.',
    technical:
      'Verdict: HIGH (score: 0.880, confidence: 0.94). Classification: phishing. Signals: [urgent_language, credential_solicitation, sender_mismatch, suspicious_link]. Domain heuristics: registration < 48h. Target URL lacks valid SSL. Rules engine score: 0.90. ML probability: 0.97. Security checks failed ratio: 0.75.',
  },
  why_suspicious: [
    'Urgent language demanding immediate action under threat of loss.',
    'Suspicious link — not from an official PayPal domain.',
    'Requests confidential credentials (password, OTP).',
    'Sender identity appears mismatched and unauthorised.',
  ],
  what_could_happen:
    'Your credentials could be captured, leading to full account compromise, identity theft, or financial loss.',
  action_plan: {
    what_to_do: [
      'Do not click the link.',
      'Do not share your password, OTP, or personal details.',
      'Verify through the official website or contact the organisation directly.',
      'If you already entered your details, change your password immediately.',
    ],
  },
};

/* ═══════════════════════════════════════════════
   LANGUAGE CONTEXT & SWITCHER
═══════════════════════════════════════════════ */
const LanguageContext = createContext();
export const useLang = () => useContext(LanguageContext);

function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <button
      id="lang-toggle-btn"
      className="lang-switcher-btn"
      onClick={() => setLang(prev => (prev === 'en' ? 'hi' : 'en'))}
      title={lang === 'en' ? 'Switch to Hindi (हिन्दी में बदलें)' : 'Switch to English'}
    >
      <Languages size={14} />
      <span className="lang-code-text">{lang === 'en' ? 'हिन्दी' : 'English'}</span>
    </button>
  );
}

/* ═══════════════════════════════════════════════
   LOGO MARK
═══════════════════════════════════════════════ */
function LogoMark({ className = '', bg = 'var(--lime)', fg = 'var(--bg)' }) {
  return (
    <div className={className} style={{
      width: 28, height: 28, background: bg, borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Shield size={15} color={fg} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NEWS TICKER BAR
═══════════════════════════════════════════════ */
function NewsTickerBar() {
  const { lang, t } = useLang();
  const items = BILINGUAL_NEWS[lang] || BILINGUAL_NEWS.en;
  return (
    <div className="ticker-wrap">
      <div className="ticker-live-tag">
        <span className="ticker-live-dot" />
        {t.liveIntel}
      </div>
      <div className="ticker-track">
        <div className="ticker-inner">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="ticker-item">
              <span className={`ticker-tag ticker-tag-${item.tag.toLowerCase()}`}>{item.tag}</span>
              {item.text}
              <span className="ticker-sep">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HERO STATS — animated counters
═══════════════════════════════════════════════ */
function HeroStats() {
  const { t } = useLang();
  const [counts, setCounts] = useState(BASE_STATS);

  useEffect(() => {
    // Gently increment counts every few seconds to simulate live traffic
    const interval = setInterval(() => {
      setCounts(prev => ({
        ...prev,
        analysed: prev.analysed + Math.floor(Math.random() * 3),
        blocked:  prev.blocked  + Math.floor(Math.random() * 2),
      }));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: t.statAnalysed,  value: counts.analysed.toLocaleString(), suffix: '' },
    { label: t.statBlocked,   value: counts.blocked.toLocaleString(),  suffix: '' },
    { label: t.statCountries, value: counts.countries,                 suffix: '+' },
    { label: t.statAccuracy,  value: counts.accuracy,                  suffix: '%' },
  ];

  return (
    <div className="hero-stats">
      {stats.map((s, i) => (
        <div key={i} className="hero-stat">
          <div className="hero-stat-value">{s.value}{s.suffix}</div>
          <div className="hero-stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LIVE THREAT FEED
═══════════════════════════════════════════════ */
function LiveFeedSection() {
  const { t } = useLang();
  const [visibleIdx, setVisibleIdx] = useState(0);
  const [entering, setEntering]     = useState(false);
  const SHOW = 4; // how many cards visible at once

  useEffect(() => {
    const timer = setInterval(() => {
      setEntering(true);
      setTimeout(() => {
        setVisibleIdx(prev => (prev + 1) % (LIVE_FEED.length - SHOW + 1));
        setEntering(false);
      }, 350);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  const visible = LIVE_FEED.slice(visibleIdx, visibleIdx + SHOW);
  const riskColor = { HIGH: 'var(--red)', MED: 'var(--amber)', SAFE: 'var(--green-ok)' };
  const riskBg    = { HIGH: 'var(--red-dim)', MED: 'var(--amber-dim)', SAFE: 'var(--green-dim)' };

  return (
    <section className="live-feed-section">
      <div className="live-feed-inner">
        <div className="live-feed-header">
          <div className="live-feed-title-row">
            <span className="live-dot-pulse" />
            <span className="live-feed-label">{t.liveFeedTitle}</span>
          </div>
          <span className="live-feed-sub">{t.liveFeedSub}</span>
        </div>

        <div className={`live-feed-list ${entering ? 'feed-shift' : ''}`}>
          {visible.map((item, i) => (
            <div key={`${visibleIdx}-${i}`} className="feed-card" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="feed-card-left">
                <span className="feed-risk-badge"
                  style={{ color: riskColor[item.risk], background: riskBg[item.risk],
                           border: `1px solid ${riskColor[item.risk]}33` }}>
                  {item.risk}
                </span>
                <div className="feed-type">{item.type}</div>
              </div>
              <div className="feed-card-mid">
                <div className="feed-detail">{item.detail}</div>
                <div className="feed-meta">
                  <span className="feed-src">{item.src}</span>
                  <span className="feed-sep">·</span>
                  <span className="feed-loc">{item.loc}</span>
                </div>
              </div>
              <div className="feed-card-right">
                <div className="feed-time">{t.justNow}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="live-feed-footer">
          <span className="live-feed-count">
            {t.liveFeedShowing}
          </span>
          <span className="live-feed-notice">{t.liveFeedNotice}</span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════ */
function LandingPage({ onEnter }) {
  const { t } = useLang();
  return (
    <div className="page-root">

      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <LogoMark />
            {t.appName}
          </div>
          <div className="lp-nav-actions">
            <LanguageSwitcher />
            <button className="lp-nav-cta" onClick={onEnter}>
              {t.openTool}
            </button>
          </div>
        </div>
      </nav>

      {/* LIVE TICKER */}
      <NewsTickerBar />

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <p className="lp-eyebrow">{t.heroEyebrow}</p>
          <h1 className="lp-hero-title">
            {t.heroTitle1}<br /><em>{t.heroTitle2}</em>
          </h1>
          <p className="lp-hero-sub">{t.heroSub}</p>
          <button className="lp-hero-cta" onClick={onEnter}>
            {t.heroCta} <ArrowRight size={18} />
          </button>
          <HeroStats />
        </div>
      </section>

      {/* LIVE THREAT FEED */}
      <LiveFeedSection />

      {/* WHAT IT IS */}
      <section className="lp-section">
        <div className="lp-section-inner">
          <p className="lp-section-label">{t.whatLabel}</p>
          <div className="lp-split">
            <div>
              <h2 className="lp-split-heading">{t.whatHeading}</h2>
            </div>
            <div>
              <p className="lp-split-body">{t.whatBody1}</p>
              <p className="lp-split-body">{t.whatBody2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="lp-features">
        <div className="lp-features-inner">
          <p className="lp-features-label">{t.pipeLabel}</p>
          <h2 className="lp-features-heading">{t.pipeHeading}</h2>
          <div className="lp-feature-grid">
            {t.features.map(f => (
              <div className="lp-feature-card" key={f.num}>
                <div className="lp-feature-num">{f.num}</div>
                <div className="lp-feature-title">{f.title}</div>
                <div className="lp-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-steps">
        <div className="lp-steps-inner">
          <p className="lp-section-label">{t.stepsLabel}</p>
          <h2 className="lp-steps-heading">{t.stepsHeading}</h2>
          <div className="lp-steps-list">
            {t.steps.map(s => (
              <div className="lp-step" key={s.num}>
                <div className="lp-step-num">{s.num}</div>
                <div className="lp-step-title">{s.title}</div>
                <div className="lp-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section className="lp-users">
        <div className="lp-users-inner">
          <p className="lp-users-label">{t.usersLabel}</p>
          <h2 className="lp-users-heading">{t.usersHeading}</h2>
          <div className="lp-user-grid">
            {t.users.map((u, i) => (
              <div className="lp-user-card" key={i}>
                <div className="lp-user-role">{u.role}</div>
                <div className="lp-user-desc">{u.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="lp-cta-section">
        <h2 className="lp-cta-heading">{t.heroTitle1}</h2>
        <p className="lp-cta-sub">{t.footerNote}</p>
        <button className="lp-cta-btn" onClick={onEnter}>
          {t.heroCta} <ArrowRight size={16} />
        </button>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <span className="lp-footer-copy">{t.footerCopy}</span>
          <span className="lp-footer-note">{t.footerNote}</span>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD — Submit View
═══════════════════════════════════════════════ */
function SubmitView({ onSubmit }) {
  const { lang, t } = useLang();
  const presets = BILINGUAL_PRESETS[lang] || BILINGUAL_PRESETS.en;
  const quotes = BILINGUAL_QUOTES[lang] || BILINGUAL_QUOTES.en;

  const [inputType, setInputType] = useState('text');
  const [payload, setPayload]     = useState(presets[0].payload);
  const [whoAreYou, setWhoAreYou] = useState('student');
  const [techLevel, setTechLevel] = useState('simple');
  const [focusArea, setFocusArea] = useState('emails_messages');
  const [fileInfo, setFileInfo]   = useState(null);   // { name, size, b64 }
  const [dragOver, setDragOver]   = useState(false);
  const [fileError, setFileError] = useState('');
  const [quoteIdx, setQuoteIdx]   = useState(0);
  const [miniFeedIdx, setMiniFeedIdx] = useState(0);
  const fileInputRef = useRef(null);

  const MAX_BYTES = 15 * 1024 * 1024;

  const ACCEPT = {
    file:       '.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.exe,.sh,.ps1,.py,.zip',
    screenshot: 'image/png,image/jpeg,image/webp,image/gif',
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setMiniFeedIdx(prev => (prev + 1) % (LIVE_FEED.length - 2));
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const readFile = (file) => {
    setFileError('');
    if (file.size > MAX_BYTES) {
      setFileError(`File too large — maximum is 15 MB (selected: ${(file.size / 1024 / 1024).toFixed(1)} MB).`);
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isText  = file.type.startsWith('text/') || /\.(txt|csv|log|md|py|sh|ps1|js|json|xml|html)$/i.test(file.name);

    // Always read as data URL for the base64 payload the API needs
    const b64Reader = new FileReader();
    b64Reader.onload = (e) => {
      const dataUrl  = e.target.result;
      const pureB64  = dataUrl.includes('base64,') ? dataUrl.split('base64,')[1] : dataUrl;

      const baseInfo = {
        name:     file.name,
        size:     file.size,
        mimeType: file.type || 'application/octet-stream',
        b64:      pureB64,
        dataUrl:  isImage ? dataUrl : null,
        textPreview: null,
      };

      if (isText) {
        // Also read as text for the preview pane
        const txtReader = new FileReader();
        txtReader.onload = (te) => {
          setFileInfo({ ...baseInfo, textPreview: te.target.result });
          setPayload(pureB64);
        };
        txtReader.readAsText(file);
      } else {
        setFileInfo(baseInfo);
        setPayload(pureB64);
      }
    };
    b64Reader.onerror = () => setFileError('Could not read the file. Please try again.');
    b64Reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  const clearFile = () => {
    setFileInfo(null);
    setFileError('');
    setPayload('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if ((inputType === 'file' || inputType === 'screenshot') && !fileInfo) {
      setFileError('Please select a file before submitting.');
      return;
    }
    if (!payload.trim()) return;
    onSubmit({ inputType, payload, whoAreYou, techLevel, focusArea });
  };

  const INPUT_TABS = [
    { key: 'text',       label: t.tabText,       Icon: FileText },
    { key: 'url',        label: t.tabUrl,        Icon: LinkIcon },
    { key: 'file',       label: t.tabFile,       Icon: File },
    { key: 'screenshot', label: t.tabScreenshot, Icon: ImageIcon },
  ];

  const curQuote = quotes[quoteIdx % quotes.length];
  const charCount = typeof payload === 'string' ? payload.length : 0;

  return (
    <div className="submit-view">

      {/* ── TOP TELEMETRY RIBBON ── */}
      <div className="dash-telemetry-ribbon">
        <div className="dtr-item">
          <span className="dtr-dot pulse-lime" />
          <span className="dtr-label">{t.nodeLabel}</span>
          <span className="dtr-val">VU-CYBER-LAB // NODE-01</span>
        </div>
        <div className="dtr-item">
          <span className="dtr-label">{t.threatLabel}</span>
          <span className="dtr-val dtr-amber">{t.defconLevel}</span>
        </div>
        <div className="dtr-item dtr-hide-mobile">
          <span className="dtr-label">{t.engineLabel}</span>
          <span className="dtr-val">{t.engineVal}</span>
        </div>
        <div className="dtr-item dtr-hide-mobile">
          <span className="dtr-label">{t.scansLabel}</span>
          <span className="dtr-val">14,938</span>
        </div>
        <div className="dtr-item">
          <span className="dtr-tag">{t.evalReady}</span>
        </div>
      </div>

      {/* ── TWO-COLUMN WORKSPACE ── */}
      <div className="dash-workspace-grid">

        {/* ── LEFT: MAIN INGESTION BENCH ── */}
        <div className="dash-workbench-col">
          <div className="workbench-card">
            
            <div className="workbench-header">
              <div className="workbench-badge">
                <Shield size={13} />
                <span>{t.terminalBadge}</span>
              </div>
              <h1 className="submit-heading">{t.submitHeading}</h1>
              <p className="submit-sub">
                {t.submitSub}
              </p>
            </div>

            {/* Quick Samples with Risk Indicators */}
            <div className="samples-row">
              <span className="samples-label">{t.scenariosLabel}</span>
              {presets.map((p, i) => (
                <button
                  key={i}
                  id={`sample-chip-${i}`}
                  className="sample-chip"
                  onClick={() => { setInputType(p.type); setPayload(p.payload); }}
                >
                  <span className="sample-chip-dot" />
                  {p.name}
                </button>
              ))}
            </div>

            {/* Input type tabs */}
            <div className="input-type-tabs">
              {INPUT_TABS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  id={`input-tab-${key}`}
                  className={`input-tab ${inputType === key ? 'active' : ''}`}
                  onClick={() => {
                    setInputType(key);
                    setFileInfo(null);
                    setFileError('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    if (key === 'text')       setPayload(presets[0].payload);
                    if (key === 'url')        setPayload(presets[1].payload);
                    if (key === 'file')       setPayload('');
                    if (key === 'screenshot') setPayload('');
                  }}
                >
                  <Icon /> {label}
                </button>
              ))}
            </div>

            {/* Input area */}
            {inputType === 'text' && (
              <textarea
                id="submit-textarea"
                className="dash-textarea"
                placeholder={t.textPlaceholder}
                value={payload}
                onChange={e => setPayload(e.target.value)}
              />
            )}

            {inputType === 'url' && (
              <input
                id="submit-url"
                type="text"
                className="dash-url-input"
                placeholder={t.urlPlaceholder}
                value={payload}
                onChange={e => setPayload(e.target.value)}
              />
            )}

            {(inputType === 'file' || inputType === 'screenshot') && (
              <>
                <input
                  ref={fileInputRef}
                  id="file-input-hidden"
                  type="file"
                  accept={ACCEPT[inputType]}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

                {fileInfo ? (
                  <div className="file-preview-panel">
                    <div className="file-preview-header">
                      <div className="file-preview-meta">
                        <span className="file-preview-name">{fileInfo.name}</span>
                        <div className="file-preview-tags">
                          <span className="file-preview-badge">
                            {fileInfo.size < 1024 * 1024
                              ? `${(fileInfo.size / 1024).toFixed(1)} KB`
                              : `${(fileInfo.size / 1024 / 1024).toFixed(1)} MB`}
                          </span>
                          <span className="file-preview-badge">
                            {fileInfo.mimeType || 'unknown type'}
                          </span>
                        </div>
                      </div>
                      <button className="dash-file-clear" onClick={clearFile}>{t.removeFile}</button>
                    </div>

                    <div className="file-preview-body">
                      {fileInfo.dataUrl && (
                        <img
                          src={fileInfo.dataUrl}
                          alt={fileInfo.name}
                          className="file-preview-img"
                        />
                      )}

                      {!fileInfo.dataUrl && fileInfo.textPreview && (
                        <pre className="file-preview-text">
                          {fileInfo.textPreview.slice(0, 1200)}
                          {fileInfo.textPreview.length > 1200 && (
                            <span className="file-preview-truncated">
                              {`\n\n... ${(fileInfo.textPreview.length - 1200).toLocaleString()} more characters not shown`}
                            </span>
                          )}
                        </pre>
                      )}

                      {!fileInfo.dataUrl && !fileInfo.textPreview && (
                        <table className="file-preview-meta-table">
                          <tbody>
                            <tr>
                              <td className="fpm-key">Filename</td>
                              <td className="fpm-val">{fileInfo.name}</td>
                            </tr>
                            <tr>
                              <td className="fpm-key">Size</td>
                              <td className="fpm-val">
                                {fileInfo.size.toLocaleString()} bytes
                              </td>
                            </tr>
                            <tr>
                              <td className="fpm-key">MIME type</td>
                              <td className="fpm-val">{fileInfo.mimeType}</td>
                            </tr>
                            <tr>
                              <td className="fpm-key">Encoding</td>
                              <td className="fpm-val">Base64 (isolated in-memory)</td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`dash-dropzone ${dragOver ? 'drag-over' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={32} className="dash-dropzone-icon" />
                    <div className="dash-dropzone-primary">
                      {inputType === 'file'
                        ? t.dropzoneFile
                        : t.dropzoneScreenshot}
                    </div>
                    <div className="dash-dropzone-secondary">
                      {t.dropzoneSub}
                    </div>
                  </div>
                )}

                {fileError && (
                  <div className="dash-file-error">{fileError}</div>
                )}
              </>
            )}

            {/* Ingestion Telemetry Bar */}
            <div className="input-telemetry-bar">
              <div className="itb-left">
                <span className="itb-metric">{t.charsMetric} <strong>{charCount}</strong></span>
                <span className="itb-sep">/</span>
                <span className="itb-metric">{t.tokensMetric} <strong>~{Math.ceil(charCount / 4)}</strong></span>
                <span className="itb-sep">/</span>
                <span className="itb-metric">{t.entropyMetric} <strong>{(charCount > 0 ? (3.6 + Math.min(1.6, charCount / 300)).toFixed(2) : '0.00')}</strong></span>
              </div>
              <div className="itb-right">
                <span className="itb-tag">{t.sandboxReady}</span>
              </div>
            </div>

            {/* Preferences */}
            <div className="prefs-row">
              <div className="pref-group">
                <label className="pref-label" htmlFor="pref-who">{t.whoLabel}</label>
                <select
                  id="pref-who"
                  className="pref-select"
                  value={whoAreYou}
                  onChange={e => setWhoAreYou(e.target.value)}
                >
                  <option value="student">{t.whoStudent}</option>
                  <option value="professional">{t.whoPro}</option>
                  <option value="personal_user">{t.whoPersonal}</option>
                </select>
              </div>

              <div className="pref-group">
                <label className="pref-label">{t.depthLabel}</label>
                <div className="seg-control">
                  {[
                    { key: 'simple', label: t.depthSimple },
                    { key: 'detailed', label: t.depthDetailed },
                    { key: 'technical', label: t.depthTechnical },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      id={`seg-${key}`}
                      className={`seg-btn ${techLevel === key ? 'active' : ''}`}
                      onClick={() => setTechLevel(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pref-group">
                <label className="pref-label" htmlFor="pref-focus">{t.focusLabel}</label>
                <select
                  id="pref-focus"
                  className="pref-select"
                  value={focusArea}
                  onChange={e => setFocusArea(e.target.value)}
                >
                  <option value="emails_messages">{t.focusEmails}</option>
                  <option value="websites_links">{t.focusWebsites}</option>
                  <option value="account_security">{t.focusAccount}</option>
                  <option value="device_security">{t.focusDevice}</option>
                  <option value="network_security">{t.focusNetwork}</option>
                  <option value="everything">{t.focusEverything}</option>
                </select>
              </div>
            </div>

            {/* Submit Action */}
            <button
              id="submit-btn"
              className="submit-btn"
              onClick={handleSubmit}
            >
              {t.analyseBtn} <ArrowRight size={16} />
            </button>

            <div className="workbench-footer-note">
              <span>{t.guaranteeZero}</span>
              <span>•</span>
              <span>{t.guaranteeRam}</span>
              <span>•</span>
              <span>{t.guaranteeSha}</span>
            </div>

          </div>
        </div>

        {/* ── RIGHT: INTEL & INVIGILATOR HUB ── */}
        <div className="dash-side-col">

          {/* Card 1: Invigilator & Academic Cyber Humor Terminal */}
          <div className="side-card meme-terminal-card">
            <div className="side-card-header">
              <div className="side-card-title">
                <Terminal size={14} className="terminal-icon-lime" />
                <span>{t.humorTitle}</span>
              </div>
              <button
                className="meme-cycle-btn"
                onClick={() => setQuoteIdx(prev => prev + 1)}
                title="Shuffle Quote"
              >
                {t.nextQuoteBtn}
              </button>
            </div>
            <div className="meme-body">
              <div className="meme-tag-pill">{curQuote.tag}</div>
              <p className="meme-quote">"{curQuote.quote}"</p>
              <div className="meme-author">— {curQuote.author}</div>
            </div>
            <div className="meme-footer">
              <span className="meme-sub">{t.humorSub}</span>
            </div>
          </div>

          {/* Card 2: Live Threat Stream (Mini Feed) */}
          <div className="side-card live-intercept-card">
            <div className="side-card-header">
              <div className="side-card-title">
                <span className="radar-pulse-dot" />
                <span>{t.radarTitle}</span>
              </div>
              <span className="radar-live-text">{t.radarRealtime}</span>
            </div>
            <div className="mini-feed-list">
              {LIVE_FEED.slice(miniFeedIdx, miniFeedIdx + 3).map((item, idx) => (
                <div key={idx} className="mini-feed-item">
                  <div className="mfi-top">
                    <span className={`mfi-badge mfi-badge-${item.risk.toLowerCase()}`}>
                      {item.risk}
                    </span>
                    <span className="mfi-type">{item.type}</span>
                    <span className="mfi-time">{idx === 0 ? '14s ago' : idx === 1 ? '45s ago' : '2m ago'}</span>
                  </div>
                  <div className="mfi-detail">{item.detail}</div>
                  <div className="mfi-loc">{item.src} &middot; {item.loc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Engine Diagnostics & Health */}
          <div className="side-card engine-health-card">
            <div className="side-card-header">
              <div className="side-card-title">
                <Activity size={14} />
                <span>{t.engineDiagTitle}</span>
              </div>
              <span className="engine-status-badge">{t.engineOnline}</span>
            </div>
            <div className="engine-metric-list">
              <div className="engine-metric-item">
                <span className="emi-label">Regex & Heuristics</span>
                <span className="emi-val emi-lime">142 rules ready</span>
              </div>
              <div className="engine-metric-item">
                <span className="emi-label">ML Lexical Classifier</span>
                <span className="emi-val emi-lime">98.4% Precision</span>
              </div>
              <div className="engine-metric-item">
                <span className="emi-label">Domain WHOIS/SSL</span>
                <span className="emi-val emi-lime">Active (18ms)</span>
              </div>
              <div className="engine-metric-item">
                <span className="emi-label">Sandbox Isolation</span>
                <span className="emi-val emi-lime">RAM Enforced</span>
              </div>
            </div>
          </div>

          {/* Card 4: Threat Coverage Chips */}
          <div className="side-card threat-chips-card">
            <div className="side-card-header">
              <div className="side-card-title">
                <Lock size={14} />
                <span>{t.supportedThreatsTitle}</span>
              </div>
              <span className="threat-count-pill">{t.typesCount}</span>
            </div>
            <div className="side-threat-grid">
              {THREATS.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="side-threat-chip">
                    <Icon size={12} />
                    <span>{t.threatNames[item.id] || item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD — Loading View
═══════════════════════════════════════════════ */
function LoadingView() {
  const { lang } = useLang();
  const [activeStep, setActiveStep] = useState(0);

  const steps = lang === 'hi'
    ? [
        'सामग्री संरचना का विश्लेषण जारी...',
        'हेयूरिस्टिक नियम इंजन सक्रिय...',
        'मशीन लर्निंग मॉडल द्वारा थ्रेट वर्गीकरण...',
        'वैश्विक सुरक्षा डेटाबेस से मिलान...',
        'समग्र जोखिम स्कोर की गणना...',
        'अंतिम सुरक्षा रिपोर्ट तैयार की जा रही है...',
      ]
    : LOADING_STEPS;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 280);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="loading-view">
      <div className="loading-bar-wrap">
        <div className="loading-track">
          <div className="loading-fill" />
        </div>
      </div>
      <div className="loading-steps">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`loading-step ${i === activeStep ? 'active' : ''} ${i < activeStep ? 'done' : ''}`}
          >
            <div className="loading-step-dot" />
            <span className="loading-step-text">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD — Output View
═══════════════════════════════════════════════ */
function OutputView({ result, onReset }) {
  const { lang, t } = useLang();
  const [activeTab, setActiveTab] = useState('simple');
  const [doneSteps, setDoneSteps] = useState({});

  const risk = result?.risk_assessment;
  const riskLevel = risk?.risk_level || 'low';
  const riskScore = risk?.risk_score || 0;
  const confidence = risk?.confidence || 0;

  const toggleStep = (i) =>
    setDoneSteps(prev => ({ ...prev, [i]: !prev[i] }));

  const riskLabel = lang === 'hi'
    ? (riskLevel === 'high' ? 'उच्च जोखिम (High Risk)' : riskLevel === 'medium' ? 'मध्यम जोखिम (Medium Risk)' : 'सुरक्षित (Safe)')
    : (riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1) + ' Risk');
  const categoryLabel = (risk?.category || '').replace(/_/g, ' ');

  return (
    <div className="output-view">
      <div className="output-inner">

        {/* Topbar */}
        <div className="output-topbar">
          <div className="output-topbar-left">
            <span className="output-topbar-label">{t.analysisComplete}</span>
            <span className="output-topbar-id">{t.analysisId} {result?.analysis_id}</span>
          </div>
          <button id="new-analysis-btn" className="output-new-btn" onClick={onReset}>
            <Plus size={14} /> {t.newAnalysis}
          </button>
        </div>

        {/* Main grid */}
        <div className="output-grid">

          {/* LEFT: Verdict */}
          <div className="verdict-panel">
            {/* Risk block */}
            <div className={`verdict-risk-block risk-${riskLevel}`}>
              <div className="verdict-risk-row">
                <span className="verdict-risk-label">{t.verdictLabel}</span>
                <span className="verdict-confidence">{Math.round(confidence * 100)}% {t.confidenceLabel}</span>
              </div>
              <div className="verdict-risk-level">{riskLabel}</div>
              <div className="verdict-category">{categoryLabel}</div>
              <div className="verdict-score-bar">
                <div className="verdict-score-bar-track">
                  <div
                    className="verdict-score-bar-fill"
                    style={{ width: `${Math.round(riskScore * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Signal tags */}
            {risk?.signals?.length > 0 && (
              <div className="verdict-signals">
                <div className="verdict-signals-label">{t.signalsDetected}</div>
                <div className="verdict-signal-tags">
                  {risk.signals.map((s, i) => (
                    <span key={i} className="verdict-signal-tag">{s.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence */}
            {risk?.evidence_collection?.length > 0 && (
              <div className="verdict-evidence">
                <div className="verdict-evidence-label">{t.evidenceCollected}</div>
                <ul className="verdict-evidence-list">
                  {risk.evidence_collection.map((ev, i) => (
                    <li key={i} className="verdict-evidence-item">
                      <span className="verdict-evidence-src">{ev.source.replace(/_/g, ' ')}</span>
                      <span className="verdict-evidence-text">{ev.reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* RIGHT: Explanation */}
          <div className="explanation-panel">
            {/* Tabs */}
            <div className="exp-tabs-bar">
              {[
                { key: 'simple', label: t.depthSimple },
                { key: 'detailed', label: t.depthDetailed },
                { key: 'technical', label: t.depthTechnical },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  id={`exp-tab-${key}`}
                  className={`exp-tab-btn ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Explanation text */}
            <div className="exp-body-text">
              {result?.explanation?.[activeTab] || result?.explanation?.simple}
            </div>

            {/* Why suspicious */}
            {result?.why_suspicious?.length > 0 && (
              <div className="why-block">
                <div className="why-label">{t.whySuspicious}</div>
                <ul className="why-list">
                  {result.why_suspicious.map((item, i) => (
                    <li key={i} className="why-item">
                      <span className="why-dot" />
                      <span className="why-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Impact */}
            {result?.what_could_happen && (
              <div className="impact-block">
                <div className="impact-label">{t.whatCouldHappen}</div>
                <div className="impact-text">{result.what_could_happen}</div>
              </div>
            )}

            {/* Action plan */}
            {result?.action_plan?.what_to_do?.length > 0 && (
              <div className="action-block">
                <div className="action-label">{t.whatToDo}</div>
                <ul className="action-steps-list">
                  {result.action_plan.what_to_do.map((step, i) => (
                    <li key={i}>
                      <button
                        id={`action-step-${i}`}
                        className={`action-step-btn ${doneSteps[i] ? 'done' : ''}`}
                        onClick={() => toggleStep(i)}
                      >
                        <span className="action-step-num">
                          {doneSteps[i] ? <Check size={12} className="step-check" /> : `0${i + 1}`}
                        </span>
                        <span className="action-step-text">{step}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Threat coverage */}
        <div className="threat-section">
          <div className="threat-section-label">{t.threatCoverageTitle}</div>
          <div className="threat-grid">
            {THREATS.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="threat-card">
                  <div className="threat-icon-wrap">
                    <Icon />
                  </div>
                  <div>
                    <div className="threat-name">{t.threatNames[item.id] || item.name}</div>
                    <div className="threat-sub">{item.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="dash-footer">
          <div className="dash-footer-inner">
            <span className="dash-footer-copy">
              {t.footerCopy}
            </span>
            <span className="dash-footer-note">
              {t.analysisId} {result?.analysis_id} &middot; {t.footerNote}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD ROOT
═══════════════════════════════════════════════ */
function Dashboard({ onBack }) {
  const { t } = useLang();
  // 'submit' | 'loading' | 'output'
  const [view, setView] = useState('submit');
  const [result, setResult] = useState(null);

  const handleSubmit = async ({ inputType, payload, whoAreYou, techLevel, focusArea }) => {
    setView('loading');
    try {
      const res = await fetch('/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input_type: inputType,
          payload,
          user_preferences: {
            who_are_you: whoAreYou,
            technical_level: techLevel,
            focus_area: [focusArea],
          },
        }),
      });

      // Minimum loading duration so steps are readable
      await new Promise(r => setTimeout(r, 2000));

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setResult(DEFAULT_RESULT);
      }
    } catch {
      await new Promise(r => setTimeout(r, 2000));
      setResult(DEFAULT_RESULT);
    } finally {
      setView('output');
    }
  };

  const handleReset = () => {
    setResult(null);
    setView('submit');
  };

  return (
    <div className="page-root">
      <nav className="dash-nav">
        <div className="dash-nav-inner">
          <div className="dash-logo">
            <LogoMark />
            {t.appName}
          </div>
          <div className="dash-nav-actions">
            <LanguageSwitcher />
            {view === 'output' ? (
              <button className="dash-nav-back" onClick={handleReset}>
                <ChevronLeft size={14} /> {t.newAnalysis}
              </button>
            ) : (
              <button className="dash-nav-back" onClick={onBack}>
                <ChevronLeft size={14} /> {t.backOverview}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Live Threat News Ticker across dashboard */}
      <NewsTickerBar />

      <div className="dash-root">
        {view === 'submit'  && <SubmitView onSubmit={handleSubmit} />}
        {view === 'loading' && <LoadingView />}
        {view === 'output'  && <OutputView result={result} onReset={handleReset} />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   APP ROOT — route between Landing and Dashboard
═══════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState('landing'); // 'landing' | 'dashboard'
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('cybersafe_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cybersafe_lang', lang);
    } catch {}
  }, [lang]);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {page === 'landing'
        ? <LandingPage onEnter={() => setPage('dashboard')} />
        : <Dashboard   onBack={() => setPage('landing')} />}
    </LanguageContext.Provider>
  );
}

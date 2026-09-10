import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, AlertTriangle, CheckCircle, Info,
  Image as ImageIcon, FileText, Link as LinkIcon,
  File, ArrowRight, Lock, Globe, Laptop,
  Network, Mail, Users, Check, Upload
} from 'lucide-react';

/* ─── Preset test samples ─── */
const PRESETS = [
  {
    name: "PayPal Phishing Email",
    type: "text",
    payload: "From: PayPal Security <support@paypa1-alert.xyz>\nURGENT: Your account has been suspended! Immediate action required within 24 hours. Enter your password and verify OTP at http://paypa1-alert.xyz/restore to unlock your balance."
  },
  {
    name: "Obfuscated Short Link",
    type: "url",
    payload: "http://bit.ly/secure-account-verification-2026"
  },
  {
    name: "Suspicious Invoice File",
    type: "file",
    payload: "UEsDBBQAAAAIAAAAAAAAAAAAAAAAAAAAAA=="
  },
  {
    name: "Safe Team Message",
    type: "text",
    payload: "Hi team, please find attached the agenda for tomorrow's architecture review. The project repository is at https://github.com/hypertonny/Cybersafe. Looking forward to our discussion."
  }
];

/* ─── Threat categories (Section 4) ─── */
const THREATS = [
  { id: "phishing", name: "Phishing", sub: "Emails & Messages", icon: Mail, bg: "#ECF4FE", color: "#0071E3" },
  { id: "malware", name: "Malware", sub: "Attachments & Files", icon: AlertTriangle, bg: "#FFF1F0", color: "#FF3B30" },
  { id: "malicious_url", name: "Malicious URLs", sub: "Websites & Links", icon: LinkIcon, bg: "#ECF4FE", color: "#5856D6" },
  { id: "social_engineering", name: "Social Engineering", sub: "Scam Detection", icon: Users, bg: "#F3EEFF", color: "#AF52DE" },
  { id: "account_security", name: "Account Security", sub: "Passwords & MFA", icon: Lock, bg: "#ECF4FE", color: "#0071E3" },
  { id: "device_security", name: "Device Security", sub: "OS Configuration", icon: Laptop, bg: "#ECF4FE", color: "#32ADE6" },
  { id: "network_threats", name: "Network Threats", sub: "MITM, Port Scan", icon: Network, bg: "#ECF4FE", color: "#0071E3" },
  { id: "web_security", name: "Web Security", sub: "SQLi, XSS, SSL/TLS", icon: Globe, bg: "#F0FFF4", color: "#34C759" },
];

/* ─── Default analysis result (demo) ─── */
const DEFAULT_RESULT = {
  analysis_id: "demo-sample-01",
  risk_assessment: {
    risk_level: "high",
    risk_score: 0.88,
    confidence: 0.94,
    category: "phishing",
    signals: ["urgent_language", "credential_solicitation", "sender_mismatch", "suspicious_link"],
  },
  explanation: {
    simple: "This message is probably a scam. The sender is trying to make you click a link and give away your personal information like your password or OTP.",
    detailed: "Our security engines identified critical phishing signals with 94% confidence. The sender claims to be PayPal but sends from an unauthorized domain registered only recently. The urgent deadline is designed to bypass your normal security judgement.",
    technical: "Verdict: HIGH (score: 0.880, confidence: 0.94). Classification: phishing. Signals: [urgent_language, credential_solicitation, sender_mismatch, suspicious_link]. Domain heuristics: registration < 48h. Target URL lacks valid SSL."
  },
  why_suspicious: [
    "Urgent language demanding immediate action",
    "Suspicious link — not from an official PayPal domain",
    "Requests confidential information (password, OTP)",
    "Sender identity appears fake and mismatched"
  ],
  what_could_happen: "Your personal information could be stolen, leading to account compromise or financial loss.",
  action_plan: {
    what_to_do: [
      "Do not click the link.",
      "Do not share your password, OTP, or personal details.",
      "Verify through the official website or contact the organisation directly.",
      "If you already entered your details, change your password immediately."
    ]
  }
};

/* ─── Risk Gauge SVG component ─── */
function RiskGauge({ score, riskLevel }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - score * circumference;
  return (
    <div className="risk-gauge">
      <svg className="gauge-svg" viewBox="0 0 72 72">
        <circle className="gauge-bg" cx="36" cy="36" r={radius} />
        <circle
          className="gauge-fill"
          cx="36" cy="36" r={radius}
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
        />
      </svg>
      <div className="gauge-label">
        <span>{Math.round(score * 100)}%</span>
        <span className="gauge-sub">Conf</span>
      </div>
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [inputType, setInputType]       = useState('text');
  const [payload, setPayload]           = useState(PRESETS[0].payload);
  const [whoAreYou, setWhoAreYou]       = useState('personal_user');
  const [techLevel, setTechLevel]       = useState('simple');
  const [focusArea, setFocusArea]       = useState('emails_messages');
  const [isLoading, setIsLoading]       = useState(false);
  const [activeTab, setActiveTab]       = useState('simple');
  const [doneSteps, setDoneSteps]       = useState({});
  const [result, setResult]             = useState(DEFAULT_RESULT);

  const riskLevel  = result?.risk_assessment?.risk_level || 'low';
  const confidence = result?.risk_assessment?.confidence || 0.9;

  const handleAnalyze = async () => {
    setIsLoading(true);
    setDoneSteps({});
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
            focus_area: [focusArea]
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setActiveTab(techLevel);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Analysis error: ${err.detail || 'Failed to analyze. Please try again.'}`);
      }
    } catch {
      // Backend offline — keep showing current result (demo mode)
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStep = (idx) =>
    setDoneSteps(prev => ({ ...prev, [idx]: !prev[idx] }));

  const getRiskIcon = () => {
    if (riskLevel === 'high')   return <AlertTriangle />;
    if (riskLevel === 'medium') return <Info />;
    return <CheckCircle />;
  };

  return (
    <div className="app-root">

      {/* ── HEADER ── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <Shield className="brand-shield" />
            <span className="brand-name">CyberSafe</span>
            <span className="brand-dot" />
            <span className="header-tagline">Think Before You Click</span>
          </div>
          <span className="header-badge">AI-Powered Security</span>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="hero">
        <p className="hero-eyebrow">An AI-Powered Cybersecurity Assistant for Everyone</p>
        <h1 className="hero-title">
          Stay safe from <em>every</em> digital threat.
        </h1>
        <p className="hero-sub">
          Paste a suspicious message, URL, or upload a file — and get a clear,
          plain-language security verdict in seconds.
        </p>
        <div className="hero-flow-pills">
          <div className="flow-pill">
            <Upload size={14} />
            Upload
          </div>
          <span className="flow-arrow">→</span>
          <div className="flow-pill">
            <Shield size={14} />
            Analyze
          </div>
          <span className="flow-arrow">→</span>
          <div className="flow-pill">
            <FileText size={14} />
            Understand
          </div>
          <span className="flow-arrow">→</span>
          <div className="flow-pill">
            <CheckCircle size={14} />
            Stay Safe
          </div>
        </div>
      </section>

      {/* ── MAIN ── */}
      <main className="main-content">
        <div className="analysis-grid">

          {/* ── PANEL 1: Input & Preferences ── */}
          <div className="card">
            <div className="card-header">
              <div className="card-step-number">1</div>
              <span className="card-title">Submit Your Content</span>
            </div>
            <div className="card-body">

              {/* Input type selector */}
              <div className="input-type-grid">
                {[
                  { key: 'screenshot', label: 'Screenshot', Icon: ImageIcon },
                  { key: 'text',       label: 'Text',       Icon: FileText },
                  { key: 'url',        label: 'URL',        Icon: LinkIcon },
                  { key: 'file',       label: 'File',       Icon: File },
                ].map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    className={`input-type-btn ${inputType === key ? 'active' : ''}`}
                    onClick={() => {
                      setInputType(key);
                      if (key === 'text') setPayload(PRESETS[0].payload);
                      if (key === 'url')  setPayload(PRESETS[1].payload);
                      if (key === 'file') setPayload(PRESETS[2].payload);
                      if (key === 'screenshot') setPayload('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=');
                    }}
                  >
                    <Icon />
                    {label}
                  </button>
                ))}
              </div>

              {/* Input area */}
              {inputType === 'text' && (
                <textarea
                  className="textarea-input"
                  placeholder="Paste suspicious email, SMS, or any message content here…"
                  value={payload}
                  onChange={e => setPayload(e.target.value)}
                />
              )}
              {inputType === 'url' && (
                <input
                  type="text"
                  className="url-input"
                  placeholder="Enter a suspicious URL, e.g. https://…"
                  value={payload}
                  onChange={e => setPayload(e.target.value)}
                />
              )}
              {(inputType === 'screenshot' || inputType === 'file') && (
                <div className="dropzone">
                  <Upload className="dropzone-icon" />
                  <p className="dropzone-primary">
                    Drag & drop your {inputType} here, or click to browse
                  </p>
                  <p className="dropzone-secondary">
                    Max 15 MB · Encrypted in transit · Never stored
                  </p>
                </div>
              )}

              {/* Test samples */}
              <div>
                <p className="presets-label">Quick test samples</p>
                <div className="presets-grid">
                  {PRESETS.map((p, i) => (
                    <button
                      key={i}
                      className="preset-chip"
                      onClick={() => { setInputType(p.type); setPayload(p.payload); }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* User preferences */}
              <div className="prefs-section">
                <div className="pref-row">
                  <label className="pref-label">Who are you?</label>
                  <select
                    className="persona-select"
                    value={whoAreYou}
                    onChange={e => setWhoAreYou(e.target.value)}
                  >
                    <option value="student">Student</option>
                    <option value="professional">Professional</option>
                    <option value="personal_user">Personal User</option>
                  </select>
                </div>

                <div className="pref-row">
                  <label className="pref-label">Explanation style</label>
                  <div className="segmented-control">
                    {[
                      { key: 'simple',    label: 'Simple' },
                      { key: 'detailed',  label: 'Detailed' },
                      { key: 'technical', label: 'Technical' },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        className={`seg-btn ${techLevel === key ? `active ${key}` : ''}`}
                        onClick={() => setTechLevel(key)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pref-row">
                  <label className="pref-label">Focus area (optional)</label>
                  <select
                    className="persona-select"
                    value={focusArea}
                    onChange={e => setFocusArea(e.target.value)}
                  >
                    <option value="emails_messages">Emails & Messages</option>
                    <option value="websites_links">Websites & Links</option>
                    <option value="account_security">Account Security</option>
                    <option value="device_security">Device Security</option>
                    <option value="network_security">Network Security</option>
                    <option value="everything">Everything</option>
                  </select>
                </div>
              </div>

              {/* Primary CTA */}
              <button
                className="analyze-btn"
                onClick={handleAnalyze}
                disabled={isLoading}
              >
                {isLoading ? (
                  <><div className="spinner" /> Analyzing…</>
                ) : (
                  <><span>Analyze Content</span><ArrowRight /></>
                )}
              </button>

            </div>
          </div>

          {/* ── PANEL 3: Analysis Output ── */}
          <div className="card">
            <div className="card-header">
              <div className="card-step-number">3</div>
              <span className="card-title">Security Analysis</span>
            </div>
            <div className="card-body">
              <div className="results-panel">

                {/* Risk header with gauge */}
                <div className={`risk-header ${riskLevel}`}>
                  <div className="risk-left">
                    <div className="risk-icon-wrap">
                      {getRiskIcon()}
                    </div>
                    <div>
                      <div className="risk-level-text">{riskLevel} Risk</div>
                      <div className="risk-category">
                        {result?.risk_assessment?.category?.replace('_', ' ')} · Threat Detected
                      </div>
                    </div>
                  </div>
                  <RiskGauge score={confidence} riskLevel={riskLevel} />
                </div>

                {/* Explanation tabs */}
                <div className="exp-tabs">
                  {['simple', 'detailed', 'technical'].map(t => (
                    <button
                      key={t}
                      className={`exp-tab ${activeTab === t ? `active ${t}` : ''}`}
                      onClick={() => setActiveTab(t)}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="exp-body">
                  {result?.explanation?.[activeTab] || result?.explanation?.simple}
                </div>

                {/* Why suspicious */}
                <div className="signals-wrap">
                  <div className="signals-label">Why is it suspicious?</div>
                  <ul className="signals-list">
                    {result?.why_suspicious?.map((item, i) => (
                      <li key={i} className="signal-item">
                        <span className="signal-dot" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What could happen */}
                <div className="impact-banner">
                  <strong>What could happen?</strong>
                  {result?.what_could_happen}
                </div>

                {/* Action plan */}
                <div className="action-plan">
                  <div className="action-plan-header">What should you do?</div>
                  <div className="action-steps">
                    {result?.action_plan?.what_to_do?.map((step, i) => (
                      <button
                        key={i}
                        className={`action-step ${doneSteps[i] ? 'done' : ''}`}
                        onClick={() => toggleStep(i)}
                      >
                        <div className="step-num">
                          {doneSteps[i] ? <Check size={12} /> : i + 1}
                        </div>
                        <span>{step}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: Threat Coverage ── */}
        <div className="threat-section">
          <div className="threat-section-header">
            <div className="threat-section-step">4</div>
            <span className="threat-section-title">Key Threat Coverage</span>
            <span className="threat-section-sub">Sessions 1–10 · 8 modules</span>
          </div>
          <div className="threat-grid">
            {THREATS.map(t => {
              const Icon = t.icon;
              return (
                <div key={t.id} className="threat-card">
                  <div className="threat-icon-bg" style={{ background: t.bg }}>
                    <Icon style={{ color: t.color }} />
                  </div>
                  <div>
                    <div className="threat-name">{t.name}</div>
                    <div className="threat-sub">{t.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <Shield />
                <span className="footer-brand-name">CyberSafe</span>
              </div>
              <p className="footer-mission">
                Empowering individuals with easy-to-use cybersecurity tools
                that detect threats, explain risks in plain language, and
                guide them with clear actions.
              </p>
            </div>

            <div>
              <div className="footer-col-title">Target Users</div>
              <ul className="footer-list">
                <li>General internet users</li>
                <li>Students</li>
                <li>Professionals</li>
                <li>Small businesses</li>
                <li>Anyone seeking digital safety</li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Key Benefits</div>
              <ul className="footer-list">
                <li>No technical knowledge needed</li>
                <li>Covers multiple cyber threat types</li>
                <li>Clear, actionable guidance</li>
                <li>Builds cybersecurity awareness</li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Future Scope</div>
              <ul className="footer-list">
                <li>Real-time browser extension</li>
                <li>Mobile apps (iOS & Android)</li>
                <li>Threat history & notifications</li>
                <li>Community threat reporting</li>
                <li>Enterprise tool integration</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="footer-copy">
              © 2026 CyberSafe · Vijaybhoomi University Cybersecurity Course
            </span>
            <span className="footer-note">
              All analysis is performed in transient memory. No data is stored.
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

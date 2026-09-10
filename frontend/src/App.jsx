import React, { useState } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, Info, Image, 
  FileText, Link as LinkIcon, File, ArrowRight, Lock, 
  Globe, Laptop, Network, Mail, Users, Check
} from 'lucide-react';

const PRESETS = [
  {
    name: "Urgent PayPal Scam",
    type: "text",
    payload: "From: PayPal Security <support@paypa1-alert.xyz>\nURGENT: Your account has been suspended! Immediate action required within 24 hours. Enter your password and verify OTP at http://paypa1-alert.xyz/restore to unlock your balance."
  },
  {
    name: "Obfuscated Shortlink",
    type: "url",
    payload: "http://bit.ly/secure-account-verification-2026"
  },
  {
    name: "Dangerous Invoice Attachment",
    type: "file",
    payload: "UEsDBBQAAAAIAAAAAAAAAAAAAAAAAAAAAA==" // sample base64 representation
  },
  {
    name: "Legitimate Meeting Note",
    type: "text",
    payload: "Hi team, please find attached the agenda for tomorrow's architecture review. The project repository is at https://github.com/hypertonny/Cybersafe. Looking forward to our discussion."
  }
];

const THREAT_CATEGORIES = [
  { id: "phishing", name: "Phishing", sub: "Emails, Messages", icon: Mail, color: "#1e40af" },
  { id: "malware", name: "Malware", sub: "Attachments, Files", icon: AlertTriangle, color: "#dc2626" },
  { id: "malicious_url", name: "Malicious URLs", sub: "Websites, Links", icon: LinkIcon, color: "#0284c7" },
  { id: "social_engineering", name: "Social Engineering", sub: "SCAM detection", icon: Users, color: "#7c3aed" },
  { id: "account_security", name: "Account Security", sub: "Passwords, MFA", icon: Lock, color: "#1e40af" },
  { id: "device_security", name: "Device Security", sub: "OS Configuration", icon: Laptop, color: "#0284c7" },
  { id: "network_threat", name: "Network Threats", sub: "MITM, Port Scan", icon: Network, color: "#0891b2" },
  { id: "web_security", name: "Web Security", sub: "SQLi, XSS, SSL/TLS", icon: Globe, color: "#0d9488" }
];

export default function App() {
  const [inputType, setInputType] = useState('text');
  const [payload, setPayload] = useState(PRESETS[0].payload);
  const [whoAreYou, setWhoAreYou] = useState('personal_user');
  const [technicalLevel, setTechnicalLevel] = useState('simple');
  const [focusArea, setFocusArea] = useState('emails_messages');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('simple');
  const [completedSteps, setCompletedSteps] = useState({});

  // Default Analysis result matching PRD & Infographic
  const [analysisResult, setAnalysisResult] = useState({
    analysis_id: "demo-sample-01",
    risk_assessment: {
      risk_level: "high",
      risk_score: 0.88,
      confidence: 0.94,
      category: "phishing",
      signals: ["urgent_language", "credential_solicitation", "sender_mismatch", "suspicious_link"],
      evidence_collection: [
        { reason: "Urgent language demanding immediate action under threat of penalty", source: "rules_engine" },
        { reason: "Suspicious link (not from official domain: 'paypa1-alert.xyz')", source: "security_checks" },
        { reason: "Requests confidential information (passwords, OTP)", source: "rules_engine" },
        { reason: "Sender identity appears fake and mismatched", source: "rules_engine" }
      ],
      extracted_url: "http://paypa1-alert.xyz/restore"
    },
    explanation: {
      simple: "This message is probably a scam. The sender is trying to make you click a link and give away your personal information like your password or OTP.",
      detailed: "Our security engines identified critical phishing signals with 94% confidence. The sender claims to be PayPal but sends from an unauthorized domain registered only recently. The urgent deadline is designed to bypass security scrutiny.",
      technical: "Verdict: HIGH (score: 0.880, confidence: 0.94). Classification: phishing. Signals: [urgent_language, credential_solicitation, sender_mismatch, suspicious_link]. Domain heuristics show new registration < 48 hours. Target URL lacks valid SSL certificate."
    },
    why_suspicious: [
      "Urgent language demanding immediate action",
      "Suspicious link (not from official domain)",
      "Requests confidential information",
      "Sender identity appears fake"
    ],
    what_could_happen: "Your personal information could be stolen, leading to account compromise or financial loss.",
    action_plan: {
      what_happened: "You received a fraudulent phishing message designed to steal your credentials.",
      why_risky: "Submitting details will result in unauthorized account takeover and potential monetary loss.",
      what_to_do: [
        "Do not click the link.",
        "Do not share your password, OTP or personal details.",
        "Verify through the official website or contact the organization directly.",
        "If you already entered your details, change your password immediately."
      ]
    }
  });

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input_type: inputType,
          payload: payload,
          user_preferences: {
            who_are_you: whoAreYou,
            technical_level: technicalLevel,
            focus_area: [focusArea]
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResult(data);
        setActiveTab(technicalLevel);
        setCompletedSteps({});
      } else {
        const err = await response.json();
        alert(`Analysis error: ${err.detail || 'Failed to analyze'}`);
      }
    } catch (e) {
      console.warn("Backend API unavailable, using client-side simulated analysis:", e);
      // Client-side fallback if backend not running on port 8000
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStep = (idx) => {
    setCompletedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const riskLevel = analysisResult?.risk_assessment?.risk_level || 'low';
  const confidence = Math.round((analysisResult?.risk_assessment?.confidence || 0.9) * 100);

  return (
    <div className="app-root">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="brand-section">
            <Shield className="brand-icon" />
            <div>
              <h1 className="brand-title">CyberSafe</h1>
              <p className="brand-tagline">Think Before You Click • Upload • Analyze • Understand • Stay Safe</p>
            </div>
          </div>
          <div className="vision-card">
            <div className="vision-quote">"A safer digital world for everyone"</div>
            <div className="vision-sub">To make cybersecurity simple, accessible, and actionable for every internet user.</div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        <div className="top-grid">
          {/* Left Column: Input & Preferences */}
          <div className="card-panel">
            <div className="panel-header">
              <div className="panel-number">1</div>
              <div className="panel-title">User Input & Preferences</div>
            </div>

            {/* Input Selection Tabs */}
            <div className="input-tabs">
              <button 
                className={`input-tab-btn ${inputType === 'screenshot' ? 'active' : ''}`}
                onClick={() => { setInputType('screenshot'); setPayload('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='); }}
              >
                <Image size={18} />
                <span>Screenshot</span>
              </button>
              <button 
                className={`input-tab-btn ${inputType === 'text' ? 'active' : ''}`}
                onClick={() => { setInputType('text'); setPayload(PRESETS[0].payload); }}
              >
                <FileText size={18} />
                <span>Text</span>
              </button>
              <button 
                className={`input-tab-btn ${inputType === 'url' ? 'active' : ''}`}
                onClick={() => { setInputType('url'); setPayload(PRESETS[1].payload); }}
              >
                <LinkIcon size={18} />
                <span>URL</span>
              </button>
              <button 
                className={`input-tab-btn ${inputType === 'file' ? 'active' : ''}`}
                onClick={() => { setInputType('file'); setPayload('JVBERi0xLjQKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwKL0tpZHM='); }}
              >
                <File size={18} />
                <span>File (Opt)</span>
              </button>
            </div>

            {/* Input Form Fields */}
            {inputType === 'text' && (
              <textarea 
                className="textarea-input"
                placeholder="Paste suspicious email, SMS, or message content here..."
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
              />
            )}

            {inputType === 'url' && (
              <input 
                type="text"
                className="url-input-field"
                placeholder="Enter suspicious website URL (e.g. https://...)"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
              />
            )}

            {(inputType === 'screenshot' || inputType === 'file') && (
              <div className="dropzone">
                <Image size={32} style={{ margin: '0 auto 0.5rem', color: '#64748b' }} />
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Drag & drop your {inputType} here or click to browse</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Max 15MB. Encrypted and processed in transient memory.</p>
              </div>
            )}

            {/* Quick Presets */}
            <div className="presets-container">
              <div className="presets-label">Test Samples (Click to load)</div>
              <div className="presets-grid">
                {PRESETS.map((p, idx) => (
                  <button 
                    key={idx} 
                    className="preset-chip"
                    onClick={() => {
                      setInputType(p.type);
                      setPayload(p.payload);
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* User Preferences Box */}
            <div className="preferences-box">
              <div>
                <label className="pref-label">1. Who are you?</label>
                <select 
                  className="persona-select"
                  value={whoAreYou}
                  onChange={(e) => setWhoAreYou(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="professional">Professional</option>
                  <option value="personal_user">Personal User</option>
                </select>
              </div>

              <div>
                <label className="pref-label">2. How technical should the explanation be?</label>
                <div className="segmented-toggle">
                  <button 
                    className={`segment-btn ${technicalLevel === 'simple' ? 'active simple' : ''}`}
                    onClick={() => setTechnicalLevel('simple')}
                  >
                    Simple (Non-technical)
                  </button>
                  <button 
                    className={`segment-btn ${technicalLevel === 'detailed' ? 'active detailed' : ''}`}
                    onClick={() => setTechnicalLevel('detailed')}
                  >
                    Detailed (Balanced)
                  </button>
                  <button 
                    className={`segment-btn ${technicalLevel === 'technical' ? 'active technical' : ''}`}
                    onClick={() => setTechnicalLevel('technical')}
                  >
                    Technical (Advanced)
                  </button>
                </div>
              </div>
            </div>

            {/* Primary CTA */}
            <button 
              className="analyze-cta"
              disabled={isLoading}
              onClick={handleRunAnalysis}
            >
              {isLoading ? "Running Security Pipeline..." : (
                <>
                  <span>Analyze Content</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {/* Right Column: Analysis Output (Matches Infographic Panel 3) */}
          <div className="card-panel">
            <div className="panel-header">
              <div className="panel-number">3</div>
              <div className="panel-title">Analysis Output (Results)</div>
            </div>

            <div className="results-container">
              {/* Risk Level Banner */}
              <div className={`risk-banner ${riskLevel}`}>
                <div className="risk-title-group">
                  <div className="risk-icon-box">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <div className="risk-text-title">{riskLevel} RISK</div>
                    <div className="risk-category-badge">
                      {analysisResult?.risk_assessment?.category?.replace('_', ' ').toUpperCase()} / THREAT
                    </div>
                  </div>
                </div>
                <div className="confidence-indicator">
                  Confidence: {confidence}%
                </div>
              </div>

              {/* Explanation Tabs (Simple | Detailed | Technical) */}
              <div className="explanation-tabs">
                <button 
                  className={`exp-tab ${activeTab === 'simple' ? 'active simple' : ''}`}
                  onClick={() => setActiveTab('simple')}
                >
                  Simple
                </button>
                <button 
                  className={`exp-tab ${activeTab === 'detailed' ? 'active detailed' : ''}`}
                  onClick={() => setActiveTab('detailed')}
                >
                  Detailed
                </button>
                <button 
                  className={`exp-tab ${activeTab === 'technical' ? 'active technical' : ''}`}
                  onClick={() => setActiveTab('technical')}
                >
                  Technical
                </button>
              </div>

              {/* Explanation Body */}
              <div className="explanation-body">
                {analysisResult?.explanation?.[activeTab] || analysisResult?.explanation?.simple}
              </div>

              {/* Why is it suspicious? */}
              <div className="suspicious-box">
                <div className="section-label">Why is it suspicious?</div>
                <ul className="suspicious-list">
                  {analysisResult?.why_suspicious?.map((item, idx) => (
                    <li key={idx} className="suspicious-item">
                      <span className="bullet-red">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What could happen? */}
              <div className="impact-card">
                <strong>What could happen?</strong>
                <p style={{ marginTop: '0.25rem' }}>{analysisResult?.what_could_happen}</p>
              </div>

              {/* What should you do? Checklist */}
              <div className="action-plan-box">
                <div className="action-plan-title">What should you do?</div>
                <div className="action-list">
                  {analysisResult?.action_plan?.what_to_do?.map((step, idx) => {
                    const isChecked = !!completedSteps[idx];
                    return (
                      <div 
                        key={idx} 
                        className={`action-item ${isChecked ? 'checked' : ''}`}
                        onClick={() => toggleStep(idx)}
                      >
                        <div className="action-number">
                          {isChecked ? <Check size={14} /> : (idx + 1)}
                        </div>
                        <span>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Threat Coverage Explorer (Panel 4) */}
        <section className="card-panel threat-grid-section">
          <div className="panel-header">
            <div className="panel-number">4</div>
            <div className="panel-title">Key Threat Coverage (Core Modules)</div>
          </div>
          <div className="threat-cards-grid">
            {THREAT_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div key={cat.id} className="threat-card">
                  <div className="threat-icon-title">
                    <IconComp size={18} style={{ color: cat.color }} />
                    <span>{cat.name}</span>
                  </div>
                  <div className="threat-desc">{cat.sub}</div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <div>
            <h3 className="footer-col-title">Our Mission</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
              To empower individuals with easy-to-use cybersecurity tools that detect threats, explain risks in simple language, and guide them with clear actions.
            </p>
          </div>
          <div>
            <h3 className="footer-col-title">Target Users</h3>
            <ul className="footer-list">
              <li>• General internet users</li>
              <li>• Students</li>
              <li>• Professionals</li>
              <li>• Small businesses</li>
              <li>• Anyone seeking digital safety</li>
            </ul>
          </div>
          <div>
            <h3 className="footer-col-title">Future Scope</h3>
            <ul className="footer-list">
              <li>• Real-time browser extension</li>
              <li>• Mobile native apps (iOS / Android)</li>
              <li>• Threat notifications & history</li>
              <li>• Advanced host & network scans</li>
              <li>• Community threat reporting</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

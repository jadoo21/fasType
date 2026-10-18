import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { contactApi } from '../services/api';
import { Button, PageHeader } from '../components/common';
import { cn } from '../utils/cn';

const page = "max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-unit-2xl";
const header = "mb-unit-2xl max-w-3xl mx-auto text-center flex flex-col items-center";
const grid = "grid grid-cols-1 lg:grid-cols-12 gap-unit-xl items-start";
const leftCol = "lg:col-span-5 space-y-unit-lg";
const infoCard = "bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg shadow-sm relative overflow-hidden";
const infoCardHeader = "flex items-center justify-between mb-unit-sm";
const monoLabel = "text-label-mono-sm font-label-mono-sm text-on-surface-variant";
const monoBadge = "text-label-mono-sm font-label-mono-sm text-secondary bg-surface-container px-2 py-0.5 rounded";
const infoCardTitle = "text-headline-sm font-headline-sm text-primary mb-2";
const infoCardDesc = "text-body-md font-body-md text-on-surface-variant leading-relaxed";
const categoryCard = "p-unit-base bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-secondary transition-colors duration-150";
const categoryIconWrap = "w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary";
const categoryIcon = "material-symbols-outlined text-[18px]";
const categoryTitle = "text-body-md font-body-md font-semibold text-primary";
const categoryDesc = "text-body-sm font-body-sm text-on-surface-variant mt-0.5";
const slaRow = "flex items-center gap-3 p-unit-base bg-surface-container-low border border-outline-variant rounded-xl";
const slaDotOuter = "w-3 h-3 rounded-full bg-secondary flex items-center justify-center";
const slaDotInner = "w-1.5 h-1.5 rounded-full bg-on-secondary";
const slaText = "text-body-sm font-body-sm text-on-surface";
const linksSection = "border-t border-outline-variant pt-unit-base";
const linksTitle = "text-label-mono-sm font-label-mono-sm text-on-surface-variant mb-unit-sm";
const linksGrid = "grid grid-cols-1 sm:grid-cols-3 gap-2";
const linkItem = "flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant hover:border-outline text-body-sm font-body-sm text-on-surface transition-colors duration-150";
const linkText = "truncate";
const linkIcon = "material-symbols-outlined text-[16px] text-on-surface-variant";
const rightCol = "lg:col-span-7";
const formCard = "bg-surface-container-lowest border border-outline-variant rounded-2xl p-unit-xl shadow-sm";
const successBanner = "mb-unit-lg p-unit-base bg-surface-container border border-secondary rounded-xl text-on-surface transition-all duration-200";
const successIcon = "material-symbols-outlined text-secondary";
const successTitle = "font-semibold text-body-md font-body-md text-primary";
const successDesc = "text-body-sm font-body-sm text-on-surface-variant mt-0.5";
const errorBanner = "mb-unit-lg p-unit-base bg-error-container border border-error/30 rounded-xl text-on-error-container flex items-start gap-3";
const errorIcon = "material-symbols-outlined text-error";
const errorTitle = "font-semibold text-body-md font-body-md text-error font-medium";
const errorDesc = "text-body-sm font-body-sm text-on-error-container mt-0.5";
const form = "space-y-unit-lg";
const inputGrid = "grid grid-cols-1 md:grid-cols-2 gap-unit-base";
const fieldWrapper = "space-y-1.5";
const fieldLabel = "block text-label-mono-sm font-label-mono-sm text-on-surface-variant";
const validatedBadge = "text-label-mono-sm font-label-mono-sm text-secondary flex items-center gap-1";
const validatedIcon = "material-symbols-outlined text-[14px]";
const fieldInput = "w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md font-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all";
const subjectSection = "space-y-2";
const subjectPillGroup = "flex flex-wrap gap-2";
const subjectPill = "subject-pill px-3 py-1.5 rounded-xl border text-body-sm font-body-sm transition-all";
const subjectPillActive = "border-primary bg-primary text-on-primary font-medium";
const subjectPillInactive = "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:border-outline";
const textareaHeader = "flex justify-between items-center";
const charCounter = "text-label-mono-sm font-label-mono-sm text-on-surface-variant";
const textarea = "w-full p-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md font-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-y";
const diagnosticsBar = "p-unit-base rounded-xl border border-outline-variant bg-surface-container-low flex items-start justify-between gap-4";
const diagnosticsText = "space-y-1";
const diagnosticsIconRow = "flex items-center gap-2";
const diagnosticsIcon = "material-symbols-outlined text-[18px] text-on-surface-variant";
const diagnosticsTitle = "text-body-md font-body-md font-semibold text-primary";
const diagnosticsDesc = "text-body-sm font-body-sm text-on-surface-variant";
const toggleLabel = "relative inline-flex items-center cursor-pointer shrink-0 mt-1";
const toggleInput = "sr-only peer";
const toggleTrack = "w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary";
const actionBar = "pt-2 flex flex-col sm:flex-row items-center justify-between gap-4";
const keyboardHint = "flex items-center gap-2 text-label-mono-sm font-label-mono-sm text-on-surface-variant order-2 sm:order-1";
const kbd = "px-2 py-0.5 rounded bg-surface-container border border-outline-variant text-primary shadow-xs";

function Contact() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.firstName || user?.username || 'Alex Vance',
    email: user?.email || 'alex@domain.com',
    subject: 'feature',
    message: '',
    includeDiagnostics: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = Boolean(
    formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubjectChange = (subject: string) => {
    setFormData(prev => ({ ...prev, subject }));
  };

  const submitForm = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const result = await contactApi.submit({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      if (result.success) {
        setSuccess(true);
        window.scrollTo({ top: 200, behavior: 'smooth' });
      } else {
        setError(result.error || 'Failed to send message');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [formData, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitForm();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        const form = document.getElementById('contactForm') as HTMLFormElement | null;
        if (form) {
          if (form.checkValidity()) {
            e.preventDefault();
            void submitForm();
          } else {
            form.reportValidity();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [submitForm]);

  const envInfo = React.useMemo(() => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    let browser = 'Chrome 124';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';

    let os = 'macOS 14.4';
    if (ua.includes('Win')) os = 'Windows 11';
    else if (ua.includes('Linux')) os = 'Linux';

    return `${browser}, ${os}`;
  }, []);

  return (
    <div className={page}>
      {/* Page Header */}
      <div className={header}>
        <PageHeader
          badgeText="PRECISION FEEDBACK DISPATCH // DEV.V3.4"
          title="Get in Touch"
          subtitle="Have a question, feature suggestion, or found a bug? We love hearing from mechanical keyboard enthusiasts and fast typists."
          className="max-w-3xl"
        />
      </div>

      {/* Two-Column Layout Grid */}
      <div className={grid}>
        {/* Left Column: Information & Context */}
        <div className={leftCol}>
          {/* Direct Feedback Channel Context Card */}
          <div className={infoCard}>
            <div className={infoCardHeader}>
              <span className={monoLabel}>TELEMETRY & UX ITERATION</span>
              <span className={monoBadge}>DIRECT CHANNEL</span>
            </div>
            <h2 className={infoCardTitle}>Direct Feedback Channel</h2>
            <p className={infoCardDesc}>
              fasType is continuously refined through real-world keystroke telemetry, tactile community reviews, and open feedback loops. Every issue logged directly informs our next release cycle.
            </p>
          </div>

          {/* Quick Category Cards */}
          <div className="space-y-3">
            <div className={categoryCard}>
              <div className="flex items-start gap-3">
                <div className={categoryIconWrap}>
                  <span className={categoryIcon}>bug_report</span>
                </div>
                <div>
                  <h3 className={categoryTitle}>Bug Reports</h3>
                  <p className={categoryDesc}>Encountered unexpected caret lag or key repeat issues? Let us know your browser & OS.</p>
                </div>
              </div>
            </div>

            <div className={categoryCard}>
              <div className="flex items-start gap-3">
                <div className={categoryIconWrap}>
                  <span className={categoryIcon}>tune</span>
                </div>
                <div>
                  <h3 className={categoryTitle}>Feature Requests</h3>
                  <p className={categoryDesc}>Want custom quotes, language corpora, or sound packs? We prioritize user submissions.</p>
                </div>
              </div>
            </div>

            <div className={categoryCard}>
              <div className="flex items-start gap-3">
                <div className={categoryIconWrap}>
                  <span className={categoryIcon}>groups</span>
                </div>
                <div>
                  <h3 className={categoryTitle}>General Inquiries</h3>
                  <p className={categoryDesc}>Team partnerships, open-source queries, or typing tournaments.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Response SLA Badge */}
          <div className={slaRow}>
            <div className={slaDotOuter}>
              <span className={slaDotInner}></span>
            </div>
            <div className={slaText}>
              <span className="font-semibold text-primary">Response Time SLA:</span> Average response time under 24 hours.
            </div>
          </div>

          {/* Direct Links / Endpoints */}
          <div className={linksSection}>
            <h4 className={linksTitle}>PUBLIC REPOSITORIES & HUBS</h4>
            <div className={linksGrid}>
              <a href="mailto:hello@fastype.dev" className={linkItem}>
                <span className={linkText}>Email</span>
                <span className={linkIcon}>mail</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className={linkItem}>
                <span className={linkText}>GitHub</span>
                <span className={linkIcon}>terminal</span>
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className={linkItem}>
                <span className={linkText}>Discord</span>
                <span className={linkIcon}>chat</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className={rightCol}>
          <div className={formCard}>
            {/* Success Confirmation Banner */}
            {success && (
              <div className={successBanner} id="confirmationBanner">
                <div className="flex items-start gap-3">
                  <span className={successIcon}>check_circle</span>
                  <div>
                    <div className={successTitle}>Message sent! Thanks for reaching out.</div>
                    <p className={successDesc}>We have registered your telemetry submission and will review your feedback shortly.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className={errorBanner}>
                <span className={errorIcon}>error</span>
                <div>
                  <div className={errorTitle}>Failed to send message</div>
                  <p className={errorDesc}>{error}</p>
                </div>
              </div>
            )}

            <form id="contactForm" onSubmit={handleSubmit} className={form}>
              {/* Name & Email Inputs */}
              <div className={inputGrid}>
                <div className={fieldWrapper}>
                  <label className={fieldLabel} htmlFor="contact-name">NAME *</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Alex Vance"
                    value={formData.name}
                    onChange={handleChange}
                    className={fieldInput}
                  />
                </div>

                <div className={fieldWrapper}>
                  <div className="flex items-center justify-between">
                    <label className={fieldLabel} htmlFor="contact-email">EMAIL *</label>
                    {isValidEmail && (
                      <span className={validatedBadge}>
                        <span className={validatedIcon}>verified</span> Validated
                      </span>
                    )}
                  </div>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="alex@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={fieldInput}
                  />
                </div>
              </div>

              {/* Subject Selection Pills */}
              <div className={subjectSection}>
                <label className={fieldLabel}>SUBJECT INQUIRY *</label>
                <div className={subjectPillGroup} id="subject-pill-group">
                  {[
                    { value: 'feature', label: 'Feature Suggestion' },
                    { value: 'bug', label: 'Bug Report' },
                    { value: 'corporate', label: 'Corporate/School' },
                    { value: 'other', label: 'Other' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSubjectChange(option.value)}
                      className={cn(subjectPill, formData.subject === option.value ? subjectPillActive : subjectPillInactive)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Textarea with Live Counter */}
              <div className={fieldWrapper}>
                <div className={textareaHeader}>
                  <label className={fieldLabel} htmlFor="contact-message">MESSAGE DETAILS *</label>
                  <span className={charCounter} id="charCounter">
                    {formData.message.length} / 1000 characters
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  name="message"
                  maxLength={1000}
                  rows={5}
                  required
                  placeholder="Describe your telemetry anomaly, feature thoughts, or hardware setup details (switch type, polling rate, OS)..."
                  value={formData.message}
                  onChange={handleChange}
                  className={textarea}
                ></textarea>
              </div>

              {/* System Diagnostics Environment Toggle */}
              <div className={diagnosticsBar}>
                <div className={diagnosticsText}>
                  <div className={diagnosticsIconRow}>
                    <span className={diagnosticsIcon}>memory</span>
                    <span className={diagnosticsTitle}>System Diagnostics</span>
                  </div>
                  <p className={diagnosticsDesc}>
                    Include browser environment data (<code className="font-label-mono-sm text-label-mono-sm text-primary">{envInfo}</code>) to help debug frame-drops and input latency.
                  </p>
                </div>
                <label className={toggleLabel}>
                  <input
                    type="checkbox"
                    name="includeDiagnostics"
                    checked={formData.includeDiagnostics}
                    onChange={handleChange}
                    className={toggleInput}
                  />
                  <div className={toggleTrack}></div>
                </label>
              </div>

              {/* Action Buttons & Keyboard Trigger Notice */}
              <div className={actionBar}>
                <div className={keyboardHint}>
                  <span>PRESS</span>
                  <kbd className={kbd}>Cmd</kbd>
                  <span>+</span>
                  <kbd className={kbd}>Enter</kbd>
                  <span>TO TRANSMIT</span>
                </div>
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full sm:w-auto order-1 sm:order-2"
                >
                  <span>Send Message</span>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

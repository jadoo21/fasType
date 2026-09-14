import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { contactApi } from '../services/api';

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

  // Keyboard trigger: Cmd/Ctrl + Enter to submit form
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

  // Environment info string for System Diagnostics
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
    <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-unit-2xl">
      {/* Page Header */}
      <div className="mb-unit-2xl max-w-3xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-surface-container-high border border-outline-variant text-label-mono-sm font-label-mono-sm text-on-primary-fixed-variant mb-unit-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          PRECISION FEEDBACK DISPATCH // DEV.V3.4
        </div>
        <h1 className="text-headline-lg font-headline-lg text-primary tracking-tight mb-unit-sm">Get in Touch</h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant">
          Have a question, feature suggestion, or found a bug? We love hearing from mechanical keyboard enthusiasts and fast typists.
        </p>
      </div>

      {/* Two-Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-unit-xl items-start">
        {/* Left Column: Information & Context */}
        <div className="lg:col-span-5 space-y-unit-lg">
          {/* Direct Feedback Channel Context Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-unit-sm">
              <span className="text-label-mono-sm font-label-mono-sm text-on-surface-variant">TELEMETRY & UX ITERATION</span>
              <span className="text-label-mono-sm font-label-mono-sm text-secondary bg-surface-container px-2 py-0.5 rounded">DIRECT CHANNEL</span>
            </div>
            <h2 className="text-headline-sm font-headline-sm text-primary mb-2">Direct Feedback Channel</h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
              fasType is continuously refined through real-world keystroke telemetry, tactile community reviews, and open feedback loops. Every issue logged directly informs our next release cycle.
            </p>
          </div>

          {/* Quick Category Cards */}
          <div className="space-y-3">
            <div className="p-unit-base bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-secondary transition-colors duration-150">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[18px]">bug_report</span>
                </div>
                <div>
                  <h3 className="text-body-md font-body-md font-semibold text-primary">Bug Reports</h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">Encountered unexpected caret lag or key repeat issues? Let us know your browser & OS.</p>
                </div>
              </div>
            </div>

            <div className="p-unit-base bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-secondary transition-colors duration-150">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                </div>
                <div>
                  <h3 className="text-body-md font-body-md font-semibold text-primary">Feature Requests</h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">Want custom quotes, language corpora, or sound packs? We prioritize user submissions.</p>
                </div>
              </div>
            </div>

            <div className="p-unit-base bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-secondary transition-colors duration-150">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[18px]">groups</span>
                </div>
                <div>
                  <h3 className="text-body-md font-body-md font-semibold text-primary">General Inquiries</h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">Team partnerships, open-source queries, or typing tournaments.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Response SLA Badge */}
          <div className="flex items-center gap-3 p-unit-base bg-surface-container-low border border-outline-variant rounded-xl">
            <div className="w-3 h-3 rounded-full bg-secondary flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-on-secondary"></span>
            </div>
            <div className="text-body-sm font-body-sm text-on-surface">
              <span className="font-semibold text-primary">Response Time SLA:</span> Average response time under 24 hours.
            </div>
          </div>

          {/* Direct Links / Endpoints */}
          <div className="border-t border-outline-variant pt-unit-base">
            <h4 className="text-label-mono-sm font-label-mono-sm text-on-surface-variant mb-unit-sm">PUBLIC REPOSITORIES & HUBS</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a href="mailto:hello@fastype.dev" className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant hover:border-outline text-body-sm font-body-sm text-on-surface transition-colors duration-150">
                <span className="truncate">Email</span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">mail</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant hover:border-outline text-body-sm font-body-sm text-on-surface transition-colors duration-150">
                <span className="truncate">GitHub</span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">terminal</span>
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant hover:border-outline text-body-sm font-body-sm text-on-surface transition-colors duration-150">
                <span className="truncate">Discord</span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">chat</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-unit-xl shadow-sm">
            {/* Success Confirmation Banner */}
            {success && (
              <div className="mb-unit-lg p-unit-base bg-surface-container border border-secondary rounded-xl text-on-surface transition-all duration-200" id="confirmationBanner">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                  <div>
                    <div className="font-semibold text-body-md font-body-md text-primary">Message sent! Thanks for reaching out.</div>
                    <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">We have registered your telemetry submission and will review your feedback shortly.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-unit-lg p-unit-base bg-error-container border border-error/30 rounded-xl text-on-error-container flex items-start gap-3">
                <span className="material-symbols-outlined text-error">error</span>
                <div>
                  <div className="font-semibold text-body-md font-body-md text-error font-medium">Failed to send message</div>
                  <p className="text-body-sm font-body-sm text-on-error-container mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <form id="contactForm" onSubmit={handleSubmit} className="space-y-unit-lg">
              {/* Name & Email Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-base">
                <div className="space-y-1.5">
                  <label className="block text-label-mono-sm font-label-mono-sm text-on-surface-variant" htmlFor="contact-name">NAME *</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Alex Vance"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md font-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-label-mono-sm font-label-mono-sm text-on-surface-variant" htmlFor="contact-email">EMAIL *</label>
                    {isValidEmail && (
                      <span className="text-label-mono-sm font-label-mono-sm text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">verified</span> Validated
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
                    className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md font-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  />
                </div>
              </div>

              {/* Subject Selection Pills */}
              <div className="space-y-2">
                <label className="block text-label-mono-sm font-label-mono-sm text-on-surface-variant">SUBJECT INQUIRY *</label>
                <div className="flex flex-wrap gap-2" id="subject-pill-group">
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
                      className={`subject-pill px-3 py-1.5 rounded-xl border text-body-sm font-body-sm transition-all ${
                        formData.subject === option.value
                          ? 'border-primary bg-primary text-on-primary font-medium'
                          : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:border-outline'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Textarea with Live Counter */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-label-mono-sm font-label-mono-sm text-on-surface-variant" htmlFor="contact-message">MESSAGE DETAILS *</label>
                  <span className="text-label-mono-sm font-label-mono-sm text-on-surface-variant" id="charCounter">
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
                  className="w-full p-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md font-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-y"
                ></textarea>
              </div>

              {/* System Diagnostics Environment Toggle */}
              <div className="p-unit-base rounded-xl border border-outline-variant bg-surface-container-low flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">memory</span>
                    <span className="text-body-md font-body-md font-semibold text-primary">System Diagnostics</span>
                  </div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    Include browser environment data (<code className="font-label-mono-sm text-label-mono-sm text-primary">{envInfo}</code>) to help debug frame-drops and input latency.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    name="includeDiagnostics"
                    checked={formData.includeDiagnostics}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Action Buttons & Keyboard Trigger Notice */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-label-mono-sm font-label-mono-sm text-on-surface-variant order-2 sm:order-1">
                  <span>PRESS</span>
                  <kbd className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant text-primary shadow-xs">Cmd</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant text-primary shadow-xs">Enter</kbd>
                  <span>TO TRANSMIT</span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-medium px-6 py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-100 ease-out order-1 sm:order-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4 text-on-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
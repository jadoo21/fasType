import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/80 py-8">
      <div className="container-max px-gutter-mobile md:px-gutter-desktop flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-unit-xs text-center sm:text-left">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-primary text-on-primary font-label-mono-sm text-[10px] font-bold">f_</span>
            <span className="font-headline font-bold text-sm tracking-tight text-primary">fasType</span>
          </Link>
          <div>
            <p className="text-xs text-slate-500 mt-1">Improve your typing speed, accuracy, and consistency. Built for mechanical keyboard enthusiasts.</p>
            <p className="text-[11px] font-mono text-slate-400 mt-1">© {new Date().getFullYear()} fasType. Precision typing instrument.</p>
          </div>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-unit-md text-label-mono-sm font-label-mono-sm">
          <Link
            to="/about"
            className="text-on-surface-variant hover:text-on-surface hover:text-primary transition-colors duration-150"
          >
            Philosophy
          </Link>
          <Link
            to="/contact"
            className="text-on-surface-variant hover:text-on-surface hover:text-primary transition-colors duration-150"
          >
            Feedback
          </Link>
          <Link
            to="/statistics"
            className="text-on-surface-variant hover:text-on-surface hover:text-primary transition-colors duration-150"
          >
            Open Statistics Page
          </Link>
          <a href="#privacy"
            className="text-on-surface-variant hover:text-on-surface hover:text-primary transition-colors duration-150"
          >
            Privacy
          </a>
          <a href="#terms" className="text-on-surface-variant hover:text-primary transition-colors duration-150">Terms</a>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
            <span className="status-pulse w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span> All Systems Operational
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

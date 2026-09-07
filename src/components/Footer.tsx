import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant">
      <div className="container-max px-gutter-mobile md:px-gutter-desktop py-unit-base flex flex-col md:flex-row justify-between items-center gap-unit-base w-full">
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-unit-xs text-center sm:text-left">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-on-primary font-label-mono-sm font-bold tracking-tighter">f_</span>
            <span className="font-headline font-bold text-xl tracking-tight text-primary">fasType</span>
          </Link>
          <span className="hidden sm:inline text-outline-variant">•</span>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            © {new Date().getFullYear()} fasType. Precision typing instrument. Built for mechanical keyboard enthusiasts.
          </p>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-unit-md text-label-mono-sm font-label-mono-sm">
          <a
            href="#privacy"
            className="text-on-surface-variant hover:text-on-surface hover:text-primary transition-colors duration-150"
          >
            Privacy Policy
          </a>
          <a
            href="#terms"
            className="text-on-surface-variant hover:text-on-surface hover:text-primary transition-colors duration-150"
          >
            Terms of Service
          </a>
          <a
            href="#changelog"
            className="text-on-surface-variant hover:text-on-surface hover:text-primary transition-colors duration-150"
          >
            Changelog
          </a>
          <a
            href="#shortcuts"
            className="text-on-surface-variant hover:text-on-surface hover:text-primary transition-colors duration-150"
          >
            Shortcuts
          </a>
          <a
            href="#status"
            className="flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface hover:text-primary transition-colors duration-150"
          >
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>System Status</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
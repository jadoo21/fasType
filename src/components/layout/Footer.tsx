import { Link } from 'react-router-dom';
import Brand from './Brand';

const footerLinkStyles = 'hover:text-slate-900 transition-colors';

function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/80 mt-auto py-8">
      <div className="container-max px-gutter-mobile md:px-gutter-desktop flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        <div className="text-left">
          <Brand compact showVersion={false} linkTo="/" />
          <p className="text-xs text-slate-500 mt-1">
            Improve your typing speed, accuracy and consistency. Built for mechanical keyboard enthusiasts.
          </p>
          <p className="text-[11px] font-mono text-slate-400 mt-1">
            &copy; {new Date().getFullYear()} fasType. Precision typing instrument.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600 font-mono">
          <Link to="/about" className={footerLinkStyles}>Philosophy</Link>
          <Link to="/contact" className={footerLinkStyles}>Feedback</Link>
          <a href="#privacy" className={footerLinkStyles}>Privacy</a>
          <a href="#terms" className={footerLinkStyles}>Terms</a>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
            <span className="status-pulse w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span> All Systems Operational
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

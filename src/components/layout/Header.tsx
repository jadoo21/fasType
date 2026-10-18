import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';
import Brand from './Brand';
import MobileNavigation from './MobileNavigation';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/statistics', label: 'Statistics' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const navLinkStyles = 'font-body text-sm transition-all';
const navLinkActive = 'font-semibold text-primary border-b-2 border-slate-900 pb-1';
const navLinkInactive = 'text-slate-600 hover:text-primary';

const accountLinkStyles = 'flex items-center gap-2.5 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors';
const iconButtonStyles = 'p-1.5 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors';
const logoutButtonStyles = 'p-1.5 text-slate-600 hover:text-error hover:bg-rose-50 rounded-lg transition-colors';
const loginLinkStyles = 'px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-primary transition-colors';
const signupLinkStyles = 'px-4 py-1.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-slate-800 transition-all subtle-shadow';
const hamburgerButtonStyles = 'md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant/80 sticky top-0 z-40">
      <div className="container-max px-gutter-mobile md:px-gutter-desktop h-16 flex items-center justify-between w-full">
        <Brand />

        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(navLinkStyles, isActive(link.path) ? navLinkActive : navLinkInactive)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-3">
                <Link to="/statistics" className={accountLinkStyles}>
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left">
                    <span className="font-headline text-xs font-semibold text-slate-900 block leading-tight">
                      {user.username || 'User'}
                    </span>
                    <span className="font-mono text-[10px] text-indigo-700 font-medium leading-tight">
                      {user.bestWpm || 0} WPM
                    </span>
                  </div>
                </Link>
                <Link
                  to="/statistics"
                  className={iconButtonStyles}
                  title="Profile / Dashboard"
                >
                  <span className="material-symbols-outlined text-[20px]">account_circle</span>
                </Link>
                <button
                  onClick={() => void logout()}
                  className={logoutButtonStyles}
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className={loginLinkStyles}>
                  Login
                </Link>
                <Link to="/signup" className={signupLinkStyles}>
                  Sign Up
                </Link>
              </div>
            </>
          )}

          <button
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            className={hamburgerButtonStyles}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      <MobileNavigation
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        navLinks={navLinks}
        isActive={isActive}
      />
    </header>
  );
}

export default Header;

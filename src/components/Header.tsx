import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/statistics', label: 'Statistics' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant/80 sticky top-0 z-40">
      <div className="container-max px-gutter-mobile md:px-gutter-desktop h-16 flex items-center justify-between w-full">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center gap-2 group text-primary">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-mono font-bold shadow-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[18px]">keyboard</span>
            </div>
            <span className="font-headline font-bold text-xl tracking-tight text-primary">fasType</span>
          </Link>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] tracking-wide border border-slate-200">
            v2.4
          </span>
        </div>

        {/* Desktop Primary Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-body text-sm transition-all ${
                isActive(link.path)
                  ? 'font-semibold text-primary border-b-2 border-slate-900 pb-1'
                  : 'text-slate-600 hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Action Cluster */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Authenticated State */}
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/statistics"
                  className="flex items-center gap-2.5 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
                >
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
                  className="p-1.5 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                  title="Profile / Dashboard"
                >
                  <span className="material-symbols-outlined text-[20px]">account_circle</span>
                </Link>
                <button
                  onClick={() => void logout()}
                  className="p-1.5 text-slate-600 hover:text-error hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Anonymous State */}
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-slate-800 transition-all subtle-shadow"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}

          {/* Mobile Hamburger Button */}
          <button
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      {isOpen && (
        <div id="mobile-navigation" className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                isActive(link.path)
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">v2.4</span>
            <div className="flex items-center gap-2">
              {user ? (
                <button
                  onClick={() => {
                    void logout();
                    setIsOpen(false);
                  }}
                  className="text-xs font-semibold px-2.5 py-1 rounded bg-rose-50 text-rose-700"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 text-white"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

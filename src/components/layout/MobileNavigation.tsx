import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NavLink {
  path: string;
  label: string;
}

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  isActive: (path: string) => boolean;
}

function MobileNavigation({ isOpen, onClose, navLinks, isActive }: MobileNavigationProps) {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div id="mobile-navigation" className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          onClick={onClose}
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
                onClose();
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded bg-rose-50 text-rose-700"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={onClose}
                className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={onClose}
                className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 text-white"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileNavigation;

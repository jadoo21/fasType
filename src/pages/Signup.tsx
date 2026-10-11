import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../utils/cn';
import { Button } from '../components/common';

const page = 'w-full max-w-lg mx-auto px-4 py-10 md:py-12 relative';
const bgPattern = 'absolute inset-0 -z-10 pointer-events-none opacity-[0.035] bg-[radial-gradient(#0b1c30_1px,transparent_1px)] [background-size:24px_24px]';
const card = 'bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] space-y-5';
const headerIcon = 'w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-2 font-mono font-bold';
const headerTitle = 'text-2xl font-headline font-bold text-slate-900';
const headerSubtitle = 'text-xs text-slate-500';
const errorAlert = 'p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2';
const fieldWrapper = 'space-y-1.5';
const fieldLabel = 'block font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase';
const fieldInput = 'w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all';
const passwordToggle = 'absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface transition-colors';
const footer = 'text-center pt-2 border-t border-slate-100 text-xs text-slate-600';

const passwordStrengthColors = {
  strong: 'text-emerald-600',
  medium: 'text-amber-600',
  weak: 'text-rose-600',
} as const;

const passwordStrengthBarColors = {
  strong: 'bg-emerald-500',
  medium: 'bg-amber-500',
  weak: 'bg-rose-500',
} as const;

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      if (value.length >= 12 && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) {
        setPasswordStrength('strong');
      } else if (value.length >= 8) {
        setPasswordStrength('medium');
      } else {
        setPasswordStrength('weak');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className={page}>
      <div className={bgPattern}></div>
      <div className={card}>
        <div className="text-center space-y-1">
          <div className={headerIcon}>
            <span className="material-symbols-outlined text-[20px]">keyboard</span>
          </div>
          <h2 className={headerTitle}>Create Your fasType Account</h2>
          <p className={headerSubtitle}>Start tracking your typing journey</p>
        </div>

        {error && (
          <div className={errorAlert}>
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className={fieldWrapper}>
            <label htmlFor="signup-username" className={fieldLabel}>USERNAME</label>
            <input
              id="signup-username"
              type="text"
              name="username"
              placeholder="alex_typist"
              value={formData.username}
              onChange={handleChange}
              required
              className={fieldInput}
            />
            {formData.username && (
              <p className="text-xs text-on-surface-variant">&#10003; Username available</p>
            )}
          </div>

          <div className={fieldWrapper}>
            <label htmlFor="signup-email" className={fieldLabel}>EMAIL</label>
            <input
              id="signup-email"
              type="email"
              name="email"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className={fieldInput}
            />
            {formData.email && (
              <p className="text-xs text-on-surface-variant">&#10003; Valid email address</p>
            )}
          </div>

          <div className={fieldWrapper}>
            <label htmlFor="signup-phone" className={fieldLabel}>PHONE (OPTIONAL)</label>
            <input
              id="signup-phone"
              type="tel"
              name="phone"
              placeholder="+1 (555) 019-2834"
              value={formData.phone}
              onChange={handleChange}
              className={fieldInput}
            />
          </div>

          <div className={fieldWrapper}>
            <label htmlFor="signup-password" className={fieldLabel}>PASSWORD</label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={cn(fieldInput, 'pr-10')}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className={passwordToggle}
              >
                <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>

            {formData.password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Strength:</span>
                  <span className={cn('font-bold', passwordStrengthColors[passwordStrength])}>
                    {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex gap-0.5">
                  <div className={cn('h-full w-1/4 rounded-sm', passwordStrengthBarColors[passwordStrength])}></div>
                  <div className={cn('h-full w-1/4 rounded-sm', passwordStrength === 'strong' ? 'bg-emerald-500' : passwordStrength === 'medium' ? 'bg-amber-500' : 'bg-slate-200')}></div>
                  <div className={cn('h-full w-1/4 rounded-sm', passwordStrength === 'strong' ? 'bg-emerald-500' : 'bg-slate-200')}></div>
                  <div className={cn('h-full w-1/4 rounded-sm', passwordStrength === 'strong' ? 'bg-emerald-500' : 'bg-slate-200')}></div>
                </div>
              </div>
            )}
          </div>

          <div className={fieldWrapper}>
            <label htmlFor="signup-confirm-password" className={fieldLabel}>CONFIRM PASSWORD</label>
            <div className="relative">
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className={cn(
                  fieldInput,
                  'pr-10',
                  passwordsMatch ? 'border-emerald-500 focus:ring-emerald-500/20' : 'focus:border-secondary focus:ring-secondary/20',
                )}
                placeholder="••••••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={passwordToggle}
              >
                <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            {formData.confirmPassword && (
              <p className={cn('text-[11px] font-medium mt-1 flex items-center gap-1', passwordsMatch ? 'text-emerald-600' : 'text-rose-600')}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          <Button type="submit" loading={loading} className="w-full mt-2">
            Create Account
          </Button>
        </form>

        <div className={footer}>
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;

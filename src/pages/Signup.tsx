import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input } from '../components/ui';

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

    // Password strength calculation
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

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 card-shadow space-y-5">
        {/* Card Header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-2 font-mono font-bold">
            <span className="material-symbols-outlined text-[20px]">keyboard</span>
          </div>
          <h2 className="text-2xl font-headline font-bold text-slate-900">Create Your fasType Account</h2>
          <p className="text-xs text-slate-500">Start tracking your typing journey</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="USERNAME"
            type="text"
            name="username"
            placeholder="alex_typist"
            value={formData.username}
            onChange={handleChange}
            required
            hint={formData.username ? '✓ Username available' : undefined}
          />

          <Input
            label="EMAIL"
            type="email"
            name="email"
            placeholder="alex@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            hint={formData.email ? '✓ Valid email address' : undefined}
          />

          <Input
            label="PHONE (OPTIONAL)"
            type="tel"
            name="phone"
            placeholder="+1 (555) 019-2834"
            value={formData.phone}
            onChange={handleChange}
          />

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase">PASSWORD</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all pr-10"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Strength:</span>
                  <span className={`font-bold ${passwordStrength === 'strong' ? 'text-emerald-600' : passwordStrength === 'medium' ? 'text-amber-600' : 'text-rose-600'}`}>
                    {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex gap-0.5">
                  <div className={`h-full w-1/4 rounded-sm ${passwordStrength === 'strong' ? 'bg-emerald-500' : passwordStrength === 'medium' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                  <div className={`h-full w-1/4 rounded-sm ${passwordStrength === 'strong' ? 'bg-emerald-500' : passwordStrength === 'medium' ? 'bg-amber-500' : 'bg-slate-200'}`}></div>
                  <div className={`h-full w-1/4 rounded-sm ${passwordStrength === 'strong' ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                  <div className={`h-full w-1/4 rounded-sm ${passwordStrength === 'strong' ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase">CONFIRM PASSWORD</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className={`w-full px-3.5 py-2.5 bg-surface-container-lowest border rounded-xl text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 transition-all pr-10 ${
                  formData.confirmPassword && formData.password === formData.confirmPassword
                    ? 'border-emerald-500 focus:ring-emerald-500/20'
                    : 'border-outline-variant focus:border-secondary focus:ring-secondary/20'
                }`}
                placeholder="••••••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            {formData.confirmPassword && (
              <p className={`text-[11px] font-medium mt-1 flex items-center gap-1 ${
                formData.password === formData.confirmPassword ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          <Button type="submit" loading={loading} className="w-full mt-2">
            Create Account
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
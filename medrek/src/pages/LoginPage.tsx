import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Language, LoginForm } from '../types';
import { AuthInput } from '../components/auth/AuthInput';
import { AuthBrandPanel } from '../components/auth/AuthBrandPanel';
import { Button } from '../components/ui/Button';
import { authAPI } from '../lib/api';
import { signInWithGoogle } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [lang, setLang] = useState<Language>('en');
  const [form, setForm] = useState<LoginForm>({ emailOrUsername: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setGoogleError('');
      const idToken = await signInWithGoogle();
      const data = await authAPI.googleLogin(idToken);
      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setGoogleError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.emailOrUsername.trim()) newErrors.emailOrUsername = lang === 'en' ? 'Required' : 'ያስፈልጋል';
    if (!form.password.trim()) newErrors.password = lang === 'en' ? 'Required' : 'ያስፈልጋል';
    else if (form.password.length < 6) newErrors.password = lang === 'en' ? 'Password must be at least 6 characters' : 'የምስጢር ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      setIsLoading(true);
      const data = await authAPI.login({ emailOrUsername: form.emailOrUsername, password: form.password });
      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setErrors({ general: err.message || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen font-sans bg-[#FAF4EC]">
      <div className="w-full md:w-1/2 h-screen overflow-y-auto bg-[#FAF4EC] flex flex-col items-center justify-center p-8 md:p-12">
        <div className="max-w-sm w-full">
          <div className="flex items-center gap-1 mb-4 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-xs text-[#9C836A] hover:text-[#4A2C00]">← {lang === 'en' ? 'Back to Medrek' : 'ወደ መድረክ ተመለስ'}</span>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl font-bold text-[#1A0F00]">{lang === 'en' ? 'Welcome back' : 'እንኳን ደህና መጡ'}</h1>
          </div>

          <AuthInput label="Email or username" labelAm="ኢሜይል ወይም የተጠቃሚ ስም" type="text" value={form.emailOrUsername} onChange={v => setForm({ ...form, emailOrUsername: v })} placeholder="Enter your email or username" placeholderAm="ኢሜይልዎን ወይም ስምዎን ያስገቡ" lang={lang} error={errors.emailOrUsername} required />
          <AuthInput label="Password" labelAm="የምስጢር ቃል" type="password" value={form.password} onChange={v => setForm({ ...form, password: v })} placeholder="Enter your password" placeholderAm="የምስጢር ቃልዎን ያስገቡ" lang={lang} error={errors.password} required />
          {errors.general && (
            <p className="text-xs text-[#C0392B] mb-3 text-center">{errors.general}</p>
          )}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.rememberMe} onChange={e => setForm({ ...form, rememberMe: e.target.checked })} className="accent-[#1A0F00]" />
              <span className="text-xs text-[#5C4A32]">{lang === 'en' ? 'Remember me' : 'አስታውሰኝ'}</span>
            </label>
            <span className="text-xs text-[#6B3F00] hover:underline cursor-pointer">{lang === 'en' ? 'Forgot password?' : 'የምስጢር ቃል ረሱ?'}</span>
          </div>
          <button className="w-full bg-[#1A0F00] text-white font-bold text-sm py-2.5 rounded-lg hover:bg-[#2E1A00] transition-colors cursor-pointer disabled:opacity-50" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? (lang === 'en' ? 'Signing in...' : 'እየገቡ...') : (lang === 'en' ? 'Log in' : 'ግባ')}
          </button>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#DDD0BE]" />
            <span className="text-xs text-[#9C836A] font-semibold">{lang === 'en' ? 'OR' : 'ወይም'}</span>
            <div className="flex-1 h-px bg-[#DDD0BE]" />
          </div>

          <button onClick={handleGoogleSignIn} disabled={googleLoading} type="button" className="w-full border border-[#DDD0BE] rounded-lg py-3 flex items-center justify-center gap-3 text-sm font-semibold text-[#1A0F00] hover:bg-white hover:border-[#A8692A] transition-colors disabled:opacity-50 bg-white">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.8 2.73v2.27h2.91c1.7-1.57 2.69-3.88 2.69-6.64z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.91-2.27c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.34C2.44 15.98 5.48 18 9 18z"/>
              <path fill="#FBBC05" d="M3.96 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.96H.96C.35 6.18 0 7.55 0 9s.35 2.82.96 4.04l3-2.33z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z"/>
            </svg>
            {googleLoading ? (lang === 'en' ? 'Signing in...' : 'እየገቡ...') : (lang === 'en' ? 'Continue with Google' : 'በGoogle ይቀጥሉ')}
          </button>

          {googleError && <p className="text-xs text-[#C0392B] text-center mt-2">{googleError}</p>}

          <div className="mt-4 text-center">
            <p className="text-sm text-[#5C4A32]">
              {lang === 'en' ? "Don't have an account? " : 'መለያ የለዎትም? '}
              <Link to="/register" className="text-[#4A2C00] font-bold hover:underline">{lang === 'en' ? 'Sign up' : 'ይመዝገቡ'}</Link>
            </p>
          </div>
        </div>
      </div>
      <AuthBrandPanel lang={lang} />
    </div>
  );
};

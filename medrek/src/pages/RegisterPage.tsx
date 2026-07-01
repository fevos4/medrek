import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Language, RegisterForm } from '../types';
import { AuthInput } from '../components/auth/AuthInput';
import { AuthBrandPanel } from '../components/auth/AuthBrandPanel';
import { RulesCheckbox } from '../components/auth/RulesCheckbox';
import { authAPI } from '../lib/api';
import { signInWithGoogle } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [lang, setLang] = useState<Language>('en');
  const [form, setForm] = useState<RegisterForm>({
    username: '', email: '', password: '', confirmPassword: '',
    agreedToRules: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
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

  const handleStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!form.username.trim()) newErrors.username = lang === 'en' ? 'Required' : 'ያስፈልጋል';
    else if (form.username.length < 3) newErrors.username = lang === 'en' ? 'At least 3 characters' : 'ቢያንስ 3 ቁምፊዎች';
    else if (/[^a-zA-Z0-9_]/.test(form.username)) newErrors.username = lang === 'en' ? 'Only letters, numbers, underscores' : 'ፊደላት፣ ቁጥሮች እና _ ብቻ';
    if (!form.email.trim()) newErrors.email = lang === 'en' ? 'Required' : 'ያስፈልጋል';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = lang === 'en' ? 'Invalid email address' : 'ልክ ያልሆነ ኢሜይል';
    if (!form.password.trim()) newErrors.password = lang === 'en' ? 'Required' : 'ያስፈልጋል';
    else if (form.password.length < 8) newErrors.password = lang === 'en' ? 'At least 8 characters' : 'ቢያንስ 8 ቁምፊዎች';
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = lang === 'en' ? 'Passwords do not match' : 'የምስጢር ቃላት አይዛመዱም';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setStep(2);
  };

  const handleRegister = async () => {
    if (!form.agreedToRules) {
      setErrors({ agreedToRules: lang === 'en' ? 'You must agree to the rules' : 'ደንቦቹን መቀበል አለብዎት' });
      return;
    }
    try {
      setIsLoading(true);
      const data = await authAPI.register({
        username: form.username,
        email: form.email,
        password: form.password
      });
      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setErrors({ general: err.message || 'Registration failed' });
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen font-sans bg-[#FAF4EC]">
      <AuthBrandPanel lang={lang} />
      <div className="w-full md:w-1/2 h-screen overflow-y-auto bg-[#FAF4EC] flex flex-col items-center justify-center p-8 md:p-12">
        <div className="max-w-sm w-full">
          <div className="flex items-center gap-1 mb-4 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-xs text-[#9C836A] hover:text-[#4A2C00]">← {lang === 'en' ? 'Back to Medrek' : 'ወደ መድረክ ተመለስ'}</span>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl font-bold text-[#1A0F00]">{lang === 'en' ? 'Join Medrek' : 'መድረክን ይቀላቀሉ'}</h1>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-[#1A0F00]' : step === 2 ? 'bg-[#6B3F00]' : 'bg-[#DDD0BE]'}`} />
              <span className="text-[10px] text-[#9C836A]">{lang === 'en' ? 'Account' : 'መለያ'}</span>
            </div>
            <div className="h-px flex-1 bg-[#DDD0BE] max-w-[32px]" />
            <div className="flex flex-col items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-[#1A0F00]' : 'bg-[#DDD0BE]'}`} />
              <span className="text-[10px] text-[#9C836A]">{lang === 'en' ? 'Rules' : 'ደንቦች'}</span>
            </div>
          </div>

          {step === 1 && (
            <>
              <AuthInput label="Username" labelAm="የተጠቃሚ ስም" type="text" value={form.username} onChange={v => setForm({ ...form, username: v })} placeholder="Choose a unique username" placeholderAm="ልዩ የተጠቃሚ ስም ይምረጡ" lang={lang} error={errors.username} hint="Only letters, numbers, and underscores. No spaces." hintAm="ፊደላት፣ ቁጥሮች እና _ ብቻ። ክፍተት አይፈቀድም።" required />
              <AuthInput label="Email address" labelAm="ኢሜይል አድራሻ" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="your@email.com" lang={lang} error={errors.email} required />
              <AuthInput label="Password" labelAm="የምስጢር ቃል" type="password" value={form.password} onChange={v => setForm({ ...form, password: v })} placeholder="Create a strong password" placeholderAm="ጠንካራ የምስጢር ቃል ይፍጠሩ" lang={lang} error={errors.password} hint="At least 8 characters" hintAm="ቢያንስ 8 ቁምፊዎች" required />
              <AuthInput label="Confirm password" labelAm="የምስጢር ቃል ያረጋግጡ" type="password" value={form.confirmPassword} onChange={v => setForm({ ...form, confirmPassword: v })} placeholder="Repeat your password" lang={lang} error={errors.confirmPassword} required />
              <button className="w-full bg-[#1A0F00] text-white font-bold text-sm py-2.5 rounded-lg hover:bg-[#2E1A00] transition-colors cursor-pointer" onClick={handleStep1}>{lang === 'en' ? 'Continue' : 'ቀጥል'}</button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-[#5C4A32] mb-4">{lang === 'en' ? 'Review and confirm your account details' : 'የመለያ ዝርዝሮችዎን ይገምግሙ እና ያረጋግጡ'}</p>
              <RulesCheckbox checked={form.agreedToRules} onChange={v => setForm({ ...form, agreedToRules: v })} lang={lang} />
              {errors.agreedToRules && <p className="text-xs text-[#C0392B] -mt-3 mb-3">{lang === 'en' ? 'You must agree to the rules to continue' : 'ለመቀጠል ደንቦቹን መቀበል ያስፈልጋል'}</p>}
              {errors.general && <p className="text-xs text-[#C0392B] mb-3 text-center">{errors.general}</p>}
              <div className="flex gap-3">
                <button className="border border-[#DDD0BE] text-[#5C4A32] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#F2E0C8] transition-colors cursor-pointer" onClick={() => setStep(1)}>{lang === 'en' ? 'Back' : 'ተመለስ'}</button>
                <button className="flex-1 bg-[#1A0F00] text-white font-bold text-sm py-2.5 rounded-lg hover:bg-[#2E1A00] transition-colors cursor-pointer disabled:opacity-50" onClick={handleRegister} disabled={isLoading}>
                  {isLoading ? (lang === 'en' ? 'Creating account...' : 'መለያ እየፈጠሩ...') : (lang === 'en' ? 'Create account' : 'መለያ ፍጠር')}
                </button>
              </div>
            </>
          )}

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
              {lang === 'en' ? 'Already have an account? ' : 'መለያ አልዎትም? '}
              <Link to="/login" className="text-[#4A2C00] font-bold hover:underline">{lang === 'en' ? 'Log in' : 'ይግቡ'}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

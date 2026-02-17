'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createWebAuthAdapter } from '@/lib/supabase/auth-adapter';
import { useAuthStore } from '@oath/ui-kit/auth/auth-store';
import type { BirthTimePrecision } from '@oath/shared/types/user';

/** 步驟：1=帳號 2=出生資料 */
type Step = 1 | 2;

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: 帳號
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // Step 2: 出生資料
  const [birthDatetime, setBirthDatetime] = useState('');
  const [birthTimezone, setBirthTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [birthPrecision, setBirthPrecision] =
    useState<BirthTimePrecision>('approximate');
  const [gender, setGender] = useState<'male' | 'female' | undefined>(
    undefined,
  );

  const handleStep1 = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError(t('auth.emailRequired'));
      return;
    }
    if (!password) {
      setError(t('auth.passwordRequired'));
      return;
    }
    if (password.length < 8) {
      setError(t('auth.passwordMinLength'));
      return;
    }
    if (password !== passwordConfirm) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    setStep(2);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const adapter = createWebAuthAdapter();
      const session = await adapter.signUp({
        email,
        password,
        birthDatetime: birthDatetime
          ? new Date(birthDatetime).toISOString()
          : new Date().toISOString(),
        birthTimezone,
        birthTimePrecision: birthPrecision,
        gender,
      });
      useAuthStore.getState().setSession(session);
      router.push('/daily');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.registerError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSkipBirth = async () => {
    setLoading(true);
    setError('');

    try {
      const adapter = createWebAuthAdapter();
      const session = await adapter.signUp({
        email,
        password,
        birthDatetime: new Date().toISOString(),
        birthTimezone,
        birthTimePrecision: 'unknown',
      });
      useAuthStore.getState().setSession(session);
      router.push('/daily');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.registerError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h1
          className="text-3xl font-bold text-center mb-2"
          style={{ color: 'var(--color-brand-primary)' }}
        >
          Oath
        </h1>
        <p
          className="text-center mb-8"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {step === 1 ? t('auth.register') : t('birth.title')}
        </p>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-6">
          <div
            className="w-8 h-1 rounded-full"
            style={{
              backgroundColor:
                'var(--color-brand-primary, #6366f1)',
            }}
          />
          <div
            className="w-8 h-1 rounded-full"
            style={{
              backgroundColor:
                step === 2
                  ? 'var(--color-brand-primary, #6366f1)'
                  : 'var(--color-border, #e5e7eb)',
            }}
          />
        </div>

        {step === 1 ? (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  borderColor: 'var(--color-border, #d1d5db)',
                  backgroundColor: 'var(--color-bg-input, #fff)',
                }}
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  borderColor: 'var(--color-border, #d1d5db)',
                  backgroundColor: 'var(--color-bg-input, #fff)',
                }}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('auth.passwordConfirm')}
              </label>
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  borderColor: 'var(--color-border, #d1d5db)',
                  backgroundColor: 'var(--color-bg-input, #fff)',
                }}
                autoComplete="new-password"
              />
            </div>

            {error && (
              <p
                className="text-sm text-center"
                style={{ color: 'var(--color-error, #dc2626)' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-medium text-white"
              style={{
                backgroundColor: 'var(--color-brand-primary, #6366f1)',
              }}
            >
              {t('common.next')}
            </button>

            <p
              className="text-center text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('auth.hasAccount')}{' '}
              <Link
                href="/login"
                className="font-medium underline"
                style={{ color: 'var(--color-brand-primary, #6366f1)' }}
              >
                {t('auth.login')}
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <p
              className="text-sm mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('birth.description')}
            </p>

            <div>
              <label
                htmlFor="birthDatetime"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('birth.datetime')}
              </label>
              <input
                id="birthDatetime"
                type="datetime-local"
                value={birthDatetime}
                onChange={(e) => setBirthDatetime(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  borderColor: 'var(--color-border, #d1d5db)',
                  backgroundColor: 'var(--color-bg-input, #fff)',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="birthTimezone"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('birth.timezone')}
              </label>
              <input
                id="birthTimezone"
                type="text"
                value={birthTimezone}
                onChange={(e) => setBirthTimezone(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  borderColor: 'var(--color-border, #d1d5db)',
                  backgroundColor: 'var(--color-bg-input, #fff)',
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('birth.precision')}
              </label>
              <div className="flex gap-2">
                {(
                  [
                    { value: 'exact', label: t('birth.precisionExact') },
                    {
                      value: 'approximate',
                      label: t('birth.precisionApproximate'),
                    },
                    { value: 'unknown', label: t('birth.precisionUnknown') },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setBirthPrecision(opt.value)}
                    className="flex-1 py-1.5 px-2 rounded-lg border text-xs"
                    style={{
                      borderColor:
                        birthPrecision === opt.value
                          ? 'var(--color-brand-primary, #6366f1)'
                          : 'var(--color-border, #d1d5db)',
                      backgroundColor:
                        birthPrecision === opt.value
                          ? 'var(--color-brand-primary-bg, #eef2ff)'
                          : 'transparent',
                      color:
                        birthPrecision === opt.value
                          ? 'var(--color-brand-primary, #6366f1)'
                          : 'var(--color-text-secondary)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('birth.gender')}
              </label>
              <div className="flex gap-2">
                {(
                  [
                    { value: 'male', label: t('birth.genderMale') },
                    { value: 'female', label: t('birth.genderFemale') },
                    { value: undefined, label: t('birth.genderSkip') },
                  ] as const
                ).map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      setGender(
                        opt.value as 'male' | 'female' | undefined,
                      )
                    }
                    className="flex-1 py-1.5 px-2 rounded-lg border text-xs"
                    style={{
                      borderColor:
                        gender === opt.value
                          ? 'var(--color-brand-primary, #6366f1)'
                          : 'var(--color-border, #d1d5db)',
                      backgroundColor:
                        gender === opt.value
                          ? 'var(--color-brand-primary-bg, #eef2ff)'
                          : 'transparent',
                      color:
                        gender === opt.value
                          ? 'var(--color-brand-primary, #6366f1)'
                          : 'var(--color-text-secondary)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p
                className="text-sm text-center"
                style={{ color: 'var(--color-error, #dc2626)' }}
              >
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-lg font-medium border"
                style={{
                  borderColor: 'var(--color-border, #d1d5db)',
                  color: 'var(--color-text-secondary)',
                }}
                disabled={loading}
              >
                {t('common.back')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg font-medium text-white disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--color-brand-primary, #6366f1)',
                }}
              >
                {loading ? '...' : t('auth.registerSubmit')}
              </button>
            </div>

            <button
              type="button"
              onClick={handleSkipBirth}
              disabled={loading}
              className="w-full text-center text-sm underline disabled:opacity-50"
              style={{ color: 'var(--color-text-muted, #9ca3af)' }}
            >
              {t('common.skip')}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

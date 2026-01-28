'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type OnboardingOverlayProps = {
  isLoggedIn: boolean;
};

const STORAGE_KEY = 'job-analysis-onboarding-done';

export default function OnboardingOverlay({ isLoggedIn }: OnboardingOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [resumeMessage, setResumeMessage] = useState('');
  const [portfolioMessage, setPortfolioMessage] = useState('');
  const [resumeLoading, setResumeLoading] = useState(false);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [extensionConfirmed, setExtensionConfirmed] = useState(false);
  const extensionUrl = useMemo(
    () => process.env.NEXT_PUBLIC_EXTENSION_URL || '',
    []
  );
  const hasExtensionUrl = Boolean(extensionUrl);

  useEffect(() => {
    if (!isLoggedIn) return;
    const done = localStorage.getItem(STORAGE_KEY) === 'true';
    setIsOpen(!done);
  }, [isLoggedIn]);

  useEffect(() => {
    if (step !== 2) {
      setExtensionConfirmed(false);
    }
  }, [step]);

  const closeOnboarding = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const handleUpload = async (type: 'resume' | 'portfolio') => {
    const file = type === 'resume' ? resumeFile : portfolioFile;
    if (!file) {
      if (type === 'resume') setResumeMessage('파일을 선택해주세요.');
      if (type === 'portfolio') setPortfolioMessage('파일을 선택해주세요.');
      return;
    }

    if (type === 'resume') {
      setResumeLoading(true);
      setResumeMessage('');
    } else {
      setPortfolioLoading(true);
      setPortfolioMessage('');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/resumes/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        if (type === 'resume') {
          setResumeMessage('이력서가 업로드되었습니다.');
          setResumeFile(null);
          const input = document.getElementById('onboard-resume-file') as HTMLInputElement | null;
          if (input) input.value = '';
        } else {
          setPortfolioMessage('포트폴리오가 업로드되었습니다.');
          setPortfolioFile(null);
          const input = document.getElementById('onboard-portfolio-file') as HTMLInputElement | null;
          if (input) input.value = '';
        }
      } else {
        const message = data.error || '업로드에 실패했습니다.';
        if (type === 'resume') setResumeMessage(message);
        else setPortfolioMessage(message);
      }
    } catch (error) {
      const message = '업로드 중 오류가 발생했습니다.';
      if (type === 'resume') setResumeMessage(message);
      else setPortfolioMessage(message);
    } finally {
      if (type === 'resume') setResumeLoading(false);
      else setPortfolioLoading(false);
    }
  };

  if (!isLoggedIn || !isOpen) return null;

  const steps = [
    {
      title: '서비스 요약',
      description:
        '이력서/포트폴리오를 올리고 채용 공고와의 적합도를 바로 확인하세요.',
    },
    {
      title: '이력서 업로드',
      description: '이력서와 포트폴리오는 한 번만 등록하면 됩니다.',
    },
    {
      title: '확장프로그램 설치',
      description:
        '채용 공고 페이지에서 분석 버튼을 눌러 리포트를 생성합니다.',
    },
    {
      title: '완료',
      description: '이제 분석을 시작할 준비가 끝났습니다.',
    },
  ];

  const canGoBack = step > 0;
  const canGoNext = step < steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center px-6">
      <div className="w-full max-w-4xl bg-white rounded-[32px] shadow-2xl p-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
              Onboarding
            </p>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              {steps[step].title}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeOnboarding}
            className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
          >
            건너뛰기
          </button>
        </div>

        <div key={`step-${step}`} className="animate-fade-slide">
          <p className="text-slate-600 text-base leading-relaxed mb-8">
            {steps[step].description}
          </p>

          <div className="grid gap-4 mb-10">
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
                  <p className="text-sm font-bold text-slate-800 mb-4">이력서 업로드</p>
                  <input
                    id="onboard-resume-file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="w-full text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleUpload('resume')}
                    disabled={resumeLoading}
                    className="mt-4 w-full py-3 rounded-xl bg-slate-900 text-white font-bold disabled:bg-slate-300"
                  >
                    {resumeLoading ? '업로드 중...' : '이력서 업로드'}
                  </button>
                  {resumeMessage && (
                    <p className="mt-3 text-xs text-slate-500">{resumeMessage}</p>
                  )}
                </div>
                <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
                  <p className="text-sm font-bold text-slate-800 mb-4">포트폴리오 업로드</p>
                  <input
                    id="onboard-portfolio-file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPortfolioFile(e.target.files?.[0] || null)}
                    className="w-full text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleUpload('portfolio')}
                    disabled={portfolioLoading}
                    className="mt-4 w-full py-3 rounded-xl bg-blue-600 text-white font-bold disabled:bg-slate-300"
                  >
                    {portfolioLoading ? '업로드 중...' : '포트폴리오 업로드'}
                  </button>
                  {portfolioMessage && (
                    <p className="mt-3 text-xs text-slate-500">{portfolioMessage}</p>
                  )}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <a
                  href={extensionUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center justify-center w-full px-5 py-3 rounded-2xl font-bold ${
                    extensionUrl
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  크롬 확장프로그램 설치
                </a>
                {hasExtensionUrl ? (
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={extensionConfirmed}
                      onChange={(e) => setExtensionConfirmed(e.target.checked)}
                    />
                    설치 완료했어요
                  </label>
                ) : (
                  <p className="text-xs text-slate-400">
                    확장프로그램 링크가 아직 설정되지 않았습니다.
                  </p>
                )}
              </div>
            )}
            {step === 3 && (
              <Link
                href="/main"
                className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold"
                onClick={closeOnboarding}
              >
                메인으로 이동
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            className={`text-xs font-black uppercase tracking-widest ${
              canGoBack ? 'text-slate-500 hover:text-slate-900' : 'text-slate-300 cursor-not-allowed'
            }`}
            disabled={!canGoBack}
          >
            이전
          </button>
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <span
                key={`dot-${index}`}
                className={`w-2 h-2 rounded-full ${
                  index === step ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          {canGoNext ? (
            <button
              type="button"
              onClick={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className={`text-xs font-black uppercase tracking-widest ${
                step === 2 && extensionUrl && !extensionConfirmed
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-900'
              }`}
              disabled={step === 2 && hasExtensionUrl && !extensionConfirmed}
            >
              다음
            </button>
          ) : (
            <button
              type="button"
              onClick={closeOnboarding}
              className="text-xs font-black uppercase tracking-widest text-slate-900"
            >
              완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

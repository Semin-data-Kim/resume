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
  const extensionUrl = useMemo(
    () => process.env.NEXT_PUBLIC_EXTENSION_URL || '',
    []
  );

  useEffect(() => {
    if (!isLoggedIn) return;
    const done = localStorage.getItem(STORAGE_KEY) === 'true';
    setIsOpen(!done);
  }, [isLoggedIn]);

  const closeOnboarding = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
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
      <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl p-10">
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

        <p className="text-slate-600 text-base leading-relaxed mb-8">
          {steps[step].description}
        </p>

        <div className="grid gap-4 mb-10">
          {step === 1 && (
            <Link
              href="/resume"
              className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold"
              onClick={() => setIsOpen(false)}
            >
              이력서/포트폴리오 업로드 하러가기
            </Link>
          )}
          {step === 2 && (
            <a
              href={extensionUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center justify-center px-5 py-3 rounded-2xl font-bold ${
                extensionUrl
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              크롬 확장프로그램 설치
            </a>
          )}
          {step === 2 && !extensionUrl && (
            <p className="text-xs text-slate-400">
              확장프로그램 링크가 아직 설정되지 않았습니다.
            </p>
          )}
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
              className="text-xs font-black uppercase tracking-widest text-slate-900"
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

'use client';

import { createClient } from '@/lib/supabase-client';

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });

    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* 1. Hero Section: 가치 제안 */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-32 md:pb-24 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-tight text-blue-600 bg-blue-50 rounded-full">
          채용공고 AI 분석
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.15]">
          한 번의 분석으로 <br />
          <span className="text-blue-600">채용 공고 AI 분석</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          내 이력서와 채용 공고를 비교해 <br className="md:hidden" />
          <strong className="font-bold text-slate-700">강점·약점·면접 전략</strong>을 한 번에 확인하세요.
        </p>

        {/* 메인 CTA */}
        <div className="flex justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-blue-200/50"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
            </svg>
            Google로 시작하기
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-400">별도의 가입 없이 3초 만에 시작하세요</p>
      </section>

      {/* 2. Process Section: 핵심 플로우 */}
      <section className="bg-slate-50 border-y border-slate-100 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">이렇게 분석해 드립니다</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6">1</div>
              <h3 className="font-bold text-lg mb-3">서류 업로드</h3>
              <p className="text-slate-500 leading-snug">이력서와 포트폴리오를 한 번만 등록해 두세요.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6">2</div>
              <h3 className="font-bold text-lg mb-3">공고에서 AI 분석</h3>
              <p className="text-slate-500 leading-snug">가고 싶은 채용 공고에서 확장 프로그램 버튼을 클릭하세요.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6">3</div>
              <h3 className="font-bold text-lg mb-3">맞춤 리포트 확인</h3>
              <p className="text-slate-500 leading-snug">합격 가능성을 높이는 면접 전략 리포트를 받아보세요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bottom CTA & Trust Point */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="max-w-md mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">지금 바로 시작해보세요</h2>
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-4 px-6 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 shadow-sm"
            >
              <svg className="w-5 h-5 fill-current text-slate-900" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
              </svg>
              Google 계정으로 로그인
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-slate-400 italic">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              분석 결과는 본인만 확인할 수 있습니다
            </div>
            <div className="hidden md:block w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              데이터는 안전하게 보호됩니다
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-slate-400 text-xs border-t border-slate-50">
        © 2026 Job Analysis AI. All rights reserved.
      </footer>
    </div>
  );
}

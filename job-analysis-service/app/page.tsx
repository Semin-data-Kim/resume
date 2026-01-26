'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';

export default function LandingPage() {
  const supabase = createClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleGoogleSignIn = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${baseUrl}/auth/callback` },
    });
    if (error) alert(error.message);
  };

  const handleProSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('pro_interests').insert({ email });
    if (error) {
      alert(error.message);
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsSubmitted(false);
      setEmail('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 relative">
      <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-32 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-100/50 blur-[120px] rounded-full -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-bold tracking-tight text-blue-700 bg-white border border-blue-100 rounded-2xl shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
          </span>
          채용공고 AI 분석 서비스
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
          합격을 결정짓는 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            AI 채용 분석 리포트
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          내 서류와 공고를 실시간 비교해{' '}
          <strong className="text-slate-900 font-semibold">강점·약점·면접 전략</strong>을
          <br className="hidden md:block" /> 단 10초 만에 확인하세요.
        </p>

        <div className="flex flex-col items-center justify-center gap-4">
          <button
            onClick={handleGoogleSignIn}
            className="group relative flex items-center justify-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-[20px] font-bold text-xl hover:bg-slate-800 transition-all shadow-2xl hover:shadow-blue-500/20 active:scale-[0.98]"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
            </svg>
            무료로 시작하기
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16 text-center">
        <p className="text-base md:text-lg text-slate-600 leading-relaxed">
          이 서비스는 채용 공고와 내 서류를 정밀하게 비교해 매칭도, 강점, 약점을 한눈에 보여주고
          면접 전략까지 자동으로 제공합니다.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              step: '01',
              title: '서류 업로드',
              desc: '이력서와 포트폴리오를 한 번만 등록하세요.',
            },
            {
              step: '02',
              title: '공고에서 AI 분석',
              desc: '채용 페이지에서 확장 프로그램 버튼을 클릭하세요.',
            },
            {
              step: '03',
              title: '맞춤 리포트 확인',
              desc: '데이터 기반 합격 전략을 즉시 제공합니다.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="group bg-white p-10 rounded-[32px] border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {item.step}
                </div>
                <span className="text-4xl font-black text-slate-100 group-hover:text-blue-50 transition-colors">
                  {item.step}
                </span>
              </div>
              <h3 className="font-bold text-xl mb-4">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed tracking-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between transition-all hover:border-slate-300">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Standard</span>
              <h3 className="text-3xl font-bold mb-2 italic">Free</h3>
              <p className="text-slate-500 mb-8 leading-snug">핵심 분석 기능을 <br />평생 무료로 이용하세요.</p>
              <ul className="space-y-4 mb-10 text-slate-600 font-medium text-sm">
                <li className="flex items-center gap-2">✓ 공고 대비 서류 매칭 분석</li>
                <li className="flex items-center gap-2">✓ 강점/약점 요약 리포트</li>
                <li className="flex items-center gap-2">✓ 최근 분석 이력 대시보드</li>
              </ul>
            </div>
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-4 border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              무료 시작
            </button>
          </div>

          <div className="bg-white p-10 rounded-[32px] border-2 border-blue-600 shadow-xl flex flex-col justify-between relative overflow-hidden transition-all hover:translate-y-[-4px]">
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest z-20">Coming Soon</div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 -z-10" />

            <div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 block">Premium</span>
              <h3 className="text-3xl font-bold mb-2 italic text-blue-600">Pro</h3>
              <p className="text-slate-500 mb-8 leading-snug">
                취업 성공률을 높이는 <br />
                <span className="text-blue-600 font-bold underline decoration-blue-200">심화 AI 피드백</span>
              </p>
              <ul className="space-y-4 mb-10 text-slate-600 font-bold text-sm">
                <li className="flex items-center gap-2 text-blue-700">✓ AI 예상 면접 질문 &amp; 답변</li>
                <li className="flex items-center gap-2 text-blue-700">✓ 자소서 항목별 커스터마이징</li>
                <li className="flex items-center gap-2 text-blue-700">✓ 실시간 합격 확률 시뮬레이터</li>
              </ul>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              50% 할인 혜택 예약하기
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl relative transition-transform duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-8 text-slate-400 hover:text-slate-600 text-2xl font-light"
            >
              ✕
            </button>

            {!isSubmitted ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-slate-900">Pro 플랜 사전 예약</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    AI 면접 질문 생성 등 심화 기능은 현재 개발 중입니다.
                    <br />
                    이메일을 남겨주시면 출시 즉시 <strong className="font-bold text-slate-700">50% 할인권</strong>을 보내드려요!
                  </p>
                </div>
                <form onSubmit={handleProSubmit} className="space-y-4">
                  <input
                    required
                    type="email"
                    placeholder="알림받을 이메일 주소"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg">
                    예약 완료하고 혜택 받기
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">예약 완료!</h2>
                <p className="text-slate-500">출시 즉시 이메일로 연락드릴게요.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="py-12 text-center text-slate-400 text-xs border-t border-slate-100 bg-white">
        © 2026 Job Analysis AI. All rights reserved.
      </footer>
    </div>
  );
}

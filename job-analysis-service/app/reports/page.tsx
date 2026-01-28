'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ReportContent() {
  const [data, setData] = useState<any>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchAndSetData = async () => {
      // 1. 우선순위: 로컬 스토리지에서 데이터 읽기 (URL 길이 제한 및 디코딩 에러 방지)
      const cached = localStorage.getItem('last_report_data');
      if (cached) {
        try {
          setData(JSON.parse(cached));
          return;
        } catch (e) {
          console.error("캐시 데이터 읽기 실패", e);
        }
      }

      // 2. 차선책: URL 파라미터 시도 (안전하게 디코딩)
      const dataParam = searchParams.get('data');
      if (dataParam) {
        try {
          const decoded = JSON.parse(decodeURIComponent(dataParam.replace(/\+/g, ' ')));
          setData(decoded);
          return;
        } catch (e) {
          console.error("URL 데이터 디코딩 실패", e);
        }
      }

      // 3. 마지막: reportId로 서버에서 조회
      const reportId = searchParams.get('reportId');
      if (reportId) {
        try {
          const response = await fetch(`/api/reports/${reportId}`);
          if (!response.ok) {
            throw new Error(`리포트 조회 실패: ${response.status}`);
          }
          const result = await response.json();
          if (result?.data) {
            setData(result.data);
          }
        } catch (e) {
          console.error('리포트 조회 실패', e);
        }
      }
    };

    fetchAndSetData();
  }, [searchParams]);

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-black text-slate-300 text-4xl animate-pulse">
      REPORT LOADING...
    </div>
  );

  const h = data.header || {};
  const a = data.career_assessment || {};

  const company = h.company_name || "회사 정보 없음";
  const title = h.job_title || "공고 제목 없음";
  const score = h.match_score || 0;
  const reason = h.match_reason || "";
  const experience = h.required_experience || "정보 없음";
  const jobUrl = h.job_url || "";

  const winningPoints = a.winning_points || a.strengths || [];
  const strategicAdvices = a.strategic_advices || a.considerations || [];
  const interview = Array.isArray(data.interview_strategy)
    ? data.interview_strategy
    : typeof data.interview_strategy === 'string'
      ? (() => {
          try {
            const parsed = JSON.parse(data.interview_strategy);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];

  const summary =
    reason && reason !== '분석 완료되었습니다.' ? reason : '요약 없음';

  const topStrengths = winningPoints
    .map((item: any) => item?.title || item)
    .filter((item: any) => Boolean(item) && item !== summary && item !== '분석 완료되었습니다.')
    .slice(0, 3);
  const topWeaknesses = strategicAdvices
    .map((item: any) => item?.topic || item?.title || item)
    .filter((item: any) => Boolean(item) && item !== summary && item !== '분석 완료되었습니다.')
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 font-sans text-slate-900 text-sm">
      <div className="max-w-5xl mx-auto space-y-8 font-bold">

        {/* 오리지널 상단 레이아웃 */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <p className="text-blue-400 font-bold mb-2 tracking-widest uppercase text-sm">{company}</p>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{title}</h1>
                <div className="flex gap-2 mt-4 font-black text-[10px] uppercase" />
              </div>
              <div className="text-left md:text-right">
                <div className="inline-block px-4 py-1 bg-blue-600 rounded-full text-[11px] font-black mb-2 uppercase tracking-widest">
                  요구 경력: {experience}
                </div>
                {jobUrl && (
                  <div className="mt-2">
                    <a
                      href={jobUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border border-white/30 hover:border-white/70 transition-all"
                    >
                      공고 보기
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-b-8 border-slate-900" />
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">매칭도</p>
              <p className="text-5xl font-black text-blue-600 leading-none">{score}%</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">강점 요약</p>
              <div className="text-sm font-bold text-slate-700 leading-relaxed">
                {topStrengths.length > 0 ? (
                  topStrengths.map((item: string, i: number) => (
                    <div key={`strength-${i}`}># {item}</div>
                  ))
                ) : (
                  <div>요약 없음</div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">약점 요약</p>
              <div className="text-sm font-bold text-slate-700 leading-relaxed">
                {topWeaknesses.length > 0 ? (
                  topWeaknesses.map((item: string, i: number) => (
                    <div key={`weakness-${i}`}># {item}</div>
                  ))
                ) : (
                  <div>요약 없음</div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-center text-sm font-bold text-slate-600">
            {summary}
          </div>
        </div>

        {/* 강점 및 보완점 (오리지널 2열 레이아웃) */}
        <div className="space-y-10">
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center uppercase tracking-tighter">🚀 강점 포인트</h3>
            <div className="space-y-4">
              {winningPoints.map((item: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm hover:border-slate-900 transition-all">
                  <h4 className="font-black text-base text-slate-900 mb-2 uppercase"># {item.title || item}</h4>
                  {item.description && <p className="text-slate-600 text-sm leading-relaxed font-bold">{item.description}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center uppercase tracking-tighter">🎯 개선 전략</h3>
            <div className="space-y-4">
              {strategicAdvices.map((item: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm">
                  <h4 className="font-black text-slate-900 mb-2 uppercase text-base"># {item.topic || item.title || item}</h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-3">
                    <p className="text-slate-700 text-sm font-bold">"{item.advice || item.defense_strategy || item.description || '분석 중'}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 면접 전략 (오리지널 다크 레이아웃) */}
        <section className="bg-slate-900 p-8 md:p-12 rounded-[3rem] text-white shadow-2xl">
          <h3 className="text-2xl font-black mb-10 uppercase tracking-tighter text-center">면접 전략</h3>
          <div className="grid gap-8">
            {interview.length === 0 && (
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center text-sm font-bold opacity-70">
                인터뷰 전략 데이터가 아직 없습니다.
              </div>
            )}
            {interview.map((item: any, i: number) => (
              <div key={i} className="border-b border-white/10 last:border-0 pb-8 last:pb-0">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-blue-500 font-black text-xl uppercase">Q{i+1}.</span>
                  <h4 className="text-lg font-black tracking-tight uppercase leading-tight">{item.question || item}</h4>
                </div>
                {item.tip && (
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10 ml-10 opacity-70">
                    <p className="text-sm font-bold">"TIP: {item.tip}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="text-center pt-8 pb-12">
          <Link href="/" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-all border-b-2 border-transparent hover:border-slate-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black text-4xl animate-pulse text-slate-300">LOADING...</div>}>
      <ReportContent />
    </Suspense>
  );
}

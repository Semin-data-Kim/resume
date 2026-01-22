import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: resumes } = user
    ? await supabase
        .from('resumes')
        .select('id, title, type, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    : { data: [] };
  const { data: reports } = user
    ? await supabase
        .from('analysis_reports')
        .select('id, job_posting_title, job_posting_company, matching_score, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
    : { data: [] };

  const latestResume = (resumes || []).find((item) => item.type !== 'portfolio');
  const latestPortfolio = (resumes || []).find((item) => item.type === 'portfolio');

  return (
    <div className="min-h-screen bg-slate-50 px-8">
      <div className="max-w-5xl mx-auto">
        <main>
          <h1 className="text-4xl font-bold text-center mb-4">
          AI 채용 공고 분석 서비스
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          이력서와 채용 공고를 AI로 분석하여 맞춤형 인사이트를 제공합니다
          </p>

          <section className="mt-12">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-2xl font-bold">이력서 관리</h2>
              <Link href="/resumes" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900">
                관리하기 →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/resumes">
                <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-500 bg-white">
                  <h3 className="text-lg font-semibold mb-2">📄 이력서</h3>
                  <p className="text-sm text-slate-600">
                    {user
                      ? latestResume
                        ? `최신 파일: ${latestResume.title}`
                        : '업로드된 파일 없음'
                      : '로그인 후 이용 가능'}
                  </p>
                </div>
              </Link>
              <Link href="/resumes">
                <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-500 bg-white">
                  <h3 className="text-lg font-semibold mb-2">🗂️ 포트폴리오</h3>
                  <p className="text-sm text-slate-600">
                    {user
                      ? latestPortfolio
                        ? `최신 파일: ${latestPortfolio.title}`
                        : '업로드된 파일 없음'
                      : '로그인 후 이용 가능'}
                  </p>
                </div>
              </Link>
            </div>
          </section>

          <section className="mt-12">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-2xl font-bold">최근 리포트</h2>
              <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900">
                전체 보기 →
              </Link>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              {!user && (
                <p className="text-slate-500 text-sm">로그인 후 리포트를 확인할 수 있습니다.</p>
              )}
              {user && reports && reports.length === 0 && (
                <p className="text-slate-500 text-sm">최근 생성된 리포트가 없습니다.</p>
              )}
              {user && reports && reports.length > 0 && (
                <div className="divide-y divide-slate-100">
                  {reports.map((report) => (
                    <div key={report.id} className="py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {report.job_posting_title || '공고 제목 없음'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {report.job_posting_company || '회사 정보 없음'} · {new Date(report.created_at).toISOString().slice(0, 10)}
                        </p>
                      </div>
                      <Link
                        href={`/reports?reportId=${report.id}`}
                        className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800"
                      >
                        보기
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

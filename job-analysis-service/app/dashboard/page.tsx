import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ReportsList from '@/components/ReportsList';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: reports } = await supabase
    .from('analysis_reports')
    .select('id, job_posting_title, job_posting_company, job_posting_url, matching_score, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const uniqueReports = (reports || []).filter((report, index, all) => {
    if (!report.job_posting_url) {
      return true;
    }
    return all.findIndex((item) => item.job_posting_url === report.job_posting_url) === index;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex justify-between items-end border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">아카이브</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 italic">내 리포트 기록</p>
          </div>
        </div>

        <ReportsList reports={uniqueReports} />
      </div>
    </div>
  );
}

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex justify-between items-end border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">Archive</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 italic">Your Career Intel Reports</p>
          </div>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black italic uppercase text-xs tracking-widest hover:bg-blue-700 transition-all">
            + New Analysis
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports?.map((report) => (
            <Link key={report.id} href={`/reports?data=${encodeURIComponent(JSON.stringify(report.analysis_data))}`} className="group">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-slate-900 transition-all shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">{report.company_name}</span>
                    <span className="text-2xl font-black italic text-slate-900 leading-none">{report.match_score}%</span>
                  </div>
                  <h3 className="text-xl font-black italic uppercase leading-tight group-hover:text-blue-600 transition-colors mb-4 line-clamp-2">
                    {report.job_title}
                  </h3>
                </div>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">
                  {new Date(report.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
          {(!reports || reports.length === 0) && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
              <p className="text-slate-400 font-black italic uppercase tracking-widest">No Analysis Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
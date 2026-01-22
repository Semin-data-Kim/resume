'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type ReportItem = {
  id: string;
  job_posting_title: string | null;
  job_posting_company: string | null;
  matching_score: number | null;
  created_at: string;
};

type SortKey = 'latest' | 'score';

type ReportsListProps = {
  reports: ReportItem[];
};

export default function ReportsList({ reports }: ReportsListProps) {
  const [sortKey, setSortKey] = useState<SortKey>('latest');

  const sortedReports = useMemo(() => {
    const cloned = [...reports];
    if (sortKey === 'score') {
      return cloned.sort((a, b) => (b.matching_score ?? 0) - (a.matching_score ?? 0));
    }
    return cloned.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [reports, sortKey]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-black italic uppercase tracking-widest"
        >
          <option value="latest">최신순</option>
          <option value="score">매칭도 높은 순</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {sortedReports.map((report) => (
          <Link key={report.id} href={`/reports?reportId=${report.id}`} className="group">
            <div className="bg-white px-6 py-5 rounded-2xl border border-slate-200 hover:border-slate-900 transition-all shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="space-y-2">
                  <p className="text-sm font-black uppercase tracking-wider text-slate-700">
                    {report.job_posting_company || '회사 정보 없음'}
                  </p>
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {report.job_posting_title || '공고 제목 없음'}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(report.created_at).toISOString().slice(0, 10)}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-2xl font-black italic text-blue-600">
                    {report.matching_score ?? 0}%
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {sortedReports.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
            <p className="text-slate-400 font-black italic uppercase tracking-widest">No Analysis Found</p>
          </div>
        )}
      </div>
    </div>
  );
}

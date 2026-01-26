'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthButton from '@/components/AuthButton';
import { usePathname } from 'next/navigation';

export default function MainHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === '/' || pathname === '/login') {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:border-slate-900 transition-all"
            aria-label="Open menu"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="w-5 h-5 text-slate-900"
            >
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <AuthButton />
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/40"
        />
        <aside
          className={`absolute left-0 top-0 h-full w-72 bg-white shadow-2xl p-6 transform transition-transform duration-200 ease-out ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black italic uppercase tracking-wider">Navigation</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900"
            >
              Close
            </button>
          </div>
          <nav className="space-y-4">
            <Link
              href="/resume"
              className="block px-4 py-3 rounded-xl border border-slate-200 font-black italic uppercase tracking-widest text-xs hover:border-slate-900 transition-all"
            >
              서류 관리
            </Link>
            <Link
              href="/dashboard"
              className="block px-4 py-3 rounded-xl border border-slate-200 font-black italic uppercase tracking-widest text-xs hover:border-slate-900 transition-all"
            >
              리포트 대시보드
            </Link>
          </nav>
        </aside>
      </div>
    </>
  );
}

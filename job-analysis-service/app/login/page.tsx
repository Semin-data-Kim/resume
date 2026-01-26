'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${baseUrl}/auth/callback` },
    });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[28px] p-10 shadow-sm text-center space-y-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Login</p>
          <h1 className="text-2xl font-black text-slate-900 mt-2">간편 로그인</h1>
          <p className="text-sm text-slate-500 mt-2">
            구글 계정으로 3초 만에 시작하세요.
          </p>
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
        >
          Google로 로그인
        </button>
        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900">
          랜딩으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

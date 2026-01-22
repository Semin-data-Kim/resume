'use client';

import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (isMounted) setUser(user);
    };
    getUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
    router.push('/login');
  };

  if (!user) {
    return (
      <button 
        onClick={() => router.push('/login')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-black italic uppercase text-xs tracking-widest hover:bg-blue-700 transition-all"
      >
        Login
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-xs font-bold text-slate-500 italic">
        로그인됨{user.email ? ` · ${user.email}` : ''}
      </span>
      <button 
        onClick={handleSignOut}
        className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-black italic uppercase text-xs tracking-widest hover:bg-slate-50 transition-all"
      >
        Logout
      </button>
    </div>
  );
}

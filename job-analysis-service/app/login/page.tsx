'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push('/dashboard');
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    });
    if (error) alert(error.message);
    else alert('Check your email for the confirmation link!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200">
        <div className="text-center">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Job Analysis</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Start your PM Career Journey</p>
        </div>
        <form onSubmit={handleSignIn} className="space-y-4">
          <input 
            type="email" placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
          />
          <input 
            type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
          />
          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black italic uppercase tracking-widest hover:bg-black transition-all">
            Sign In
          </button>
        </form>
        <button onClick={handleSignUp} className="w-full text-center text-xs text-slate-400 font-bold uppercase hover:underline">
          Create an Account
        </button>
      </div>
    </div>
  );
}
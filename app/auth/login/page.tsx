'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        router.push('/');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-violet-50">
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
        <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
        <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
      </div>

      <div className="z-10 flex justify-center items-center w-full">
        <div className="w-96 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl">
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-10 h-10 text-violet-700 mr-2" />
            <h2 className="text-2xl font-bold text-violet-900">NeuroBuddy</h2>
          </div>
          {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-violet-600 focus:outline-none transition" required />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-violet-600 focus:outline-none transition" required />
            </div>
            <button type="submit" className="w-full py-3 bg-violet-700 text-white rounded-xl hover:bg-violet-800 transition font-semibold disabled:opacity-50" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-4 text-center space-y-2">
            <Link href="/auth/ForgotPassword" className="text-sm text-violet-700 hover:underline block">Forgot Password?</Link>
            <p className="text-sm text-gray-600">Don&apos;t have an account? <Link href="/auth/register" className="text-violet-700 hover:underline font-semibold">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

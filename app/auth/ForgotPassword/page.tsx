"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Brain } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/ForgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage('Password reset link sent to your email');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-violet-50">
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
        <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
        <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
      </div>
      <div className="flex h-full w-full justify-center items-center relative z-10">
        <div className="w-96 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl">
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-10 h-10 text-violet-700 mr-2" />
            <h2 className="text-2xl font-bold text-violet-900">Forgot Password</h2>
          </div>
          {message && <p className="text-violet-700 text-center mb-4 text-sm">{message}</p>}
          {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-violet-600 focus:outline-none transition" required />
            </div>
            <button type="submit" className="w-full py-3 bg-violet-700 text-white rounded-xl hover:bg-violet-800 transition font-semibold">Send Reset Link</button>
          </form>
          <Link href="/auth/login" className="block text-center mt-4 text-sm text-violet-700 hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/ForgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage('Password reset link sent to your email');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleBackToLogin = () => {
    router.push('/auth/login');
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

      <div className="flex h-full w-full justify-center items-center relative z-10">
        <div className="w-96 p-6 bg-white rounded-xl shadow-lg z-20">
          <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

          {message && <p className="text-violet-700 text-center mb-4">{message}</p>}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full p-2 hover:border-violet-700 border-2 rounded-md mt-1"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-violet-700 text-white rounded-md hover:bg-violet-600"
            >
              Send Reset Link
            </button>
          </form>

          <button
            onClick={handleBackToLogin}
            className="w-full py-2 mt-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

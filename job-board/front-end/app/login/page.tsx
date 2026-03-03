'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Moved inside try block to catch errors
      // 2. Shortened path to work with your axios instance
      const response = await axios.post('/auth/login', { email, password });
      
      const { access_token, user } = response.data;

      if (!access_token || !user) {
        throw new Error('Invalid response from server');
      }

      // Clear old data and set new session
      localStorage.clear();
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (err: any) {
      console.error('Login error:', err);
      // This will now correctly catch 401 (Wrong password) or 404 (User not found)
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ... (Your JSX remains the same)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-slate-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="card w-full max-w-lg bg-white shadow-2xl relative z-10 rounded-3xl border-t-8 border-blue-900">
        <div className="card-body p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-900 to-blue-700 rounded-3xl mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-lg text-gray-600">Sign in to continue to your account</p>
          </div>

          {error && (
            <div className="alert alert-error mb-6 bg-red-50 border-l-4 border-red-600 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-red-600 shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800 font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-bold text-gray-900">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input input-bordered w-full pl-12 bg-gray-50 border-2 border-gray-300 focus:border-blue-900 focus:bg-white text-gray-900 text-base h-14 rounded-2xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-bold text-gray-900">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full pl-12 bg-gray-50 border-2 border-gray-300 focus:border-blue-900 focus:bg-white text-gray-900 text-base h-14 rounded-2xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="label cursor-pointer gap-2 p-0">
                <input type="checkbox" className="checkbox checkbox-sm bg-white border-2 border-gray-400 checked:border-blue-900 [--chkbg:theme(colors.blue.900)] [--chkfg:white]" />
                <span className="label-text text-gray-700 font-medium">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-900 hover:text-blue-700 font-bold hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button - COLORFUL & ROUND */}
            <button
              type="submit"
              className={`btn w-full text-white text-lg font-bold rounded-full py-4 h-auto shadow-lg transform transition-all duration-200 hover:scale-105 border-0 ${
                loading 
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-wait' 
                  : 'bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600'
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🚀 Sign In to Dashboard
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider text-gray-500 font-semibold my-8">OR</div>

          {/* Register Link - COLORFUL & ROUND */}
          <button
            onClick={() => router.push('/register')}
            className="btn w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 text-lg font-bold rounded-full py-4 h-auto shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              ✨ Create New Account
            </span>
          </button>

          {/* Back to Home - COLORFUL & ROUND */}
          <button
            onClick={() => router.push('/')}
            className="btn w-full bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white border-0 font-bold rounded-full py-3 h-auto mt-4 transform transition-all duration-200 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              🏠 Back to Home
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
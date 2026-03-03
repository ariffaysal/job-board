
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}


export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        console.log('=== DASHBOARD AUTH CHECK ===');
        console.log('Token exists:', !!token);
        console.log('Token value:', token);
        console.log('User data raw:', userData);

        if (!token || token === 'null' || token === 'undefined') {
          console.log('❌ No valid token, redirecting to login');
          setLoading(false);
          router.push('/login');
          return;
        }

        if (!userData || userData === 'null' || userData === 'undefined') {
          console.log('❌ No valid user data, redirecting to login');
          setLoading(false);
          router.push('/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        console.log('✅ Parsed user:', parsedUser);
        
        // Check if user object has required properties
        if (!parsedUser || typeof parsedUser !== 'object') {
          console.log('❌ Invalid user object');
          setLoading(false);
          router.push('/login');
          return;
        }

        if (!parsedUser.id && !parsedUser.email) {
          console.log('❌ User missing id or email');
          setLoading(false);
          router.push('/login');
          return;
        }

        console.log('✅ Auth successful, setting user');
        setUser(parsedUser);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error in checkAuth:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
        router.push('/login');
      }
    };

    // Small delay to ensure localStorage is ready
    setTimeout(checkAuth, 100);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="inline-block p-6 bg-white rounded-full shadow-2xl mb-4">
            <svg className="animate-spin h-16 w-16 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-xl font-semibold text-gray-700">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - Light & Friendly */}
        <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-3xl shadow-xl border-t-4 border-blue-400">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-gray-600 mt-2 text-lg">Welcome back, <span className="font-bold text-blue-600">{user.name}</span>! 👋</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 font-bold rounded-full px-8 py-3 h-auto shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              🚪 Logout
            </span>
          </button>
        </div>

        {/* User Info Card - Light & Round */}
        <div className="card bg-white shadow-xl mb-8 rounded-3xl border-l-8 border-blue-400">
          <div className="card-body p-8">
            <h2 className="card-title text-3xl text-blue-600 mb-4">
              <span className="mr-2">👤</span>
              Your Profile
            </h2>
            <div className="divider"></div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-blue-50 p-5 rounded-2xl border-l-4 border-blue-400">
                <span className="font-bold text-blue-600 w-28 text-lg">📝 Name:</span>
                <span className="text-gray-700 text-lg">{user.name}</span>
              </div>
              <div className="flex items-center gap-4 bg-purple-50 p-5 rounded-2xl border-l-4 border-purple-400">
                <span className="font-bold text-purple-600 w-28 text-lg">📧 Email:</span>
                <span className="text-gray-700 text-lg">{user.email}</span>
              </div>
              <div className="flex items-center gap-4 bg-pink-50 p-5 rounded-2xl border-l-4 border-pink-400">
                <span className="font-bold text-pink-600 w-28 text-lg">⭐ Role:</span>
                <span className="badge bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 badge-lg font-bold px-6 py-4 rounded-full text-base">{user.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Colorful Cards */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* View Agencies Card */}
            <div
              className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-105 rounded-3xl border-t-4 border-blue-400"
              onClick={() => router.push('/agencies')}
            >
              <div className="card-body p-8">
                <div className="text-6xl mb-4">🏢</div>
                <h3 className="card-title text-2xl text-blue-600 font-bold">View Agencies</h3>
                <p className="text-gray-600 text-base">Manage all your agencies</p>
                <div className="card-actions justify-end mt-6">
                  <button className="btn bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 font-bold rounded-full px-6 shadow-lg transform transition-all duration-200 hover:scale-110">
                    Go →
                  </button>
                </div>
              </div>
            </div>

            {/* Create Agency Card */}
            <div
              className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-105 rounded-3xl border-t-4 border-green-400"
              onClick={() => router.push('/agencies/add')}
            >
              <div className="card-body p-8">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="card-title text-2xl text-green-600 font-bold">Create Agency</h3>
                <p className="text-gray-600 text-base">Add a new agency</p>
                <div className="card-actions justify-end mt-6">
                  <button className="btn bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 font-bold rounded-full px-6 shadow-lg transform transition-all duration-200 hover:scale-110">
                    Go →
                  </button>
                </div>
              </div>
            </div>

            {/* Manage Clients Card */}
            <div
              className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-105 rounded-3xl border-t-4 border-purple-400"
              onClick={() => router.push('/agencies')}
            >
              <div className="card-body p-8">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="card-title text-2xl text-purple-600 font-bold">Manage Clients</h3>
                <p className="text-gray-600 text-base">View and manage clients</p>
                <div className="card-actions justify-end mt-6">
                  <button className="btn bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 font-bold rounded-full px-6 shadow-lg transform transition-all duration-200 hover:scale-110">
                    Go →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section - Light & Friendly */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">📊 Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Type Stat */}
            <div className="card bg-white shadow-xl rounded-3xl border-t-4 border-blue-400">
              <div className="card-body p-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-5xl">🎯</div>
                  <div className="badge bg-blue-100 text-blue-600 border-0 font-bold px-4 py-3 rounded-full">Active</div>
                </div>
                <div className="text-sm font-bold text-gray-500 uppercase mb-2">Account Type</div>
                <div className="text-4xl font-bold text-blue-600 mb-2">{user.role}</div>
                <div className="text-gray-500 font-semibold">Active account</div>
              </div>
            </div>

            {/* Email Stat */}
            <div className="card bg-white shadow-xl rounded-3xl border-t-4 border-purple-400">
              <div className="card-body p-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-5xl">📧</div>
                  <div className="badge bg-green-100 text-green-600 border-0 font-bold px-4 py-3 rounded-full">✓ Verified</div>
                </div>
                <div className="text-sm font-bold text-gray-500 uppercase mb-2">Email Address</div>
                <div className="text-xl font-bold text-purple-600 mb-2 break-all">{user.email}</div>
                <div className="text-gray-500 font-semibold">Verified & secure</div>
              </div>
            </div>

            {/* Status Stat */}
            <div className="card bg-white shadow-xl rounded-3xl border-t-4 border-pink-400">
              <div className="card-body p-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-5xl">💼</div>
                  <div className="badge bg-green-100 text-green-600 border-0 font-bold px-4 py-3 rounded-full">● Online</div>
                </div>
                <div className="text-sm font-bold text-gray-500 uppercase mb-2">System Status</div>
                <div className="text-4xl font-bold text-pink-600 mb-2">Active</div>
                <div className="text-gray-500 font-semibold">All systems operational</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
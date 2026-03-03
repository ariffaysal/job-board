
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { Agency } from '@/app/types';

export default function AgenciesPage() {
  const router = useRouter();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      // Logic unchanged: axios automatically uses the baseURL from your lib file
      const response = await axios.get('/agency');
      setAgencies(response.data);
    } 
    
    catch (err) {
      console.error('Failed to fetch agencies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <svg className="animate-spin h-16 w-16 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-3xl shadow-xl border-t-4 border-blue-400">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              All Agencies
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage all your agencies in one place
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push('/agencies/add')}
              className="btn bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 font-bold rounded-full px-8 shadow-lg transition-all hover:scale-105"
            >
              ✨ Create Agency
            </button>

            <button
              onClick={handleLogout}
              className="btn bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 font-bold rounded-full px-8 shadow-lg transition-all hover:scale-105"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Empty State */}
        {agencies.length === 0 ? (
          <div className="card bg-white shadow-xl rounded-3xl border-l-8 border-blue-400">
            <div className="card-body text-center py-20">
              <div className="text-7xl mb-4">🏢</div>
              <h3 className="text-3xl font-bold text-blue-600 mb-3">
                No Agencies Yet
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Create your first agency to get started!
              </p>
              <button
                onClick={() => router.push('/agencies/add')}
                className="btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 font-bold rounded-full px-10 py-4 shadow-lg transition-all hover:scale-110"
              >
                🚀 Create First Agency
              </button>
            </div>
          </div>
        ) : (

          /* Agencies Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencies.map((agency) => (
              <div
                key={agency.id}
                onClick={() => router.push(`/agency/${agency.id}`)}
                className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-105 rounded-3xl border-t-4 border-blue-400"
              >
                <div className="card-body p-8">

                  <div className="text-6xl mb-4">🏢</div>

                  <h2 className="text-2xl font-bold text-blue-600 mb-1">
                    {agency.name}
                  </h2>

                  <p className="text-gray-600 break-all">
                    {agency.email}
                  </p>

                  {agency.createdAt && (
                    <p className="text-sm text-gray-400 mt-3">
                      📅 Created: {new Date(agency.createdAt).toLocaleDateString()}
                    </p>
                  )}

                  <div className="card-actions justify-end mt-6">
                    <button className="btn bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 font-bold rounded-full px-6 shadow-lg transition-all hover:scale-110">
                      View → 
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

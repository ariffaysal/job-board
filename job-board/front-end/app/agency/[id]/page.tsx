'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { Agency, Client } from '@/app/types';

export default function AgencyPage() {
  const params = useParams();
  const router = useRouter();
  const agencyId = params.id as string;

  const [agency, setAgency] = useState<Agency | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (agencyId) fetchData();
  }, [agencyId]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // CLEANED: Using relative paths with your custom axios instance
      const [agencyResponse, clientsResponse] = await Promise.all([
        axios.get(`/agency/${agencyId}`),
        axios.get(`/agency/${agencyId}/clients`)
      ]);

      setAgency(agencyResponse.data);
      setClients(clientsResponse.data);
    } catch (err: any) {
      console.error('Failed to load agency data:', err);
      setError(err.response?.data?.message || 'Failed to load agency data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <svg className="animate-spin h-16 w-16 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center border-l-8 border-red-400">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-red-600 text-lg mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={fetchData}
              className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full px-8 shadow-lg"
            >
              Retry
            </button>
            <button
              onClick={() => router.push('/agencies')}
              className="btn bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full px-8 shadow-lg"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!agency) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Agency Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-3xl shadow-xl border-t-4 border-blue-400">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {agency.name}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">{agency.email}</p>
          </div>

          <button
            onClick={() => router.push('/agencies')}
            className="btn bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-full px-8 shadow-lg hover:scale-105 transition"
          >
            ← Back
          </button>
        </div>

        {/* Clients Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            👥 Clients
          </h2>

          <button
            onClick={() => router.push(`/agency/${agencyId}/add`)}
            className="btn bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full px-8 shadow-lg hover:scale-105 transition"
          >
            ➕ Add Client
          </button>
        </div>

        {/* Empty Clients */}
        {clients.length === 0 ? (
          <div className="card bg-white shadow-xl rounded-3xl border-l-8 border-blue-400">
            <div className="card-body text-center py-20">
              <div className="text-7xl mb-4">📭</div>
              <h3 className="text-3xl font-bold text-blue-600 mb-3">
                No Clients Yet
              </h3>
              <p className="text-gray-600 mb-8">
                Add your first client to get started
              </p>
              <button
                onClick={() => router.push(`/agency/${agencyId}/add`)}
                className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-10 py-4 shadow-lg hover:scale-110 transition"
              >
                Add First Client 🚀
              </button>
            </div>
          </div>
        ) : (

          /* Clients Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <div
                key={client.id}
                className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 rounded-3xl border-t-4 border-purple-400"
              >
                <div className="card-body p-8">

                  <div className="text-5xl mb-4">🏬</div>

                  <h3 className="text-2xl font-bold text-purple-600">
                    {client.companyName}
                  </h3>

                  <p className="text-gray-600 break-all">
                    {client.email}
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    ID: {client.id}
                  </p>

                  {client._count && (
                    <div className="badge bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 mt-4 px-4 py-3 rounded-full font-bold">
                      {client._count.jobs} Jobs
                    </div>
                  )}

                  <div className="card-actions justify-end mt-6 flex gap-3">
                    <button
                      onClick={() => router.push(`/clients/${client.id}/jobs`)}
                      className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full px-5 shadow-lg hover:scale-110 transition"
                    >
                      View Jobs
                    </button>

                    <button
                      onClick={() => router.push(`/clients/${client.id}/add-job`)}
                      className="btn bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full px-5 shadow-lg hover:scale-110 transition"
                    >
                      Post Job
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
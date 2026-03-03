
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Client } from '@/app/types';
import axios from '@/lib/axios';

export default function ClientPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

  const fetchClient = async () => {
    setLoading(true);
    setError('');
    
 try {
    // CLEANED: Using the relative path. 
    // Your baseURL in lib/axios.ts handles the https://...render.com part.
    const response = await axios.get(`/client/${clientId}`);
    setClient(response.data);
  } catch (err) {
    console.error('Fetch client error:', err);
  }
  


finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block p-6 bg-white rounded-full shadow-2xl mb-4">
            <svg className="animate-spin h-16 w-16 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-xl font-semibold text-gray-700">Loading Client...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Client Not Found</h2>
            <p className="text-gray-600 mb-4">The client you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/clients')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
            >
              View All Clients
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold text-gray-800">{client.companyName}</h1>
            <p className="text-xl text-gray-600 mt-2">{client.email}</p>
          </div>
          <button
            onClick={() => router.back()}
            className="btn btn-outline"
          >
            ← Back
          </button>
        </div>

        <div className="card bg-white shadow-2xl">
          <div className="card-body">
            <h2 className="card-title text-2xl">Client Details</h2>
            <div className="divider"></div>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700 w-32">Company:</span>
                <span className="text-gray-600">{client.companyName}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700 w-32">Email:</span>
                <span className="text-gray-600">{client.email}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700 w-32">Client ID:</span>
                <span className="text-gray-600">{client.id}</span>
              </div>
            </div>
            <div className="card-actions justify-end mt-6">
              <button
                onClick={() => router.push(`/clients/${clientId}/jobs`)}
                className="btn btn-primary text-white"
              >
                View Jobs
              </button>
              <button
                onClick={() => router.push(`/clients/${clientId}/add-job`)}
                className="btn btn-secondary text-white"
              >
                Post New Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
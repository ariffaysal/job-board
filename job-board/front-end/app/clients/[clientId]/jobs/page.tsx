'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary?: string;
  createdAt?: string;
}

export default function ClientJobsPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); 

  useEffect(() => {
    if (clientId) fetchJobs();
  }, [clientId]);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');


 try {
    // CLEANED: Using the relative path. 
    // Your baseURL in lib/axios.ts handles the https://...render.com part.
    const response = await axios.get(`/agency/client/${clientId}/jobs`);
    setJobs(response.data);
  } 
  
  catch (err: any) {
    console.error('Fetch jobs error:', err);
    setError(err.response?.data?.message || 'Failed to load jobs');
  } finally {
    setLoading(false);
  }};



  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return date.toLocaleDateString();
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
              onClick={fetchJobs}
              className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full px-8 shadow-lg"
            >
              Retry
            </button>
            <button
              onClick={() => router.back()}
              className="btn bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full px-8 shadow-lg"
            >
              Back
            </button>
          </div>
        </div>
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
              Job Listings
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} available
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push(`/clients/${clientId}/add-job`)}
              className="btn bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full px-8 shadow-lg hover:scale-105 transition"
            >
              ➕ Post Job
            </button>

            <button
              onClick={() => router.back()}
              className="btn bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-full px-8 shadow-lg hover:scale-105 transition"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Empty State */}
        {jobs.length === 0 ? (
          <div className="card bg-white shadow-xl rounded-3xl border-l-8 border-blue-400">
            <div className="card-body text-center py-20">
              <div className="text-7xl mb-4">📭</div>
              <h3 className="text-3xl font-bold text-blue-600 mb-3">
                No Jobs Yet
              </h3>
              <p className="text-gray-600 mb-8">
                Post your first job to start hiring
              </p>
              <button
                onClick={() => router.push(`/clients/${clientId}/add-job`)}
                className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-10 py-4 shadow-lg hover:scale-110 transition"
              >
                Post First Job 🚀
              </button>
            </div>
          </div>
        ) : (

          /* Jobs Grid */
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job, index) => (
              <div
                key={job.id}
                className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] rounded-3xl border-t-4 border-purple-400"
              >
                <div className="card-body p-8">

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="badge bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-3 rounded-full font-bold">
                          #{index + 1}
                        </span>
                        <h2 className="text-3xl font-bold text-purple-600">
                          {job.title}
                        </h2>
                      </div>

                      {job.createdAt && (
                        <p className="text-gray-500 text-sm">
                          Posted {getTimeAgo(job.createdAt)}
                        </p>
                      )}
                    </div>

                    <div className="badge bg-green-100 text-green-600 border-0 font-bold px-4 py-3 rounded-full">
                      ● Active
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl mb-5">
                    <p className="text-gray-700 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-5 rounded-2xl flex items-center gap-4 border-l-4 border-blue-400">
                      <div className="text-3xl">📍</div>
                      <div>
                        <p className="text-sm text-blue-600 font-bold">Location</p>
                        <p className="text-lg font-semibold text-gray-700">
                          {job.location}
                        </p>
                      </div>
                    </div>

                    {job.salary && (
                      <div className="bg-green-50 p-5 rounded-2xl flex items-center gap-4 border-l-4 border-green-400">
                        <div className="text-3xl">💰</div>
                        <div>
                          <p className="text-sm text-green-600 font-bold">Salary</p>
                          <p className="text-lg font-semibold text-gray-700">
                            {job.salary}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div className="flex gap-2">
                      <span className="badge badge-outline border-purple-400 text-purple-600">
                        ID: {job.id}
                      </span>
                      {job.createdAt && (
                        <span className="badge badge-outline border-slate-400 text-slate-600">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Fixed View Button */}
                    <button
                      onClick={() => router.push(`/jobs/${job.id}`)
}
                      className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full px-6 shadow-lg hover:scale-110 transition"
                    >
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


'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function AddJobPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

try {
      // CLEANED: Using the shortened path. 
      // Axios adds your Render URL from the baseURL automatically.
      await axios.post(`/agency/client/${clientId}/job`, {
        title,
        description,
        location,
        salary: salary || undefined,
      });

      setSuccess(true);
      
      // Redirect after 1 second
      setTimeout(() => {
        router.push(`/clients/${clientId}/jobs`);
      }, 1000);
      
    } catch (err: any) {
      console.error('Job posting error:', err);
      setError(err.response?.data?.message || 'Failed to post job');
      setLoading(false);
    }}
  
      

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl bg-white shadow-2xl rounded-3xl">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-blue-900">Post New Job</h2>
            <p className="text-slate-600 mt-2">Fill in the details to create a new job listing</p>
          </div>

          {error && (
            <div className="alert alert-error shadow-lg mb-4 rounded-2xl">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-blue-900 text-lg">Job Title</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Senior Software Engineer"
                className="input input-bordered w-full rounded-2xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-blue-900 text-lg">Description</span>
              </label>
              <textarea
                placeholder="Job description..."
                className="textarea textarea-bordered w-full h-32 rounded-2xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-blue-900 text-lg">Location</span>
              </label>
              <input
                type="text"
                placeholder="e.g., New York, NY"
                className="input input-bordered w-full rounded-2xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-blue-900 text-lg">Salary (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., $80,000 - $120,000"
                className="input input-bordered w-full rounded-2xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={`btn w-full text-white text-lg font-bold rounded-full py-4 h-auto shadow-lg transform transition-all duration-200 hover:scale-105 ${
                loading 
                  ? 'bg-gradient-to-r from-blue-400 to-blue-500 cursor-wait' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  ✨ Post Job
                </span>
              )}
            </button>
          </form>

          <button
            onClick={() => router.back()}
            className="btn w-full mt-4 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-bold rounded-full py-4 h-auto shadow-lg border-0 transform transition-all duration-200 hover:scale-105"
          >
            ← Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
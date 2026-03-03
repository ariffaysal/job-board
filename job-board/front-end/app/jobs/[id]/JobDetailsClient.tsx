'use client';

import { useState } from 'react';

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary?: string;
  attachment?: string;
  createdAt?: string;
  agency?: {
    name: string;
  };
}

interface JobDetailsClientProps {
  job: Job;
}

// Time formatting utility
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  return date.toLocaleDateString();
}

export default function JobDetailClient({ job }: JobDetailsClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 border-t-4 border-purple-400">
        {/* Job Header */}
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-purple-600 mb-2">{job.title}</h1>
          {job.agency?.name && (
            <p className="text-2xl text-gray-700 mb-2">{job.agency.name}</p>
          )}
          {job.createdAt && (
            <p className="text-gray-500">Posted {getTimeAgo(job.createdAt)}</p>
          )}
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
          <div 
            className="text-gray-700 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </div>

        {/* Job Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-5 rounded-2xl flex items-center gap-4 border-l-4 border-blue-400">
            <div className="text-3xl">📍</div>
            <div>
              <p className="text-sm text-blue-600 font-bold">Location</p>
              <p className="text-lg text-gray-700">{job.location}</p>
            </div>
          </div>

          {job.salary && (
            <div className="bg-green-50 p-5 rounded-2xl flex items-center gap-4 border-l-4 border-green-400">
              <div className="text-3xl">💰</div>
              <div>
                <p className="text-sm text-green-600 font-bold">Salary</p>
                <p className="text-lg text-gray-700">{job.salary}</p>
              </div>
            </div>
          )}
        </div>

        {/* Attachment */}
        {job.attachment && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Attachment</h2>
            <a
              href={`/uploads/${job.attachment}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"
            >
              📄 View Job Description File
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => window.history.back()}
            className="btn bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            ← Back to Jobs
          </button>
          
          <button
            className="btn bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
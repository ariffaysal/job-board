'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

interface Applicant {
  id: number;
  name: string;
  email: string;
  phone: string;
  experience: string;
  applicationDate: string;
  status: 'Applied' | 'Interviewing' | 'Rejected' | 'Hired';
  jobId: number;
  jobTitle: string;
  clientId: number;
}

interface ApplicantManagementTableProps {
  jobId: number;
  jobTitle: string;
  clientName: string;
}

const statusColors = {
  Applied: 'bg-blue-100 text-blue-800 border-blue-200',
  Interviewing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
  Hired: 'bg-green-100 text-green-800 border-green-200',
};

export default function ApplicantManagementTable({ 
  jobId, 
  jobTitle, 
  clientName 
}: ApplicantManagementTableProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/client/jobs/${jobId}/applicants`);
      setApplicants(response.data);
    } catch (err: any) {
      console.error('Error fetching applicants:', err);
      setError(err.response?.data?.message || 'Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicantStatus = async (applicantId: number, newStatus: string) => {
    try {
      await axios.patch(`/client/applicants/${applicantId}/status`, {
        status: newStatus,
      });
      
      // Update local state
      setApplicants(prev => 
        prev.map(applicant => 
          applicant.id === applicantId 
            ? { ...applicant, status: newStatus as Applicant['status'] }
            : applicant
        )
      );
    } catch (err: any) {
      console.error('Error updating status:', err);
      // You might want to show a toast notification here
    }
  };

  const sendEmailNotification = async (applicant: Applicant) => {
    try {
      await axios.post('/client/notifications/email', {
        to: applicant.email,
        subject: `Regarding your application for ${jobTitle}`,
        template: 'applicant-followup',
        data: {
          applicantName: applicant.name,
          clientName,
          jobTitle,
          status: applicant.status,
        },
      });
      
      // Show success message
      alert('Email sent successfully!');
    } catch (err: any) {
      console.error('Error sending email:', err);
      alert('Failed to send email. Please try again.');
    }
  };

  const createWhatsAppMessage = (applicant: Applicant) => {
    const message = `Hi ${applicant.name}, this is ${clientName} regarding your application for ${jobTitle}. I would like to discuss the next steps with you.`;
    return encodeURIComponent(message);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchApplicants}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applicants Yet</h3>
          <p className="text-gray-600">Applicants for this position will appear here once they apply.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Applicant Management</h2>
            <p className="text-sm text-gray-600 mt-1">{jobTitle} • {applicants.length} applicants</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active: {applicants.filter(a => a.status !== 'Rejected').length}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Experience
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Application Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applicants.map((applicant) => (
              <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
                    <div className="text-sm text-gray-500">{applicant.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{applicant.experience}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(applicant.applicationDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={applicant.status}
                    onChange={(e) => updateApplicantStatus(applicant.id, e.target.value)}
                    aria-label={`Application status for ${applicant.name}`}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors ${statusColors[applicant.status]}`}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Hired">Hired</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {/* WhatsApp Button */}
                    <a
                      href={`https://wa.me/${applicant.phone.replace(/[^0-9]/g, '')}?text=${createWhatsAppMessage(applicant)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                      title="Contact via WhatsApp"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 9.888-5.335 9.888-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      WhatsApp
                    </a>

                    {/* Email Button */}
                    <button
                      onClick={() => sendEmailNotification(applicant)}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      title="Send Email"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </button>

                    {/* Phone Button */}
                    <a
                      href={`tel:${applicant.phone}`}
                      className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
                      title="Call Applicant"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {applicants.length} applicants</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Active: {applicants.filter(a => a.status !== 'Rejected').length}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Rejected: {applicants.filter(a => a.status === 'Rejected').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

interface AgencyStats {
  totalClients: number;
  liveJobPostings: number;
  totalApplications: number;
  growthRate: number;
  previousMonthGrowth?: number;
}

interface StatCard {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function AgencyStatsGrid() {
  const [stats, setStats] = useState<AgencyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAgencyStats();
  }, []);

  const fetchAgencyStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/agency/analytics/summary');
      setStats(response.data);
    } catch (err: any) {
      console.error('Error fetching agency stats:', err);
      setError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getStatCards = (data: AgencyStats): StatCard[] => [
    {
      title: 'Total Managed Clients',
      value: data.totalClients.toString(),
      subtitle: 'Companies',
      icon: 'users',
      color: 'blue',
    },
    {
      title: 'Live Job Postings',
      value: data.liveJobPostings.toString(),
      subtitle: 'Active',
      icon: 'briefcase',
      color: 'green',
    },
    {
      title: 'Total Applications',
      value: formatNumber(data.totalApplications),
      subtitle: 'Received',
      icon: 'file-text',
      color: 'purple',
    },
    {
      title: 'Growth Rate',
      value: `${data.growthRate > 0 ? '+' : ''}${data.growthRate}%`,
      subtitle: 'This month',
      icon: 'trending-up',
      color: data.growthRate >= 0 ? 'emerald' : 'red',
      trend: {
        value: data.growthRate,
        isPositive: data.growthRate >= 0,
      },
    },
  ];

  const getIconSvg = (iconName: string, color: string) => {
    const colorClasses = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      emerald: 'text-emerald-600',
      red: 'text-red-600',
    };

    const icons = {
      users: (
        <svg className={`w-8 h-8 ${colorClasses[color as keyof typeof colorClasses]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      briefcase: (
        <svg className={`w-8 h-8 ${colorClasses[color as keyof typeof colorClasses]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      'file-text': (
        <svg className={`w-8 h-8 ${colorClasses[color as keyof typeof colorClasses]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      'trending-up': (
        <svg className={`w-8 h-8 ${colorClasses[color as keyof typeof colorClasses]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    };

    return icons[iconName as keyof typeof icons] || icons.users;
  };

  const getCardGradient = (color: string): string => {
    const gradients = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      emerald: 'from-emerald-500 to-emerald-600',
      red: 'from-red-500 to-red-600',
    };
    return gradients[color as keyof typeof gradients] || gradients.blue;
  };

  const getCardBgColor = (color: string): string => {
    const bgColors = {
      blue: 'bg-blue-50',
      green: 'bg-green-50',
      purple: 'bg-purple-50',
      emerald: 'bg-emerald-50',
      red: 'bg-red-50',
    };
    return bgColors[color as keyof typeof bgColors] || bgColors.blue;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
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
            onClick={fetchAgencyStats}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = getStatCards(stats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          {/* Background gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient(card.color)} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${getCardBgColor(card.color)} group-hover:scale-110 transition-transform duration-300`}>
              {getIconSvg(card.icon, card.color)}
            </div>
            {card.trend && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                card.trend.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={card.trend.isPositive ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} 
                  />
                </svg>
                {Math.abs(card.trend.value)}%
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
              {card.value}
            </h3>
            <p className="text-sm font-medium text-gray-600 mb-1">
              {card.title}
            </p>
            <p className="text-xs text-gray-500">
              {card.subtitle}
            </p>
          </div>

          {/* Subtle bottom border */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getCardGradient(card.color)} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl`}></div>
        </div>
      ))}
    </div>
  );
}

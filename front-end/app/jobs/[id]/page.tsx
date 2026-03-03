import { notFound } from 'next/navigation';
import axios from '@/lib/axios';
import { Metadata } from 'next';
import JobDetailClient from './JobDetailsClient';

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

/**
 * 1. Metadata Generation (Server-Side)
 * This ensures your job links look professional when shared on LinkedIn/Twitter.
 */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const isNumeric = /^\d+$/.test(params.id);
    const endpoint = isNumeric ? `/agency/job/${params.id}` : `/agency/job/slug/${params.id}`;
    const response = await axios.get(endpoint);
    const job: Job = response.data;

    const description = job.description
      .replace(/<[^>]*>/g, '') // Strip HTML tags for clean snippet
      .substring(0, 160)
      .trim() + (job.description.length > 160 ? '...' : '');

    return {
      title: `${job.title} | ${job.agency?.name || 'Company'} | Job Board`,
      description,
      openGraph: {
        title: `${job.title} at ${job.agency?.name || 'Company'}`,
        description,
        type: 'article',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/jobs/${params.id}`,
      },
    };
  } catch (error) {
    return {
      title: 'Job Not Found | Job Board',
    };
  }
}

/**
 * 2. Data Fetching (Server-Side)
 * Fetches the job details from your Render backend securely.
 */
async function getJob(id: string): Promise<Job> {
  try {
    const isNumeric = /^\d+$/.test(id);
    const endpoint = isNumeric ? `/agency/job/${id}` : `/agency/job/slug/${id}`;
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching job:', error);
    notFound();
  }
}

/**
 * 3. Main Page Component
 * Connects the Server data to your Client UI.
 */
export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id);

  // JSON-LD Structured Data for Google Job Search
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
      },
    },
    hiringOrganization: {
      '@type': 'Organization',
      name: job.agency?.name || 'Company',
    },
    employmentType: 'FULL_TIME',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* This is the boundary! 
          'job' data flows from the Server (this file) 
          to the Client (JobDetailClient.tsx).
      */}
      <JobDetailClient job={job} />
    </>
  );
}
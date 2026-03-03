export interface Agency {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  _count?: {
    clients: number;
  };
}

export interface Client {
  id: number;
  companyName: string;
  email: string;
  agencyId: number;
  agency?: Agency;
  _count?: {
    jobs: number;
  };
}

export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  postedAt: string;
  clientId: number;
  client?: Client;
  _count?: {
    applications: number;
  };
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  resume?: string;
}

export interface Application {
  resume: any;
  coverLetter: any;
  id: number;
  status: string;
  appliedAt: string;
  jobId: number;
  job?: Job;
  candidateId: number;
  candidate?: Candidate;
}
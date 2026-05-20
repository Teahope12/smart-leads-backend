import mongoose from 'mongoose';

export interface ILead {
  _id?: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadInput {
  name: string;
  email: string;
  status?: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
}

export interface ILeadFilters {
  status?: string;
  source?: string;
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: number;
  limit?: number;
}

export interface IPaginatedResponse {
  leads: ILead[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalLeads: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
import mongoose from 'mongoose';
import { Lead } from '../../shared/models/Lead.model';
import { ILeadInput, ILeadFilters, IPaginatedResponse } from './lead.types';

export class LeadService {
  async createLead(leadData: ILeadInput, userId: string) {
    const lead = await Lead.create({
      ...leadData,
      createdBy: new mongoose.Types.ObjectId(userId)
    });
    return lead;
  }

  async getLeads(filters: ILeadFilters, userId: string, userRole: string): Promise<IPaginatedResponse> {
    const query: any = {};
    
    // Apply filters
    if (filters.status) query.status = filters.status;
    if (filters.source) query.source = filters.source;
    
    // Non-admin users can only see their own leads
    if (userRole !== 'Admin') {
      query.createdBy = new mongoose.Types.ObjectId(userId);
    }
    
    // Search by name or email
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;
    
    // Sorting
    const sortOrder = filters.sort === 'oldest' ? 1 : -1;
    
    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email'),
      Lead.countDocuments(query)
    ]);
    
    return {
      leads: leads as any,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalLeads: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    };
  }

  async getLeadById(id: string, userId: string, userRole: string) {
    const lead = await Lead.findById(id).populate('createdBy', 'name email');
    
    if (!lead) {
      throw new Error('Lead not found');
    }
    
    // Check access
    const createdBy = lead.createdBy as any;
    if (userRole !== 'Admin' && createdBy._id.toString() !== userId) {
      throw new Error('Access denied');
    }
    
    return lead;
  }

  async updateLead(id: string, updateData: Partial<ILeadInput>, userId: string, userRole: string) {
    // First check if lead exists and user has access
    await this.getLeadById(id, userId, userRole);
    
    const lead = await Lead.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    return lead;
  }

  async deleteLead(id: string, userId: string, userRole: string) {
    // First check if lead exists and user has access
    await this.getLeadById(id, userId, userRole);
    
    await Lead.findByIdAndDelete(id);
    return { message: 'Lead deleted successfully' };
  }

  async exportLeads(filters: ILeadFilters, userId: string, userRole: string) {
    const query: any = {};
    
    if (filters.status) query.status = filters.status;
    if (filters.source) query.source = filters.source;
    if (userRole !== 'Admin') query.createdBy = new mongoose.Types.ObjectId(userId);
    
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    
    return leads;
  }
}
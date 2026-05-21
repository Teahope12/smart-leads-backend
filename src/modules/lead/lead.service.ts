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
    
    if (filters.status) query.status = filters.status;
    if (filters.source) query.source = filters.source;
    
    if (userRole !== 'Admin') {
      query.createdBy = new mongoose.Types.ObjectId(userId);
    }
    
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;
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
    
    // ✅ FIXED: Convert both to strings for proper comparison
    const createdBy = lead.createdBy as any;
    const leadOwnerId = createdBy._id.toString();
    const requestingUserId = userId.toString();
    
    console.log('🔍 Access Check:');
    console.log('  Lead Owner ID:', leadOwnerId);
    console.log('  Requesting User ID:', requestingUserId);
    console.log('  User Role:', userRole);
    
    if (userRole !== 'Admin' && leadOwnerId !== requestingUserId) {
      throw new Error('Access denied: You can only access leads you created');
    }
    
    return lead;
  }

  async updateLead(id: string, updateData: Partial<ILeadInput>, userId: string, userRole: string) {
  const lead = await Lead.findById(id);
  
  if (!lead) {
    throw new Error('Lead not found');
  }
  
  const leadOwnerId = lead.createdBy.toString();
  const requestingUserId = userId.toString();
  
  let hasPermission = false;
  
  if (userRole === 'Admin') {
    hasPermission = true;
  } else if (leadOwnerId === requestingUserId) {
    hasPermission = true;
  }
  
  if (!hasPermission) {
    throw new Error('Access denied: You can only edit leads you created');
  }
  
  // ✅ Fix the deprecation warning - use returnDocument instead of new
  const updatedLead = await Lead.findByIdAndUpdate(
    id,
    updateData,
    { 
      returnDocument: 'after',  // Replace 'new: true' with this
      runValidators: true 
    }
  ).populate('createdBy', 'name email');
  
  return updatedLead;
}

  async deleteLead(id: string, userId: string, userRole: string) {
    
    const lead = await Lead.findById(id);
    
    if (!lead) {
      throw new Error('Lead not found');
    }
    
    const leadOwnerId = lead.createdBy.toString();
    const requestingUserId = userId.toString();
    
    if (userRole !== 'Admin' && leadOwnerId !== requestingUserId) {
      throw new Error('Access denied: You can only delete leads you created');
    }
    
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
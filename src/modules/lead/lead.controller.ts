import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { LeadService } from './lead.service';

const leadService = new LeadService();

export class LeadController {
  async createLead(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const lead = await leadService.createLead(req.body, (req as any).user._id);
      
      res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        data: lead
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create lead'
      });
    }
  }

  async getLeads(req: Request, res: Response) {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        source: req.query.source as string | undefined,
        search: req.query.search as string | undefined,
        sort: req.query.sort as 'latest' | 'oldest' | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10
      };

      const result = await leadService.getLeads(
        filters,
        (req as any).user._id,
        (req as any).user.role
      );
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch leads'
      });
    }
  }

  async getLeadById(req: Request, res: Response) {
    try {
      const leadId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      
      const lead = await leadService.getLeadById(
        leadId,
        (req as any).user._id,
        (req as any).user.role
      );
      
      res.status(200).json({
        success: true,
        data: lead
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Lead not found'
      });
    }
  }

  async updateLead(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const leadId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      
      const lead = await leadService.updateLead(
        leadId,
        req.body,
        (req as any).user._id,
        (req as any).user.role
      );
      
      res.status(200).json({
        success: true,
        message: 'Lead updated successfully',
        data: lead
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update lead'
      });
    }
  }

  async deleteLead(req: Request, res: Response) {
    try {
      const leadId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      
      await leadService.deleteLead(
        leadId,
        (req as any).user._id,
        (req as any).user.role
      );
      
      res.status(200).json({
        success: true,
        message: 'Lead deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete lead'
      });
    }
  }

  async exportLeads(req: Request, res: Response) {
  try {
    const filters = {
      status: req.query.status as string | undefined,
      source: req.query.source as string | undefined,
      search: req.query.search as string | undefined,
      sort: req.query.sort as 'latest' | 'oldest' | undefined
    };

    const leads = await leadService.exportLeads(
      filters,
      (req as any).user._id,
      (req as any).user.role
    );
    
    // Convert to CSV with proper formatting
    let csvContent = 'Name,Email,Status,Source,Created By,Created At\n';
    
    leads.forEach((lead: any) => {
      const row = [
        `"${lead.name}"`,
        `"${lead.email}"`,
        lead.status,
        lead.source,
        lead.createdBy?.name ? `"${lead.createdBy.name}"` : 'Unknown',
        new Date(lead.createdAt).toLocaleString()
      ].join(',');
      csvContent += row + '\n';
    });
    
    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=leads-${Date.now()}.csv`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    
    res.status(200).send(csvContent);
  } catch (error: any) {
    console.error('Export error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to export leads'
    });
  }
}
}
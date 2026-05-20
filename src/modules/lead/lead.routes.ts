import { Router } from 'express';
import { LeadController } from './lead.controller';
import { 
  createLeadValidator, 
  updateLeadValidator, 
  leadFiltersValidator 
} from './lead.validators';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { adminOnly } from '../../shared/middleware/rbac.middleware';

const router = Router();
const leadController = new LeadController();

// All lead routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', leadFiltersValidator, leadController.getLeads);
router.get('/export', leadController.exportLeads);
router.get('/:id', leadController.getLeadById);
router.post('/', createLeadValidator, leadController.createLead);
router.put('/:id', updateLeadValidator, leadController.updateLead);
router.delete('/:id', adminOnly, leadController.deleteLead); // Only admin can delete

export const leadRoutes = router;
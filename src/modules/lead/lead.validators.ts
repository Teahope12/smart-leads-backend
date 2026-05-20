import { body, query } from 'express-validator';

export const createLeadValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('source')
    .notEmpty().withMessage('Source is required')
    .isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
  
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status')
];

export const updateLeadValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('source')
    .optional()
    .isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
  
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status')
];

export const leadFiltersValidator = [
  query('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  
  query('source')
    .optional()
    .isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
  
  query('search')
    .optional()
    .isString().trim(),
  
  query('sort')
    .optional()
    .isIn(['latest', 'oldest']).withMessage('Sort must be latest or oldest'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).toInt()
];
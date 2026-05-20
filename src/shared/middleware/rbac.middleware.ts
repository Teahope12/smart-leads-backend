import { Request, Response, NextFunction } from 'express';

export const rbacMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions'
      });
    }
    
    next();
  };
};

export const adminOnly = rbacMiddleware(['Admin']);
export const adminOrOwner = rbacMiddleware(['Admin', 'Sales User']);
import { Request, Response, NextFunction } from 'express';

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const adminAuth = req.cookies.admin_auth;

  if (!adminAuth || adminAuth !== 'authenticated') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Please login first.',
      redirect: '/admin'
    });
  }

  next();
};
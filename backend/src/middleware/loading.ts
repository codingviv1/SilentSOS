import { Request, Response, NextFunction } from 'express';

// Track loading states for each request
const loadingStates = new Map<string, boolean>();

export const setLoading = (req: Request, loading: boolean) => {
  const requestId = `${req.method}-${req.originalUrl}-${Date.now()}`;
  loadingStates.set(requestId, loading);
  
  // Clean up after 5 minutes
  setTimeout(() => {
    loadingStates.delete(requestId);
  }, 5 * 60 * 1000);
};

export const loadingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = `${req.method}-${req.originalUrl}-${Date.now()}`;
  
  // Set loading to true at the start
  setLoading(req, true);
  
  // Add loading state to response headers
  res.setHeader('X-Loading-State', 'true');
  
  // Clean up loading state when response is finished
  res.on('finish', () => {
    setLoading(req, false);
    res.removeHeader('X-Loading-State');
  });
  
  next();
};

export const getLoadingState = (req: Request): boolean => {
  const requestId = `${req.method}-${req.originalUrl}-${Date.now()}`;
  return loadingStates.get(requestId) || false;
}; 
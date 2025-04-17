import { Request, Response, NextFunction } from 'express';
import { loadingMiddleware, getLoadingState, setLoading } from '../middleware/loading';

describe('Loading Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      method: 'GET',
      originalUrl: '/api/test',
    };
    mockRes = {
      setHeader: jest.fn(),
      removeHeader: jest.fn(),
      on: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should set loading state to true when request starts', () => {
    loadingMiddleware(mockReq as Request, mockRes as Response, mockNext);
    expect(getLoadingState(mockReq as Request)).toBe(true);
  });

  it('should set loading state to false when response finishes', () => {
    loadingMiddleware(mockReq as Request, mockRes as Response, mockNext);
    
    // Simulate response finish
    const finishCallback = (mockRes.on as jest.Mock).mock.calls[0][1];
    finishCallback();
    
    expect(getLoadingState(mockReq as Request)).toBe(false);
  });

  it('should set and remove loading header', () => {
    loadingMiddleware(mockReq as Request, mockRes as Response, mockNext);
    
    expect(mockRes.setHeader).toHaveBeenCalledWith('X-Loading-State', 'true');
    
    // Simulate response finish
    const finishCallback = (mockRes.on as jest.Mock).mock.calls[0][1];
    finishCallback();
    
    expect(mockRes.removeHeader).toHaveBeenCalledWith('X-Loading-State');
  });

  it('should call next function', () => {
    loadingMiddleware(mockReq as Request, mockRes as Response, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should clean up loading state after timeout', () => {
    jest.useFakeTimers();
    
    setLoading(mockReq as Request, true);
    expect(getLoadingState(mockReq as Request)).toBe(true);
    
    jest.advanceTimersByTime(5 * 60 * 1000);
    expect(getLoadingState(mockReq as Request)).toBe(false);
    
    jest.useRealTimers();
  });
}); 
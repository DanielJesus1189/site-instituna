import "express";

declare global {
  namespace Express {
    interface Request {
      /** Set by the auth middleware for authenticated requests. */
      user?: {
        username: string;
      };
    }
  }
}

export {};

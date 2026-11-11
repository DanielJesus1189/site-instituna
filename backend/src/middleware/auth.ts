import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/** Reads the bearer token from the Authorization header, if present. */
export function getBearerToken(req: Request): string | null {
  const header = req.headers.authorization;

  if (!header) return null;

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;

  return token.trim() || null;
}

/**
 * Express middleware that requires a valid JWT in the Authorization header.
 * On success it exposes the authenticated username as `req.user`.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.JWT_SECRET || "";

  if (!secret) {
    return res
      .status(503)
      .json({ message: "Autenticação não configurada no servidor." });
  }

  const token = getBearerToken(req);

  if (!token) {
    return res.status(401).json({ message: "Autenticação necessária." });
  }

  try {
    const payload = jwt.verify(token, secret);

    if (typeof payload === "string" || !payload.sub) {
      return res.status(401).json({ message: "Sessão inválida ou expirada." });
    }

    req.user = { username: String(payload.sub) };
    return next();
  } catch {
    return res.status(401).json({ message: "Sessão inválida ou expirada." });
  }
}

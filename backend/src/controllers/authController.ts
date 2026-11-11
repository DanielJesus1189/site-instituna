import express from "express";
import jwt from "jsonwebtoken";
import { timingSafeEqual } from "node:crypto";

const DEFAULT_TOKEN_TTL_SECONDS = 8 * 60 * 60; // 8 hours

function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME || "admin";
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "";
}

function getJwtSecret(): string {
  return process.env.JWT_SECRET || "";
}

function getTokenTtlSeconds(): number {
  const configured = Number(process.env.JWT_EXPIRES_IN_SECONDS);
  return Number.isFinite(configured) && configured > 0
    ? configured
    : DEFAULT_TOKEN_TTL_SECONDS;
}

/** Constant-time string comparison to avoid leaking credentials through timing. */
function safeCompare(value: string, expected: string): boolean {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    // Compare the expected value with itself so the length mismatch still
    // takes roughly the same time as a regular comparison.
    timingSafeEqual(expectedBuffer, expectedBuffer);
    return false;
  }

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

class AuthController {
  /** POST /auth/login — exchange credentials for a JWT */
  login = (req: express.Request, res: express.Response) => {
    const secret = getJwtSecret();
    const adminPassword = getAdminPassword();

    if (!secret || !adminPassword) {
      return res
        .status(503)
        .json({ message: "Autenticação não configurada no servidor." });
    }

    const { username, password } = req.body ?? {};

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !safeCompare(username, getAdminUsername()) ||
      !safeCompare(password, adminPassword)
    ) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const adminUsername = getAdminUsername();
    const token = jwt.sign(
      { sub: adminUsername, username: adminUsername },
      secret,
      { expiresIn: getTokenTtlSeconds() },
    );

    return res.status(200).json({
      data: {
        token,
        user: { username: adminUsername },
      },
    });
  };

  /** GET /auth/me — return the authenticated user (requires auth) */
  me = (req: express.Request, res: express.Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Autenticação necessária." });
    }

    return res.status(200).json({ data: req.user });
  };
}

export default new AuthController();

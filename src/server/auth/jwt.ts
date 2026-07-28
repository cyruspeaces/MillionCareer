import { SignJWT, jwtVerify } from "jose";

const SESSION_DAYS = 30;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string;
};

export async function signSessionToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.sub !== "string" || !payload.sub) return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE_SECONDS = SESSION_DAYS * 24 * 60 * 60;

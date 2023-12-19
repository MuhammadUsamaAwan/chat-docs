import { cookies } from 'next/headers';
import { jwtVerify, SignJWT, type JWTPayload } from 'jose';

export function signToken({ id, username }: { id: string; username: string }) {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .setSubject(id)
    .sign(new TextEncoder().encode('supersecret'));
}

export async function verifyToken(token: string | undefined | null) {
  if (!token) return null;
  try {
    const user = await jwtVerify(token, new TextEncoder().encode('supersecret'));
    return user.payload as JWTPayload & { username: string };
  } catch (error) {
    return null;
  }
}

export async function getAuth() {
  return verifyToken(cookies().get('token')?.value);
}

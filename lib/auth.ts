import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual, createHash } from 'crypto';
import { promisify } from 'util';
import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

const scrypt = promisify(scryptCallback);

export const SESSION_COOKIE = 'learn-kana-session';
export const GOOGLE_OAUTH_STATE_COOKIE = 'learn-kana-google-oauth-state';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const OAUTH_STATE_MAX_AGE_SECONDS = 60 * 10;
const PASSWORD_KEY_LENGTH = 64;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type UserDocument = AuthUser & {
  _id: string;
  passwordHash?: string;
  passwordSalt?: string;
  googleId?: string;
  image?: string;
  updatedAt: string;
};

type SessionDocument = {
  _id: string;
  userId: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: Date;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

async function getUsersCollection() {
  const db = await getMongoDb();
  const collection = db.collection<UserDocument>('users');
  await collection.createIndex({ email: 1 }, { unique: true });
  await collection.createIndex({ googleId: 1 }, { unique: true, sparse: true });
  return collection;
}

async function getSessionsCollection() {
  const db = await getMongoDb();
  const collection = db.collection<SessionDocument>('sessions');
  await collection.createIndex({ tokenHash: 1 }, { unique: true });
  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  return collection;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, PASSWORD_KEY_LENGTH)) as Buffer;
  return {
    hash: derivedKey.toString('hex'),
    salt,
  };
}

export async function verifyPassword(password: string, hash: string, salt: string) {
  const derivedKey = (await scrypt(password, salt, PASSWORD_KEY_LENGTH)) as Buffer;
  const storedKey = Buffer.from(hash, 'hex');

  if (storedKey.length !== derivedKey.length) return false;
  return timingSafeEqual(storedKey, derivedKey);
}

export function validateSignupInput(name: string, email: string, password: string) {
  if (name.trim().length < 2) return 'Name must be at least 2 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must include at least one number.';
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Password must include at least one special character.';
  }
  return null;
}

export async function createUser(name: string, email: string, password: string): Promise<AuthUser> {
  const users = await getUsersCollection();
  const now = new Date().toISOString();
  const passwordResult = await hashPassword(password);
  const user: UserDocument = {
    _id: randomUUID(),
    id: randomUUID(),
    name: name.trim(),
    email: normalizeEmail(email),
    passwordHash: passwordResult.hash,
    passwordSalt: passwordResult.salt,
    createdAt: now,
    updatedAt: now,
  };
  user._id = user.id;

  await users.insertOne(user);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function findUserByEmail(email: string): Promise<UserDocument | null> {
  const users = await getUsersCollection();
  return users.findOne({ email: normalizeEmail(email) });
}

export async function createOrUpdateGoogleUser({
  googleId,
  email,
  name,
  image,
}: {
  googleId: string;
  email: string;
  name: string;
  image?: string;
}): Promise<AuthUser> {
  const users = await getUsersCollection();
  const now = new Date().toISOString();
  const normalizedEmail = normalizeEmail(email);
  const existingUser =
    (await users.findOne({ googleId })) ?? (await users.findOne({ email: normalizedEmail }));

  if (existingUser) {
    await users.updateOne(
      { _id: existingUser._id },
      {
        $set: {
          googleId,
          name: existingUser.name || name,
          image,
          updatedAt: now,
        },
      }
    );

    return {
      id: existingUser.id,
      name: existingUser.name || name,
      email: existingUser.email,
      createdAt: existingUser.createdAt,
    };
  }

  const user: UserDocument = {
    _id: randomUUID(),
    id: randomUUID(),
    name,
    email: normalizedEmail,
    googleId,
    image,
    createdAt: now,
    updatedAt: now,
  };
  user._id = user.id;

  await users.insertOne(user);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function createSession(userId: string) {
  const sessions = await getSessionsCollection();
  const token = randomBytes(32).toString('base64url');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000);

  await sessions.insertOne({
    _id: randomUUID(),
    userId,
    tokenHash: hashSessionToken(token),
    createdAt: now.toISOString(),
    expiresAt,
  });

  return {
    token,
    expiresAt,
  };
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function setGoogleOAuthStateCookie(response: NextResponse, state: string) {
  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: OAUTH_STATE_MAX_AGE_SECONDS,
  });
}

export function clearGoogleOAuthStateCookie(response: NextResponse) {
  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const sessions = await getSessionsCollection();
  const session = await sessions.findOne({
    tokenHash: hashSessionToken(token),
    expiresAt: { $gt: new Date() },
  });

  if (!session) return null;

  const users = await getUsersCollection();
  const user = await users.findOne({ _id: session.userId });
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function deleteCurrentSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return;

  const sessions = await getSessionsCollection();
  await sessions.deleteOne({ tokenHash: hashSessionToken(token) });
}

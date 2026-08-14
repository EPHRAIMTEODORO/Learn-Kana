import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';
import { UserData } from '@/types/kana';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const COLLECTION_NAME = 'userData';
const LEARNER_COOKIE = 'learn-kana-learner-id';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

type UserDataDocument = {
  _id: string;
  userData: UserData;
  createdAt: string;
  updatedAt: string;
};

function createEmptyUserData(): UserData {
  const now = new Date().toISOString();
  return {
    version: 1,
    progress: {},
    attempts: [],
    createdAt: now,
    updatedAt: now,
  };
}

function getLearnerId(request: NextRequest) {
  return request.cookies.get(LEARNER_COOKIE)?.value ?? crypto.randomUUID();
}

async function getUserDataDocumentId(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (user) {
    return {
      documentId: `user:${user.id}`,
      anonymousLearnerId: request.cookies.get(LEARNER_COOKIE)?.value,
      isAuthenticated: true,
    };
  }

  return {
    documentId: getLearnerId(request),
    anonymousLearnerId: undefined,
    isAuthenticated: false,
  };
}

function setLearnerCookie(response: NextResponse, learnerId: string) {
  response.cookies.set(LEARNER_COOKIE, learnerId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

function normalizeUserData(value: Partial<UserData> | null | undefined): UserData {
  const empty = createEmptyUserData();
  return {
    ...empty,
    ...value,
    version: 1,
    progress: value?.progress ?? {},
    attempts: value?.attempts ?? [],
    createdAt: value?.createdAt ?? empty.createdAt,
    updatedAt: value?.updatedAt ?? empty.updatedAt,
  };
}

async function getCollection() {
  const db = await getMongoDb();
  return db.collection<UserDataDocument>(COLLECTION_NAME);
}

function mongoErrorResponse(error: unknown) {
  console.error('MongoDB user data error:', error);
  return NextResponse.json(
    { error: 'MongoDB user data storage is not configured or unavailable.' },
    { status: 503 }
  );
}

export async function GET(request: NextRequest) {
  try {
    const { documentId, isAuthenticated } = await getUserDataDocumentId(request);
    const collection = await getCollection();
    const document = await collection.findOne({ _id: documentId });
    const response = NextResponse.json({
      userData: normalizeUserData(document?.userData),
    });
    if (!isAuthenticated) {
      setLearnerCookie(response, documentId);
    }
    return response;
  } catch (error) {
    return mongoErrorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { documentId, anonymousLearnerId, isAuthenticated } =
      await getUserDataDocumentId(request);
    const body = (await request.json()) as { userData?: Partial<UserData> };
    const now = new Date().toISOString();
    const userData = normalizeUserData(body.userData);
    const userDataDocument = {
      ...userData,
      updatedAt: now,
    };

    const collection = await getCollection();
    await collection.updateOne(
      { _id: documentId },
      {
        $set: {
          userData: userDataDocument,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: userData.createdAt ?? now },
      },
      { upsert: true }
    );

    if (isAuthenticated && anonymousLearnerId) {
      await collection.deleteOne({ _id: anonymousLearnerId });
    }

    const response = NextResponse.json({ userData: userDataDocument });
    if (!isAuthenticated) {
      setLearnerCookie(response, documentId);
    }
    return response;
  } catch (error) {
    return mongoErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { documentId, isAuthenticated } = await getUserDataDocumentId(request);
    const collection = await getCollection();
    await collection.deleteOne({ _id: documentId });

    const response = NextResponse.json({ userData: createEmptyUserData() });
    if (!isAuthenticated) {
      setLearnerCookie(response, documentId);
    }
    return response;
  } catch (error) {
    return mongoErrorResponse(error);
  }
}

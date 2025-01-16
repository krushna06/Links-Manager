import { NextResponse } from 'next/server';
import { auth } from '../../../lib/firebase-admin';

export async function GET() {
  try {
    const { users } = await auth.listUsers();
    const formattedUsers = users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
    }));
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}


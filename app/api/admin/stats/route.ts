import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Link from '../../../models/Link';
import { auth } from '../../../lib/firebase-admin';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // Fetch total users from Firebase
    const { users } = await auth.listUsers(1000);
    const totalUsers = users.length;

    // Fetch total links from MongoDB
    const totalLinks = await Link.countDocuments();

    console.log('Total Users:', totalUsers);
    console.log('Total Links:', totalLinks);

    return NextResponse.json({ totalUsers, totalLinks });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}


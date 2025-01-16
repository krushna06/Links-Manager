import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import Link from '../../models/Link';

export async function GET(req: NextRequest) {
  await dbConnect();
  const userId = req.nextUrl.searchParams.get('userId');
  const folderId = req.nextUrl.searchParams.get('folderId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const query: any = { user: userId };
    if (folderId) {
      query.folderId = folderId;
    }
    const links = await Link.find(query);
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();

  try {
    const newLink = await Link.create(body);
    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}


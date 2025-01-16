import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import Folder from '../../models/Folder';

export async function GET(req: NextRequest) {
  await dbConnect();
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const folders = await Folder.find({ user: userId });
    return NextResponse.json(folders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();

  try {
    const newFolder = await Folder.create(body);
    return NextResponse.json(newFolder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}


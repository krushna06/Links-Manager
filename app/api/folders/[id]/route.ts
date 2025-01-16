import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Folder from '../../../models/Folder';
import Link from '../../../models/Link';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  try {
    const folder = await Folder.findById(id);
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }
    return NextResponse.json(folder);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch folder' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  const body = await req.json();

  try {
    const updatedFolder = await Folder.findByIdAndUpdate(id, body, { new: true });
    if (!updatedFolder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }
    return NextResponse.json(updatedFolder);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  try {
    const deletedFolder = await Folder.findByIdAndDelete(id);
    if (!deletedFolder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }
    // Remove folder reference from links
    await Link.updateMany({ folderId: id }, { $set: { folderId: null } });
    return NextResponse.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
  }
}


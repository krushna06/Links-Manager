import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Link from '../../../models/Link';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  const body = await req.json();

  try {
    const updatedLink = await Link.findByIdAndUpdate(id, body, { new: true });
    if (!updatedLink) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }
    return NextResponse.json(updatedLink);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update link' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  try {
    const deletedLink = await Link.findByIdAndDelete(id);
    if (!deletedLink) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Link deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 });
  }
}


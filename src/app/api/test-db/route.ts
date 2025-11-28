import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function GET() {
  try {
    const usersCount = await prisma.user.count();
    return NextResponse.json({ status: 'success', message: 'Connected to DB', usersCount });
  } catch (error) {
    console.error('DB Connection Error:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to connect', error: String(error) }, { status: 500 });
  }
}

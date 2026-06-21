import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const ads = await prisma.advertisement.findMany({
      where: { is_active: true },
      orderBy: { display_order: 'asc' },
    });
    return NextResponse.json(ads);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const ad = await prisma.advertisement.create({ data });
    return NextResponse.json(ad);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

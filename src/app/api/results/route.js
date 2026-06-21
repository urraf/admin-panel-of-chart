import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const date = searchParams.get('date');

    const where = {};
    if (gameId) where.game_id = parseInt(gameId);
    if (date) {
      where.date = new Date(date);
    } else if (year && month) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      where.date = { gte: startDate, lte: endDate };
    }

    const results = await prisma.result.findMany({
      where,
      include: { game: true },
      orderBy: [{ date: 'asc' }, { game: { display_order: 'asc' } }],
    });
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const result = await prisma.result.upsert({
      where: {
        game_id_date: {
          game_id: parseInt(data.game_id),
          date: new Date(data.date),
        },
      },
      update: { result: data.result },
      create: {
        game_id: parseInt(data.game_id),
        date: new Date(data.date),
        result: data.result,
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

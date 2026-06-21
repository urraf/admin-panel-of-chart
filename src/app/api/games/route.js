import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      where: { is_active: true },
      orderBy: { display_order: 'asc' },
    });
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const game = await prisma.game.create({ data });

    // Automatically assign the new game to the last ChartGroup so it appears on the homepage
    const lastGroup = await prisma.chartGroup.findFirst({
      orderBy: { display_order: 'desc' }
    });
    
    if (lastGroup) {
      await prisma.chartGroupGame.create({
        data: {
          group_id: lastGroup.id,
          game_id: game.id,
          display_order: 999
        }
      });
    }

    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

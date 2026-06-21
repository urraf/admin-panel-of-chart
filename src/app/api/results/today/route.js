import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const games = await prisma.game.findMany({
      where: { is_active: true },
      orderBy: { display_order: 'asc' },
    });

    const todayResults = await prisma.result.findMany({
      where: { date: today },
    });

    const yesterdayResults = await prisma.result.findMany({
      where: { date: yesterday },
    });

    const data = games.map((game) => {
      const todayResult = todayResults.find((r) => r.game_id === game.id);
      const yesterdayResult = yesterdayResults.find((r) => r.game_id === game.id);
      return {
        ...game,
        today_result: todayResult?.result || '-',
        yesterday_result: yesterdayResult?.result || '-',
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

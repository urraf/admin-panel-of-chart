import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1));

    const chartGroups = await prisma.chartGroup.findMany({
      orderBy: { display_order: 'asc' },
      include: {
        games: {
          orderBy: { display_order: 'asc' },
          include: { game: true },
        },
      },
    });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const daysInMonth = endDate.getDate();

    const results = await prisma.result.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'asc' },
    });

    const chartData = chartGroups.map((group) => {
      const gameIds = group.games.map((g) => g.game.id);
      const gameNames = group.games.map((g) => g.game.name);

      const rows = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month - 1, day);
        const dateStr = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}`;
        const isToday = new Date().toDateString() === currentDate.toDateString();

        const dayResults = gameIds.map((gameId) => {
          const r = results.find(
            (res) => res.game_id === gameId && new Date(res.date).getDate() === day
          );
          return r ? r.result : '-';
        });

        if (currentDate <= new Date()) {
          rows.push({ date: isToday ? 'Today' : dateStr, results: dayResults });
        }
      }

      return {
        id: group.id,
        name: group.name,
        color: group.color,
        data_color: group.data_color,
        games: gameNames,
        rows,
      };
    });

    return NextResponse.json({ chartData, year, month, daysInMonth });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

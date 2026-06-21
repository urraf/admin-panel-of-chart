import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = parseInt(searchParams.get('gameid'));
    const year = parseInt(searchParams.get('year'));

    if (!gameId || !year) {
      return NextResponse.json({ error: 'Missing gameid or year' }, { status: 400 });
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const results = await prisma.result.findMany({
      where: {
        game_id: gameId,
        date: { gte: startDate, lte: endDate },
      },
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const rows = [];

    for (let day = 1; day <= 31; day++) {
      const monthData = [];
      for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
        // Check if this day is valid for this month
        const maxDaysInMonth = new Date(year, monthIdx + 1, 0).getDate();
        if (day > maxDaysInMonth) {
          monthData.push('');
          continue;
        }

        const currentDate = new Date(year, monthIdx, day);
        if (currentDate > new Date()) {
          monthData.push('');
          continue;
        }

        const r = results.find(
          res => new Date(res.date).getDate() === day && new Date(res.date).getMonth() === monthIdx
        );
        monthData.push(r ? r.result : '-');
      }
      
      const dateStr = `${String(day).padStart(2, '0')}`;
      rows.push({
        date: dateStr,
        results: monthData
      });
    }

    return NextResponse.json({ game, year, months, rows });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

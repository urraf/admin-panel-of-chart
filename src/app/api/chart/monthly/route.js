import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();
    const month = parseInt(searchParams.get('month')) || (new Date().getMonth() + 1);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const games = await prisma.game.findMany({
      orderBy: { display_order: 'asc' }
    });

    const results = await prisma.result.findMany({
      where: {
        date: { gte: startDate, lte: endDate }
      }
    });

    const maxDays = endDate.getDate();
    const rows = [];

    for (let day = 1; day <= maxDays; day++) {
      const row = {
        date: `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}`,
        results: {}
      };
      
      games.forEach(game => {
        const r = results.find(
          res => res.game_id === game.id && new Date(res.date).getDate() === day
        );
        // If the date is in the future, return empty string, else '-'
        const currentDate = new Date(year, month - 1, day);
        if (currentDate > new Date()) {
          row.results[game.id] = '';
        } else {
          row.results[game.id] = r ? r.result : '-';
        }
      });
      rows.push(row);
    }

    return NextResponse.json({ year, month, games, rows });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

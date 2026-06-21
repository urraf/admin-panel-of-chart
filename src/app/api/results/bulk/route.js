import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { results } = await request.json();
    const promises = results.map((r) =>
      prisma.result.upsert({
        where: {
          game_id_date: {
            game_id: parseInt(r.game_id),
            date: new Date(r.date),
          },
        },
        update: { result: r.result },
        create: {
          game_id: parseInt(r.game_id),
          date: new Date(r.date),
          result: r.result,
        },
      })
    );
    await Promise.all(promises);
    return NextResponse.json({ success: true, count: results.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

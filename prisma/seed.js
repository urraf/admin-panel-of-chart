const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // 1. Create Default Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: passwordHash,
    },
  });

  // 2. Site Settings
  const settings = [
    { key: 'marquee_text', value: 'B2 Satta King, A7 Satta King live result, B2-SATTA, Satta king chart, Satta king online result, Satta king online, Satta king result today, Gali result, Desawar result, Faridabad result, Gaziyabad result, Satta matka king, Satta king up, Satta king desawar, Satta king gali, Satta king 2019 chart, Satta baba king, Gali live result, Disawar live result, Satta Number, Matka Number, Satta.com, Satta Game, Gali Number, Delhi Satta king, Satta Bazar, Satta king 2017, satta king 2018, Gali Leak Number, Gali Single Jodi, Black Satta Result, Black satta king, Satta King India' },
    { key: 'hindi_text', value: 'हा भाई यही आती हे सबसे पहले खबर रूको और देखो' },
    { key: 'disclaimer', value: '!! DISCLAIMER:- This is a non-commercial website. Viewing This Website Is Your Own Risk, All The Information Shown On Website Is Sponsored And We Warn You That Gambling/Satta May Be Banned Or Illegal In Your Country..., We Are Not Responsible For Any Issues Or Scam..., We Respect All Country Rules/Laws... If You Not Agree With Our Site Disclaimer... Please Quit Our Site Right Now. Thank You.' }
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // 3. Games with EXACT IDs from original site
  const games = [
    { id: 156, name: 'P.K BAZAR', time: '08:30 AM', display_order: 1 },
    { id: 35, name: 'Neelkanth', time: '09:30 AM', display_order: 2 },
    { id: 189, name: 'NAGPUR', time: '10:30 AM', display_order: 3 },
    { id: 99, name: 'JAIPUR CITY', time: '11:30 AM', display_order: 4 },
    { id: 108, name: 'B2 SATTA', time: '12:30 PM', display_order: 5 },
    { id: 169, name: 'DL', time: '01:30 PM', display_order: 6 },
    { id: 174, name: 'ChANDIGARh CITY', time: '02:20 PM', display_order: 7 },
    { id: 94, name: 'DELHI BAZAR', time: '03:10 PM', display_order: 8 },
    { id: 141, name: 'DELHI KING', time: '03:30 PM', display_order: 9 },
    { id: 101, name: 'GAZIYABAD SAVERA', time: '04:00 PM', display_order: 10 },
    { id: 95, name: 'SHREE GANESH', time: '04:20 PM', display_order: 11 },
    { id: 109, name: 'RAMGARH', time: '05:20 PM', display_order: 12 },
    { id: 9, name: 'Faridabad', time: '06:10 PM', display_order: 13 },
    { id: 232, name: 'TAJ BAZAR', time: '07:10 PM', display_order: 14 },
    { id: 96, name: 'BALAZI', time: '07:30 PM', display_order: 15 },
    { id: 11, name: 'GAZIYABAD', time: '09:30 PM', display_order: 16 },
    { id: 149, name: 'DISAWAR KING', time: '10:15 PM', display_order: 17 },
    { id: 150, name: 'GALI B', time: '10:30 PM', display_order: 18 },
    { id: 46, name: 'GALI', time: '11:30 PM', display_order: 19 },
    { id: 7, name: 'DISAWAR', time: '05:10 AM', display_order: 20 },
  ];

  for (const g of games) {
    await prisma.game.upsert({
      where: { id: g.id },
      update: { name: g.name, time: g.time, display_order: g.display_order },
      create: g,
    });
  }

  // 4. Chart Groups with separate data_color
  const chartGroups = [
    {
      id: 1, name: 'Group 1', color: '#00ff64', data_color: 'red', display_order: 1,
      games: [9, 11, 46, 7] // Faridabad, Gaziyabad, Gali, Disawar
    },
    {
      id: 2, name: 'Group 2', color: '#00ffdb', data_color: 'green', display_order: 2,
      games: [156, 35, 189, 99] // P.K BAZAR, Neelkanth, NAGPUR, JAIPUR CITY
    },
    {
      id: 3, name: 'Group 3', color: '#ff009b', data_color: '#aa0881', display_order: 3,
      games: [108, 169, 174, 94] // B2 SATTA, DL, ChANDIGARh CITY, DELHI BAZAR
    },
    {
      id: 4, name: 'Group 4', color: '#fff', data_color: '#fff', display_order: 4,
      games: [141, 101, 95, 109] // DELHI KING, GAZIYABAD SAVERA, SHREE GANESH, RAMGARH
    },
    {
      id: 5, name: 'Group 5', color: '#ffd800', data_color: '#ffd800', display_order: 5,
      games: [232, 96, 149, 150] // TAJ BAZAR, BALAZI, DISAWAR KING, GALI B
    }
  ];

  for (const cg of chartGroups) {
    await prisma.chartGroup.upsert({
      where: { id: cg.id },
      update: { name: cg.name, color: cg.color, data_color: cg.data_color, display_order: cg.display_order },
      create: { id: cg.id, name: cg.name, color: cg.color, data_color: cg.data_color, display_order: cg.display_order },
    });

    for (let i = 0; i < cg.games.length; i++) {
      const gameId = cg.games[i];
      await prisma.chartGroupGame.upsert({
        where: {
          chart_group_id_game_id: {
            chart_group_id: cg.id,
            game_id: gameId
          }
        },
        update: { display_order: i + 1 },
        create: {
          chart_group_id: cg.id,
          game_id: gameId,
          display_order: i + 1
        }
      });
    }
  }

  // Create Ads (Simplified to one to avoid huge seed file)
  const ads = [
    {
        title: "--सीधे सट्टा कंपनी का No 1 खाईवाल",
        content: "<p><big>--सीधे सट्टा कंपनी का No 1 खाईवाल</big></p><p><big>♕♕VIJAY.BHAI KHAIWAL ♕♕</big></p><p>Game play करने के लिये नीचे लिंक पर क्लिक करे</p><a href=\"https://wa.me/+918764892937\"><img src=\"/images/whatsapp.png\" style=\"height:69px; width:200px\"></a>",
        whatsapp_number: "918764892937",
        display_order: 1,
    }
  ];

  for(const ad of ads) {
    const exist = await prisma.advertisement.findFirst({where: {title: ad.title}});
    if (!exist) {
        await prisma.advertisement.create({data: ad});
    }
  }

  // 5. Seed June 2026 data
  // Since generating 420+ results manually is too much code, we will generate a baseline of random valid numbers (00-99)
  // for all games up to June 20, 2026. And specific ones for today.
  
  const startDate = new Date('2026-06-01');
  const endDate = new Date('2026-06-20');
  
  const allGames = games.map(g => g.id);
  const resultsToInsert = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    for (const gameId of allGames) {
      // Generate a random 2-digit number as string
      const randomResult = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      resultsToInsert.push({
        game_id: gameId,
        date: new Date(d),
        result: randomResult
      });
    }
  }

  // Add specific results for June 21, 2026 (Today)
  const today = new Date('2026-06-21');
  const todaySpecific = [
    { game_id: 156, result: '31' },
    { game_id: 35, result: '90' },
    { game_id: 189, result: '45' },
    { game_id: 99, result: '55' },
    { game_id: 108, result: '98' },
    { game_id: 169, result: '30' },
    { game_id: 174, result: '94' },
    { game_id: 94, result: '33' },
    { game_id: 141, result: '48' },
    { game_id: 101, result: '81' },
    { game_id: 95, result: '14' },
    { game_id: 109, result: '15' },
    { game_id: 9, result: '59' },
    { game_id: 232, result: '82' },
    { game_id: 96, result: '27' },
    { game_id: 11, result: '-' }, // Wait
    { game_id: 149, result: '-' },
    { game_id: 150, result: '-' },
    { game_id: 46, result: '-' },
    { game_id: 7, result: '-' }
  ];

  for (const ts of todaySpecific) {
    resultsToInsert.push({
      game_id: ts.game_id,
      date: new Date(today),
      result: ts.result
    });
  }

  for(const r of resultsToInsert) {
      await prisma.result.upsert({
          where: {
              game_id_date: {
                  game_id: r.game_id,
                  date: r.date
              }
          },
          update: { result: r.result },
          create: r
      });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

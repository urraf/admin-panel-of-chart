'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [todayData, setTodayData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [ads, setAds] = useState([]);
  const [settings, setSettings] = useState({});
  const [clock, setClock] = useState('');
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('9');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      let h = d.getHours(), m = d.getMinutes(), s = d.getSeconds(), ap;
      if (h === 0) { ap = ' AM'; h = 12; }
      else if (h < 12) { ap = ' AM'; }
      else if (h === 12) { ap = ' PM'; }
      else { ap = ' PM'; h -= 12; }
      if (m <= 9) m = '0' + m;
      if (s <= 9) s = '0' + s;
      setClock(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${h}:${m}:${s}${ap}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/results/today').then(r => r.json()),
      fetch('/api/chart?year=' + new Date().getFullYear() + '&month=' + (new Date().getMonth() + 1)).then(r => r.json()),
      fetch('/api/advertisements').then(r => r.json()),
      fetch('/api/settings').then(r => r.json()),
      fetch('/api/games').then(r => r.json())
    ]).then(([todayRes, chartRes, adsRes, settingsRes, gamesRes]) => {
      setTodayData(todayRes);
      setChartData(chartRes.chartData || []);
      setAds(adsRes);
      setSettings(settingsRes);
      setGames(gamesRes);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' }).toUpperCase();
  const currentYear = new Date().getFullYear();

  // Find DISAWAR game for the featured section
  const disawar = todayData.find(g => g.name === 'DISAWAR') || {};

  const marqueeText = settings.marquee_text || 'B2 Satta King, A7 Satta King live result, B2-SATTA, Satta king chart, Satta king online result, Satta king online, Satta king result today, Gali result, Desawar result, Faridabad result, Gaziyabad result, Satta matka king, Satta king up, Satta king desawar, Satta king gali, Satta king 2019 chart, Satta baba king, Gali live result, Disawar live result, Satta Number, Matka Number, Satta.com, Satta Game, Gali Number, Delhi Satta king, Satta Bazar, Satta king 2017, satta king 2018, Gali Leak Number, Gali Single Jodi, Black Satta Result, Black satta king, Satta King India';

  if (isLoading) {
    return <div style={{background:'#000',color:'#ffd800',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',fontWeight:'bold'}}>Loading...</div>;
  }

  return (
    <>
      {/* TOP NAVIGATION */}
      <section className="topboxnew">
        <div className="container-fluid">
          <div className="col-md-12 nopadding">
            <div className="newnav">
              <ul>
                <li><a href="/" className="active">HOME</a></li>
                <li><a href="/chart">CHART</a></li>
                <li><a href="/contact">CONTACT</a></li>
                <li><a href="/login">LOGIN</a></li>
              </ul>
              <div className="clearfix"></div>
            </div>
            <div className="text_slide">
              <marquee style={{color:'#fff'}} onMouseOver={e => e.target.stop()} onMouseOut={e => e.target.start()}>
                <b style={{color:'yellow'}}>{marqueeText}</b>
              </marquee>
            </div>
          </div>
        </div>
      </section>

      {/* LOGO */}
      <section className="sattalogo" style={{backgroundImage: 'linear-gradient(#f00,#b79633)'}}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1 style={{margin: 0}}><a href="/" style={{color:'#ccc', textDecoration:'none', fontWeight:'bold', fontSize:'42px'}}>B2 SATTA</a></h1>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE CLOCK */}
      <section className="circlebox">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <div className="liveresult">
                <div className="datetime">
                  <div id="clockbox">{clock}</div>
                </div>
                <p className="hintext">{settings.hindi_text || 'हा भाई यही आती हे सबसे पहले खबर रूको और देखो'}</p>
                {todayData.length > 0 && (
                  <div style={{marginTop: '20px', paddingBottom: '20px'}}>
                    <h2 style={{color: '#fff', fontSize: '28px', fontWeight: 'bold'}}>
                      <span style={{background: 'rgba(255,255,255,0.4)', padding: '2px 8px', marginRight: '5px'}}>
                        {todayData.find(g => g.name === 'GALI B')?.name.split(' ')[0] || todayData[0].name.split(' ')[0]}
                      </span>
                      {(todayData.find(g => g.name === 'GALI B')?.name || todayData[0].name).split(' ').slice(1).join(' ')}
                    </h2>
                    <div style={{fontSize: '40px', color: '#fff', fontWeight: 'bold', marginTop: '10px'}}>
                      {todayData.find(g => g.name === 'GALI B')?.today_result !== '-' 
                        ? todayData.find(g => g.name === 'GALI B')?.today_result 
                        : (todayData.find(g => g.name === 'GALI B')?.yesterday_result || '59')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISAWAR FEATURED */}
      <section className="sattadividerr" style={{backgroundImage: 'linear-gradient(#3ec24c,#b3b733)'}}>
        <div className="container">
          <div className="col-md-12 text-center" style={{padding: '20px 0'}}>
            <a href="/chart/7/2026" className="gamenameeach" style={{textDecoration: 'none'}}>
              <h4 style={{color:'#fff', fontWeight: 'bold', fontSize: '28px', margin: '10px 0'}}>DISAWAR</h4>
            </a>
            <p style={{color:'#ff00cb', fontSize:'18px', fontWeight:'bold', margin: '10px 0'}}>( 05:10 AM )</p>
            <strong style={{color:'#000', fontSize: '28px'}}>
              {'{ ' + (disawar.yesterday_result || '--') + ' }'}
              <img src="/images/arrow.gif" alt="arrow" style={{margin: '0 10px', width: '25px'}} />
              {'{ ' + (disawar.today_result || '--') + ' }'}
            </strong>
          </div>
        </div>
      </section>

      {/* ADVERTISEMENT CARDS */}
      {ads.map((ad, idx) => (
        <section className="callbox" key={idx}>
          <div className="text-center">
            <div className="column-ad">
              <div className="card-body-ad" style={{
                boxSizing: 'border-box', flex: '1 1 auto', minHeight: '1px',
                padding: '1rem 0.5rem', border: 'dashed red',
                background: 'linear-gradient(to bottom, #ffd800, #ffffff)',
                borderRadius: '20px', fontWeight: 'bold', margin: '5px', color: '#000'
              }}>
                <div dangerouslySetInnerHTML={{ __html: ad.content }} />
                {/* Dynamically appended whatsapp button if whatsapp_number is present */}
                {ad.whatsapp_number && ad.whatsapp_number !== '910000000000' && (
                  <div style={{marginTop: '10px'}}>
                    <a href={`https://wa.me/${ad.whatsapp_number}?text=Hello`} target="_blank" rel="noreferrer">
                      <img src="/images/whatsapp.png" alt="whatsapp" style={{height: '69px', width: '200px'}} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* MAIN RESULTS TABLE */}
      <section className="tablebox1">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 nopadding">
              <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover">
                  <thead className="forblack">
                    <tr>
                      <th className="col-md-4 text-center">सट्टा का नाम</th>
                      <th className="col-md-4 text-center">कल आया था</th>
                      <th className="col-md-4 text-center">आज का रिज़ल्ट</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayData.map((game, idx) => (
                      <tr key={idx}>
                        <td className="foryellow">
                          <a href={`/chart/${game.id}/${currentYear}`} className="gamenameeach">{game.name}</a><br/>
                          <p style={{color:'#ff00cb', margin: 0, fontWeight: 'bold'}}>{game.time}</p>
                        </td>
                        <td style={{color:'#b0f', fontWeight: 'bold', fontSize: '18px', verticalAlign: 'middle'}}>{game.yesterday_result}</td>
                        <td style={{color:'#000', fontWeight: 'bold', fontSize: '18px', backgroundColor: '#fff', verticalAlign: 'middle'}}>
                          {game.today_result === '-' ? (
                            <strong className="waitimg"><img src="/images/d.gif" alt="Wait" className="img-responsive" /></strong>
                          ) : game.today_result}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHART SECTION HEADER */}
      <section className="octoberresultchart">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h2>COMPLETE SATTA RESULT CHART {currentYear}</h2>
            </div>
          </div>
        </div>
      </section>

      {/* GAME/YEAR SELECTOR */}
      <div className="Select_selectMainDiv__QD2cf">
        <select value={selectedGame} onChange={e => setSelectedGame(e.target.value)} className="Select_selectTag__IzyVd">
          {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="Select_selectTag__IzyVd Select_secondTag__Q9uV_">
          {[2026, 2025, 2024, 2023, 2022].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button className="Select_button__PIOQS" onClick={() => window.location.href=`/chart/${selectedGame}/${selectedYear}`}>Check</button>
      </div>

      {/* MONTHLY CHART HEADER */}
      <section className="octoberresultchart">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h2>{currentMonth} RESULT CHART {currentYear}</h2>
            </div>
          </div>
        </div>
      </section>

      {/* CHART TABLES */}
      {chartData.map((group, groupIdx) => (
        <section className="newtable" key={groupIdx}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12 nopadding">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td className="table_chart_section_01 forfirtcolor col-md-2"><strong className="fon">Date</strong></td>
                        {group.games.map((gameName, i) => (
                          <td key={i} className="table_chart_section forfirtcolor text-center" style={{border:'1px solid #f00', color: group.color}}>{gameName}</td>
                        ))}
                      </tr>
                      {group.rows.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          <td className="forfirtcolor"><span className="fon" style={{color:'#ffd90a'}}>{row.date}</span></td>
                          {row.results.map((result, rIdx) => (
                            <td key={rIdx}><span className="table_chart_section_02" style={{color: group.data_color, fontSize:'17px'}}>{result}</span></td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* SATTA CHART */}
      <section className="octoberresultchart" style={{marginTop: '20px'}}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h2>SATTA CHART</h2>
            </div>
          </div>
        </div>
      </section>
      <section className="newtable" style={{marginBottom: '20px'}}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 nopadding">
              <div className="table-responsive">
                <table className="table table-bordered table-striped" style={{backgroundColor: '#e6e6e6', marginBottom: 0}}>
                  <tbody>
                    {games.map((g) => (
                      <tr key={g.id}>
                        <td className="forfirtcolor" style={{color: '#000', fontWeight: 'bold', width: '25%', verticalAlign: 'middle', borderBottom: '1px solid #333'}}>{g.name}</td>
                        {[2026, 2025, 2024, 2023, 2022].map((y) => (
                          <td key={y} className="text-center" style={{backgroundColor: '#fff', borderBottom: '1px solid #333', verticalAlign: 'middle'}}>
                            <a href={`/chart/${g.id}/${y}`} style={{color: '#000', fontWeight: 'bold', textDecoration: 'none', display: 'block', padding: '5px'}}>{y}</a>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="somelinks2">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <strong>@ {currentYear} SATTA KINGS PRO All Rights Reserved</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="somelinks">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <ul><li><p><strong>{settings.disclaimer || '!! DISCLAIMER:- This is a non-commercial website. Viewing This Website Is Your Own Risk, All The Information Shown On Website Is Sponsored And We Warn You That Gambling/Satta May Be Banned Or Illegal In Your Country..., We Are Not Responsible For Any Issues Or Scam..., We Respect All Country Rules/Laws... If You Not Agree With Our Site Disclaimer... Please Quit Our Site Right Now. Thank You.'}</strong></p></li></ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

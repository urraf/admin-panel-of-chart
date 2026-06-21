'use client';
import { useState, useEffect } from 'react';

export default function MonthlyCombinedChartPage() {
  const [monthsData, setMonthsData] = useState([]);
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(console.error);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Helper to handle year wrap-around
    const getTarget = (offset) => {
      let m = currentMonth - offset;
      let y = currentYear;
      if (m <= 0) {
        m += 12;
        y -= 1;
      }
      return { m, y };
    };

    const targets = [getTarget(0), getTarget(1), getTarget(2)];

    Promise.all(
      targets.map(t => fetch(`/api/chart/monthly?year=${t.y}&month=${t.m}`).then(r => r.json()))
    ).then(data => {
      setMonthsData(data);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  const currentYear = new Date().getFullYear();
  const marqueeText = settings.marquee_text || 'B2 Satta King, A7 Satta King live result, B2-SATTA, Satta king chart, Satta king online result, Satta king online, Satta king result today, Gali result, Desawar result, Faridabad result, Gaziyabad result';

  if (isLoading) return <div style={{textAlign:'center', padding:'50px', color:'#ffd800', background: '#000', minHeight: '100vh', fontSize:'24px', fontWeight:'bold', display:'flex', alignItems:'center', justifyContent:'center'}}>Loading Charts...</div>;

  const games = monthsData[0]?.games || [];

  return (
    <>
      {/* TOP NAVIGATION */}
      <section className="topboxnew">
        <div className="container-fluid">
          <div className="col-md-12 nopadding">
            <div className="newnav">
              <ul>
                <li><a href="/">HOME</a></li>
                <li><a href="/chart" className="active">CHART</a></li>
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

      {monthsData.map((data, index) => {
        if (!data || !data.rows) return null;
        const monthName = new Date(data.year, data.month - 1).toLocaleString('en-US', { month: 'long' }).toUpperCase();
        
        return (
          <div key={index}>
            {/* CHART HEADER */}
            <section className="octoberresultchart" style={{marginTop: index > 0 ? '20px' : '0'}}>
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h2>{monthName} RESULT CHART {data.year}</h2>
                  </div>
                </div>
              </div>
            </section>

            {/* COMBINED CHART TABLE */}
            <section className="newtable" style={{paddingBottom: '20px'}}>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 nopadding">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <td className="table_chart_section_01 forfirtcolor col-md-2">
                              <strong className="fon">Date</strong>
                            </td>
                            {data.games.map(game => (
                              <td key={game.id} className="table_chart_section forfirtcolor text-center" style={{border:'1px solid #f00', color: '#00ff64'}}>
                                {game.name}
                              </td>
                            ))}
                          </tr>
                          {data.rows.map((row, idx) => (
                            <tr key={idx}>
                              <td className="forfirtcolor">
                                <span className="fon" style={{color:'#ffd90a'}}>{row.date}</span>
                              </td>
                              {data.games.map(game => {
                                const result = row.results[game.id];
                                return (
                                  <td key={game.id} style={{backgroundColor: '#fff'}}>
                                    <span className="table_chart_section_02" style={{color: result && result !== '-' ? 'red' : '#000'}}>
                                      {result}
                                    </span>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      })}

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
                        <td style={{backgroundColor: '#6c757d', color: '#fff', fontWeight: 'bold', width: '25%'}}>{g.name}</td>
                        {[2026, 2025, 2024, 2023, 2022].map((y) => (
                          <td key={y} className="text-center">
                            <a href={`/chart/${g.id}/${y}`} style={{color: '#000', fontWeight: 'bold', textDecoration: 'none'}}>{y}</a>
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

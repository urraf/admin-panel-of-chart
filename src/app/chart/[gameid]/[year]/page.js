'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function YearlyChartPage() {
  const { gameid, year } = useParams();
  const [data, setData] = useState(null);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(console.error);
    fetch(`/api/chart/yearly?gameid=${gameid}&year=${year}`)
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, [gameid, year]);

  const currentYear = new Date().getFullYear();
  const marqueeText = settings.marquee_text || 'B2 Satta King, A7 Satta King live result, B2-SATTA, Satta king chart, Satta king online result, Satta king online, Satta king result today, Gali result, Desawar result, Faridabad result, Gaziyabad result';

  if (!data) return <div style={{textAlign:'center', padding:'50px', color:'#fff'}}>Loading...</div>;
  if (data.error) return <div style={{textAlign:'center', padding:'50px', color:'#f00'}}>Error: {data.error}</div>;

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
              <h1><a href="/" className="blink">SATTA KINGS PRO</a></h1>
            </div>
          </div>
        </div>
      </section>

      {/* CHART HEADINGS */}
      <section className="text-center" style={{padding: '20px 0'}}>
        <h2 className="loginhead" style={{color: '#fff', margin: 0, fontSize: '32px'}}>SATTA KING {data.game.name.toUpperCase()} {year} RECORD CHART</h2>
        <h3 className="loginhead" style={{color: '#ffd800', margin: '10px 0', fontSize: '24px'}}>{data.game.name.toUpperCase()} {year} Satta King Record Chart</h3>
      </section>

      {/* YEARLY CHART TABLE */}
      <section className="newtable" style={{paddingBottom: '40px'}}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 nopadding">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td className="forfirtcolor" style={{textAlign: 'center', fontWeight: 'bold'}}>{year}</td>
                      {data.months.map(m => (
                        <td key={m} className="forfirtcolor text-center">{m}</td>
                      ))}
                    </tr>
                    {data.rows.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{background: '#ff471a', color: '#FFF', textAlign: 'center', fontWeight: 'bold'}}>
                          {row.date}
                        </td>
                        {row.results.map((res, rIdx) => (
                          <td key={rIdx} className="text-center" style={{fontWeight: 'bold', fontSize: '16px', background: '#fff', color: '#000'}}>
                            {res}
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

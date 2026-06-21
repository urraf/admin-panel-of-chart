'use client';
import { useState, useEffect } from 'react';

export default function ContactPage() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(console.error);
  }, []);

  const games = [
    { name: 'Faridabad', id: 1 },
    { name: 'GAZIYABAD', id: 2 },
    { name: 'GALI', id: 3 },
    { name: 'DISAWAR', id: 4 },
    { name: 'P.K BAZAR', id: 5 },
    { name: 'Neelkanth', id: 6 },
    { name: 'NAGPUR', id: 7 },
    { name: 'JAIPUR CITY', id: 8 },
    { name: 'B2 SATTA', id: 9 },
    { name: 'DL', id: 10 },
    { name: 'ChANDIGARh CITY', id: 11 },
    { name: 'DELHI BAZAR', id: 12 },
    { name: 'DELHI KING', id: 13 },
    { name: 'GAZIYABAD SAVERA', id: 14 },
    { name: 'SHREE GANESH', id: 15 },
    { name: 'RAMGARH', id: 16 },
    { name: 'BALAZI', id: 17 },
    { name: 'DISAWAR KING', id: 18 },
    { name: 'GALI B', id: 19 },
    { name: 'TAJ BAZAR', id: 20 },
  ];

  const years = [2026, 2025, 2024, 2023, 2022];
  const currentYear = new Date().getFullYear();
  const marqueeText = settings.marquee_text || 'Satta Kings Pro, Satta King live result, Satta king chart, Satta king online result, Satta king result today, Gali result, Desawar result, Faridabad result, Gaziyabad result';

  return (
    <>
      <section className="topboxnew">
        <div className="container-fluid">
          <div className="col-md-12 nopadding">
            <div className="newnav">
              <ul>
                <li><a href="/">HOME</a></li>
                <li><a href="/chart">CHART</a></li>
                <li><a href="/contact" className="active">CONTACT</a></li>
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

      <section className="sattalogo" style={{backgroundImage: 'linear-gradient(#f00,#b79633)'}}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1><a href="/" className="blink">SATTA KINGS PRO</a></h1>
            </div>
          </div>
        </div>
      </section>

      <section className="octoberresultchart">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h2>SATTA CHART</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="tabel3">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 nopadding">
              <div className="table-responsive">
                <table className="table table-bordered" style={{backgroundColor: '#fff', marginBottom: 0}}>
                  <tbody>
                    {games.map((game, idx) => (
                      <tr key={idx}>
                        <td className="table_chart_section2 col-md-2" style={{verticalAlign: 'middle'}}>{game.name}</td>
                        {years.map(year => (
                          <td className="table_chart_section" key={year} style={{verticalAlign: 'middle'}}>
                            <a href={`/chart/${game.id}/${year}`}>{year}</a>
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

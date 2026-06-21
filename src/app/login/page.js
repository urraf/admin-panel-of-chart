'use client';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(console.error);
  }, []);

  const games = [
    { name: 'Faridabad', id: 1 }, { name: 'GAZIYABAD', id: 2 },
    { name: 'GALI', id: 3 }, { name: 'DISAWAR', id: 4 },
    { name: 'P.K BAZAR', id: 5 }, { name: 'Neelkanth', id: 6 },
    { name: 'NAGPUR', id: 7 }, { name: 'JAIPUR CITY', id: 8 },
    { name: 'B2 SATTA', id: 9 }, { name: 'DL', id: 10 },
    { name: 'ChANDIGARh CITY', id: 11 }, { name: 'DELHI BAZAR', id: 12 },
    { name: 'DELHI KING', id: 13 }, { name: 'GAZIYABAD SAVERA', id: 14 },
    { name: 'SHREE GANESH', id: 15 }, { name: 'RAMGARH', id: 16 },
    { name: 'BALAZI', id: 17 }, { name: 'DISAWAR KING', id: 18 },
    { name: 'GALI B', id: 19 }, { name: 'TAJ BAZAR', id: 20 },
  ];
  const years = [2026, 2025, 2024, 2023, 2022];
  const currentYear = new Date().getFullYear();
  const marqueeText = settings.marquee_text || 'Satta Kings Pro, Satta King live result, Satta king chart, Satta king online result, Satta king result today, Gali result, Desawar result, Faridabad result, Gaziyabad result';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await signIn('credentials', {
      username, password, redirect: false,
    });
    if (result?.error) {
      setError('Invalid username or password');
    } else {
      window.location.href = '/admin';
    }
  };

  return (
    <>
      <section className="topboxnew">
        <div className="container-fluid">
          <div className="col-md-12 nopadding">
            <div className="newnav">
              <ul>
                <li><a href="/">HOME</a></li>
                <li><a href="/chart">CHART</a></li>
                <li><a href="/contact">CONTACT</a></li>
                <li><a href="/login" className="active">LOGIN</a></li>
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

      <section className="callbox">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <p className="loginhead text-center">Login</p>
              <form onSubmit={handleSubmit}>
                <p className="sattname text-center">Sign in to SATTA KINGS PRO</p>
                {error && <p style={{color:'red', textAlign:'center', fontSize:'14px'}}>{error}</p>}
                <div className="row">
                  <div className="col-md-4"></div>
                  <div className="col-md-4">
                    <div className="form-wrapper">
                      <input
                        type="text"
                        placeholder="Username"
                        className="form-control"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value.replace(/\s/g, ''))}
                      />
                    </div>
                    <div className="form-wrapper">
                      <input
                        type="password"
                        placeholder="Password"
                        className="form-control"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value.replace(/\s/g, ''))}
                      />
                    </div>
                    <div className="form-wrapper text-center">
                      <input type="submit" className="formbut btn btn-primary" value="Submit" />
                    </div>
                  </div>
                  <div className="col-md-4"></div>
                </div>
              </form>
              <div className="clearfix"></div>
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
                <table className="table table-bordered">
                  <tbody>
                    {games.map((game, idx) => (
                      <tr key={idx}>
                        <td className="table_chart_section2 col-md-2">{game.name}</td>
                        {years.map(year => (
                          <td className="table_chart_section" key={year} style={{background:'#000'}}>
                            <a href={`/chart?gameid=${game.id}&year=${year}`}>{year}</a>
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
              <ul><li><p><strong>{settings.disclaimer || '!! DISCLAIMER:- This is a non-commercial website. Viewing This Website Is Your Own Risk...'}</strong></p></li></ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

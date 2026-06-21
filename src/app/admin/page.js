'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [games, setGames] = useState([]);
  const [ads, setAds] = useState([]);
  const [settings, setSettings] = useState({});
  const [todayData, setTodayData] = useState([]);
  const [msg, setMsg] = useState('');

  // Grid form
  const [gridYear, setGridYear] = useState(new Date().getFullYear());
  const [gridMonth, setGridMonth] = useState(new Date().getMonth() + 1);
  const [gridData, setGridData] = useState(null);
  const [gridChanges, setGridChanges] = useState({});
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [pasteText, setPasteText] = useState('');

  // Results form
  const [resultGameId, setResultGameId] = useState('');
  const [resultDate, setResultDate] = useState(new Date().toISOString().split('T')[0]);
  const [resultValue, setResultValue] = useState('');

  // Game form
  const [gameName, setGameName] = useState('');
  const [gameTime, setGameTime] = useState('');
  const [gameOrder, setGameOrder] = useState(0);
  const [editGameId, setEditGameId] = useState(null);

  // Ad form
  const [adTitle, setAdTitle] = useState('');
  const [adContent, setAdContent] = useState('');
  const [adWhatsapp, setAdWhatsapp] = useState('');
  const [adOrder, setAdOrder] = useState(0);
  const [editAdId, setEditAdId] = useState(null);

  // Settings form
  const [marqueeText, setMarqueeText] = useState('');
  const [disclaimer, setDisclaimer] = useState('');
  const [hindiText, setHindiText] = useState('');
  const [flashResultName, setFlashResultName] = useState('');
  const [flashResultNumber, setFlashResultNumber] = useState('');
  const [greenBoxName, setGreenBoxName] = useState('');
  const [greenBoxLink, setGreenBoxLink] = useState('');
  const [greenBoxTime, setGreenBoxTime] = useState('');
  const [greenBoxResult1, setGreenBoxResult1] = useState('');
  const [greenBoxResult2, setGreenBoxResult2] = useState('');
  const [winnerText, setWinnerText] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      loadData();
    }
  }, [status]);

  useEffect(() => {
    if (activeTab === 'grid') {
      loadGridData();
    }
  }, [activeTab, gridYear, gridMonth]);

  const loadData = async () => {
    try {
      const [gamesRes, adsRes, settingsRes, todayRes] = await Promise.all([
        fetch('/api/games'), fetch('/api/advertisements'),
        fetch('/api/settings'), fetch('/api/results/today'),
      ]);
      const gamesData = await gamesRes.json();
      const adsData = await adsRes.json();
      const settingsData = await settingsRes.json();
      const todayDataRes = await todayRes.json();
      setGames(Array.isArray(gamesData) ? gamesData : []);
      setAds(Array.isArray(adsData) ? adsData : []);
      setSettings(settingsData || {});
      setTodayData(Array.isArray(todayDataRes) ? todayDataRes : []);
      setMarqueeText(settingsData?.marquee_text || '');
      setDisclaimer(settingsData?.disclaimer || '');
      setHindiText(settingsData?.hindi_text || '');
      setFlashResultName(settingsData?.flash_result_name || '');
      setFlashResultNumber(settingsData?.flash_result_number || '');
      setGreenBoxName(settingsData?.green_box_name || '');
      setGreenBoxLink(settingsData?.green_box_link || '');
      setGreenBoxTime(settingsData?.green_box_time || '');
      setGreenBoxResult1(settingsData?.green_box_result_1 || '');
      setGreenBoxResult2(settingsData?.green_box_result_2 || '');
      setWinnerText(settingsData?.winner_text || '');
      if (gamesData?.length > 0 && !resultGameId) setResultGameId(gamesData[0].id);
    } catch (e) { console.error(e); }
  };

  const loadGridData = async () => {
    try {
      const res = await fetch(`/api/chart/monthly?year=${gridYear}&month=${gridMonth}`);
      const data = await res.json();
      setGridData(data);
      setGridChanges({});
    } catch (e) { console.error(e); }
  };

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  // GRID HANDLERS
  const handleGridChange = (day, gameId, value) => {
    setGridChanges(prev => ({ ...prev, [`${day}-${gameId}`]: value }));
  };

  const handleSaveGrid = async () => {
    const results = Object.keys(gridChanges).map(key => {
      const [day, gameId] = key.split('-');
      // Important to use the correct timezone-safe date representation here for the backend
      const d = new Date(Date.UTC(gridYear, gridMonth - 1, day, 12, 0, 0));
      return { game_id: parseInt(gameId), date: d.toISOString(), result: gridChanges[key] };
    });

    if (results.length === 0) return;
    try {
      await fetch('/api/results/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results })
      });
      showMsg('Grid saved successfully!');
      loadGridData();
    } catch (e) { showMsg('Error saving grid'); }
  };

  const handlePasteData = () => {
    if (!gridData || !gridData.games) return;
    const lines = pasteText.trim().split('\n');
    const newChanges = { ...gridChanges };
    lines.forEach((line, rowIdx) => {
      const day = rowIdx + 1;
      if (day > gridData.rows.length) return;
      const cells = line.split('\t');
      gridData.games.forEach((game, colIdx) => {
        if (colIdx < cells.length) {
          let val = cells[colIdx].trim();
          if (val === '-' || val === '') val = '';
          else if (val.length === 1) val = '0' + val;
          if (val.length <= 2) {
            newChanges[`${day}-${game.id}`] = val;
          }
        }
      });
    });
    setGridChanges(newChanges);
    setShowPasteBox(false);
    setPasteText('');
    showMsg('Pasted data applied! Review the grid, then click "Save Grid Changes" to publish.');
  };

  // RESULT HANDLERS
  const handleAddResult = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id: resultGameId, date: resultDate, result: resultValue }),
      });
      showMsg('Result saved successfully!');
      setResultValue('');
      loadData();
    } catch (e) { showMsg('Error saving result'); }
  };

  // GAME HANDLERS
  const handleSaveGame = async (e) => {
    e.preventDefault();
    try {
      if (editGameId) {
        await fetch(`/api/games/${editGameId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: gameName, time: gameTime, display_order: parseInt(gameOrder) }),
        });
        showMsg('Game updated!');
      } else {
        await fetch('/api/games', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: gameName, time: gameTime, display_order: parseInt(gameOrder) }),
        });
        showMsg('Game added!');
      }
      setGameName(''); setGameTime(''); setGameOrder(0); setEditGameId(null);
      loadData();
    } catch (e) { showMsg('Error saving game'); }
  };

  const handleEditGame = (game) => {
    setEditGameId(game.id);
    setGameName(game.name);
    setGameTime(game.time);
    setGameOrder(game.display_order);
  };

  const handleDeleteGame = async (id) => {
    if (!confirm('Delete this game and all its results?')) return;
    await fetch(`/api/games/${id}`, { method: 'DELETE' });
    showMsg('Game deleted!');
    loadData();
  };

  // AD HANDLERS
  const handleSaveAd = async (e) => {
    e.preventDefault();
    try {
      const body = { title: adTitle, content: adContent, whatsapp_number: adWhatsapp, display_order: parseInt(adOrder) };
      if (editAdId) {
        await fetch(`/api/advertisements/${editAdId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
        showMsg('Ad updated!');
      } else {
        await fetch('/api/advertisements', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
        showMsg('Ad added!');
      }
      setAdTitle(''); setAdContent(''); setAdWhatsapp(''); setAdOrder(0); setEditAdId(null);
      loadData();
    } catch (e) { showMsg('Error saving ad'); }
  };

  const handleEditAd = (ad) => {
    setEditAdId(ad.id); setAdTitle(ad.title); setAdContent(ad.content);
    setAdWhatsapp(ad.whatsapp_number); setAdOrder(ad.display_order);
  };

  const handleDeleteAd = async (id) => {
    if (!confirm('Delete this ad?')) return;
    await fetch(`/api/advertisements/${id}`, { method: 'DELETE' });
    showMsg('Ad deleted!'); loadData();
  };

  // SETTINGS HANDLER
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await fetch('/api/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        marquee_text: marqueeText, 
        disclaimer, 
        hindi_text: hindiText, 
        flash_result_name: flashResultName, 
        flash_result_number: flashResultNumber,
        green_box_name: greenBoxName,
        green_box_link: greenBoxLink,
        green_box_time: greenBoxTime,
        green_box_result_1: greenBoxResult1,
        green_box_result_2: greenBoxResult2,
        winner_text: winnerText
      }),
    });
    showMsg('Settings saved!'); loadData();
  };

  if (status === 'loading') return <div style={{ background: '#000', color: '#ffd800', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 900 }}>Loading...</div>;
  if (status === 'unauthenticated') return null;

  const totalGames = games.length;
  const resultsEntered = todayData.filter(g => g.today_result !== '-').length;
  const pendingResults = totalGames - resultsEntered;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>🏆 SATTA KINGS PRO - Admin Panel</h2>
        <div>
          <span style={{ marginRight: '15px', color: '#ffd800' }}>Welcome, {session?.user?.name}</span>
          <button className="admin-btn" onClick={() => signOut({ callbackUrl: '/' })}>Logout</button>
        </div>
      </div>

      {msg && <div style={{ background: '#25d366', color: '#fff', padding: '10px', borderRadius: '5px', textAlign: 'center', marginBottom: '15px', fontWeight: 700 }}>{msg}</div>}

      <div className="admin-nav">
        {['dashboard', 'results', 'grid', 'games', 'advertisements', 'settings'].map(tab => (
          <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
            {tab === 'dashboard' && '📊 '}
            {tab === 'results' && '🎯 '}
            {tab === 'grid' && '📅 '}
            {tab === 'games' && '🎮 '}
            {tab === 'advertisements' && '📢 '}
            {tab === 'settings' && '⚙️ '}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {activeTab === 'dashboard' && (
        <>
          <div className="admin-stats">
            <div className="admin-stat-card">
              <h4>Total Games</h4>
              <div className="stat-number">{totalGames}</div>
            </div>
            <div className="admin-stat-card">
              <h4>Results Entered Today</h4>
              <div className="stat-number" style={{ color: '#25d366' }}>{resultsEntered}</div>
            </div>
            <div className="admin-stat-card">
              <h4>Pending Results</h4>
              <div className="stat-number" style={{ color: '#f00' }}>{pendingResults}</div>
            </div>
            <div className="admin-stat-card">
              <h4>Active Ads</h4>
              <div className="stat-number">{ads.length}</div>
            </div>
          </div>

          <div className="admin-card">
            <h3>Today&apos;s Results Overview</h3>
            <table className="admin-table">
              <thead><tr><th>Game</th><th>Time</th><th>Yesterday</th><th>Today</th></tr></thead>
              <tbody>
                {todayData.map((g, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700, color: '#ffd800' }}>{g.name}</td>
                    <td style={{ color: '#ff00cb' }}>{g.time}</td>
                    <td style={{ color: '#b0f' }}>{g.yesterday_result}</td>
                    <td style={{ color: g.today_result === '-' ? '#f00' : '#25d366', fontWeight: 900 }}>
                      {g.today_result === '-' ? 'PENDING' : g.today_result}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* RESULTS */}
      {activeTab === 'results' && (
        <div className="admin-card">
          <h3>Enter / Update Result</h3>
          <form onSubmit={handleAddResult}>
            <div className="admin-form-group">
              <label>Game</label>
              <select className="admin-input" value={resultGameId} onChange={e => setResultGameId(e.target.value)}>
                {games.map(g => <option key={g.id} value={g.id}>{g.name} ({g.time})</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label>Date</label>
              <input type="date" className="admin-input" value={resultDate} onChange={e => setResultDate(e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>Result (2 digits, e.g. 45)</label>
              <input type="text" className="admin-input" value={resultValue} onChange={e => setResultValue(e.target.value)}
                maxLength={2} pattern="[0-9]{2}" placeholder="00-99" required />
            </div>
            <button type="submit" className="admin-btn">Save Result</button>
          </form>

          <h3 style={{ marginTop: '30px' }}>Quick Entry - All Games for {resultDate}</h3>
          <table className="admin-table">
            <thead><tr><th>Game</th><th>Time</th><th>Current Result</th><th>New Result</th><th>Action</th></tr></thead>
            <tbody>
              {games.map((g, i) => {
                const existing = todayData.find(t => t.id === g.id);
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{g.name}</td>
                    <td style={{ color: '#ff00cb' }}>{g.time}</td>
                    <td style={{ color: existing?.today_result === '-' ? '#f00' : '#25d366' }}>
                      {existing?.today_result || '-'}
                    </td>
                    <td>
                      <input type="text" className="admin-input" maxLength={2} placeholder="00-99"
                        style={{ width: '80px', display: 'inline' }}
                        id={`quick-${g.id}`}
                      />
                    </td>
                    <td>
                      <button className="admin-btn" onClick={async () => {
                        const val = document.getElementById(`quick-${g.id}`).value;
                        if (!val || val.length !== 2) { alert('Enter 2 digit result'); return; }
                        await fetch('/api/results', {
                          method: 'POST', headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ game_id: g.id, date: resultDate, result: val })
                        });
                        document.getElementById(`quick-${g.id}`).value = '';
                        showMsg(`Result saved for ${g.name}!`);
                        loadData();
                      }}>Save</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MONTHLY GRID EDITOR */}
      {activeTab === 'grid' && (
        <div className="admin-card" style={{ overflowX: 'auto' }}>
          <h3>Monthly Chart Grid Editor</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <select className="admin-input" style={{ width: '150px' }} value={gridYear} onChange={e => setGridYear(parseInt(e.target.value))}>
              {[2026, 2025, 2024, 2023, 2022].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select className="admin-input" style={{ width: '150px' }} value={gridMonth} onChange={e => setGridMonth(parseInt(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{new Date(2026, m - 1).toLocaleString('default', { month: 'long' })}</option>)}
            </select>
            <button className="admin-btn" style={{ background: '#25d366' }} onClick={handleSaveGrid}>Save Grid Changes</button>
            <button className="admin-btn" style={{ background: '#007bff' }} onClick={() => setShowPasteBox(!showPasteBox)}>
              {showPasteBox ? 'Cancel Paste' : 'Bulk Paste from Excel'}
            </button>
          </div>

          {showPasteBox && (
            <div style={{ marginBottom: '20px', padding: '15px', background: '#2a2a3e', borderRadius: '5px' }}>
              <h4 style={{ marginTop: 0, color: '#ffd800' }}>Paste Excel Data (Tab Separated)</h4>
              <p style={{ fontSize: '12px', color: '#ccc' }}>Copy a block of cells from Excel. Columns must match the games shown below, from left to right. Rows must be from Day 1 to Day 31 sequentially.</p>
              <textarea
                style={{ width: '100%', height: '150px', background: '#000', color: '#fff', border: '1px solid #555', padding: '10px' }}
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                placeholder="Paste here..."
              ></textarea>
              <button className="admin-btn" style={{ background: '#ff00cb', marginTop: '10px' }} onClick={handlePasteData}>Apply Pasted Data</button>
            </div>
          )}

          {!gridData ? <p>Loading grid...</p> : (
            <table className="admin-table" style={{ fontSize: '12px', minWidth: '1000px' }}>
              <thead>
                <tr>
                  <th style={{ position: 'sticky', left: 0, background: '#1a1a2e', zIndex: 10 }}>Date</th>
                  {gridData.games.map(g => <th key={g.id} style={{ minWidth: '60px' }}>{g.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {gridData.rows.map((row, rIdx) => {
                  // row.date is like '01-06'
                  const day = parseInt(row.date.split('-')[0]);
                  return (
                    <tr key={rIdx}>
                      <td style={{ position: 'sticky', left: 0, background: '#1a1a2e', zIndex: 10, fontWeight: 'bold', color: '#ffd800' }}>{row.date}</td>
                      {gridData.games.map(game => {
                        const originalResult = row.results[game.id];
                        const currentValue = gridChanges[`${day}-${game.id}`] !== undefined
                          ? gridChanges[`${day}-${game.id}`]
                          : originalResult;

                        const isChanged = gridChanges[`${day}-${game.id}`] !== undefined;

                        return (
                          <td key={game.id} style={{ padding: '2px' }}>
                            <input
                              type="text"
                              maxLength={2}
                              style={{
                                width: '100%',
                                textAlign: 'center',
                                padding: '4px',
                                background: isChanged ? '#4a2' : (currentValue === '-' || currentValue === '' ? '#333' : '#fff'),
                                color: isChanged ? '#fff' : (currentValue === '-' || currentValue === '' ? '#fff' : '#000'),
                                border: isChanged ? '2px solid #0f0' : '1px solid #666',
                                borderRadius: '4px'
                              }}
                              value={currentValue === '-' ? '' : currentValue}
                              onChange={(e) => handleGridChange(day, game.id, e.target.value)}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* GAMES */}
      {activeTab === 'games' && (
        <div className="admin-card">
          <h3>{editGameId ? 'Edit Game' : 'Add New Game'}</h3>
          <form onSubmit={handleSaveGame}>
            <div className="admin-form-group">
              <label>Game Name</label>
              <input type="text" className="admin-input" value={gameName} onChange={e => setGameName(e.target.value)} required />
            </div>
            <div className="admin-form-group">
              <label>Time (e.g. 09:30 PM)</label>
              <input type="text" className="admin-input" value={gameTime} onChange={e => setGameTime(e.target.value)} required />
            </div>
            <div className="admin-form-group">
              <label>Display Order</label>
              <input type="number" className="admin-input" value={gameOrder} onChange={e => setGameOrder(e.target.value)} />
            </div>
            <button type="submit" className="admin-btn">{editGameId ? 'Update Game' : 'Add Game'}</button>
            {editGameId && <button type="button" className="admin-btn" style={{ marginLeft: '10px', background: '#666' }} onClick={() => { setEditGameId(null); setGameName(''); setGameTime(''); setGameOrder(0); }}>Cancel</button>}
          </form>

          <h3 style={{ marginTop: '30px' }}>All Games</h3>
          <table className="admin-table">
            <thead><tr><th>#</th><th>Name</th><th>Time</th><th>Order</th><th>Actions</th></tr></thead>
            <tbody>
              {games.map((g, i) => (
                <tr key={i}>
                  <td>{g.id}</td>
                  <td style={{ fontWeight: 700 }}>{g.name}</td>
                  <td style={{ color: '#ff00cb' }}>{g.time}</td>
                  <td>{g.display_order}</td>
                  <td>
                    <button className="admin-btn" style={{ marginRight: '5px' }} onClick={() => handleEditGame(g)}>Edit</button>
                    <button className="admin-btn admin-btn-danger" onClick={() => handleDeleteGame(g.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADVERTISEMENTS */}
      {activeTab === 'advertisements' && (
        <div className="admin-card">
          <h3>{editAdId ? 'Edit Advertisement' : 'Add New Advertisement'}</h3>
          <form onSubmit={handleSaveAd}>
            <div className="admin-form-group">
              <label>Title</label>
              <input type="text" className="admin-input" value={adTitle} onChange={e => setAdTitle(e.target.value)} required />
            </div>
            <div className="admin-form-group">
              <label>Content (HTML allowed)</label>
              <textarea className="admin-textarea" value={adContent} onChange={e => setAdContent(e.target.value)} required />
            </div>
            <div className="admin-form-group">
              <label>WhatsApp Number (with country code, e.g. 918764892937)</label>
              <input type="text" className="admin-input" value={adWhatsapp} onChange={e => setAdWhatsapp(e.target.value)} required />
            </div>
            <div className="admin-form-group">
              <label>Display Order</label>
              <input type="number" className="admin-input" value={adOrder} onChange={e => setAdOrder(e.target.value)} />
            </div>
            <button type="submit" className="admin-btn">{editAdId ? 'Update Ad' : 'Add Ad'}</button>
            {editAdId && <button type="button" className="admin-btn" style={{ marginLeft: '10px', background: '#666' }} onClick={() => { setEditAdId(null); setAdTitle(''); setAdContent(''); setAdWhatsapp(''); setAdOrder(0); }}>Cancel</button>}
          </form>

          <h3 style={{ marginTop: '30px' }}>All Advertisements</h3>
          {ads.map((ad, i) => (
            <div key={i} style={{ border: '1px dashed red', background: 'linear-gradient(to bottom, #ffd800, #fff)', borderRadius: '20px', padding: '15px', marginBottom: '10px', color: '#000' }}>
              <strong>{ad.title}</strong>
              <p style={{ fontSize: '12px', color: '#666' }}>WhatsApp: {ad.whatsapp_number} | Order: {ad.display_order}</p>
              <button className="admin-btn" style={{ marginRight: '5px' }} onClick={() => handleEditAd(ad)}>Edit</button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDeleteAd(ad.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* SETTINGS */}
      {activeTab === 'settings' && (
        <div className="admin-card">
          <h3>Site Settings</h3>
          <form onSubmit={handleSaveSettings}>
            <div className="admin-form-group">
              <label>Marquee Text (scrolling text on top)</label>
              <textarea className="admin-textarea" value={marqueeText} onChange={e => setMarqueeText(e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>Hindi Text (below clock)</label>
              <input type="text" className="admin-input" value={hindiText} onChange={e => setHindiText(e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>Disclaimer Text</label>
              <textarea className="admin-textarea" value={disclaimer} onChange={e => setDisclaimer(e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>Flash Result Game Name (e.g. GALI)</label>
              <input type="text" className="admin-input" value={flashResultName} onChange={e => setFlashResultName(e.target.value)} placeholder="Leave blank to hide the box" />
            </div>
            <div className="admin-form-group">
              <label>Flash Result Number (e.g. 61)</label>
              <input type="text" className="admin-input" value={flashResultNumber} onChange={e => setFlashResultNumber(e.target.value)} placeholder="e.g. 61 or -" />
            </div>

            <h4 style={{marginTop: '30px', borderBottom: '1px solid #ccc', paddingBottom: '10px'}}>Winner Announcement</h4>
            <div className="admin-form-group">
              <label>Winner Text (shows below Hindi text)</label>
              <input type="text" className="admin-input" value={winnerText} onChange={e => setWinnerText(e.target.value)} placeholder="e.g. Congratulations Rajesh (9876543210)" />
            </div>

            <h4 style={{marginTop: '30px', borderBottom: '1px solid #ccc', paddingBottom: '10px'}}>Green Box Settings</h4>
            <div className="admin-form-group">
              <label>Game Name</label>
              <input type="text" className="admin-input" value={greenBoxName} onChange={e => setGreenBoxName(e.target.value)} placeholder="e.g. DISAWAR" />
            </div>
            <div className="admin-form-group">
              <label>Link Game ID (e.g. 7 for Disawar chart)</label>
              <input type="text" className="admin-input" value={greenBoxLink} onChange={e => setGreenBoxLink(e.target.value)} placeholder="e.g. 7" />
            </div>
            <div className="admin-form-group">
              <label>Timing</label>
              <input type="text" className="admin-input" value={greenBoxTime} onChange={e => setGreenBoxTime(e.target.value)} placeholder="e.g. 05:10 AM" />
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <div className="admin-form-group" style={{flex: 1}}>
                <label>Left Result (Yesterday)</label>
                <input type="text" className="admin-input" value={greenBoxResult1} onChange={e => setGreenBoxResult1(e.target.value)} placeholder="e.g. 44" />
              </div>
              <div className="admin-form-group" style={{flex: 1}}>
                <label>Right Result (Today)</label>
                <input type="text" className="admin-input" value={greenBoxResult2} onChange={e => setGreenBoxResult2(e.target.value)} placeholder="e.g. -" />
              </div>
            </div>


            <button type="submit" className="admin-btn">Save Settings</button>
          </form>
        </div>
      )}
    </div>
  );
}

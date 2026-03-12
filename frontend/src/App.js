import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ============ API CALLS ============
const api = {
  get: (path) => fetch(`${BASE_URL}${path}`).then(r => r.json()),
  post: (path, body) => fetch(`${BASE_URL}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json()),
  put: (path, body) => fetch(`${BASE_URL}${path}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json()),
  delete: (path) => fetch(`${BASE_URL}${path}`, { method: 'DELETE' }).then(r => r.json()),
  patch: (path, body) => fetch(`${BASE_URL}${path}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json()),
};

// ============ STYLES ============
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #060a10;
    --bg2: #0d1420;
    --bg3: #111c2e;
    --border: #1e2d45;
    --accent: #00d4ff;
    --accent2: #0095b3;
    --green: #00e676;
    --red: #ff4757;
    --gold: #ffd700;
    --text: #e2eaf5;
    --muted: #6b82a0;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: var(--bg2); } ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .mono { font-family: 'JetBrains Mono', monospace; }
  .green { color: var(--green); } .red { color: var(--red); } .gold { color: var(--gold); } .muted { color: var(--muted); }
  .btn { padding: 8px 18px; border-radius: 6px; border: none; cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13px; transition: all 0.2s; }
  .btn-primary { background: var(--accent); color: #000; }
  .btn-primary:hover { background: #00f0ff; transform: translateY(-1px); }
  .btn-danger { background: var(--red); color: #fff; }
  .btn-danger:hover { background: #ff6b7a; }
  .btn-success { background: var(--green); color: #000; }
  .btn-success:hover { background: #00ff88; }
  .btn-outline { background: transparent; color: var(--accent); border: 1px solid var(--accent); }
  .btn-outline:hover { background: rgba(0,212,255,0.1); }
  .btn-sm { padding: 5px 12px; font-size: 12px; }
  .card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
  .input { background: var(--bg3); border: 1px solid var(--border); color: var(--text); padding: 10px 14px; border-radius: 8px; font-family: 'Space Grotesk', sans-serif; font-size: 14px; outline: none; width: 100%; transition: border 0.2s; }
  .input:focus { border-color: var(--accent); }
  .select { background: var(--bg3); border: 1px solid var(--border); color: var(--text); padding: 10px 14px; border-radius: 8px; font-family: 'Space Grotesk', sans-serif; font-size: 14px; outline: none; cursor: pointer; }
  .badge { display: inline-block; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-green { background: rgba(0,230,118,0.15); color: var(--green); }
  .badge-red { background: rgba(255,71,87,0.15); color: var(--red); }
  .badge-blue { background: rgba(0,212,255,0.15); color: var(--accent); }
  .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; background: rgba(255,255,255,0.05); color: var(--muted); }
  .toast { position: fixed; bottom: 24px; right: 24px; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; z-index: 9999; animation: slideUp 0.3s ease; }
  .toast-success { background: rgba(0,230,118,0.2); border: 1px solid var(--green); color: var(--green); }
  .toast-error { background: rgba(255,71,87,0.2); border: 1px solid var(--red); color: var(--red); }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
  .modal { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 28px; width: 480px; max-width: 95vw; animation: fadeIn 0.2s; }
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
  .shimmer { background: linear-gradient(90deg, var(--bg2) 25%, var(--bg3) 50%, var(--bg2) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
`;

// ============ UTILS ============
const fmt = {
  price: (n) => `$${(+n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  num: (n) => (+n || 0).toLocaleString('en-US'),
  cap: (n) => {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    return `$${n}`;
  },
  pct: (n) => `${n > 0 ? '+' : ''}${(+n || 0).toFixed(2)}%`,
  date: (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
};

const generateMockChart = (basePrice, points = 20) => {
  return Array.from({ length: points }, (_, i) => ({
    t: `${i}h`,
    price: +(basePrice * (0.95 + Math.random() * 0.1)).toFixed(2)
  }));
};

// ============ TOAST COMPONENT ============
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast toast-${type}`}>{type === 'success' ? '✓ ' : '✗ '}{message}</div>;
};

// ============ NAV ============
const Nav = ({ active, setActive, portfolioId }) => (
  <nav style={{ background: 'rgba(6,10,16,0.95)', borderBottom: '1px solid var(--border)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, var(--accent), #0070a8)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📈</div>
      <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px' }}>StockApp</span>
      <span style={{ fontSize: 10, background: 'rgba(0,212,255,0.15)', color: 'var(--accent)', padding: '2px 6px', borderRadius: 4, marginLeft: 4, fontWeight: 600 }}>MERN</span>
    </div>
    <div style={{ display: 'flex', gap: 4 }}>
      {['Dashboard', 'Markets', 'Portfolio', 'Transactions', 'Manage'].map(tab => (
        <button key={tab} onClick={() => setActive(tab)} className="btn" style={{ background: active === tab ? 'rgba(0,212,255,0.15)' : 'transparent', color: active === tab ? 'var(--accent)' : 'var(--muted)', fontSize: 13 }}>
          {tab}
        </button>
      ))}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 8, height: 8, background: 'var(--green)', borderRadius: '50%', boxShadow: '0 0 8px var(--green)' }} />
      <span style={{ fontSize: 12, color: 'var(--muted)' }}>Live</span>
    </div>
  </nav>
);

// ============ STAT CARD ============
const StatCard = ({ label, value, sub, color }) => (
  <div className="card" style={{ flex: 1 }}>
    <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: color || 'var(--text)' }} className="mono">{value}</div>
    {sub && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{sub}</div>}
  </div>
);

// ============ STOCK ROW ============
const StockRow = ({ stock, onBuy, onSell, onEdit, onDelete, showActions }) => {
  const change = stock.priceChange || (stock.currentPrice - stock.previousClose);
  const pct = stock.percentChange || (stock.previousClose ? ((stock.currentPrice - stock.previousClose) / stock.previousClose * 100) : 0);
  const up = change >= 0;
  const chartData = generateMockChart(stock.currentPrice);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.2fr 1.2fr 1fr 1fr auto', gap: 16, padding: '14px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center', transition: 'background 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: `${stock.logoColor || '#00d4ff'}22`, border: `1px solid ${stock.logoColor || '#00d4ff'}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: stock.logoColor || 'var(--accent)' }}>
          {stock.symbol?.slice(0, 2)}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{stock.symbol}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stock.name}</div>
        </div>
      </div>
      <div style={{ height: 36 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, bottom: 0 }}>
            <defs><linearGradient id={`g${stock.symbol}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={up ? '#00e676' : '#ff4757'} stopOpacity={0.3} /><stop offset="100%" stopColor={up ? '#00e676' : '#ff4757'} stopOpacity={0} /></linearGradient></defs>
            <Area type="monotone" dataKey="price" stroke={up ? '#00e676' : '#ff4757'} strokeWidth={1.5} fill={`url(#g${stock.symbol})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mono" style={{ fontWeight: 600, fontSize: 15 }}>{fmt.price(stock.currentPrice)}</div>
      <div className={up ? 'green' : 'red'} style={{ fontWeight: 600, fontSize: 13 }} className="mono">
        {up ? '▲' : '▼'} {fmt.pct(pct)}
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{fmt.cap(stock.marketCap)}</div>
      <span className="tag">{stock.sector}</span>
      {showActions && (
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => onBuy(stock)} className="btn btn-success btn-sm">Buy</button>
          <button onClick={() => onSell(stock)} className="btn btn-danger btn-sm">Sell</button>
          <button onClick={() => onEdit(stock)} className="btn btn-outline btn-sm">Edit</button>
          <button onClick={() => onDelete(stock)} className="btn btn-sm" style={{ background: 'rgba(255,71,87,0.1)', color: 'var(--red)' }}>Del</button>
        </div>
      )}
    </div>
  );
};

// ============ BUY/SELL MODAL ============
const TradeModal = ({ stock, type, portfolioId, onClose, onToast, onRefresh }) => {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const total = qty * (stock?.currentPrice || 0);

  const handleTrade = async () => {
    if (!portfolioId) { onToast('No portfolio found. Please create one first.', 'error'); return; }
    setLoading(true);
    try {
      const res = await api.post(`/portfolio/${portfolioId}/${type === 'BUY' ? 'buy' : 'sell'}`, { stockId: stock._id, quantity: parseInt(qty) });
      if (res.success) { onToast(res.message, 'success'); onClose(); onRefresh(); }
      else onToast(res.message, 'error');
    } catch { onToast('Trade failed', 'error'); }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{type === 'BUY' ? '🟢 Buy' : '🔴 Sell'} {stock?.symbol}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>
        <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>Current Price</span>
            <span className="mono" style={{ fontWeight: 600 }}>{fmt.price(stock?.currentPrice)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>Company</span>
            <span style={{ fontSize: 13 }}>{stock?.name}</span>
          </div>
        </div>
        <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--muted)' }}>Quantity</label>
        <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} className="input" style={{ marginBottom: 20 }} />
        <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--muted)' }}>Estimated Total</span>
          <span className="mono" style={{ fontWeight: 700, fontSize: 18, color: type === 'BUY' ? 'var(--green)' : 'var(--red)' }}>{fmt.price(total)}</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
          <button onClick={handleTrade} disabled={loading} className={`btn ${type === 'BUY' ? 'btn-success' : 'btn-danger'}`} style={{ flex: 1 }}>
            {loading ? 'Processing...' : `Confirm ${type}`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ ADD/EDIT STOCK MODAL ============
const StockFormModal = ({ stock, onClose, onToast, onRefresh }) => {
  const [form, setForm] = useState(stock || { symbol: '', name: '', sector: 'Technology', currentPrice: '', previousClose: '', volume: '', marketCap: '', peRatio: '', dividendYield: '', description: '' });
  const [loading, setLoading] = useState(false);

  const sectors = ['Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial', 'Materials', 'Utilities', 'Real Estate', 'Communication'];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = stock?._id ? await api.put(`/stocks/${stock._id}`, form) : await api.post('/stocks', form);
      if (res.success) { onToast(res.message, 'success'); onClose(); onRefresh(); }
      else onToast(res.message, 'error');
    } catch { onToast('Operation failed', 'error'); }
    setLoading(false);
  };

  const f = (key, val) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 560 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>{stock ? '✏️ Edit Stock' : '➕ Add New Stock'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['Symbol', 'symbol'], ['Company Name', 'name'], ['Current Price', 'currentPrice'], ['Previous Close', 'previousClose'], ['Volume', 'volume'], ['Market Cap', 'marketCap'], ['P/E Ratio', 'peRatio'], ['Dividend Yield', 'dividendYield']].map(([label, key]) => (
            <div key={key}>
              <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>{label}</label>
              <input className="input" value={form[key] || ''} onChange={e => f(key, e.target.value)} placeholder={label} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Sector</label>
            <select className="select input" value={form.sector} onChange={e => f('sector', e.target.value)}>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Description</label>
          <textarea className="input" value={form.description} onChange={e => f('description', e.target.value)} rows={2} />
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
            {loading ? 'Saving...' : stock ? 'Update Stock' : 'Add Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ DASHBOARD PAGE ============
const Dashboard = ({ portfolioId, onToast }) => {
  const [stats, setStats] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, p] = await Promise.all([api.get('/stocks/stats'), portfolioId ? api.get(`/portfolio/${portfolioId}`) : Promise.resolve(null)]);
        if (s.success) setStats(s.data);
        if (p?.success) setPortfolio(p.data);
      } finally { setLoading(false); }
    };
    load();
  }, [portfolioId]);

  if (loading) return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[...Array(4)].map((_, i) => <div key={i} className="shimmer" style={{ height: 90 }} />)}
      </div>
    </div>
  );

  const pieData = portfolio?.holdings?.slice(0, 5).map(h => ({ name: h.symbol, value: h.currentValue || 0 })) || [];
  const COLORS = ['#00d4ff', '#00e676', '#ffd700', '#ff4757', '#a855f7'];

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Market Dashboard</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Real-time market overview · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Stocks" value={stats?.totalStocks || 0} sub="Listed companies" color="var(--accent)" />
        <StatCard label="Portfolio Value" value={portfolio ? fmt.price(portfolio.totalPortfolioValue) : '-'} sub={portfolio ? `${fmt.price(portfolio.cash)} cash` : 'No portfolio'} color="var(--gold)" />
        <StatCard label="P&L" value={portfolio ? fmt.price(portfolio.totalProfitLoss) : '-'} sub={portfolio ? `${fmt.pct(portfolio.totalProfitLossPercent)} return` : ''} color={portfolio?.totalProfitLoss >= 0 ? 'var(--green)' : 'var(--red)'} />
        <StatCard label="Holdings" value={portfolio?.holdings?.length || 0} sub="Active positions" color="var(--text)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--green)' }}>▲ Top Gainers</h3>
          {stats?.gainers?.map(s => {
            const pct = s.percentChange || 0;
            return (
              <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(0,230,118,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--green)' }}>{s.symbol?.slice(0, 2)}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{s.symbol}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.name?.split(' ')[0]}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{fmt.price(s.currentPrice)}</div>
                  <div className="green mono" style={{ fontSize: 12 }}>+{pct.toFixed(2)}%</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--red)' }}>▼ Top Losers</h3>
          {stats?.losers?.map(s => {
            const pct = s.percentChange || 0;
            return (
              <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(255,71,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--red)' }}>{s.symbol?.slice(0, 2)}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{s.symbol}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.name?.split(' ')[0]}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{fmt.price(s.currentPrice)}</div>
                  <div className="red mono" style={{ fontSize: 12 }}>{pct.toFixed(2)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {portfolio?.holdings?.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Portfolio Allocation</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt.price(v)} contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {pieData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                  <span style={{ color: 'var(--muted)' }}>{d.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Holdings Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {portfolio.holdings.slice(0, 5).map(h => {
                const pl = h.profitLoss || 0;
                const plPct = h.profitLossPercent || 0;
                const up = pl >= 0;
                return (
                  <div key={h._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8 }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{h.symbol}</span>
                      <span style={{ color: 'var(--muted)', fontSize: 12, marginLeft: 8 }}>{h.quantity} shares</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{fmt.price(h.currentValue)}</div>
                      <div style={{ fontSize: 12, color: up ? 'var(--green)' : 'var(--red)' }} className="mono">{up ? '+' : ''}{fmt.price(pl)} ({fmt.pct(plPct)})</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ MARKETS PAGE ============
const Markets = ({ portfolioId, onToast, onRefresh }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('');
  const [trade, setTrade] = useState(null);

  const loadStocks = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (sector) params.append('sector', sector);
    const res = await api.get(`/stocks?${params}`);
    if (res.success) setStocks(res.data);
    setLoading(false);
  }, [search, sector]);

  useEffect(() => { loadStocks(); }, [loadStocks]);

  const sectors = ['', 'Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial', 'Materials', 'Utilities', 'Real Estate', 'Communication'];

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Market Stocks</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <input placeholder="Search symbol or name..." className="input" style={{ width: 220 }} value={search} onChange={e => setSearch(e.target.value)} />
          <select className="select" value={sector} onChange={e => setSector(e.target.value)}>
            {sectors.map(s => <option key={s} value={s}>{s || 'All Sectors'}</option>)}
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.2fr 1.2fr 1fr 1fr auto', gap: 16, padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)', borderRadius: '12px 12px 0 0' }}>
          {['Company', 'Trend', 'Price', 'Change', 'Mkt Cap', 'Sector', 'Actions'].map(h => (
            <div key={h} style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>{h}</div>
          ))}
        </div>
        {loading ? [...Array(5)].map((_, i) => (
          <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <div className="shimmer" style={{ height: 36 }} />
          </div>
        )) : stocks.map(stock => (
          <StockRow key={stock._id} stock={stock}
            onBuy={s => setTrade({ stock: s, type: 'BUY' })}
            onSell={s => setTrade({ stock: s, type: 'SELL' })}
            onEdit={() => {}} onDelete={() => {}}
            showActions={true} />
        ))}
        {!loading && stocks.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>No stocks found</div>
        )}
      </div>

      {trade && (
        <TradeModal stock={trade.stock} type={trade.type} portfolioId={portfolioId}
          onClose={() => setTrade(null)} onToast={onToast} onRefresh={onRefresh} />
      )}
    </div>
  );
};

// ============ PORTFOLIO PAGE ============
const Portfolio = ({ portfolioId, onToast }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!portfolioId) { setLoading(false); return; }
    const res = await api.get(`/portfolio/${portfolioId}`);
    if (res.success) setPortfolio(res.data);
    setLoading(false);
  }, [portfolioId]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div style={{ padding: 32 }}><div className="shimmer" style={{ height: 200 }} /></div>;
  if (!portfolio) return <div style={{ padding: 32, color: 'var(--muted)' }}>No portfolio found. Seed the database first.</div>;

  const plColor = portfolio.totalProfitLoss >= 0 ? 'var(--green)' : 'var(--red)';

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>{portfolio.name}</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>{portfolio.holdings.length} positions</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Value" value={fmt.price(portfolio.totalPortfolioValue)} sub="Portfolio + Cash" color="var(--accent)" />
        <StatCard label="Invested" value={fmt.price(portfolio.totalInvested)} sub="In positions" />
        <StatCard label="P&L" value={fmt.price(portfolio.totalProfitLoss)} sub={fmt.pct(portfolio.totalProfitLossPercent)} color={plColor} />
        <StatCard label="Cash Available" value={fmt.price(portfolio.cash)} sub="Ready to invest" color="var(--gold)" />
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)', borderRadius: '12px 12px 0 0' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600 }}>Holdings</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 16, padding: '10px 20px', borderBottom: '1px solid var(--border)' }}>
          {['Symbol', 'Qty', 'Avg Price', 'Cur Price', 'Value', 'P&L', 'P&L %'].map(h => (
            <div key={h} style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>{h}</div>
          ))}
        </div>
        {portfolio.holdings.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>No holdings yet. Buy some stocks!</div>
        ) : portfolio.holdings.map(h => {
          const pl = h.profitLoss || 0;
          const plPct = parseFloat(h.profitLossPercent || 0);
          const up = pl >= 0;
          return (
            <div key={h._id} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 16, padding: '14px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent)' }}>{h.symbol}</div>
              <div className="mono">{h.quantity}</div>
              <div className="mono">{fmt.price(h.avgBuyPrice)}</div>
              <div className="mono">{fmt.price(h.stock?.currentPrice)}</div>
              <div className="mono" style={{ fontWeight: 600 }}>{fmt.price(h.currentValue)}</div>
              <div className="mono" style={{ color: up ? 'var(--green)' : 'var(--red)' }}>{up ? '+' : ''}{fmt.price(pl)}</div>
              <div>
                <span className={`badge ${up ? 'badge-green' : 'badge-red'}`}>{fmt.pct(plPct)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============ TRANSACTIONS PAGE ============
const Transactions = ({ onToast }) => {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api.get(`/transactions${filter ? `?type=${filter}` : ''}`);
    if (res.success) setTxns(res.data);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    const res = await api.delete(`/transactions/${id}`);
    if (res.success) { onToast('Transaction deleted', 'success'); load(); }
    else onToast(res.message, 'error');
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Transaction History</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {['', 'BUY', 'SELL'].map(t => (
            <button key={t} onClick={() => setFilter(t)} className="btn" style={{ background: filter === t ? 'rgba(0,212,255,0.15)' : 'transparent', color: filter === t ? 'var(--accent)' : 'var(--muted)' }}>
              {t || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 0.8fr 0.8fr 1fr 1fr auto', gap: 16, padding: '10px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)', borderRadius: '12px 12px 0 0' }}>
          {['Stock', 'Type', 'Qty', 'Price', 'Total', 'Date', ''].map(h => (
            <div key={h} style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>{h}</div>
          ))}
        </div>
        {loading ? [...Array(5)].map((_, i) => <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}><div className="shimmer" style={{ height: 36 }} /></div>)
          : txns.length === 0 ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>No transactions yet</div>
          : txns.map(t => (
            <div key={t._id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 0.8fr 0.8fr 1fr 1fr auto', gap: 16, padding: '14px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{t.symbol}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.companyName}</div>
              </div>
              <span className={`badge ${t.type === 'BUY' ? 'badge-green' : 'badge-red'}`}>{t.type}</span>
              <div className="mono">{t.quantity}</div>
              <div className="mono">{fmt.price(t.price)}</div>
              <div className="mono" style={{ fontWeight: 600 }}>{fmt.price(t.total)}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{fmt.date(t.createdAt)}</div>
              <button onClick={() => handleDelete(t._id)} className="btn btn-sm" style={{ background: 'rgba(255,71,87,0.1)', color: 'var(--red)', fontSize: 11 }}>Del</button>
            </div>
          ))}
      </div>
    </div>
  );
};

// ============ MANAGE PAGE (Admin CRUD) ============
const Manage = ({ onToast }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [priceEdit, setPriceEdit] = useState({});

  const load = async () => {
    setLoading(true);
    const res = await api.get('/stocks');
    if (res.success) setStocks(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (stock) => {
    if (!window.confirm(`Delete ${stock.symbol}?`)) return;
    const res = await api.delete(`/stocks/${stock._id}`);
    if (res.success) { onToast(`${stock.symbol} deleted`, 'success'); load(); }
    else onToast(res.message, 'error');
  };

  const handlePriceUpdate = async (stock) => {
    const newPrice = priceEdit[stock._id];
    if (!newPrice) return;
    const res = await api.patch(`/stocks/${stock._id}/price`, { currentPrice: parseFloat(newPrice) });
    if (res.success) { onToast(`${stock.symbol} price updated`, 'success'); setPriceEdit(p => ({ ...p, [stock._id]: '' })); load(); }
    else onToast(res.message, 'error');
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Manage Stocks</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>Admin panel · GET, POST, PUT, PATCH, DELETE APIs</p>
        </div>
        <button onClick={() => setModal({ type: 'add' })} className="btn btn-primary">+ Add Stock</button>
      </div>

      <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: 'var(--accent)' }}>
        📡 API Endpoints: <span className="mono" style={{ fontSize: 12 }}>GET /api/stocks · POST /api/stocks · PUT /api/stocks/:id · PATCH /api/stocks/:id/price · DELETE /api/stocks/:id</span>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? [...Array(4)].map((_, i) => <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}><div className="shimmer" style={{ height: 50 }} /></div>)
          : stocks.map(stock => {
          const change = stock.priceChange || (stock.currentPrice - stock.previousClose);
          const pct = stock.percentChange || 0;
          const up = change >= 0;
          return (
            <div key={stock._id} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: `${stock.logoColor || '#00d4ff'}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: stock.logoColor || 'var(--accent)', flexShrink: 0 }}>
                {stock.symbol?.slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{stock.symbol} <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 13 }}>{stock.name}</span></div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{stock.sector} · P/E: {stock.peRatio} · Vol: {fmt.num(stock.volume)}</div>
              </div>
              <div style={{ textAlign: 'right', marginRight: 8 }}>
                <div className="mono" style={{ fontWeight: 700 }}>{fmt.price(stock.currentPrice)}</div>
                <div style={{ fontSize: 12, color: up ? 'var(--green)' : 'var(--red)' }}>{up ? '▲' : '▼'} {fmt.pct(pct)}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="number" placeholder="New price" className="input" style={{ width: 110, fontSize: 12 }} value={priceEdit[stock._id] || ''} onChange={e => setPriceEdit(p => ({ ...p, [stock._id]: e.target.value }))} />
                <button onClick={() => handlePriceUpdate(stock)} className="btn btn-outline btn-sm">PATCH</button>
                <button onClick={() => setModal({ type: 'edit', stock })} className="btn btn-sm" style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--accent)' }}>PUT</button>
                <button onClick={() => handleDelete(stock)} className="btn btn-sm" style={{ background: 'rgba(255,71,87,0.1)', color: 'var(--red)' }}>DELETE</button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <StockFormModal stock={modal.stock} onClose={() => setModal(null)} onToast={onToast} onRefresh={load} />
      )}
    </div>
  );
};

// ============ MAIN APP ============
export default function App() {
  const [active, setActive] = useState('Dashboard');
  const [toast, setToast] = useState(null);
  const [portfolioId, setPortfolioId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = (message, type) => setToast({ message, type });

  // Load portfolio ID on mount
  useEffect(() => {
    api.get('/portfolio').then(res => {
      if (res.success && res.data.length > 0) setPortfolioId(res.data[0]._id);
    }).catch(() => {});
  }, []);

  const pages = {
    Dashboard: <Dashboard portfolioId={portfolioId} onToast={showToast} key={refreshKey} />,
    Markets: <Markets portfolioId={portfolioId} onToast={showToast} onRefresh={() => setRefreshKey(k => k + 1)} />,
    Portfolio: <Portfolio portfolioId={portfolioId} onToast={showToast} key={refreshKey} />,
    Transactions: <Transactions onToast={showToast} />,
    Manage: <Manage onToast={showToast} />
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Nav active={active} setActive={setActive} portfolioId={portfolioId} />

        {/* Ticker bar */}
        <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '8px 32px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 32, fontSize: 12, animation: 'scroll 30s linear infinite', whiteSpace: 'nowrap' }}>
            {['AAPL +1.23%', 'MSFT +0.58%', 'NVDA +1.48%', 'TSLA -2.58%', 'AMZN +1.99%', 'META +1.35%', 'GOOGL -1.04%', 'JPM +1.28%', 'JNJ -1.39%', 'XOM +1.53%'].map(t => {
              const up = t.includes('+');
              return <span key={t} style={{ color: up ? 'var(--green)' : 'var(--red)' }} className="mono">{t}</span>;
            })}
          </div>
        </div>

        {pages[active]}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

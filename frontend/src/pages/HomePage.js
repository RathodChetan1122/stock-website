import React, { useState, useEffect } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #ffffff;
    --bg2: #f8faff;
    --bg3: #f0f4ff;
    --accent: #00b386;
    --accent2: #009970;
    --dark: #0d1117;
    --text: #1a1a2e;
    --muted: #6b7280;
    --border: #e5e7eb;
    --red: #ef4444;
    --green: #00b386;
  }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text); }
  .mono { font-family: 'JetBrains Mono', monospace; }
  .btn { padding: 12px 28px; border-radius: 8px; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 15px; transition: all 0.2s; }
  .btn-green { background: var(--accent); color: white; }
  .btn-green:hover { background: var(--accent2); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,179,134,0.3); }
  .btn-outline { background: transparent; color: var(--accent); border: 2px solid var(--accent); }
  .btn-outline:hover { background: var(--accent); color: white; }
  .btn-dark { background: var(--dark); color: white; }
  .btn-dark:hover { background: #1a2332; transform: translateY(-1px); }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .animate-1 { animation: fadeUp 0.6s ease forwards; }
  .animate-2 { animation: fadeUp 0.6s ease 0.1s forwards; opacity: 0; }
  .animate-3 { animation: fadeUp 0.6s ease 0.2s forwards; opacity: 0; }
  .animate-4 { animation: fadeUp 0.6s ease 0.3s forwards; opacity: 0; }
`;

const stocks = [
  { symbol: 'AAPL', price: '189.50', change: '+1.23%', up: true },
  { symbol: 'MSFT', price: '415.20', change: '+0.58%', up: true },
  { symbol: 'NVDA', price: '875.40', change: '+1.48%', up: true },
  { symbol: 'TSLA', price: '245.60', change: '-2.58%', up: false },
  { symbol: 'AMZN', price: '178.90', change: '+1.99%', up: true },
  { symbol: 'META', price: '502.30', change: '+1.35%', up: true },
  { symbol: 'GOOGL', price: '138.75', change: '-1.04%', up: false },
  { symbol: 'JPM',  price: '198.30', change: '+1.28%', up: true },
];

const features = [
  { icon: '📊', title: 'Real-time Market Data', desc: 'Track live stock prices, market trends, and portfolio performance all in one place.' },
  { icon: '💼', title: 'Smart Portfolio', desc: 'Buy and sell stocks with $100,000 virtual cash. Track your P&L and returns instantly.' },
  { icon: '🔒', title: 'Secure & Trusted', desc: 'Your account is protected with JWT authentication and encrypted passwords.' },
  { icon: '📈', title: 'Market Analytics', desc: 'See top gainers, losers, sector breakdowns and visual charts for every stock.' },
  { icon: '🔔', title: 'Transaction History', desc: 'Complete history of every trade you make with timestamps and profit/loss tracking.' },
  { icon: '⚡', title: 'Lightning Fast', desc: 'Built with MERN stack — MongoDB, Express, React, Node for blazing fast performance.' },
];

const stats = [
  { value: '12+', label: 'Stocks Listed' },
  { value: '$100K', label: 'Virtual Cash' },
  { value: '6', label: 'Market Sectors' },
  { value: '100%', label: 'Free to Use' },
];

export default function HomePage({ onLogin, onRegister }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        padding: '0 5%', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #00b386, #0066ff)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📈</div>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#0d1117' }}>Stock<span style={{ color: 'var(--accent)' }}>Website</span></span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={onLogin} className="btn btn-outline" style={{ padding: '9px 24px', fontSize: 14 }}>Login</button>
          <button onClick={onRegister} className="btn btn-green" style={{ padding: '9px 24px', fontSize: 14 }}>Sign Up Free</button>
        </div>
      </nav>

      {/* TICKER BAR */}
      <div style={{ marginTop: 68, background: '#0d1117', padding: '10px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', animation: 'ticker 25s linear infinite', width: 'max-content' }}>
          {[...stocks, ...stocks].map((s, i) => (
            <span key={i} style={{ marginRight: 40, fontSize: 13, fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#9ca3af' }}>{s.symbol}</span>
              <span style={{ color: 'white', marginLeft: 8 }}>${s.price}</span>
              <span style={{ color: s.up ? '#00b386' : '#ef4444', marginLeft: 6 }}>{s.change}</span>
            </span>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #f8faff 50%, #f0fff8 100%)',
        padding: '80px 5% 100px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* background decorations */}
        <div style={{ position: 'absolute', top: 80, left: '10%', width: 300, height: 300, background: 'rgba(0,179,134,0.06)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: 40, right: '10%', width: 250, height: 250, background: 'rgba(0,102,255,0.06)', borderRadius: '50%', filter: 'blur(60px)' }} />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <div className="animate-1" style={{ display: 'inline-block', background: 'rgba(0,179,134,0.1)', color: 'var(--accent)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 24, border: '1px solid rgba(0,179,134,0.2)' }}>
            🚀 MERN Stack Workshop Project
          </div>

          <h1 className="animate-2" style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, color: '#0d1117' }}>
            Invest Smarter,<br />
            <span style={{ color: 'var(--accent)' }}>Grow Faster</span>
          </h1>

          <p className="animate-3" style={{ fontSize: 18, color: 'var(--muted)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Practice stock trading with $100,000 virtual cash. Track real market data, build your portfolio, and master investing — completely free.
          </p>

          <div className="animate-4" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onRegister} className="btn btn-green" style={{ fontSize: 16, padding: '14px 36px' }}>
              Start Investing Free →
            </button>
            <button onClick={onLogin} className="btn" style={{ background: 'white', color: '#0d1117', border: '2px solid var(--border)', fontSize: 16, padding: '14px 36px' }}>
              Login to Account
            </button>
          </div>

          <p style={{ marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
            No credit card required · Free virtual ₹100,000 · Start in 30 seconds
          </p>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: 'var(--dark)', padding: '40px 5%' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, textAlign: 'center' }}>
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</div>
              <div style={{ color: '#9ca3af', fontSize: 14, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ padding: '80px 5%', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
              Everything you need to <span style={{ color: 'var(--accent)' }}>trade smart</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 17 }}>A complete stock trading simulator built with MERN stack</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                padding: 28, borderRadius: 16,
                border: '1px solid var(--border)',
                background: 'white',
                transition: 'all 0.2s',
                cursor: 'default'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,179,134,0.1)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKET PREVIEW */}
      <section style={{ padding: '80px 5%', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Live Market Preview</h2>
            <p style={{ color: 'var(--muted)' }}>See what stocks are available to trade</p>
          </div>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '14px 24px', background: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
              {['Company', 'Price', 'Change', 'Sector'].map(h => (
                <div key={h} style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</div>
              ))}
            </div>
            {stocks.map((s, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '16px 24px', borderBottom: i < stocks.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8faff'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <div style={{ fontWeight: 700, fontSize: 15 }}>{s.symbol}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>${s.price}</div>
                <div style={{ color: s.up ? 'var(--green)' : 'var(--red)', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', fontSize: 14 }}>
                  {s.up ? '▲' : '▼'} {s.change}
                </div>
                <div style={{ fontSize: 12, background: '#f0f4ff', color: '#4f46e5', padding: '4px 10px', borderRadius: 20, display: 'inline-block', width: 'fit-content' }}>Technology</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button onClick={onRegister} className="btn btn-green" style={{ fontSize: 15 }}>
              Sign Up to Start Trading →
            </button>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: '80px 5%', background: 'linear-gradient(135deg, #0d1117 0%, #1a2332 100%)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: 'white', marginBottom: 16 }}>
          Ready to start your<br /><span style={{ color: 'var(--accent)' }}>investment journey?</span>
        </h2>
        <p style={{ color: '#9ca3af', fontSize: 17, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
          Join now and get $100,000 virtual cash to practice trading with real market data.
        </p>
        <button onClick={onRegister} className="btn btn-green" style={{ fontSize: 16, padding: '16px 48px' }}>
          Create Free Account →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0d1117', borderTop: '1px solid #1e2d45', padding: '32px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #00b386, #0066ff)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📈</div>
          <span style={{ fontWeight: 700, color: 'white' }}>StockWebsite</span>
        </div>
        <p style={{ color: '#6b7280', fontSize: 13 }}>Built with ❤️ using MERN Stack · Workshop Project</p>
        <div style={{ display: 'flex', gap: 20 }}>
          <button onClick={onLogin} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 14 }}>Login</button>
          <button onClick={onRegister} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 14 }}>Sign Up</button>
        </div>
      </footer>
    </>
  );
}

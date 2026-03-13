import React, { useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; }
  .auth-input {
    width: 100%; padding: 13px 16px;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    font-size: 15px; font-family: 'Plus Jakarta Sans', sans-serif;
    outline: none; transition: border 0.2s; background: #fafafa;
    color: #1a1a2e;
  }
  .auth-input:focus { border-color: #00b386; background: white; box-shadow: 0 0 0 3px rgba(0,179,134,0.1); }
  .auth-btn {
    width: 100%; padding: 14px;
    background: #00b386; color: white; border: none;
    border-radius: 10px; font-size: 16px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .auth-btn:hover { background: #009970; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,179,134,0.3); }
  .auth-btn:disabled { background: #9ca3af; transform: none; box-shadow: none; cursor: not-allowed; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .auth-card { animation: fadeIn 0.4s ease; }
`;

// ============ LOGIN PAGE ============
export function LoginPage({ onLogin, onSwitchToRegister, onBack }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user, data.token);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #f8faff 50%, #f0fff8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="auth-card" style={{ background: 'white', borderRadius: 20, padding: '48px 44px', width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #00b386, #0066ff)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>📈</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0d1117' }}>Welcome back</h1>
            <p style={{ color: '#6b7280', fontSize: 15, marginTop: 6 }}>Login to your StockWebsite account</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 7, fontWeight: 600, fontSize: 14, color: '#374151' }}>Email Address</label>
              <input className="auth-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <label style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <input className="auth-input" type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#9ca3af' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <span style={{ color: '#6b7280', fontSize: 14 }}>Don't have an account? </span>
            <button onClick={onSwitchToRegister} style={{ background: 'none', border: 'none', color: '#00b386', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Sign up free</button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 13 }}>← Back to Home</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ============ REGISTER PAGE ============
export function RegisterPage({ onRegister, onSwitchToLogin, onBack }) {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: form.fullName, email: form.email, password: form.password, phone: form.phone })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onRegister(data.user, data.token);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #f8faff 50%, #f0fff8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="auth-card" style={{ background: 'white', borderRadius: 20, padding: '48px 44px', width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #00b386, #0066ff)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>📈</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0d1117' }}>Create account</h1>
            <p style={{ color: '#6b7280', fontSize: 15, marginTop: 6 }}>Start trading with $100,000 virtual cash</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 7, fontWeight: 600, fontSize: 13, color: '#374151' }}>Full Name *</label>
                <input className="auth-input" placeholder="John Doe" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 7, fontWeight: 600, fontSize: 13, color: '#374151' }}>Phone</label>
                <input className="auth-input" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', marginBottom: 7, fontWeight: 600, fontSize: 13, color: '#374151' }}>Email Address *</label>
              <input className="auth-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 7, fontWeight: 600, fontSize: 13, color: '#374151' }}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <input className="auth-input" type={showPass ? 'text' : 'password'} placeholder="Min 6 chars" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required style={{ paddingRight: 40 }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#9ca3af' }}>{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 7, fontWeight: 600, fontSize: 13, color: '#374151' }}>Confirm Password *</label>
                <input className="auth-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} required />
              </div>
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Free Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 16 }}>
            By signing up, you agree to our Terms of Service
          </p>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ color: '#6b7280', fontSize: 14 }}>Already have an account? </span>
            <button onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: '#00b386', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Login</button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 13 }}>← Back to Home</button>
          </div>
        </div>
      </div>
    </>
  );
}

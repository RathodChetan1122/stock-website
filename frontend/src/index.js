// StockWebsite v2 - Auth enabled
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import HomePage from './pages/HomePage';

function Root() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setPage('app');
    }
  }, []);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setPage('app');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setPage('home');
  };

  if (page === 'home') return (
    <HomePage
      onLogin={() => setPage('login')}
      onRegister={() => setPage('register')}
    />
  );

  if (page === 'login') return (
    <LoginPage
      onLogin={handleLogin}
      onSwitchToRegister={() => setPage('register')}
      onBack={() => setPage('home')}
    />
  );

  if (page === 'register') return (
    <RegisterPage
      onRegister={handleLogin}
      onSwitchToLogin={() => setPage('login')}
      onBack={() => setPage('home')}
    />
  );

  if (page === 'app') return (
    <App user={user} token={token} onLogout={handleLogout} />
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><Root /></React.StrictMode>);
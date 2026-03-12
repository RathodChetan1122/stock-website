import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// ============ STOCK APIs ============
export const stockAPI = {
  // GET all stocks (with optional filters)
  getAll: (params = {}) => api.get('/stocks', { params }),
  
  // GET single stock by ID
  getById: (id) => api.get(`/stocks/${id}`),
  
  // GET stock by symbol
  getBySymbol: (symbol) => api.get(`/stocks/symbol/${symbol}`),
  
  // GET market stats
  getStats: () => api.get('/stocks/stats'),
  
  // POST create stock
  create: (data) => api.post('/stocks', data),
  
  // PUT update stock
  update: (id, data) => api.put(`/stocks/${id}`, data),
  
  // PATCH update price only
  updatePrice: (id, price) => api.patch(`/stocks/${id}/price`, { currentPrice: price }),
  
  // DELETE stock
  delete: (id) => api.delete(`/stocks/${id}`)
};

// ============ PORTFOLIO APIs ============
export const portfolioAPI = {
  // GET all portfolios
  getAll: () => api.get('/portfolio'),
  
  // GET single portfolio with holdings
  getById: (id) => api.get(`/portfolio/${id}`),
  
  // POST create portfolio
  create: (data) => api.post('/portfolio', data),
  
  // PUT update portfolio
  update: (id, data) => api.put(`/portfolio/${id}`, data),
  
  // DELETE portfolio
  delete: (id) => api.delete(`/portfolio/${id}`),
  
  // POST buy stock
  buyStock: (portfolioId, data) => api.post(`/portfolio/${portfolioId}/buy`, data),
  
  // POST sell stock
  sellStock: (portfolioId, data) => api.post(`/portfolio/${portfolioId}/sell`, data)
};

// ============ TRANSACTION APIs ============
export const transactionAPI = {
  // GET all transactions
  getAll: (params = {}) => api.get('/transactions', { params }),
  
  // GET single transaction
  getById: (id) => api.get(`/transactions/${id}`),
  
  // DELETE transaction
  delete: (id) => api.delete(`/transactions/${id}`)
};

export default api;

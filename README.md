# 📈 StockApp — MERN Stack Workshop Project

A full-featured stock trading platform built with **MongoDB, Express, React, Node.js**.

## 🗂️ Project Structure
```
stockapp/
├── backend/
│   ├── models/
│   │   ├── Stock.js          # Stock schema (Mongoose)
│   │   ├── Portfolio.js      # Portfolio + Holdings schema
│   │   └── Transaction.js    # Buy/Sell transaction schema
│   ├── controllers/
│   │   ├── stockController.js       # All stock CRUD logic
│   │   ├── portfolioController.js   # Portfolio + trade logic
│   │   └── transactionController.js # Transaction history
│   ├── routes/
│   │   ├── stockRoutes.js
│   │   ├── portfolioRoutes.js
│   │   └── transactionRoutes.js
│   ├── server.js             # Express entry point
│   ├── seed.js               # Seed DB with sample data
│   └── .env                  # Environment variables
└── frontend/
    └── src/
        ├── App.js            # Main React app (all pages)
        └── services/api.js   # Axios API calls
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Backend Setup
```bash
cd backend
npm install
```

Configure `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stockapp
```

### 2. Seed the Database
```bash
npm run seed
```
This creates 12 sample stocks and a portfolio with $100,000 cash.

### 3. Start Backend
```bash
npm run dev    # with nodemon (auto-restart)
# or
npm start      # production
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

App runs at **http://localhost:3000**, API at **http://localhost:5000**

---

## 🔌 API Endpoints

### Stocks
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/stocks` | Get all stocks (supports `?search=&sector=`) |
| GET | `/api/stocks/:id` | Get stock by ID |
| GET | `/api/stocks/symbol/:symbol` | Get by ticker symbol |
| GET | `/api/stocks/stats` | Market stats (gainers/losers) |
| POST | `/api/stocks` | Create new stock |
| PUT | `/api/stocks/:id` | Update stock (full) |
| PATCH | `/api/stocks/:id/price` | Update price only |
| DELETE | `/api/stocks/:id` | Delete stock |

### Portfolio
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/portfolio` | Get all portfolios |
| GET | `/api/portfolio/:id` | Get portfolio with P&L |
| POST | `/api/portfolio` | Create portfolio |
| PUT | `/api/portfolio/:id` | Update portfolio |
| DELETE | `/api/portfolio/:id` | Delete portfolio |
| POST | `/api/portfolio/:id/buy` | Buy stock |
| POST | `/api/portfolio/:id/sell` | Sell stock |

### Transactions
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/transactions` | All transactions (supports `?type=BUY/SELL`) |
| GET | `/api/transactions/:id` | Single transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

---

## 🛠️ Tech Stack
- **MongoDB** — NoSQL database (Mongoose ODM)
- **Express.js** — RESTful API backend
- **React.js** — Frontend SPA
- **Node.js** — Runtime environment
- **Recharts** — Stock charts

## 📱 Pages
1. **Dashboard** — Market overview, gainers/losers, portfolio summary, pie chart
2. **Markets** — Browse all stocks, search/filter, buy/sell
3. **Portfolio** — Holdings, P&L per stock, total returns
4. **Transactions** — Trade history with delete
5. **Manage** — Admin CRUD for stocks (demonstrates all HTTP methods)

const mongoose = require('mongoose');
require('dotenv').config();
const Stock = require('./models/Stock');
const Portfolio = require('./models/Portfolio');

const sampleStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', currentPrice: 189.50, previousClose: 187.20, openPrice: 188.00, highPrice: 191.00, lowPrice: 187.50, volume: 58000000, marketCap: 2950000000000, peRatio: 29.5, dividendYield: 0.5, description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.', logoColor: '#555555' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', currentPrice: 138.75, previousClose: 140.20, openPrice: 139.00, highPrice: 141.00, lowPrice: 137.80, volume: 24000000, marketCap: 1750000000000, peRatio: 25.3, dividendYield: 0, description: 'Alphabet Inc. provides online advertising services and products, search, cloud, hardware, maps, and more.', logoColor: '#4285F4' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', currentPrice: 415.20, previousClose: 412.80, openPrice: 413.50, highPrice: 417.00, lowPrice: 412.00, volume: 22000000, marketCap: 3080000000000, peRatio: 35.2, dividendYield: 0.7, description: 'Microsoft Corp. develops, licenses, and supports software, services, devices, and solutions worldwide.', logoColor: '#00a1f1' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer', currentPrice: 178.90, previousClose: 175.40, openPrice: 176.00, highPrice: 180.00, lowPrice: 175.20, volume: 45000000, marketCap: 1870000000000, peRatio: 62.1, dividendYield: 0, description: 'Amazon.com Inc. engages in retail sale of consumer products and subscriptions through online and physical stores.', logoColor: '#FF9900' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Industrial', currentPrice: 245.60, previousClose: 252.10, openPrice: 250.00, highPrice: 253.00, lowPrice: 242.00, volume: 98000000, marketCap: 780000000000, peRatio: 72.3, dividendYield: 0, description: 'Tesla Inc. designs, develops, manufactures, leases, and sells electric vehicles and energy generation systems.', logoColor: '#E31937' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', currentPrice: 875.40, previousClose: 862.70, openPrice: 865.00, highPrice: 880.00, lowPrice: 860.00, volume: 42000000, marketCap: 2150000000000, peRatio: 65.4, dividendYield: 0.03, description: 'NVIDIA Corp. designs and manufactures computer graphics processors, chipsets, and related multimedia software.', logoColor: '#76B900' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Finance', currentPrice: 198.30, previousClose: 195.80, openPrice: 196.50, highPrice: 199.50, lowPrice: 195.00, volume: 12000000, marketCap: 575000000000, peRatio: 12.8, dividendYield: 2.3, description: 'JPMorgan Chase & Co. operates as a financial services company worldwide.', logoColor: '#0052B4' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', currentPrice: 158.20, previousClose: 160.40, openPrice: 159.00, highPrice: 160.00, lowPrice: 157.50, volume: 8000000, marketCap: 382000000000, peRatio: 22.1, dividendYield: 3.1, description: 'Johnson & Johnson researches, develops, manufactures, and sells healthcare products worldwide.', logoColor: '#CC0000' },
  { symbol: 'XOM', name: 'Exxon Mobil Corp.', sector: 'Energy', currentPrice: 112.50, previousClose: 110.80, openPrice: 111.00, highPrice: 113.50, lowPrice: 110.50, volume: 18000000, marketCap: 450000000000, peRatio: 14.2, dividendYield: 3.5, description: 'Exxon Mobil Corp. explores and produces crude oil and natural gas in the United States and internationally.', logoColor: '#FF0000' },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Communication', currentPrice: 502.30, previousClose: 495.60, openPrice: 497.00, highPrice: 505.00, lowPrice: 494.00, volume: 20000000, marketCap: 1280000000000, peRatio: 27.8, dividendYield: 0, description: 'Meta Platforms Inc. develops products that enable people to connect and share with friends and family.', logoColor: '#1877F2' },
  { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer', currentPrice: 68.40, previousClose: 67.20, openPrice: 67.50, highPrice: 68.80, lowPrice: 67.00, volume: 14000000, marketCap: 548000000000, peRatio: 32.5, dividendYield: 1.3, description: 'Walmart Inc. engages in retail and wholesale operations in various formats worldwide.', logoColor: '#0071CE' },
  { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Finance', currentPrice: 38.60, previousClose: 37.90, openPrice: 38.00, highPrice: 38.90, lowPrice: 37.80, volume: 52000000, marketCap: 302000000000, peRatio: 11.5, dividendYield: 2.6, description: 'Bank of America Corp. provides banking and financial products and services for individual consumers.', logoColor: '#E31837' },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Stock.deleteMany({});
    await Portfolio.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert stocks
    const stocks = await Stock.insertMany(sampleStocks);
    console.log(`✅ Inserted ${stocks.length} stocks`);

    // Create default portfolio
    const portfolio = await Portfolio.create({
      name: 'My Portfolio',
      cash: 100000,
      holdings: []
    });
    console.log(`✅ Created default portfolio: ${portfolio._id}`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📋 Portfolio ID: ${portfolio._id} (save this for API calls)`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();

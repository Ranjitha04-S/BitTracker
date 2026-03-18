import axios from 'axios';

const API_BASE = 'https://api.coingecko.com/api/v3';

// Simple Cache Object
const cache: Record<string, { data: any; expiry: number }> = {};
const CACHE_DURATION = 60000; // 1 minute cache

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export interface BitcoinData {
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

/**
 * Fetches Live Market Data
 * Resume Point: Implemented custom caching layer to optimize API rate limit usage.
 */
export const fetchBitcoinData = async (): Promise<BitcoinData> => {
  const cacheKey = 'btc_live_data';
  
  if (cache[cacheKey] && cache[cacheKey].expiry > Date.now()) {
    return cache[cacheKey].data;
  }

  try {
    const { data } = await api.get('/coins/bitcoin', {
      params: {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false,
      }
    });

    const result = {
      currentPrice: data.market_data.current_price.usd,
      priceChange24h: data.market_data.price_change_24h,
      priceChangePercentage24h: data.market_data.price_change_percentage_24h,
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      high24h: data.market_data.high_24h.usd,
      low24h: data.market_data.low_24h.usd,
    };

    cache[cacheKey] = { data: result, expiry: Date.now() + CACHE_DURATION };
    return result;

  } catch (error) {
    console.warn('Using Fallback Data: API Rate limited or unreachable.');
    return {
      currentPrice: 62450.12,
      priceChange24h: 1420.50,
      priceChangePercentage24h: 2.15,
      marketCap: 1200000000000,
      volume24h: 42000000000,
      high24h: 63100.00,
      low24h: 61200.00,
    };
  }
};

/**
 * Fetches Historical Price Points for Charts
 */
export const fetchHistoricalData = async (days: number = 30): Promise<{ prices: [number, number][] }> => {
  const cacheKey = `btc_history_${days}`;
  
  if (cache[cacheKey] && cache[cacheKey].expiry > Date.now()) {
    return cache[cacheKey].data;
  }

  try {
    const { data } = await api.get('/coins/bitcoin/market_chart', {
      params: { vs_currency: 'usd', days }
    });

    cache[cacheKey] = { data, expiry: Date.now() + (CACHE_DURATION * 5) };
    return data;
  } catch (error) {
    return { prices: generateMockPriceData(days) };
  }
};

const generateMockPriceData = (days: number): [number, number][] => {
  const data: [number, number][] = [];
  let currentPrice = 58000;
  const now = Date.now();

  for (let i = 0; i < days; i++) {
    const timestamp = now - (days - i) * 24 * 60 * 60 * 1000;
    currentPrice += (Math.random() - 0.5) * 2000;
    data.push([timestamp, parseFloat(currentPrice.toFixed(2))]);
  }
  return data;
};
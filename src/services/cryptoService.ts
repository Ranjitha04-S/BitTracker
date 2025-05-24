import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

interface CoinGeckoResponse {
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    low_24h: {
      usd: number;
    };
  };
}

interface BitcoinData {
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export const fetchBitcoinData = async (): Promise<BitcoinData> => {
  try {
    const response = await axios.get<CoinGeckoResponse>(
      `${COINGECKO_API_URL}/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false`
    );

    const data = response.data;

    return {
      currentPrice: data.market_data.current_price.usd,
      priceChange24h: data.market_data.price_change_24h,
      priceChangePercentage24h: data.market_data.price_change_percentage_24h,
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      high24h: data.market_data.high_24h.usd,
      low24h: data.market_data.low_24h.usd,
    };
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error);

    // Return mock data as fallback
    return {
      currentPrice: 55420.32,
      priceChange24h: 1250.65,
      priceChangePercentage24h: 2.31,
      marketCap: 1050000000000,
      volume24h: 35760000000,
      high24h: 56100.25,
      low24h: 54200.10,
    };
  }
};

export const fetchHistoricalData = async (
  days: number = 30
): Promise<{ prices: [number, number][] }> => {
  try {
    const response = await axios.get<{ prices: [number, number][] }>(
      `${COINGECKO_API_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);

    // Return mock data as fallback
    return {
      prices: generateMockPriceData(days),
    };
  }
};

// Helper function to generate mock price data
const generateMockPriceData = (days: number): [number, number][] => {
  const data: [number, number][] = [];
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  const startPrice = 50000 + Math.random() * 10000;

  for (let i = 0; i < days; i++) {
    const timestamp = now - (days - i) * dayInMs;
    const volatility = Math.random() * 0.05; // 5% max daily change
    const changePercent = (Math.random() * volatility * 2) - volatility;
    const price =
      i === 0 ? startPrice : data[i - 1][1] * (1 + changePercent);

    data.push([timestamp, parseFloat(price.toFixed(2))]);
  }

  return data;
};

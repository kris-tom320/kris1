import { CurrencyCode, ExchangeRates, RateHistory } from '../types';

const API_BASE = 'https://open.er-api.com/v6/latest';

export const fetchLatestRates = async (base: CurrencyCode): Promise<ExchangeRates> => {
  try {
    const response = await fetch(`${API_BASE}/${base}`);
    if (!response.ok) throw new Error('Failed to fetch rates');
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Error fetching rates:', error);
    // Fallback mock data if API fails
    return {
      USD: 1,
      CNY: 7.24,
      HKD: 7.82,
      EUR: 0.92,
      JPY: 151.4,
      GBP: 0.79,
    };
  }
};

// Simulated historical data since most free APIs don't provide easy historical access
export const fetchHistoricalRates = async (base: CurrencyCode, target: CurrencyCode): Promise<RateHistory[]> => {
  const history: RateHistory[] = [];
  const now = new Date();
  
  // Generate 7 days of realistic random walk data
  let currentRate = 1.0; 
  // Get initial relative rate
  const rates = await fetchLatestRates(base);
  currentRate = rates[target] || 1.0;

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const volatility = (Math.random() - 0.5) * 0.02; // 2% max daily change
    currentRate = currentRate * (1 + volatility);
    history.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rate: Number(currentRate.toFixed(4)),
    });
  }
  return history;
};

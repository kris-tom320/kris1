export type CurrencyCode = 'CNY' | 'USD' | 'HKD' | 'EUR' | 'JPY' | 'GBP' | 'AUD' | 'CAD' | 'SGD';

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  flag: string;
  symbol: string;
}

export interface ExchangeRates {
  [key: string]: number;
}

export interface RateHistory {
  date: string;
  rate: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  CNY: { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
  USD: { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
  HKD: { code: 'HKD', name: 'HK Dollar', flag: '🇭🇰', symbol: 'HK$' },
  EUR: { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
  JPY: { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
  GBP: { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£' },
  AUD: { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$' },
  SGD: { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
};

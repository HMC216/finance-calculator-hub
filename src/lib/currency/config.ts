export const currencies = [
  'USD',
  'EUR',
  'GBP',
  'KRW',
  'JPY',
  'CNY',
  'HKD',
  'SGD',
  'AUD',
  'CAD',
] as const;

export type CurrencyCode = (typeof currencies)[number];

export const defaultCurrency: CurrencyCode = 'USD';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  flag: string;
}

export const currencyConfig: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', flag: '🇬🇧' },
  KRW: { code: 'KRW', symbol: '₩', flag: '🇰🇷' },
  JPY: { code: 'JPY', symbol: '¥', flag: '🇯🇵' },
  CNY: { code: 'CNY', symbol: '¥', flag: '🇨🇳' },
  HKD: { code: 'HKD', symbol: 'HK$', flag: '🇭🇰' },
  SGD: { code: 'SGD', symbol: 'S$', flag: '🇸🇬' },
  AUD: { code: 'AUD', symbol: 'A$', flag: '🇦🇺' },
  CAD: { code: 'CAD', symbol: 'C$', flag: '🇨🇦' },
};

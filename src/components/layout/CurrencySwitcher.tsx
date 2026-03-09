'use client';

import { useTranslations } from 'next-intl';
import { useCurrency } from '@/lib/currency/CurrencyContext.tsx';
import {
  currencies,
  currencyConfig,
  type CurrencyCode,
} from '@/lib/currency/config.ts';

export default function CurrencySwitcher() {
  const t = useTranslations();
  const { currency, setCurrency } = useCurrency();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setCurrency(e.target.value as CurrencyCode);
  }

  return (
    <select
      value={currency}
      onChange={handleChange}
      aria-label={t('common.selectCurrency')}
      className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
    >
      {currencies.map((code) => {
        const info = currencyConfig[code];
        return (
          <option key={code} value={code}>
            {info.symbol} {code}
          </option>
        );
      })}
    </select>
  );
}

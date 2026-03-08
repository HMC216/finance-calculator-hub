'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { YearlyDataPoint } from '@/lib/calculations/types.ts';
import { formatCurrency } from '@/lib/formatters.ts';

interface YearlyTableProps {
  data: YearlyDataPoint[];
  defaultExpanded?: boolean;
}

export default function YearlyTable({
  data,
  defaultExpanded = false,
}: YearlyTableProps) {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={toggleExpanded}
        aria-expanded={expanded}
        aria-controls="yearly-table-content"
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
      >
        <span>{expanded ? t('table.hideDetails') : t('table.showDetails')}</span>
        <svg
          className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {expanded && (
        <div
          id="yearly-table-content"
          className="mt-3 overflow-x-auto rounded-lg border border-gray-200"
          role="region"
          aria-label={t('table.ariaLabel')}
          tabIndex={0}
        >
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th
                  scope="col"
                  className="px-4 py-3 text-left font-semibold text-gray-700"
                >
                  {t('table.year')}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right font-semibold text-gray-700"
                >
                  {t('table.contributions')}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right font-semibold text-gray-700"
                >
                  {t('table.interestEarned')}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right font-semibold text-gray-700"
                >
                  {t('table.totalBalance')}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={row.year}
                  className={`border-b border-gray-100 transition-colors hover:bg-blue-50/50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="px-4 py-2.5 font-medium text-gray-900">
                    {row.year}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-gray-700">
                    {formatCurrency(row.contributions)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-green-600">
                    {formatCurrency(row.interestEarned)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold text-gray-900">
                    {formatCurrency(row.totalBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

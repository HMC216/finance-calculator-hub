'use client';

import { useTranslations } from 'next-intl';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { YearlyDataPoint, ScenarioResult } from '@/lib/calculations/types.ts';
import { formatCurrency } from '@/lib/formatters.ts';

interface GrowthChartProps {
  data: YearlyDataPoint[];
  mode: 'stacked-area' | 'multi-line';
  scenarios?: ScenarioResult[];
  xAxisLabel?: string;
  height?: number;
}

interface CustomTooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayloadEntry[];
  label?: string | number;
  yearLabel?: string;
}

function ChartTooltip({ active, payload, label, yearLabel }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold text-gray-700">
        {yearLabel} {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-mono font-medium text-gray-900">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function formatYAxisTick(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

const SCENARIO_COLORS = {
  Conservative: '#94a3b8', // slate-400
  Base: '#3b82f6',         // blue-500
  Aggressive: '#22c55e',   // green-500
} as const;

export default function GrowthChart({
  data,
  mode,
  scenarios,
  xAxisLabel,
  height = 350,
}: GrowthChartProps) {
  const t = useTranslations();

  const resolvedXAxisLabel = xAxisLabel ?? t('chart.year');
  const contributionsLabel = t('chart.contributions');
  const interestLabel = t('chart.interestEarned');
  const yearLabel = t('chart.year');

  if (mode === 'stacked-area') {
    return (
      <div role="img" aria-label={t('chart.stackedAreaAriaLabel')}>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              label={{
                value: resolvedXAxisLabel,
                position: 'insideBottom',
                offset: -10,
                style: { fontSize: 12, fill: '#6b7280' },
              }}
            />
            <YAxis
              tickFormatter={formatYAxisTick}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              width={60}
            />
            <Tooltip content={<ChartTooltip yearLabel={yearLabel} />} />
            <Area
              type="monotone"
              dataKey="contributions"
              name={contributionsLabel}
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="interestEarned"
              name={interestLabel}
              stackId="1"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // multi-line mode: show scenario lines
  if (!scenarios || scenarios.length === 0) return null;

  // Build combined data keyed by year
  const yearMap = new Map<number, Record<string, number>>();
  for (const scenario of scenarios) {
    for (const dp of scenario.result.yearlyData) {
      const existing = yearMap.get(dp.year) ?? { year: dp.year };
      existing[scenario.label] = dp.totalBalance;
      yearMap.set(dp.year, existing);
    }
  }
  const lineData = Array.from(yearMap.values()).sort(
    (a, b) => (a.year as number) - (b.year as number),
  );

  return (
    <div role="img" aria-label={t('chart.multiLineAriaLabel')}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{
              value: resolvedXAxisLabel,
              position: 'insideBottom',
              offset: -10,
              style: { fontSize: 12, fill: '#6b7280' },
            }}
          />
          <YAxis
            tickFormatter={formatYAxisTick}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            width={60}
          />
          <Tooltip content={<ChartTooltip yearLabel={yearLabel} />} />
          {scenarios.map((scenario) => (
            <Line
              key={scenario.label}
              type="monotone"
              dataKey={scenario.label}
              name={`${scenario.label} (${scenario.returnRate}%)`}
              stroke={SCENARIO_COLORS[scenario.label]}
              strokeWidth={scenario.label === 'Base' ? 3 : 2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

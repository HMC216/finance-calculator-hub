'use client';

import { cn } from '@/lib/utils.ts';
import { formatCurrency, formatPercent } from '@/lib/formatters.ts';

interface ResultCardProps {
  label: string;
  value: number;
  format: 'currency' | 'percent';
  variant?: 'primary' | 'secondary' | 'highlight';
  description?: string;
}

const variantStyles = {
  primary: {
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    valueColor: 'text-blue-700',
    labelColor: 'text-blue-600',
  },
  secondary: {
    border: 'border-gray-200',
    bg: 'bg-gray-50',
    valueColor: 'text-gray-700',
    labelColor: 'text-gray-600',
  },
  highlight: {
    border: 'border-green-200',
    bg: 'bg-green-50',
    valueColor: 'text-green-700',
    labelColor: 'text-green-600',
  },
} as const;

export default function ResultCard({
  label,
  value,
  format,
  variant = 'primary',
  description,
}: ResultCardProps) {
  const styles = variantStyles[variant];
  const formattedValue =
    format === 'currency' ? formatCurrency(value) : formatPercent(value);

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-shadow hover:shadow-md',
        styles.border,
        styles.bg,
      )}
      role="figure"
      aria-label={`${label}: ${formattedValue}`}
    >
      <p className={cn('mb-1 text-sm font-medium', styles.labelColor)}>
        {label}
      </p>
      <p
        className={cn(
          'text-2xl font-bold font-mono md:text-3xl',
          styles.valueColor,
        )}
      >
        {formattedValue}
      </p>
      {description && (
        <p className="mt-1.5 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}

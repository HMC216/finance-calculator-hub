'use client';

import { useTranslations } from 'next-intl';
import type { InterpretationItem } from '@/lib/calculations/types.ts';

interface InterpretationTextProps {
  items: InterpretationItem[];
}

export default function InterpretationText({
  items,
}: InterpretationTextProps) {
  const t = useTranslations();

  if (items.length === 0) return null;

  return (
    <div
      className="space-y-2 rounded-xl border border-blue-100 bg-blue-50/50 p-4"
      role="region"
      aria-label={t('results.resultInterpretation')}
    >
      {items.map((item, index) => (
        <p key={index} className="text-sm leading-relaxed text-gray-700">
          {t(item.key, item.values)}
        </p>
      ))}
    </div>
  );
}

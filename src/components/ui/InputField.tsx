'use client';

import { useId, useState, useCallback } from 'react';
import { cn } from '@/lib/utils.ts';

interface InputFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
  showSlider?: boolean;
}

export default function InputField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  tooltip,
  showSlider = true,
}: InputFieldProps) {
  const tooltipId = useId();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (raw === '' || raw === '-') return;
      const parsed = parseFloat(raw);
      if (!Number.isNaN(parsed)) {
        onChange(Math.min(Math.max(parsed, min), max));
      }
    },
    [onChange, min, max],
  );

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseFloat(e.target.value));
    },
    [onChange],
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Label row */}
      <div className="flex items-center gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {tooltip && (
          <div className="relative inline-flex">
            <button
              type="button"
              aria-describedby={showTooltip ? tooltipId : undefined}
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-500 transition-colors hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              aria-label={`Info: ${tooltip}`}
            >
              ?
            </button>
            {showTooltip && (
              <div
                id={tooltipId}
                role="tooltip"
                className="absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
              >
                {tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Number input */}
      <div className="relative flex items-center">
        {prefix && (
          <span className="pointer-events-none absolute left-3 text-sm text-gray-500">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={handleNumberChange}
          min={min}
          max={max}
          step={step}
          aria-label={label}
          className={cn(
            'w-full rounded-lg border border-gray-300 bg-white py-2 text-sm text-gray-900 transition-colors',
            'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none',
            'hover:border-gray-400',
            '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            prefix ? 'pl-7' : 'pl-3',
            suffix ? 'pr-14' : 'pr-3',
          )}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 text-sm text-gray-500">
            {suffix}
          </span>
        )}
      </div>

      {/* Range slider */}
      {showSlider && (
        <div className="flex flex-col gap-1">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
            aria-label={`${label} slider`}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
      )}
    </div>
  );
}

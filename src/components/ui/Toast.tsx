'use client';

import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils.ts';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
  variant?: 'success' | 'info' | 'error';
}

const variantStyles = {
  success: 'bg-green-800 text-white',
  info: 'bg-gray-800 text-white',
  error: 'bg-red-700 text-white',
} as const;

export default function Toast({
  message,
  visible,
  onClose,
  duration = 2000,
  variant = 'success',
}: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      // Trigger entrance animation
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setIsAnimating(false);
        // Give exit animation time to play
        setTimeout(onClose, 200);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible && !isAnimating) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg transition-all duration-200',
        variantStyles[variant],
        isAnimating
          ? 'translate-y-0 opacity-100'
          : 'translate-y-2 opacity-0',
      )}
    >
      {message}
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Toast from '@/components/ui/Toast.tsx';

interface ShareButtonProps {
  calculatorType: string;
}

export default function ShareButton({ calculatorType }: ShareButtonProps) {
  const t = useTranslations();
  const [showToast, setShowToast] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = window.location.href;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setShowToast(true);
    }
  }, []);

  const handleToastClose = useCallback(() => {
    setShowToast(false);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Share ${calculatorType} calculator link`}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
      >
        {/* Link icon */}
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        {t('common.share')}
      </button>

      <Toast
        message={t('common.linkCopied')}
        visible={showToast}
        onClose={handleToastClose}
        duration={2000}
        variant="success"
      />
    </>
  );
}

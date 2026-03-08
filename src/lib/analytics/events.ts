/**
 * Thin wrapper around GA4's gtag event API.
 *
 * Falls back silently when gtag is not loaded (e.g. during SSR or
 * when analytics is blocked).
 */

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      params?: Record<string, string | number>,
    ) => void;
  }
}

/**
 * Send a GA4 custom event.
 *
 * @param eventName - GA4 event name (snake_case recommended, e.g. `calculator_interaction`)
 * @param params    - Key-value pairs attached to the event
 *
 * @example
 * ```ts
 * trackEvent('calculator_interaction', {
 *   calculator: 'compound-interest',
 *   action: 'slider_change',
 *   field: 'years',
 * });
 * ```
 */
export function trackEvent(
  eventName: string,
  params: Record<string, string>,
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }
  window.gtag('event', eventName, params);
}

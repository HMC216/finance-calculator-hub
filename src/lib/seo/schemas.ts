/**
 * Build a JSON-LD FAQPage schema for structured data.
 * @see https://schema.org/FAQPage
 */
export function buildFAQSchema(
  items: Array<{ question: string; answer: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Build a JSON-LD WebApplication schema for a calculator page.
 * @see https://schema.org/WebApplication
 */
export function buildWebAppSchema(calculator: {
  name: string;
  url: string;
  description: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: calculator.name,
    url: calculator.url,
    description: calculator.description,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

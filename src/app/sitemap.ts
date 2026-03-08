import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/constants.ts';
import { locales } from '@/i18n/config.ts';

const routes = [
  { path: '', changeFrequency: 'monthly' as const, priority: 1 },
  { path: '/compound-interest-calculator', changeFrequency: 'monthly' as const, priority: 0.9 },
  { path: '/investment-growth-calculator', changeFrequency: 'monthly' as const, priority: 0.9 },
  { path: '/retirement-calculator', changeFrequency: 'monthly' as const, priority: 0.9 },
  { path: '/about', changeFrequency: 'yearly' as const, priority: 0.5 },
  { path: '/privacy-policy', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/terms-of-service', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/disclaimer', changeFrequency: 'yearly' as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${route.path}`]),
          ),
        },
      });
    }
  }

  return entries;
}

import { getTranslations } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants.ts';

export default async function AuthorBio() {
  const t = await getTranslations();

  return (
    <section
      aria-label="About the author"
      className="mt-12 rounded-xl border border-gray-200 bg-white p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
          {SITE_CONFIG.author.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2) || 'FC'}
        </div>
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {SITE_CONFIG.author.name}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              <svg
                className="h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              {t('authorBio.credential')}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            {t('authorBio.bio', { credential: SITE_CONFIG.author.credential })}
          </p>
        </div>
      </div>
    </section>
  );
}

import { getTranslations } from 'next-intl/server';

export default async function Disclaimer() {
  const t = await getTranslations();

  return (
    <section
      aria-label="Financial disclaimer"
      className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5"
    >
      <h3 className="mb-2 text-sm font-semibold text-amber-900">
        {t('disclaimer.heading')}
      </h3>
      <p className="text-xs leading-relaxed text-amber-800">
        {t('disclaimer.text')}
      </p>
    </section>
  );
}

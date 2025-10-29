import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { SportCategory } from '@/lib/api/homepage';

interface SportsCategoriesProps {
  categories: SportCategory[];
}

export async function SportsCategories({ categories }: SportsCategoriesProps) {
  const t = await getTranslations('Homepage');

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      {/* Section header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-medium text-[#57534E] mb-2">
          {t('browseByCategoryTitle')}
        </h2>
        <p className="text-[#A8A29E] text-sm">{t('browseByCategoryDescription')}</p>
      </div>

      {/* Sports categories grid - 6 columns responsive */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/events?sport=${category.slug}`}
            className="group relative flex flex-col items-center justify-center h-24 rounded-lg bg-[#E7E5E4] hover:bg-[#9C8573] transition-colors duration-200 overflow-hidden"
          >
            {/* Category icon */}
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">
              {category.icon}
            </div>
            {/* Category name */}
            <p className="text-xs text-center font-medium text-[#57534E] group-hover:text-[#E7E5E4] transition-colors duration-200 line-clamp-2 px-2">
              {category.name}
            </p>

            {/* Noise texture overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgc2VlZD0iMiIgLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIGZpbGwtb3BhY2l0eT0iMC4wMyIgLz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

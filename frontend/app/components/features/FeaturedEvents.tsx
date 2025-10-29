import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Event } from '@/lib/api/homepage';

interface FeaturedEventsProps {
  events: Event[];
}

export async function FeaturedEvents({ events }: FeaturedEventsProps) {
  const t = await getTranslations('Homepage');

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      {/* Section header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-medium text-[#57534E] mb-2">
            {t('featuredEventsTitle')}
          </h2>
          <p className="text-[#A8A29E] text-sm">{t('featuredEventsDescription')}</p>
        </div>
        <Link
          href="/events"
          className="text-[#9C8573] hover:text-[#8FA87E] transition-colors text-sm font-medium whitespace-nowrap"
        >
          {t('viewAll')} →
        </Link>
      </div>

      {/* Featured events grid - 3 columns responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/watch/${event.id}`}
            className="group relative bg-[#E7E5E4] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            {/* Card image container - 16:9 aspect ratio */}
            <div className="relative w-full bg-[#D4D4D8]" style={{ paddingBottom: '56.25%' }}>
              {event.thumbnail_url ? (
                <img
                  src={event.thumbnail_url}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#D4D4D8] to-[#A8A29E]">
                  <svg className="w-12 h-12 text-[#57534E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Status badge overlay */}
              {event.status === 'live' && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-[#B89968] text-[#57534E] px-2 py-1 rounded-full text-xs font-semibold uppercase flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-[#57534E] rounded-full animate-pulse"></span>
                    {t('liveIndicator')}
                  </div>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#292524] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>

            {/* Card content */}
            <div className="p-4 bg-[#E7E5E4]">
              {event.sport && (
                <p className="text-xs uppercase tracking-wider text-[#A8A29E] font-mono mb-2">
                  {event.sport}
                </p>
              )}
              <h3 className="text-lg font-medium text-[#57534E] mb-2 line-clamp-2">
                {event.title}
              </h3>
              {event.description && (
                <p className="text-sm text-[#78716C] line-clamp-2 mb-3">
                  {event.description}
                </p>
              )}
              <p className="text-xs text-[#A8A29E] font-mono">
                {new Date(event.started_at || event.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Noise texture overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgc2VlZD0iMiIgLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIGZpbGwtb3BhY2l0eT0iMC4wMyIgLz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

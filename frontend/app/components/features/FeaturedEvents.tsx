import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Event } from '@/lib/api/homepage';
import { textStyles, cardClassName } from '@/lib/styles/design-system';

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
          <h2 className={`${textStyles.headline-lg} mb-2`}>
            {t('featuredEventsTitle')}
          </h2>
          <p className={`${textStyles.caption} text-ash`}>{t('featuredEventsDescription')}</p>
        </div>
        <Link
          href="/events"
          className={`${textStyles.label} text-clay hover:text-signal transition-colors whitespace-nowrap`}
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
            className={`${cardClassName('default')} group overflow-hidden hover:shadow-layered transition-shadow duration-200`}
          >
            {/* Card image container - 16:9 aspect ratio */}
            <div className="relative w-full bg-fog aspect-video overflow-hidden">
              {event.thumbnail_url ? (
                <img
                  src={event.thumbnail_url}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-fog to-ash">
                  <svg className="w-12 h-12 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Status badge overlay */}
              {event.status === 'live' && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="badge badge-live">
                    {t('liveIndicator')}
                  </div>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-shadow via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>

            {/* Card content */}
            <div className="p-4">
              {event.sport && (
                <p className={`${textStyles.caption} text-ash mb-2`}>
                  {event.sport}
                </p>
              )}
              <h3 className={`${textStyles.title} text-stone mb-2 line-clamp-2`}>
                {event.title}
              </h3>
              {event.description && (
                <p className={`${textStyles.body} text-concrete line-clamp-2 mb-3`}>
                  {event.description}
                </p>
              )}
              <p className={`${textStyles.caption} text-ash font-mono`}>
                {new Date(event.started_at || event.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Noise texture overlay */}
            <div className="absolute inset-0 noise-texture pointer-events-none"></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

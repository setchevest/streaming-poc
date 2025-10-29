// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { gridStyles } from '@/lib/styles/design-system';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Event {
  id: number;
  title: string;
  description: string;
  status: string;
  started_at: string;
  created_at: string;
  thumbnail_url?: string;
}

export default function Home() {
  const t = useTranslations();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/events`);
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      live: 'badge-live',
      upcoming: 'badge-upcoming',
      ended: 'badge-ended'
    };
    return badges[status as keyof typeof badges] || 'badge-upcoming';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dust flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-signal mx-auto"></div>
          <p className="mt-4 text-concrete">{t('Common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dust">
      <nav className="bg-dust border-b border-ash border-opacity-30 shadow-worn sticky top-0 z-50">
        <div className="container flex justify-between h-16 items-center">
          <h1 className="text-headline-sm font-medium text-stone">
            🎥 Streaming Platform
          </h1>
          <Link
            href="/create"
            className="btn-primary px-4 py-2"
          >
            {t('Homepage.watchLiveButton')}
          </Link>
        </div>
      </nav>

      <main className="container py-8">
        <div className="mb-8">
          <h2 className="text-display-sm font-medium text-stone mb-2">{t('Homepage.featuredEventsTitle')}</h2>
          <p className="text-body text-concrete">{t('Homepage.featuredEventsDescription')}</p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-body text-ash mb-4">{t('Homepage.noEventsTitle')}</p>
            <Link
              href="/create"
              className="btn-primary inline-flex px-4 py-3"
            >
              {t('Homepage.watchLiveButton')} →
            </Link>
          </div>
        ) : (
          <div className={gridStyles['responsive-3']}>
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/watch/${event.id}`}
                className="card hover:shadow-layered transition-shadow duration-300 group overflow-hidden"
              >
                <div className="aspect-video bg-fog relative overflow-hidden">
                  {event.thumbnail_url ? (
                    <img
                      src={event.thumbnail_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-fog to-ash">
                      <svg className="w-16 h-16 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-shadow via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`${getStatusBadge(event.status)}`}>
                      {event.status === 'live' ? t('Homepage.liveIndicator') : event.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-title font-medium text-stone mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="text-body text-concrete line-clamp-2 mb-3">
                      {event.description}
                    </p>
                  )}
                  <p className="text-caption text-ash font-mono">
                    {new Date(event.created_at).toLocaleDateString(t('Watch.locale'), {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
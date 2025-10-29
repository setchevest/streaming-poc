// app/watch/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import StatisticsPanel from '@/components/features/StatisticsPanel';
import { useEvent } from '@/lib/api/hooks';
import { QueryProvider } from '@/components/providers/QueryProvider';

// Import VideoPlayer as client-only component
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  ssr: false,
});

// Force dynamic rendering - this page should not be pre-rendered
export const dynamicParams = true;

function WatchPageContent() {
  const params = useParams();
  const t = useTranslations();

  // Use React Query hook for event data with automatic polling
  const { data: event, isLoading: loading, error } = useEvent(params.id as string);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">{t('Watch.loadingStream')}</p>
        </div>
      </div>
    );
  }

  if (error || (!loading && !event)) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">
            {error ? t('Watch.errorLoading') : t('Watch.eventNotFound')}
          </p>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            {t('Watch.backHome')}
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="text-white hover:text-gray-300">
              {t('Common.back')}
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
              {event.status === 'live' && event.hls_url ? (
                <VideoPlayer
                  streamUrl={event.hls_url}
                  autoplay={true}
                />
              ) : event.status === 'scheduled' ? (
                <div className="aspect-video flex items-center justify-center bg-gray-800">
                  <div className="text-center text-white">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xl font-semibold">{t('Watch.scheduledTitle')}</p>
                    <p className="text-gray-400 mt-2">{t('Watch.scheduledDescription')}</p>
                  </div>
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-800">
                  <div className="text-center text-white">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                    <p className="text-xl font-semibold">{t('Watch.endedTitle')}</p>
                    <p className="text-gray-400 mt-2">{t('Watch.endedDescription')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Event Info */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-white">{event.title}</h1>
                {event.status === 'live' && (
                  <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold uppercase animate-pulse">
                    {t('Watch.liveStatus')}
                  </span>
                )}
              </div>
              {event.description && (
                <p className="text-gray-300 text-lg">{event.description}</p>
              )}
              {event.started_at && (
                <p className="text-gray-500 text-sm mt-2">
                  {t('Watch.startTime')} {new Date(event.started_at).toLocaleString(t('Watch.locale'))}
                </p>
              )}
            </div>
          </div>

          {/* Chat/Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stream Statistics Panel */}
            <StatisticsPanel
              eventId={event.id}
              isLive={event.status === 'live'}
              updateInterval={5000}
            />

            {/* Event Information */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">{t('Watch.information')}</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <p className="text-sm text-gray-500">{t('Watch.status')}</p>
                  <p className="font-semibold capitalize">{event.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('Watch.eventId')}</p>
                  <p className="font-mono text-sm">{event.id}</p>
                </div>
                {event.hls_url && (
                  <div>
                    <p className="text-sm text-gray-500">{t('Watch.streamUrl')}</p>
                    <p className="font-mono text-xs break-all bg-gray-900 p-2 rounded">
                      {event.hls_url}
                    </p>
                  </div>
                )}
              </div>

              {/* Coming soon: Chat */}
              <div className="mt-8 p-4 bg-gray-900 rounded text-center">
                <p className="text-gray-500 text-sm">{t('Watch.liveChatComingSoon')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WatchPage() {
  return (
    <QueryProvider>
      <WatchPageContent />
    </QueryProvider>
  );
}
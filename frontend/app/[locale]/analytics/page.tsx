// app/[locale]/analytics/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useEvents, useEvent } from '@/lib/api/hooks';

const AnalyticsDashboard = dynamic(
  () => import('@/components/features/AnalyticsDashboard'),
  { ssr: false }
);

// Force dynamic rendering - this page should not be pre-rendered
export const dynamicParams = true;

function AnalyticsPageContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event_id');

  // Fetch available events for selection
  const { data: events = [], isLoading: loadingEvents } = useEvents({ limit: 50 });

  // Fetch specific event details if event_id is provided
  const {
    data: event,
    isLoading: loading,
    error,
  } = useEvent(eventId || '', {
    enabled: !!eventId,
  });

  const handleEventSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId) {
      window.location.href = `/analytics?event_id=${selectedId}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-[#E7E5E4] border-b border-[#A8A29E] border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#8FA87E] hover:text-[#7A9A6A] transition-colors mb-4"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Home
              </Link>
              <h1 className="text-3xl md:text-4xl font-medium text-[#57534E]">
                Stream Analytics
              </h1>
              <p className="text-[#A8A29E] mt-2">
                Real-time performance metrics and historical data analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Selection */}
        <div className="mb-8">
          <label htmlFor="event-select" className="block text-sm font-semibold text-[#57534E] mb-2">
            Select Stream to Analyze
          </label>
          <select
            id="event-select"
            value={eventId || ''}
            onChange={handleEventSelect}
            disabled={loadingEvents}
            className="w-full max-w-md px-4 py-2 bg-[#E7E5E4] border border-[#A8A29E] border-opacity-30 rounded-lg text-[#57534E] focus:outline-none focus:ring-2 focus:ring-[#8FA87E] focus:border-transparent disabled:opacity-50"
            aria-label="Select event to view analytics"
          >
            <option value="">
              {loadingEvents ? 'Loading events...' : 'Choose an event...'}
            </option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title} - {evt.status}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading && eventId && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8FA87E] mx-auto mb-4"></div>
              <p className="text-[#A8A29E]">Loading analytics data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            className="bg-[#E7E5E4] border border-[#A8826B] border-opacity-30 rounded-lg p-6"
            role="alert"
          >
            <p className="text-[#A8826B] font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#8FA87E] text-white rounded font-medium hover:bg-[#7A9A6A] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Analytics Dashboard */}
        {event && !loading && (
          <AnalyticsDashboard eventId={event.id} eventTitle={event.title} />
        )}

        {/* Empty State */}
        {!eventId && !loading && (
          <div className="bg-[#E7E5E4] border border-[#A8A29E] border-opacity-20 rounded-lg p-12 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-[#57534E] mb-2">
              No Stream Selected
            </h2>
            <p className="text-[#A8A29E] max-w-md mx-auto">
              Select a stream from the dropdown above to view detailed analytics and performance metrics.
            </p>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <section className="bg-[#E7E5E4] border-t border-[#A8A29E] border-opacity-20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#57534E] mb-2">
                Peak Viewers
              </h3>
              <p className="text-xs text-[#A8A29E]">
                Maximum number of concurrent viewers reached during the stream
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#57534E] mb-2">
                Buffer Rate
              </h3>
              <p className="text-xs text-[#A8A29E]">
                Percentage of playback time affected by buffering events
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#57534E] mb-2">
                Average Bitrate
              </h3>
              <p className="text-xs text-[#A8A29E]">
                Typical streaming bitrate during the selected time period
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalyticsPageContent />
    </Suspense>
  );
}

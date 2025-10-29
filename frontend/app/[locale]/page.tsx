import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import {
  fetchLiveStreams,
  fetchFeaturedEvents,
  fetchUpcomingEvents,
  fetchSportCategories,
} from '@/lib/api/homepage';
import { HeroSection } from '@/components/features/HeroSection';
import { FeaturedEvents } from '@/components/features/FeaturedEvents';
import { UpcomingEvents } from '@/components/features/UpcomingEvents';
import { SportsCategories } from '@/components/features/SportsCategories';

/**
 * Homepage - Main landing page for the sports streaming platform
 * Features:
 * - Hero section with live stream (conditional)
 * - Featured events grid (3 columns)
 * - Upcoming events grid (4 columns)
 * - Sports categories browse section (6 columns)
 *
 * Note: This is a server component that doesn't use React Query
 * For client-side pages, see app/page.tsx
 */
export default async function HomePage() {
  const t = await getTranslations('Homepage');

  // Parallel data fetching
  const [liveStreams, featuredEvents, upcomingEvents, sportCategories] =
    await Promise.all([
      fetchLiveStreams(),
      fetchFeaturedEvents(),
      fetchUpcomingEvents(6),
      fetchSportCategories(),
    ]);

  // Get first live stream if available
  const heroStream = liveStreams.length > 0 ? liveStreams[0] : undefined;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Page metadata and SEO */}
      <div className="sr-only">
        <h1>{t('pageTitle')}</h1>
        <p>{t('pageDescription')}</p>
      </div>

      {/* Main content wrapper */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Hero Section - Conditional rendering if live stream exists */}
        {heroStream && (
          <Suspense fallback={<div className="h-96 bg-[#D4D4D8] rounded-lg animate-pulse mb-12" />}>
            <HeroSection liveStream={heroStream} />
          </Suspense>
        )}

        {/* Featured Events Section */}
        {featuredEvents.length > 0 && (
          <Suspense fallback={
            <div className="mb-16">
              <div className="h-8 w-48 bg-[#D4D4D8] rounded animate-pulse mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-80 bg-[#D4D4D8] rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          }>
            <FeaturedEvents events={featuredEvents} />
          </Suspense>
        )}

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <Suspense fallback={
            <div className="mb-16">
              <div className="h-8 w-48 bg-[#D4D4D8] rounded animate-pulse mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-64 bg-[#D4D4D8] rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          }>
            <UpcomingEvents events={upcomingEvents} />
          </Suspense>
        )}

        {/* Sports Categories Section */}
        {sportCategories.length > 0 && (
          <Suspense fallback={
            <div className="mb-16">
              <div className="h-8 w-48 bg-[#D4D4D8] rounded animate-pulse mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-24 bg-[#D4D4D8] rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          }>
            <SportsCategories categories={sportCategories} />
          </Suspense>
        )}

        {/* Empty state - No events available */}
        {!heroStream && featuredEvents.length === 0 && upcomingEvents.length === 0 && (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-16 w-16 text-[#A8A29E] mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-2xl font-medium text-[#57534E] mb-2">
              {t('noEventsTitle')}
            </h2>
            <p className="text-[#78716C] mb-6">{t('noEventsDescription')}</p>
          </div>
        )}
      </main>
    </div>
  );
}

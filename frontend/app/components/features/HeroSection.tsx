'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Event } from '@/lib/api/homepage';
import { useTranslations } from 'next-intl';

interface HeroSectionProps {
  liveStream?: Event;
}

export function HeroSection({ liveStream }: HeroSectionProps) {
  const t = useTranslations('Homepage');

  if (!liveStream) {
    return null;
  }

  return (
    <div className="w-full mb-12">
      {/* Hero video container - 16:9 aspect ratio */}
      <div className="relative w-full bg-[#78716C] rounded-lg overflow-hidden shadow-lg">
        {/* Aspect ratio container */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          {/* Video player placeholder or actual player would go here */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#292524] flex items-center justify-center">
            <div className="text-center">
              <svg className="w-24 h-24 text-[#E7E5E4] mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <p className="text-[#E7E5E4] text-lg">{t('watchLive')}</p>
            </div>
          </div>

          {/* Live badge overlay - top right */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-[#B89968] text-[#57534E] px-3 py-1 rounded-full text-xs font-semibold uppercase flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-[#57534E] rounded-full animate-pulse"></span>
              {t('liveIndicator')}
            </div>
          </div>

          {/* Event info overlay - bottom left */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#292524] to-transparent p-6 z-5">
            <h2 className="text-4xl font-medium text-[#E7E5E4] mb-2">
              {liveStream.title}
            </h2>
            <div className="flex items-center gap-4">
              {liveStream.sport && (
                <span className="text-sm uppercase tracking-wider text-[#A8A29E] font-mono">
                  {liveStream.sport}
                </span>
              )}
            </div>
          </div>

          {/* Watch Live button overlay - bottom right */}
          <div className="absolute bottom-6 right-6 z-10">
            <Link
              href={`/watch/${liveStream.id}`}
              className="inline-block px-6 py-3 bg-[#8FA87E] text-[#57534E] font-semibold rounded-md hover:bg-[#7C8A6E] transition-colors shadow-lg"
            >
              {t('watchLiveButton')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

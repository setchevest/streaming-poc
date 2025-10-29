'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import StatisticItem from './StatisticItem';
import { StreamAnalytics, StatisticItem as StatisticItemType, TIME_RANGES } from '@/lib/types/statistics';

interface Props {
  eventId: number;
  eventTitle?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AnalyticsDashboard({ eventId, eventTitle }: Props) {
  const [analytics, setAnalytics] = useState<StreamAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(24); // hours

  const fetchAnalytics = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get(
        `${API_URL}/api/events/${eventId}/analytics`,
        {
          params: { hours: selectedTimeRange },
        }
      );

      if (response.data.analytics) {
        setAnalytics(response.data.analytics);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Unable to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [eventId, selectedTimeRange]);

  useEffect(() => {
    setLoading(true);
    fetchAnalytics();
  }, [selectedTimeRange, fetchAnalytics]);

  const getAnalyticsItems = (): StatisticItemType[] => {
    if (!analytics) return [];

    const items: StatisticItemType[] = [
      {
        label: 'Peak Viewers',
        value: analytics.peak_viewers.toLocaleString(),
        tooltip: 'Maximum concurrent viewers during selected period',
        icon: '📈',
      },
      {
        label: 'Average Viewers',
        value: analytics.avg_viewers.toLocaleString(),
        tooltip: 'Average number of concurrent viewers',
        icon: '👥',
      },
      {
        label: 'Total Uptime',
        value: formatUptime(analytics.uptime_minutes),
        tooltip: `Stream was live for ${analytics.uptime_minutes} minutes`,
        icon: '⏱️',
      },
      {
        label: 'Max Buffer Rate',
        value: analytics.max_buffer_rate.toFixed(1),
        unit: '%',
        tooltip: 'Highest buffering rate experienced',
        icon: '📊',
        trend:
          analytics.max_buffer_rate < 0.5
            ? 'up'
            : analytics.max_buffer_rate < 1.0
              ? 'stable'
              : 'down',
      },
      {
        label: 'Avg Buffer Rate',
        value: analytics.avg_buffer_rate.toFixed(1),
        unit: '%',
        tooltip: 'Average buffering rate across session',
        icon: '🔄',
        trend:
          analytics.avg_buffer_rate < 0.5
            ? 'up'
            : analytics.avg_buffer_rate < 1.0
              ? 'stable'
              : 'down',
      },
      {
        label: 'Avg Bitrate',
        value: (analytics.avg_bitrate / 1000).toFixed(1),
        unit: 'Mbps',
        tooltip: 'Average streaming bitrate',
        icon: '📡',
      },
    ];

    return items;
  };

  const getEngagementMetrics = (): StatisticItemType[] => {
    if (!analytics) return [];

    const engagementItems: StatisticItemType[] = [
      {
        label: 'Data Points Collected',
        value: analytics.sample_count.toLocaleString(),
        tooltip: 'Number of statistics samples in this period',
        icon: '📋',
      },
      {
        label: 'Measurement Interval',
        value: '5',
        unit: 's',
        tooltip: 'Statistics are collected every 5 seconds',
        icon: '⏲️',
      },
    ];

    return engagementItems;
  };

  const items = getAnalyticsItems();
  const engagementItems = getEngagementMetrics();

  if (loading && !analytics) {
    return (
      <div
        className="bg-[#E7E5E4] border border-[#A8A29E] border-opacity-20 rounded-lg p-6"
        role="region"
        aria-label="Analytics dashboard loading"
      >
        {/* Skeleton loading state */}
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-6 bg-[#D4D4D8] rounded w-32 mb-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse text-center p-4">
                <div className="h-4 bg-[#D4D4D8] rounded mb-2 w-20 mx-auto"></div>
                <div className="h-8 bg-[#D4D4D8] rounded w-24 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div
        className="bg-[#E7E5E4] border border-[#A8826B] border-opacity-30 rounded-lg p-6"
        role="alert"
      >
        <p className="text-center text-[#A8826B] font-medium mb-4">{error}</p>
        <button
          onClick={() => fetchAnalytics()}
          className="w-full px-4 py-2 bg-[#8FA87E] text-white rounded font-medium hover:bg-[#7A9A6A] transition-colors"
          aria-label="Retry loading analytics"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section
      className="bg-[#E7E5E4] border border-[#A8A29E] border-opacity-20 rounded-lg p-6"
      role="region"
      aria-label="Stream analytics dashboard"
    >
      {/* Header with title and time range selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-[#A8A29E] border-opacity-20">
        <div>
          <h2 className="text-lg font-semibold text-[#57534E]">Stream Analytics</h2>
          {eventTitle && (
            <p className="text-sm text-[#A8A29E] mt-1">{eventTitle}</p>
          )}
        </div>

        {/* Time range selector */}
        <div className="flex flex-wrap gap-2">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedTimeRange(range.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                selectedTimeRange === range.value
                  ? 'bg-[#8FA87E] text-white'
                  : 'bg-[#D4D4D8] text-[#57534E] hover:bg-[#C0BEA7] hover:text-[#57534E]'
              }`}
              aria-pressed={selectedTimeRange === range.value}
              aria-label={`View analytics for ${range.label}`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Performance metrics section */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#57534E] mb-4">
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, 6).map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="bg-[#D4D4D8] bg-opacity-40 border border-[#A8A29E] border-opacity-10 rounded-lg p-4"
            >
              <StatisticItem item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Engagement & sampling section */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#57534E] mb-4">
          Data Collection
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {engagementItems.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="bg-[#D4D4D8] bg-opacity-40 border border-[#A8A29E] border-opacity-10 rounded-lg p-4"
            >
              <StatisticItem item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Data attribution and timestamps */}
      <div className="mt-6 pt-4 border-t border-[#A8A29E] border-opacity-20">
        <div className="space-y-2 text-xs text-[#A8A29E] font-mono">
          <p>
            <span className="text-[#78716C]">Data Period:</span> Last {selectedTimeRange} hour{selectedTimeRange !== 1 ? 's' : ''}
          </p>
          <p>
            <span className="text-[#78716C]">Accuracy:</span> Statistics are estimated based on{' '}
            {analytics?.sample_count || 0} collected samples
          </p>
          <p>
            <span className="text-[#78716C]">Collection Interval:</span> Every 5 seconds
          </p>
        </div>
      </div>

      {/* Accessibility: Announce updates to screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        {analytics && (
          <>
            Stream analytics for {selectedTimeRange} hours. Peak viewers: {analytics.peak_viewers}.
            Average viewers: {analytics.avg_viewers}. Average buffer rate: {analytics.avg_buffer_rate}%.
          </>
        )}
      </div>
    </section>
  );
}

/**
 * Format uptime in minutes to a human-readable string
 */
function formatUptime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

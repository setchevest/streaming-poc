'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import StatisticItem from './StatisticItem';
import { StreamStats, StatisticItem as StatisticItemType } from '@/lib/types/statistics';

interface Props {
  eventId: number;
  isLive?: boolean;
  updateInterval?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function StatisticsPanel({
  eventId,
  isLive = false,
  updateInterval = 5000,
}: Props) {
  const [stats, setStats] = useState<StreamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousStatsRef = useRef<StreamStats | null>(null);

  // Fetch current statistics
  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_URL}/api/events/${eventId}/stats`);

      if (response.data.stats) {
        setStats(response.data.stats);
        setLastUpdate(new Date());
        setIsUpdating(false);
      }
    } catch (err) {
      console.error('Error fetching stream stats:', err);
      setError('Unable to load statistics');
      setIsUpdating(false);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Initialize stats and set up polling
  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Only set up polling if stream is live
    if (isLive) {
      setIsUpdating(true);
      intervalRef.current = setInterval(() => {
        setIsUpdating(true);
        fetchStats();
      }, updateInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [eventId, isLive, updateInterval, fetchStats]);

  // Transform stats to displayable items
  const getStatisticItems = (): StatisticItemType[] => {
    if (!stats) return [];

    const items: StatisticItemType[] = [
      {
        label: 'Current Viewers',
        value: stats.viewers.toLocaleString(),
        tooltip: 'Number of viewers currently watching',
        icon: '👥',
        trend: previousStatsRef.current
          ? stats.viewers > previousStatsRef.current.viewers
            ? 'up'
            : stats.viewers < previousStatsRef.current.viewers
              ? 'down'
              : 'stable'
          : undefined,
      },
      {
        label: 'Peak Viewers',
        value: stats.peak_viewers.toLocaleString(),
        tooltip: 'Maximum concurrent viewers reached',
        icon: '📈',
      },
    ];

    if (stats.uptime_minutes > 0) {
      const hours = Math.floor(stats.uptime_minutes / 60);
      const minutes = stats.uptime_minutes % 60;
      const uptimeStr =
        hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

      items.push({
        label: 'Uptime',
        value: uptimeStr,
        tooltip: `Stream has been live for ${stats.uptime_minutes} minutes`,
        icon: '⏱️',
      });
    }

    if (stats.buffer_rate !== undefined && stats.buffer_rate >= 0) {
      items.push({
        label: 'Buffer Rate',
        value: stats.buffer_rate.toFixed(1),
        unit: '%',
        tooltip: 'Percentage of time viewers experienced buffering',
        icon: '📊',
        trend:
          stats.buffer_rate < 0.5 ? 'up' : stats.buffer_rate < 1.0 ? 'stable' : 'down',
      });
    }

    if (stats.avg_bitrate > 0) {
      const mbps = (stats.avg_bitrate / 1000).toFixed(1);
      items.push({
        label: 'Avg Bitrate',
        value: mbps,
        unit: 'Mbps',
        tooltip: 'Average streaming bitrate',
        icon: '📡',
      });
    }

    // Store current stats for trend calculation
    previousStatsRef.current = stats;

    return items;
  };

  const items = getStatisticItems();

  if (loading) {
    return (
      <div
        className="bg-[#E7E5E4] border border-[#A8A29E] border-opacity-20 rounded-lg p-4"
        role="region"
        aria-label="Stream statistics loading"
      >
        {/* Skeleton loading state */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse text-center">
              <div className="h-4 bg-[#D4D4D8] rounded mb-2 w-20 mx-auto"></div>
              <div className="h-8 bg-[#D4D4D8] rounded w-24 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-[#E7E5E4] border border-[#A8826B] border-opacity-30 rounded-lg p-4"
        role="alert"
      >
        <p className="text-sm text-[#A8826B] text-center font-medium">{error}</p>
        <button
          onClick={() => fetchStats()}
          className="mt-3 w-full px-3 py-2 bg-[#8FA87E] text-white rounded text-sm font-medium hover:bg-[#7A9A6A] transition-colors"
          aria-label="Retry loading statistics"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section
      className="bg-[#E7E5E4] border border-[#A8A29E] border-opacity-20 rounded-lg p-4"
      role="region"
      aria-label="Stream statistics"
    >
      {/* Header with title and update status */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#A8A29E] border-opacity-20">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#57534E]">
          Stream Statistics
        </h3>
        <div className="flex items-center gap-2">
          {isLive && isUpdating && (
            <div
              className="w-2 h-2 rounded-full bg-[#8FA87E] animate-pulse"
              aria-label="Updating"
              title="Data is being updated"
            ></div>
          )}
          {lastUpdate && (
            <time
              className="text-xs text-[#A8A29E] font-mono"
              dateTime={lastUpdate.toISOString()}
              title={`Last updated: ${lastUpdate.toLocaleTimeString()}`}
            >
              {lastUpdate.toLocaleTimeString()}
            </time>
          )}
        </div>
      </div>

      {/* Statistics grid - responsive 2-4 columns based on panel width */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, index) => (
          <StatisticItem key={`${item.label}-${index}`} item={item} />
        ))}
      </div>

      {/* Auto-update indicator for live streams */}
      {isLive && (
        <p className="text-xs text-[#A8A29E] text-center mt-3 pt-3 border-t border-[#A8A29E] border-opacity-20">
          Updates every {Math.round(updateInterval / 1000)} seconds
        </p>
      )}

      {/* Accessibility: Announce updates to screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        {stats && (
          <>
            Current viewers: {stats.viewers}. Peak viewers: {stats.peak_viewers}.
            {stats.buffer_rate >= 0 && ` Buffer rate: ${stats.buffer_rate}%.`}
          </>
        )}
      </div>
    </section>
  );
}

/**
 * Stream Statistics & Analytics Type Definitions
 * Defines types for real-time stream metrics and historical analytics data
 */

export interface StreamStats {
  id: number;
  event_id: number;
  viewers: number;
  peak_viewers: number;
  uptime_minutes: number;
  buffer_rate: number;
  avg_bitrate: number;
  timestamp: string;
}

export interface StreamAnalytics {
  event_id: number;
  event_title: string;
  uptime_minutes: number;
  peak_viewers: number;
  avg_viewers: number;
  max_buffer_rate: number;
  avg_buffer_rate: number;
  avg_bitrate: number;
  sample_count: number;
}

export interface StatisticItem {
  label: string;
  value: string | number;
  unit?: string;
  tooltip?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface StatisticsPanelProps {
  eventId: number;
  isLive?: boolean;
  updateInterval?: number;
}

export interface AnalyticsDashboardProps {
  eventId: number;
  eventTitle?: string;
}

export interface StatsHistoryPoint {
  timestamp: string;
  viewers: number;
  buffer_rate: number;
  avg_bitrate: number;
}

export interface TimeRange {
  label: string;
  value: number; // hours
}

export const TIME_RANGES: TimeRange[] = [
  { label: 'Last 1 hour', value: 1 },
  { label: 'Last 3 hours', value: 3 },
  { label: 'Last 6 hours', value: 6 },
  { label: 'Last 24 hours', value: 24 },
];

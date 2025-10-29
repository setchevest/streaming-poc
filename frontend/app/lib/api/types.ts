/**
 * API Response Types
 * Type definitions for API responses
 */

export interface Event {
  id: number;
  title: string;
  description: string;
  status: 'live' | 'scheduled' | 'ended';
  started_at: string;
  created_at: string;
  ended_at?: string;
  thumbnail_url?: string;
  sport?: string;
  hls_url?: string;
  stream_key?: string;
  featured?: boolean;
}

export interface SportCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface EventsResponse {
  events: Event[];
}

export interface EventResponse {
  event: Event;
}

export interface CategoriesResponse {
  categories: SportCategory[];
}

export interface CreateEventRequest {
  title: string;
  description: string;
  sport?: string;
  featured?: boolean;
}

export interface CreateEventResponse {
  event: Event;
  streamKey: string;
  rtmpUrl: string;
}

export interface StreamStats {
  viewers: number;
  peak_viewers: number;
  uptime_minutes: number;
  buffer_rate: number;
  avg_bitrate: number;
}

export interface StatsResponse {
  stats: StreamStats;
}

export interface StreamAnalytics {
  peak_viewers: number;
  avg_viewers: number;
  uptime_minutes: number;
  max_buffer_rate: number;
  avg_buffer_rate: number;
  avg_bitrate: number;
  sample_count: number;
}

export interface AnalyticsResponse {
  analytics: StreamAnalytics;
}

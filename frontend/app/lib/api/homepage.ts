// API helper functions for homepage data fetching (Server-side)
// For client-side, use the React Query hooks from ./hooks.ts

import { apiClient } from './client';

export interface Event {
  id: number;
  title: string;
  description: string;
  status: 'live' | 'scheduled' | 'ended';
  started_at: string;
  created_at: string;
  thumbnail_url?: string;
  sport?: string;
}

export interface SportCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

/**
 * Fetch all events with optional filters
 */
export async function fetchAllEvents(limit?: number): Promise<Event[]> {
  try {
    const data = await apiClient.get<{ events: Event[] }>('/api/events', {
      next: { revalidate: 60 } as any, // ISR: revalidate every 60 seconds
    });
    return data.events || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

/**
 * Fetch live/active streams (for hero section)
 */
export async function fetchLiveStreams(): Promise<Event[]> {
  try {
    const data = await apiClient.get<{ events: Event[] }>('/api/events', {
      params: { status: 'live' },
      next: { revalidate: 10 } as any, // More frequent revalidation for live content
    });
    return data.events?.filter((e: Event) => e.status === 'live') || [];
  } catch (error) {
    console.error('Error fetching live streams:', error);
    return [];
  }
}

/**
 * Fetch featured events (curated list)
 */
export async function fetchFeaturedEvents(): Promise<Event[]> {
  try {
    const data = await apiClient.get<{ events: Event[] }>('/api/events', {
      params: { featured: true },
      next: { revalidate: 60 } as any,
    });
    // Return up to 3 featured events
    return (data.events || []).slice(0, 3);
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }
}

/**
 * Fetch upcoming events (sorted by date)
 */
export async function fetchUpcomingEvents(limit: number = 6): Promise<Event[]> {
  try {
    const data = await apiClient.get<{ events: Event[] }>('/api/events', {
      params: { status: 'scheduled', sort: 'date' },
      next: { revalidate: 60 } as any,
    });
    return (data.events || []).slice(0, limit);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}

/**
 * Fetch sports categories
 */
export async function fetchSportCategories(): Promise<SportCategory[]> {
  try {
    const data = await apiClient.get<{ categories: SportCategory[] }>('/api/categories', {
      next: { revalidate: 3600 } as any, // Cache for 1 hour (static data)
    });
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching sport categories:', error);
    return getDefaultCategories();
  }
}

/**
 * Default sport categories as fallback
 */
function getDefaultCategories(): SportCategory[] {
  return [
    { id: '1', name: 'Football', slug: 'football', icon: '⚽' },
    { id: '2', name: 'Basketball', slug: 'basketball', icon: '🏀' },
    { id: '3', name: 'Tennis', slug: 'tennis', icon: '🎾' },
    { id: '4', name: 'Volleyball', slug: 'volleyball', icon: '🏐' },
    { id: '5', name: 'Rugby', slug: 'rugby', icon: '🏉' },
  ];
}

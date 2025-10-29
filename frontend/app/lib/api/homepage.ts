// API helper functions for homepage data fetching

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
    const response = await fetch(`${API_URL}/api/events`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
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
    const response = await fetch(`${API_URL}/api/events?status=live`, {
      next: { revalidate: 10 }, // More frequent revalidation for live content
    });
    if (!response.ok) throw new Error('Failed to fetch live streams');
    const data = await response.json();
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
    const response = await fetch(`${API_URL}/api/events?featured=true`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) throw new Error('Failed to fetch featured events');
    const data = await response.json();
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
    const response = await fetch(`${API_URL}/api/events?status=scheduled&sort=date`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) throw new Error('Failed to fetch upcoming events');
    const data = await response.json();
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
    const response = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 3600 }, // Cache for 1 hour (static data)
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
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
    { id: '6', name: 'Cricket', slug: 'cricket', icon: '🏏' },
  ];
}

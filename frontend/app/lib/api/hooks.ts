/**
 * React Query Hooks
 * Custom hooks for API data fetching using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  Event,
  EventsResponse,
  EventResponse,
  CategoriesResponse,
  CreateEventRequest,
  CreateEventResponse,
  StatsResponse,
  AnalyticsResponse,
} from './types';

/**
 * Query Keys
 * Centralized query key management
 */
export const queryKeys = {
  events: ['events'] as const,
  event: (id: number) => ['events', id] as const,
  eventsByStatus: (status: string) => ['events', { status }] as const,
  featuredEvents: () => ['events', { featured: true }] as const,
  categories: ['categories'] as const,
  eventStats: (id: number) => ['events', id, 'stats'] as const,
  eventAnalytics: (id: number, hours: number) =>
    ['events', id, 'analytics', hours] as const,
};

/**
 * Fetch all events
 * @param options - Query parameters for filtering events
 */
export function useEvents(options?: {
  status?: 'live' | 'scheduled' | 'ended';
  featured?: boolean;
  limit?: number;
}) {
  return useQuery({
    queryKey: options
      ? [queryKeys.events[0], options]
      : queryKeys.events,
    queryFn: async () => {
      const response = await apiClient.get<EventsResponse>('/api/events', {
        params: options,
      });
      return response.events || [];
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Fetch live streams
 */
export function useLiveStreams() {
  return useQuery({
    queryKey: queryKeys.eventsByStatus('live'),
    queryFn: async () => {
      const response = await apiClient.get<EventsResponse>('/api/events', {
        params: { status: 'live' },
      });
      return response.events?.filter((e: Event) => e.status === 'live') || [];
    },
    staleTime: 10 * 1000, // 10 seconds for live content
    refetchInterval: 10 * 1000, // Auto-refetch every 10 seconds
  });
}

/**
 * Fetch featured events
 */
export function useFeaturedEvents() {
  return useQuery({
    queryKey: queryKeys.featuredEvents(),
    queryFn: async () => {
      const response = await apiClient.get<EventsResponse>('/api/events', {
        params: { featured: true },
      });
      return (response.events || []).slice(0, 3);
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Fetch upcoming events
 */
export function useUpcomingEvents(limit: number = 6) {
  return useQuery({
    queryKey: ['events', { status: 'scheduled', limit }],
    queryFn: async () => {
      const response = await apiClient.get<EventsResponse>('/api/events', {
        params: { status: 'scheduled' },
      });
      return (response.events || []).slice(0, limit);
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Fetch single event by ID
 */
export function useEvent(id: number | string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.event(Number(id)),
    queryFn: async () => {
      const response = await apiClient.get<EventResponse>(`/api/events/${id}`);
      return response.event;
    },
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 10 * 1000, // Poll every 10 seconds for status updates
    enabled: options?.enabled !== false,
  });
}

/**
 * Fetch sport categories
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: async () => {
      const response = await apiClient.get<CategoriesResponse>('/api/categories');
      return response.categories || [];
    },
    staleTime: 60 * 60 * 1000, // 1 hour (categories don't change often)
  });
}

/**
 * Fetch event statistics
 */
export function useEventStats(
  eventId: number,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  return useQuery({
    queryKey: queryKeys.eventStats(eventId),
    queryFn: async () => {
      const response = await apiClient.get<StatsResponse>(
        `/api/events/${eventId}/stats`
      );
      return response.stats;
    },
    staleTime: 5 * 1000, // 5 seconds
    refetchInterval: options?.refetchInterval || 5000, // Default 5 seconds
    enabled: options?.enabled !== false,
  });
}

/**
 * Fetch event analytics
 */
export function useEventAnalytics(
  eventId: number,
  hours: number = 24,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.eventAnalytics(eventId, hours),
    queryFn: async () => {
      const response = await apiClient.get<AnalyticsResponse>(
        `/api/events/${eventId}/analytics`,
        {
          params: { hours },
        }
      );
      return response.analytics;
    },
    staleTime: 30 * 1000, // 30 seconds
    enabled: options?.enabled !== false,
  });
}

/**
 * Create a new event
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEventRequest) => {
      const response = await apiClient.post<CreateEventResponse>(
        '/api/events',
        data
      );
      return response;
    },
    onSuccess: () => {
      // Invalidate events query to refetch the list
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
    },
  });
}

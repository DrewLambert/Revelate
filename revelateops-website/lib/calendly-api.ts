/**
 * Calendly API Client
 * Official API Documentation: https://developer.calendly.com/api-docs
 */

const CALENDLY_API_BASE = 'https://api.calendly.com';

interface CalendlyApiConfig {
  token: string;
}

// API Response Types
export interface CalendlyUser {
  uri: string;
  name: string;
  slug: string;
  email: string;
  scheduling_url: string;
  timezone: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CalendlyUserResponse {
  resource: CalendlyUser;
}

export interface CalendlyEventType {
  uri: string;
  name: string;
  active: boolean;
  slug: string;
  scheduling_url: string;
  duration: number;
  kind: string;
  pooling_type: string | null;
  type: string;
  color: string;
  created_at: string;
  updated_at: string;
  internal_note: string | null;
  description_plain: string | null;
  description_html: string | null;
}

export interface CalendlyEventTypesResponse {
  collection: CalendlyEventType[];
  pagination: {
    count: number;
    next_page: string | null;
    previous_page: string | null;
    next_page_token: string | null;
    previous_page_token: string | null;
  };
}

export class CalendlyAPI {
  private token: string;

  constructor(config: CalendlyApiConfig) {
    this.token = config.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${CALENDLY_API_BASE}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Calendly API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  /**
   * Get current user information
   * GET /users/me
   */
  async getCurrentUser() {
    return this.request<CalendlyUserResponse>('/users/me');
  }

  /**
   * Get event types for a user
   * GET /event_types?user={user_uri}
   */
  async getEventTypes(userUri: string) {
    return this.request<CalendlyEventTypesResponse>(`/event_types?user=${encodeURIComponent(userUri)}&active=true`);
  }

  /**
   * Get a specific event type
   * GET /event_types/{uuid}
   */
  async getEventType(uuid: string) {
    return this.request(`/event_types/${uuid}`);
  }

  /**
   * Get availability for an event type
   * GET /event_type_available_times?event_type={event_type_uri}&start_time={start}&end_time={end}
   */
  async getAvailableTimes(eventTypeUri: string, startTime: string, endTime: string) {
    const params = new URLSearchParams({
      event_type: eventTypeUri,
      start_time: startTime,
      end_time: endTime,
    });
    return this.request(`/event_type_available_times?${params}`);
  }

  /**
   * Create a scheduling link (single-use)
   * POST /scheduling_links
   */
  async createSchedulingLink(data: {
    max_event_count: number;
    owner: string;
    owner_type: 'EventType' | 'User';
  }) {
    return this.request('/scheduling_links', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get scheduled events
   * GET /scheduled_events?user={user_uri}
   */
  async getScheduledEvents(userUri: string, options?: {
    count?: number;
    invitee_email?: string;
    max_start_time?: string;
    min_start_time?: string;
    status?: 'active' | 'canceled';
  }) {
    const params = new URLSearchParams({ user: userUri });

    if (options) {
      if (options.count !== undefined) params.append('count', String(options.count));
      if (options.invitee_email) params.append('invitee_email', options.invitee_email);
      if (options.max_start_time) params.append('max_start_time', options.max_start_time);
      if (options.min_start_time) params.append('min_start_time', options.min_start_time);
      if (options.status) params.append('status', options.status);
    }

    return this.request(`/scheduled_events?${params}`);
  }

  /**
   * Get event invitees
   * GET /scheduled_events/{event_uuid}/invitees
   */
  async getEventInvitees(eventUuid: string) {
    return this.request(`/scheduled_events/${eventUuid}/invitees`);
  }
}

/**
 * Get Calendly API instance (server-side only)
 */
export function getCalendlyAPI(): CalendlyAPI {
  const token = process.env.CALENDLY_API_TOKEN;

  if (!token) {
    throw new Error('CALENDLY_API_TOKEN environment variable is not set');
  }

  return new CalendlyAPI({ token });
}

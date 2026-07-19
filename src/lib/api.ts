// GovAlert API Client Module

const API_BASE = "http://localhost:8000/api/v1";
const AUTH_BASE = "http://localhost:8000/api/auth";

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface ApiAgency {
  id: number;
  name: string;
  acronym: string;
  slug: string;
  description: string;
  category: string;
  portal_url: string;
  status: "online" | "offline" | "maintenance";
  last_checked: string | null;
  response_time_ms: number | null;
  jobs_available: number;
  vetted_score: number;
  monitoring_interval_minutes?: number;
  uptime_percent?: number;
  total_recruitments_detected?: number;
  last_update?: string | null;
  recruitment_history?: Array<{ date: string; event_description: string }>;
  last_10_checks?: boolean[];
  last_offline_at?: string | null;
  last_offline_duration_minutes?: number | null;
  avg_confidence_score?: number;
  false_positives?: number;
  scam_domains_blocked?: number;
  official_domains?: string;
}

export interface ApiJob {
  ref: string;
  title: string;
  agency_name: string;
  agency_acronym: string;
  agency_slug: string;
  deadline: string;
  status: "verified" | "updating" | "closed" | "new_opening";
  positions: string;
  published_at: string;
  category: string;
  location_state: string;
  official_url: string;
  confidence_score?: number;
  confidence_factors?: Array<{ label: string; passed: boolean }>;
  source_url?: string;
  last_monitored?: string | null;
  detection_timeline?: Array<{ time: string; event: string }>;
  description?: string;
  requirements?: string[];
  portal_status?: "online" | "offline" | "maintenance";
  portal_last_checked?: string | null;
  portal_response_dots?: number;
  portal_uptime_percent?: number;
  related_jobs?: Array<{
    ref: string;
    title: string;
    agency_name: string;
    agency_acronym: string;
    deadline: string;
    status: string;
  }>;
}

export interface ApiJobVerification {
  ref: string;
  title: string;
  agency_name: string;
  agency_acronym: string;
  confidence_score: number;
  ai_classification: "REAL" | "FAKE" | "UNCERTAIN";
  ai_confidence: number;
  ai_red_flags: string[];
  confidence_factors: Array<{ label: string; passed: boolean }>;
  detection_timeline: Array<{ time: string; event: string }>;
  source_url: string;
  last_monitored: string | null;
  is_verified: boolean;
}

export interface ApiSystemStatus {
  agencies_online: number;
  agencies_offline: number;
  agencies_maintenance: number;
  total_agencies: number;
  total_checks_today: number;
  successful_checks_today: number;
  failed_checks_today: number;
  success_rate_today: number;
  changes_detected_today: number;
  active_campaigns: number;
  monitoring_interval_minutes: number;
  last_audit_at: string | null;
  system_operational: boolean;
}

export interface ApiLiveFeedItem {
  agency_name: string;
  agency_acronym: string;
  event_type: "verified" | "updating" | "closed" | "new_opening" | "no_changes" | "urgent";
  event_time: string;
  time_ago: string;
}

export interface ApiAuthTokens {
  access: string;
  refresh: string;
}

export interface ApiUserProfile {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  categories_of_interest: string[];
}

// ─── Auth helpers ──────────────────────────────────────────────────────────────

export const getAuthToken = (): string | null =>
  localStorage.getItem("govalert_access_token");

export const setAuthTokens = (tokens: ApiAuthTokens) => {
  localStorage.setItem("govalert_access_token", tokens.access);
  localStorage.setItem("govalert_refresh_token", tokens.refresh);
};

export const clearAuthTokens = () => {
  localStorage.removeItem("govalert_access_token");
  localStorage.removeItem("govalert_refresh_token");
};

export const isAuthenticated = (): boolean => Boolean(getAuthToken());

// Flag to avoid infinite loops during refresh
let isRefreshing = false;

// ─── Request helper ────────────────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  baseUrl = API_BASE,
  isRetry = false
): Promise<T | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const url = `${baseUrl}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // 401 Unauthorized handling — attempt token refresh once
    if (res.status === 401 && !isRetry && !endpoint.includes("/token/") && !endpoint.includes("/logout/")) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await api.refreshToken();
        isRefreshing = false;
        if (newToken) {
          return request<T>(endpoint, options, baseUrl, true);
        } else {
          clearAuthTokens();
        }
      }
    }

    if (!res.ok) {
      console.warn(`API error (${endpoint}): ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn(`Network error or timeout calling API endpoint ${endpoint}:`, err);
    return null;
  }
}

// ─── API Client ────────────────────────────────────────────────────────────────

export const api = {
  // Agencies
  getAgencies: async (params?: {
    page_size?: number;
    page?: number;
  }): Promise<{ results: ApiAgency[]; count: number }> => {
    const q = new URLSearchParams();
    q.set("page_size", String(params?.page_size || 100));
    if (params?.page) q.set("page", String(params.page));
    return request<{ results: ApiAgency[]; count: number }>(`/agencies/?${q.toString()}`);
  },

  getAgency: async (slug: string): Promise<ApiAgency> => {
    return request<ApiAgency>(`/agencies/${slug}/`);
  },

  // Jobs
  getJobs: async (params?: {
    search?: string;
    category?: string;
    location?: string;
    status?: string;
    ordering?: string;
    page_size?: number;
    page?: number;
    agency?: string;
    agency_slug?: string;
  }): Promise<{ results: ApiJob[]; count: number }> => {
    const q = new URLSearchParams();
    q.set("page_size", String(params?.page_size || 20));
    if (params?.page) q.set("page", String(params.page));
    if (params?.search) q.set("search", params.search);
    if (params?.category) q.set("category", params.category);
    if (params?.location) q.set("location", params.location);
    if (params?.status) q.set("status", params.status);
    if (params?.ordering) q.set("ordering", params.ordering);
    if (params?.agency) q.set("agency", params.agency);
    if (params?.agency_slug) q.set("agency_slug", params.agency_slug);
    return request<{ results: ApiJob[]; count: number }>(`/jobs/?${q.toString()}`);
  },

  getJob: async (ref: string): Promise<ApiJob> => {
    return request<ApiJob>(`/jobs/${ref}/`);
  },

  getJobVerification: async (ref: string): Promise<ApiJobVerification> => {
    return request<ApiJobVerification>(`/jobs/${ref}/verification/`);
  },

  // Saved Jobs
  getSavedJobs: async (): Promise<ApiJob[]> => {
    const res = await request<ApiJob[]>("/me/saved-jobs/");
    return res || [];
  },

  saveJob: async (ref: string): Promise<boolean> => {
    const res = await request<{ detail: string }>("/me/saved-jobs/", {
      method: "POST",
      body: JSON.stringify({ ref }),
    });
    return Boolean(res);
  },

  unsaveJob: async (ref: string): Promise<boolean> => {
    const res = await request<{ detail: string }>(`/me/saved-jobs/${ref}/`, {
      method: "DELETE",
    });
    return Boolean(res);
  },

  // System status
  getSystemStatus: async (): Promise<ApiSystemStatus> => {
    return request<ApiSystemStatus>("/status/");
  },

  getLiveFeed: async (): Promise<ApiLiveFeedItem[] | null> => {
    return request<ApiLiveFeedItem[]>("/status/live-feed/");
  },

  // Auth
  register: async (name: string, email: string, password: string): Promise<{ tokens?: ApiAuthTokens; error?: string }> => {
    try {
      const res = await fetch(`${AUTH_BASE}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const firstErr = typeof data === "object" && data !== null
          ? Object.values(data).flat()[0]
          : null;
        return { error: (firstErr as string) || "Failed to create account." };
      }
      setAuthTokens(data);
      return { tokens: data };
    } catch (err: any) {
      return { error: "Network error. Please check your connection." };
    }
  },

  login: async (email: string, password: string): Promise<{ tokens?: ApiAuthTokens; error?: string }> => {
    try {
      const res = await fetch(`${AUTH_BASE}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data?.detail || (typeof data === "object" && data !== null ? Object.values(data).flat()[0] : null);
        return { error: (errorMsg as string) || "Invalid email or password." };
      }
      setAuthTokens(data);
      return { tokens: data };
    } catch (err: any) {
      return { error: "Network error. Please check your connection." };
    }
  },

  refreshToken: async (): Promise<string | null> => {
    const refresh = localStorage.getItem("govalert_refresh_token");
    if (!refresh) return null;
    const res = await request<{ access: string }>(
      "/token/refresh/",
      { method: "POST", body: JSON.stringify({ refresh }) },
      AUTH_BASE
    );
    if (res?.access) {
      localStorage.setItem("govalert_access_token", res.access);
      return res.access;
    }
    return null;
  },

  getMe: async (): Promise<ApiUserProfile | null> => {
    return request<ApiUserProfile>("/me/", {}, AUTH_BASE);
  },

  updateMe: async (data: Partial<ApiUserProfile>): Promise<ApiUserProfile | null> => {
    return request<ApiUserProfile>(
      "/me/",
      { method: "PATCH", body: JSON.stringify(data) },
      AUTH_BASE
    );
  },

  changePassword: async (old_password: string, new_password: string): Promise<boolean> => {
    const res = await request<{ detail: string }>(
      "/password/change/",
      { method: "POST", body: JSON.stringify({ old_password, new_password }) },
      AUTH_BASE
    );
    return Boolean(res);
  },

  logout: async () => {
    const refresh = localStorage.getItem("govalert_refresh_token");
    if (refresh) {
      await request("/logout/", { method: "POST", body: JSON.stringify({ refresh }) }, AUTH_BASE);
    }
    clearAuthTokens();
  },

  // Polling utility
  pollEndpoint: <T>(
    fetchFn: () => Promise<T | null>,
    callback: (data: T | null) => void,
    intervalMs: number = 60000
  ): (() => void) => {
    let timerId: ReturnType<typeof setInterval> | null = null;

    // Initial fetch
    fetchFn().then(callback);

    timerId = setInterval(() => {
      fetchFn().then(callback);
    }, intervalMs);

    return () => {
      if (timerId !== null) clearInterval(timerId);
    };
  },
};

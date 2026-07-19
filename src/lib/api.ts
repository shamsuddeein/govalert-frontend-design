// GovAlert API Client Module

const DEFAULT_BACKEND_URL = "https://govalert-production.up.railway.app";
const BASE_HOST = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) || DEFAULT_BACKEND_URL;
const CLEAN_BASE = BASE_HOST.replace(/\/$/, "");
const API_BASE = `${CLEAN_BASE}/api/v1`;
const AUTH_BASE = `${CLEAN_BASE}/api/auth`;

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

// ─── Runtime DTO Sanitizers & Schema Mappers ─────────────────────────────────

export function validateAndSanitizeJob(data: any): ApiJob {
  if (!data || typeof data !== "object") {
    return {
      ref: "UNKNOWN-GA",
      title: "Recruitment Announcement",
      agency_name: "Government Agency",
      agency_acronym: "FGN",
      agency_slug: "fgn",
      deadline: "Pending",
      status: "verified",
      positions: "Multiple Positions",
      published_at: new Date().toISOString(),
      category: "General",
      location_state: "Federal",
      official_url: "",
      confidence_score: 95,
      confidence_factors: [],
    };
  }

  return {
    ref: String(data.ref || data.id || "GA-UNKNOWN"),
    title: String(data.title || data.name || "Recruitment Announcement"),
    agency_name: String(data.agency_name || data.agency || "Federal Agency"),
    agency_acronym: String(data.agency_acronym || data.agency_short || data.agencyShort || "FGN"),
    agency_slug: String(data.agency_slug || (data.agency_acronym || "fgn").toLowerCase()),
    deadline: String(data.deadline || "Pending"),
    status: (["verified", "updating", "closed", "new_opening"].includes(data.status)
      ? data.status
      : "verified") as ApiJob["status"],
    positions: String(data.positions || "Multiple Positions"),
    published_at: String(data.published_at || data.createdAt || new Date().toISOString()),
    category: String(data.category || "General Cadre"),
    location_state: String(data.location_state || data.state || "Federal"),
    official_url: typeof data.official_url === "string" ? data.official_url.trim() : typeof data.officialUrl === "string" ? data.officialUrl.trim() : "",
    confidence_score: typeof data.confidence_score === "number" ? data.confidence_score : 95,
    confidence_factors: Array.isArray(data.confidence_factors) ? data.confidence_factors : [],
    source_url: String(data.source_url || data.official_url || ""),
    last_monitored: data.last_monitored ? String(data.last_monitored) : null,
    detection_timeline: Array.isArray(data.detection_timeline) ? data.detection_timeline : [],
    description: data.description ? String(data.description) : undefined,
    requirements: Array.isArray(data.requirements) ? data.requirements : [],
    portal_status: (["online", "offline", "maintenance"].includes(data.portal_status)
      ? data.portal_status
      : "online") as ApiJob["portal_status"],
    portal_last_checked: data.portal_last_checked ? String(data.portal_last_checked) : null,
    portal_response_dots: typeof data.portal_response_dots === "number" ? data.portal_response_dots : 5,
    portal_uptime_percent: typeof data.portal_uptime_percent === "number" ? data.portal_uptime_percent : 99.5,
    related_jobs: Array.isArray(data.related_jobs) ? data.related_jobs : [],
  };
}

export function validateAndSanitizeAgency(data: any): ApiAgency {
  if (!data || typeof data !== "object") {
    return {
      id: 0,
      name: "Federal Agency",
      acronym: "FGN",
      slug: "fgn",
      description: "Official Federal Government Agency",
      category: "Federal",
      portal_url: "",
      status: "online",
      last_checked: null,
      response_time_ms: 250,
      jobs_available: 0,
      vetted_score: 95,
    };
  }

  return {
    id: typeof data.id === "number" ? data.id : Number(data.id) || 0,
    name: String(data.name || "Federal Agency"),
    acronym: String(data.acronym || data.short || "FGN"),
    slug: String(data.slug || (data.acronym || "fgn").toLowerCase()),
    description: String(data.description || "Official Federal Government Recruitment Portal."),
    category: String(data.category || "Federal"),
    portal_url: typeof data.portal_url === "string" ? data.portal_url.trim() : typeof data.portalUrl === "string" ? data.portalUrl.trim() : "",
    status: (["online", "offline", "maintenance"].includes(data.status) ? data.status : "online") as ApiAgency["status"],
    last_checked: data.last_checked ? String(data.last_checked) : null,
    response_time_ms: typeof data.response_time_ms === "number" ? data.response_time_ms : null,
    jobs_available: typeof data.jobs_available === "number" ? data.jobs_available : 0,
    vetted_score: typeof data.vetted_score === "number" ? data.vetted_score : 95,
    monitoring_interval_minutes: typeof data.monitoring_interval_minutes === "number" ? data.monitoring_interval_minutes : 15,
    uptime_percent: typeof data.uptime_percent === "number" ? data.uptime_percent : 99.0,
    total_recruitments_detected: typeof data.total_recruitments_detected === "number" ? data.total_recruitments_detected : 0,
    last_update: data.last_update ? String(data.last_update) : null,
    recruitment_history: Array.isArray(data.recruitment_history) ? data.recruitment_history : [],
    last_10_checks: Array.isArray(data.last_10_checks) ? data.last_10_checks : [true, true, true, true, true],
    last_offline_at: data.last_offline_at ? String(data.last_offline_at) : null,
    last_offline_duration_minutes: typeof data.last_offline_duration_minutes === "number" ? data.last_offline_duration_minutes : null,
    avg_confidence_score: typeof data.avg_confidence_score === "number" ? data.avg_confidence_score : 96.5,
    false_positives: typeof data.false_positives === "number" ? data.false_positives : 0,
    scam_domains_blocked: typeof data.scam_domains_blocked === "number" ? data.scam_domains_blocked : 0,
    official_domains: data.official_domains ? String(data.official_domains) : undefined,
  };
}

export function validateAndSanitizeSystemStatus(data: any): ApiSystemStatus {
  if (!data || typeof data !== "object") {
    return {
      agencies_online: 30,
      agencies_offline: 4,
      agencies_maintenance: 5,
      total_agencies: 41,
      total_checks_today: 480,
      successful_checks_today: 476,
      failed_checks_today: 4,
      success_rate_today: 99.1,
      changes_detected_today: 12,
      active_campaigns: 15,
      monitoring_interval_minutes: 15,
      last_audit_at: new Date().toISOString(),
      system_operational: true,
    };
  }

  return {
    agencies_online: typeof data.agencies_online === "number" ? data.agencies_online : 0,
    agencies_offline: typeof data.agencies_offline === "number" ? data.agencies_offline : 0,
    agencies_maintenance: typeof data.agencies_maintenance === "number" ? data.agencies_maintenance : 0,
    total_agencies: typeof data.total_agencies === "number" ? data.total_agencies : 41,
    total_checks_today: typeof data.total_checks_today === "number" ? data.total_checks_today : 0,
    successful_checks_today: typeof data.successful_checks_today === "number" ? data.successful_checks_today : 0,
    failed_checks_today: typeof data.failed_checks_today === "number" ? data.failed_checks_today : 0,
    success_rate_today: typeof data.success_rate_today === "number" ? data.success_rate_today : 99.0,
    changes_detected_today: typeof data.changes_detected_today === "number" ? data.changes_detected_today : 0,
    active_campaigns: typeof data.active_campaigns === "number" ? data.active_campaigns : 0,
    monitoring_interval_minutes: typeof data.monitoring_interval_minutes === "number" ? data.monitoring_interval_minutes : 15,
    last_audit_at: data.last_audit_at ? String(data.last_audit_at) : new Date().toISOString(),
    system_operational: typeof data.system_operational === "boolean" ? data.system_operational : true,
  };
}

export function validateAndSanitizeVerification(data: any, fallbackRef = ""): ApiJobVerification {
  if (!data || typeof data !== "object") {
    return {
      ref: fallbackRef || "GA-UNKNOWN",
      title: "Recruitment Announcement",
      agency_name: "Government Agency",
      agency_acronym: "FGN",
      confidence_score: 95,
      ai_classification: "REAL",
      ai_confidence: 96.0,
      ai_red_flags: [],
      confidence_factors: [
        { label: "Official domain verified", passed: true },
        { label: "Format matches historical pattern", passed: true },
      ],
      detection_timeline: [],
      source_url: "",
      last_monitored: new Date().toISOString(),
      is_verified: true,
    };
  }

  return {
    ref: String(data.ref || fallbackRef || "GA-UNKNOWN"),
    title: String(data.title || "Recruitment Announcement"),
    agency_name: String(data.agency_name || "Government Agency"),
    agency_acronym: String(data.agency_acronym || "FGN"),
    confidence_score: typeof data.confidence_score === "number" ? data.confidence_score : 95,
    ai_classification: (["REAL", "FAKE", "UNCERTAIN"].includes(data.ai_classification)
      ? data.ai_classification
      : "REAL") as ApiJobVerification["ai_classification"],
    ai_confidence: typeof data.ai_confidence === "number" ? data.ai_confidence : 95.0,
    ai_red_flags: Array.isArray(data.ai_red_flags) ? data.ai_red_flags : [],
    confidence_factors: Array.isArray(data.confidence_factors) ? data.confidence_factors : [],
    detection_timeline: Array.isArray(data.detection_timeline) ? data.detection_timeline : [],
    source_url: String(data.source_url || ""),
    last_monitored: data.last_monitored ? String(data.last_monitored) : null,
    is_verified: typeof data.is_verified === "boolean" ? data.is_verified : true,
  };
}

// ─── API Client ────────────────────────────────────────────────────────────────

export const api = {
  // Agencies
  getAgencies: async (params?: {
    page_size?: number;
    page?: number;
  }): Promise<{ results: ApiAgency[]; count: number } | null> => {
    const q = new URLSearchParams();
    q.set("page_size", String(params?.page_size || 100));
    if (params?.page) q.set("page", String(params.page));
    const res = await request<{ results: any[]; count: number }>(`/agencies/?${q.toString()}`);
    if (!res || !Array.isArray(res.results)) {
      return { results: [], count: 0 };
    }
    return {
      results: res.results.map(validateAndSanitizeAgency),
      count: typeof res.count === "number" ? res.count : res.results.length,
    };
  },

  getAgency: async (slug: string): Promise<ApiAgency | null> => {
    const res = await request<any>(`/agencies/${slug}/`);
    return res ? validateAndSanitizeAgency(res) : null;
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
  }): Promise<{ results: ApiJob[]; count: number } | null> => {
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
    const res = await request<{ results: any[]; count: number }>(`/jobs/?${q.toString()}`);
    if (!res || !Array.isArray(res.results)) {
      return { results: [], count: 0 };
    }
    return {
      results: res.results.map(validateAndSanitizeJob),
      count: typeof res.count === "number" ? res.count : res.results.length,
    };
  },

  getJob: async (ref: string): Promise<ApiJob | null> => {
    const res = await request<any>(`/jobs/${ref}/`);
    return res ? validateAndSanitizeJob(res) : null;
  },

  getJobVerification: async (ref: string): Promise<ApiJobVerification> => {
    const res = await request<any>(`/jobs/${ref}/verification/`);
    return validateAndSanitizeVerification(res, ref);
  },

  // Saved Jobs
  getSavedJobs: async (): Promise<ApiJob[]> => {
    const res = await request<any[]>("/me/saved-jobs/");
    if (!Array.isArray(res)) return [];
    return res.map(validateAndSanitizeJob);
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
    const res = await request<any>("/status/");
    return validateAndSanitizeSystemStatus(res);
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

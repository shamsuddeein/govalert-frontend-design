import { describe, it, expect } from "vitest";
import {
  validateAndSanitizeJob,
  validateAndSanitizeAgency,
  validateAndSanitizeSystemStatus,
  validateAndSanitizeVerification,
} from "./api";

describe("API DTO Sanitizers & Runtime Type Mappers", () => {
  describe("validateAndSanitizeJob", () => {
    it("handles completely null or empty objects safely", () => {
      const result = validateAndSanitizeJob(null);
      expect(result).toBeDefined();
      expect(result.ref).toBe("0");
      expect(result.title).toBe("Untitled Position");
      expect(result.agency_name).toBe("Federal Agency");
      expect(result.agency_acronym).toBe("MDA");
      expect(result.status).toBe("new_opening");
      expect(result.confidence_score).toBe(95);
      expect(result.confidence_factors).toEqual([]);
      expect(result.official_url).toBe("");
    });

    it("sanitizes null/undefined fields in partial backend DTO", () => {
      const rawDto = {
        ref: "101",
        title: null,
        agency_name: "Customs",
        agency_acronym: null,
        official_url: null,
        confidence_factors: null,
        positions: null,
        requirements: null,
      };

      const sanitized = validateAndSanitizeJob(rawDto);
      expect(sanitized.ref).toBe("101");
      expect(sanitized.title).toBe("Untitled Position");
      expect(sanitized.agency_acronym).toBe("MDA");
      expect(sanitized.official_url).toBe("");
      expect(sanitized.confidence_factors).toEqual([]);
      expect(sanitized.positions).toBe("Multiple Positions");
      expect(sanitized.requirements).toEqual([]);
    });

    it("preserves valid job fields correctly", () => {
      const rawDto = {
        ref: "77-GA",
        title: "Senior Customs Inspector",
        agency_name: "Nigeria Customs Service",
        agency_acronym: "NCS",
        official_url: "https://customs.gov.ng/apply",
        confidence_score: 99,
        category: "SECURITY",
        location_state: "Abuja",
      };

      const sanitized = validateAndSanitizeJob(rawDto);
      expect(sanitized.ref).toBe("77-GA");
      expect(sanitized.title).toBe("Senior Customs Inspector");
      expect(sanitized.agency_acronym).toBe("NCS");
      expect(sanitized.official_url).toBe("https://customs.gov.ng/apply");
      expect(sanitized.confidence_score).toBe(99);
    });
  });

  describe("validateAndSanitizeAgency", () => {
    it("handles null agency input safely", () => {
      const result = validateAndSanitizeAgency(null);
      expect(result).toBeDefined();
      expect(result.id).toBe(0);
      expect(result.name).toBe("Federal Ministry / MDA");
      expect(result.acronym).toBe("MDA");
      expect(result.status).toBe("online");
      expect(result.vetted_score).toBe(90);
      expect(result.portal_url).toBe("");
    });

    it("sanitizes partial agency DTO fields", () => {
      const rawAgency = {
        id: "42",
        name: null,
        acronym: "FIRS",
        vetted_score: null,
        jobs_available: null,
        portal_url: null,
      };

      const result = validateAndSanitizeAgency(rawAgency);
      expect(result.id).toBe(42);
      expect(result.name).toBe("Federal Ministry / MDA");
      expect(result.acronym).toBe("FIRS");
      expect(result.vetted_score).toBe(90);
      expect(result.jobs_available).toBe(0);
      expect(result.portal_url).toBe("");
    });
  });

  describe("validateAndSanitizeSystemStatus", () => {
    it("handles null status payload safely", () => {
      const result = validateAndSanitizeSystemStatus(null);
      expect(result).toBeDefined();
      expect(result.overall_status).toBe("operational");
      expect(result.active_scrapers).toBe(0);
      expect(result.uptime_percent).toBe(99.9);
      expect(result.recent_logs).toEqual([]);
    });

    it("sanitizes system status payload with numeric strings and missing log arrays", () => {
      const rawStatus = {
        overall_status: "degraded",
        active_scrapers: "12",
        total_scrapers: "15",
        active_alerts: "3",
        uptime_percent: "98.5",
        recent_logs: null,
      };

      const result = validateAndSanitizeSystemStatus(rawStatus);
      expect(result.overall_status).toBe("degraded");
      expect(result.active_scrapers).toBe(12);
      expect(result.total_scrapers).toBe(15);
      expect(result.active_alerts).toBe(3);
      expect(result.uptime_percent).toBe(98.5);
      expect(result.recent_logs).toEqual([]);
    });
  });

  describe("validateAndSanitizeVerification", () => {
    it("handles null verification response safely", () => {
      const result = validateAndSanitizeVerification(null);
      expect(result).toBeDefined();
      expect(result.is_verified).toBe(false);
      expect(result.trust_score).toBe(0);
      expect(result.confidence_factors).toEqual([]);
      expect(result.verification_notes).toBe("Verification check incomplete.");
    });
  });
});

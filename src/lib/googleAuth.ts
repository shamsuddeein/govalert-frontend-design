// Google Identity Services (GIS) Helper Module

declare global {
  interface Window {
    google?: any;
  }
}

export const GOOGLE_CLIENT_ID =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GOOGLE_CLIENT_ID) ||
  "161621432417-5tghsaflem2av3tm1njlmt252d04eahr.apps.googleusercontent.com";

export function loadGoogleGsiScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existingScript = document.getElementById("google-gsi-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.id = "google-gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

export function initializeGoogleAuth(onCredential: (idToken: string) => void) {
  loadGoogleGsiScript().then(() => {
    if (!window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: { credential?: string }) => {
        if (response?.credential) {
          onCredential(response.credential);
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  });
}

export function triggerGoogleSignIn(onCredential: (idToken: string) => void) {
  loadGoogleGsiScript().then(() => {
    if (!window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: { credential?: string }) => {
        if (response?.credential) {
          onCredential(response.credential);
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    window.google.accounts.id.prompt();
  });
}

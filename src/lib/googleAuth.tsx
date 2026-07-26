import React, { useEffect, useRef } from "react";

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

interface GoogleAuthButtonProps {
  onCredential: (idToken: string) => void;
  text?: "signin_with" | "signup_with" | "continue_with";
  disabled?: boolean;
}

export function GoogleAuthButton({ onCredential, text = "continue_with", disabled }: GoogleAuthButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    loadGoogleGsiScript().then(() => {
      if (!isMounted || !window.google?.accounts?.id || !containerRef.current) return;

      try {
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

        containerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: text,
          shape: "rectangular",
          logo_alignment: "left",
          width: 360,
        });
      } catch (err) {
        console.error("Google GIS initialization error:", err);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [onCredential, text]);

  return (
    <div className={`w-full flex justify-center my-3 min-h-[44px] ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  );
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
    if (!window.google?.accounts) return;

    if (window.google.accounts.oauth2?.initTokenClient) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "email profile openid",
        callback: (tokenResponse: any) => {
          if (tokenResponse?.access_token) {
            onCredential(tokenResponse.access_token);
          } else if (tokenResponse?.id_token) {
            onCredential(tokenResponse.id_token);
          }
        },
      });
      client.requestAccessToken();
      return;
    }

    if (window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: { credential?: string }) => {
          if (response?.credential) {
            onCredential(response.credential);
          }
        },
      });
      window.google.accounts.id.prompt();
    }
  });
}

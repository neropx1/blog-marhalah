import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { cmsConfig } from "../cms-config";
import { getSession } from "../utils/supabase.client";

declare global {
  interface Window {
    __sveltiaCmsInitialized?: boolean;
    CMS_MANUAL_INIT?: boolean;
  }
}

export default function Admin() {
  const initDoneRef = useRef(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const session = await getSession();
        if (!session) {
          navigate("/admin-login");
          return;
        }
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/admin-login");
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (typeof window === "undefined" || !isAuthenticated) return;

    if (initDoneRef.current) return;

    let isMounted = true;

    const initCms = async () => {
      const root = document.getElementById("nc-root");
      if (!root) {
        console.error("nc-root tidak ditemukan");
        return;
      }

      try {
        window.CMS_MANUAL_INIT = true;

        const { init } = await import("@sveltia/cms");

        init({
          config: cmsConfig,
        });

        if (isMounted) {
          initDoneRef.current = true;
          window.__sveltiaCmsInitialized = true;
          console.log("Sveltia CMS initialized");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Sveltia CMS init gagal:", error);
        }
      }
    };

    initCms();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 mx-auto mb-4 animate-pulse flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-amber-400 font-[Bricolage_Grotesque]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div id="nc-root" />
    </div>
  );
}
"use client";

import { useCallback, useEffect, useState } from "react";
import { userEndpoints } from "@/lib/endpoints";

function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userEndpoints.me();
      setUser(data);
      return data;
    } catch (err) {
      setError(err);
      setUser(null);
      // Redirige si le token est invalide ou le refresh échoue
      if (err?.status === 401 || /refresh/i.test(err?.message)) {
        redirectToLogin();
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await userEndpoints.me();
        if (!isMounted) return;
        setUser(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err);
        setUser(null);
        // Redirige si le token est invalide ou le refresh échoue
        if (err?.status === 401 || /refresh/i.test(err?.message)) {
          redirectToLogin();
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    user,
    loading,
    error,
    reload: fetchUser,
  };
};

export default useCurrentUser;

"use client";

import { useCallback, useEffect, useState } from "react";
import { userEndpoints } from "@/lib/endpoints";

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

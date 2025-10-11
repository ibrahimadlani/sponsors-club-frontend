"use client";

import { useCallback, useEffect, useState } from "react";
import { users, getUserFromToken } from "@/lib/api";

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
      const data = await users.getMe();
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
        // D'abord, essayer de récupérer les données du JWT (instantané)
        const tokenData = getUserFromToken();
        if (tokenData && isMounted) {
          // Mapper les données du JWT au format attendu
          setUser({
            id: tokenData.user_id,
            email: tokenData.email,
            first_name: tokenData.prenom,
            last_name: tokenData.nom,
            role: tokenData.role,
            is_staff: tokenData.role === "STAFF" || tokenData.role === "ADMIN",
            agent_has_athlete: tokenData.agent_has_athlete,
            collaborator_has_org: tokenData.collaborator_has_org,
          });
          setLoading(false);
        }

        // Ensuite, faire un appel API pour avoir les données complètes
        const data = await users.getMe();
        if (!isMounted) return;
        
        // Enrichir avec les données du JWT si l'API ne les retourne pas
        setUser({
          ...data,
          role: data.role || tokenData?.role,
          is_staff: data.is_staff ?? (tokenData?.role === "STAFF" || tokenData?.role === "ADMIN"),
        });
      } catch (err) {
        if (!isMounted) return;
        
        // Si l'API échoue mais qu'on a les données du JWT, les garder
        const tokenData = getUserFromToken();
        if (tokenData) {
          setUser({
            id: tokenData.user_id,
            email: tokenData.email,
            first_name: tokenData.prenom,
            last_name: tokenData.nom,
            role: tokenData.role,
            is_staff: tokenData.role === "STAFF" || tokenData.role === "ADMIN",
            agent_has_athlete: tokenData.agent_has_athlete,
            collaborator_has_org: tokenData.collaborator_has_org,
          });
        } else {
          setError(err);
          setUser(null);
          // Redirige si le token est invalide ou le refresh échoue
          if (err?.status === 401 || /refresh/i.test(err?.message)) {
            redirectToLogin();
          }
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

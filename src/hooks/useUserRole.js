"use client";

import { useState, useEffect } from "react";
import { getUserRole } from "@/lib/api";

/**
 * Hook to get the current user's role from JWT
 * 
 * Returns the user role (AGENT, COLLABORATOR, ADMIN) or null if not authenticated.
 * Re-checks the role when authentication status changes.
 * 
 * @returns {string|null} User role or null
 * 
 * @example
 * function MyComponent() {
 *   const role = useUserRole();
 *   
 *   if (role === "AGENT") {
 *     return <AgentDashboard />;
 *   }
 *   
 *   if (role === "COLLABORATOR") {
 *     return <CollaboratorDashboard />;
 *   }
 *   
 *   return <DefaultView />;
 * }
 */
export function useUserRole() {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get role immediately
    const currentRole = getUserRole();
    setRole(currentRole);
    setIsLoading(false);

    // Listen for storage events (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "accessToken" || e.key === null) {
        const newRole = getUserRole();
        setRole(newRole);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { role, isLoading };
}

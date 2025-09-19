"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "@/lib/api";


const AuthContext = createContext();

export const isAuthenticated = (token) => {
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
        return decoded.exp > currentTime; // True if token is still valid
    } catch (error) {
        console.error("Invalid token", error);
        return false;
    }
};

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedToken = localStorage.getItem("accessToken");

        if (storedToken) {
            const isValid = isAuthenticated(storedToken);
            if (isValid) {
                setAccessToken(storedToken);
                setUser(jwtDecode(storedToken)); // Extraire les infos du token
            } else {
                localStorage.removeItem("accessToken"); // Supprimer le token expiré
                router.replace("/login");
            }
        } else if (![
            "/",
            "/login",
            "/register",
            "/reset-password",
            "/reset-password/confirm",
            "/verify-email",
          ].includes(pathname)) {
            router.replace("/login");
        }

        setIsAuthenticating(false);
    }, [router, pathname]);

    // Fonction pour rafraîchir le token et mettre à jour l'utilisateur
    const refreshAuth = async () => {
        try {
            if (typeof window === "undefined") {
                throw new Error("No refresh token found");
            }

            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) throw new Error("No refresh token found");

            const newAccessToken = await refreshAccessToken(refreshToken);
            localStorage.setItem("accessToken", newAccessToken);
            setAccessToken(newAccessToken);
            setUser(jwtDecode(newAccessToken)); // Mettre à jour l'utilisateur
        } catch (error) {
            console.error("Token refresh failed");
            router.replace("/login");
        }
    };



    return (
        <AuthContext.Provider value={{ accessToken, user, refreshAuth, isAuthenticating }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

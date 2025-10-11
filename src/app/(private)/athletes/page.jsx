"use client";
/**
 * Athletes Listing Page
 * Displays different views based on user role:
 * - AGENT: Shows only their athletes without search bar
 * - COLLABORATOR: Shows all athletes with search and filters
 */

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserRole } from "@/hooks/useUserRole";
import ItemsGrid from "@/components/items-grid";
import { getAthletesPage, fetchMyAthletes } from "@/lib/api";
import SkeletonItem from "@/components/skeleton-item";
import { Plus, Users } from "lucide-react";
import Link from "next/link";

/**
 * Search Bar Component for Collaborators
 * Displays search input and filter dropdowns
 */
function AthleteSearchBar({ value, onChange, sport, onSport, country, onCountry, city, onCity, sports, countries, cities }) {
  return (
    <div className="w-full max-w-5xl mx-auto mb-6 flex flex-col md:flex-row gap-3 md:gap-4 items-center">
      <div className="flex flex-1 flex-col gap-1">
        <Label htmlFor="athlete-search">Recherche</Label>
        <Input
          id="athlete-search"
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Rechercher un athlète, sport, ville..."
        />
      </div>
      <div className="flex flex-col gap-1 min-w-[140px]">
        <Label htmlFor="sport-select">Sport</Label>
        <Select value={sport || "all"} onValueChange={val => onSport(val === "all" ? "" : val)}>
          <SelectTrigger id="sport-select">
            <SelectValue placeholder="Sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {sports.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1 min-w-[120px]">
        <Label htmlFor="country-select">Pays</Label>
        <Select value={country || "all"} onValueChange={val => onCountry(val === "all" ? "" : val)}>
          <SelectTrigger id="country-select">
            <SelectValue placeholder="Pays" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1 min-w-[120px]">
        <Label htmlFor="city-select">Ville</Label>
        <Select value={city || "all"} onValueChange={val => onCity(val === "all" ? "" : val)}>
          <SelectTrigger id="city-select">
            <SelectValue placeholder="Ville" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

/**
 * Main Athletes Page Component
 * Routes to appropriate view based on user role
 */
export default function AthletesPage() {
  const { role: userRole, isLoading: roleLoading } = useUserRole();

  if (roleLoading) {
    return (
      <SidebarInset className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </SidebarInset>
    );
  }

  return userRole === "AGENT" ? <AgentAthletesView /> : <CollaboratorAthletesView />;
}

/**
 * Agent Athletes View
 * Shows only agent's athletes without search bar
 */
function AgentAthletesView() {
  const [loading, setLoading] = useState(true);
  const [athletes, setAthletes] = useState([]);

  useEffect(() => {
    let mounted = true;
    
    const loadAthletes = async () => {
      try {
        const myAthletes = await fetchMyAthletes();
        const results = Array.isArray(myAthletes) ? myAthletes : (myAthletes?.results || []);
        
        if (mounted) {
          setAthletes(results);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des athlètes:", error);
        if (mounted) {
          setAthletes([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAthletes();
    
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SidebarInset className="min-h-screen flex flex-col">
      <div className="flex flex-1 flex-col gap-6 px-6 md:px-12 2xl:px-24 py-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mes Athlètes</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos athlètes et leurs profils
            </p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un athlète
          </Button>
        </div>

        {/* Empty State */}
        {!loading && athletes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="rounded-full bg-muted p-8 mb-6">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucun athlète</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Vous n&apos;avez pas encore d&apos;athlètes associés à votre compte. 
              Ajoutez votre premier athlète pour commencer à gérer leurs profils.
            </p>
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter votre premier athlète
            </Button>
          </div>
        )}

        {/* Athletes Grid */}
        {(loading || athletes.length > 0) && (
          <ItemsGrid loading={loading} items={athletes} badgeColor="bg-pink-600" />
        )}
      </div>
    </SidebarInset>
  );
}

/**
 * Collaborator Athletes View
 * Shows all athletes with search bar and filters
 */
function CollaboratorAthletesView() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  // Generate unique filter options
  const sports = Array.from(new Set(items.map((a) => a.sport?.name).filter(Boolean))).sort();
  const countries = Array.from(new Set(items.map((a) => a.country).filter(Boolean))).sort();
  const cities = Array.from(new Set(items.map((a) => a.city).filter(Boolean))).sort();

  // Initial load
  useEffect(() => {
    let mounted = true;
    
    const loadAthletes = async () => {
      try {
        const response = await getAthletesPage(12, 0);
        
        if (mounted) {
          setItems(response.results);
          setHasMore(Boolean(response.next));
          setOffset(response.results.length);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des athlètes:", error);
        if (mounted) {
          setItems([]);
          setHasMore(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAthletes();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Infinite scroll with IntersectionObserver
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!hasMore || loading || fetchingMore) return;
    
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setFetchingMore(true);
          try {
            const { results, next } = await getAthletesPage(12, offset);
            setItems((prev) => [...prev, ...results]);
            setOffset((prev) => prev + results.length);
            setHasMore(Boolean(next));
          } catch (error) {
            console.error("Erreur lors du chargement des athlètes:", error);
            setHasMore(false);
          } finally {
            setFetchingMore(false);
          }
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [offset, hasMore, fetchingMore, loading]);

  // Combined filtering
  const filteredItems = items.filter((item) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.full_name && item.full_name.toLowerCase().includes(q)) ||
      (item.sport?.name && item.sport.name.toLowerCase().includes(q)) ||
      (item.city && item.city.toLowerCase().includes(q)) ||
      (item.country && item.country.toLowerCase().includes(q));
    const matchSport = !sport || item.sport?.name === sport;
    const matchCountry = !country || item.country === country;
    const matchCity = !city || item.city === city;
    return matchSearch && matchSport && matchCountry && matchCity;
  });

  return (
    <SidebarInset className="min-h-screen flex flex-col">
      <div className="flex flex-1 flex-col gap-4 px-6 md:px-12 2xl:px-24 py-6">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Tous les Athlètes</h1>
          <p className="text-muted-foreground mt-1">
            Découvrez et suivez vos athlètes favoris
          </p>
        </div>

        {/* Search Bar with Filters */}
        <AthleteSearchBar
          value={search}
          onChange={setSearch}
          sport={sport}
          onSport={setSport}
          country={country}
          onCountry={setCountry}
          city={city}
          onCity={setCity}
          sports={sports}
          countries={countries}
          cities={cities}
        />

        {/* Empty State for filtered results */}
        {!loading && filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="rounded-full bg-muted p-8 mb-6">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucun athlète trouvé</h3>
            <p className="text-muted-foreground max-w-md mb-4">
              {search || sport || country || city
                ? "Essayez de modifier vos filtres de recherche."
                : "Aucun athlète disponible pour le moment."}
            </p>
            {(search || sport || country || city) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setSport("");
                  setCountry("");
                  setCity("");
                }}
              >
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        )}

        {/* Athletes Grid */}
        <ItemsGrid loading={loading} items={filteredItems} badgeColor="bg-pink-600" />

        {/* Loading more items */}
        {fetchingMore && (
          <div className="grid gap-x-6 gap-y-12 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <SkeletonItem key={`more-${i}`} />
              ))}
          </div>
        )}

        {/* Sentinel for infinite scroll */}
        {hasMore && <div ref={sentinelRef} className="h-2" />}
      </div>
    </SidebarInset>
  );
}

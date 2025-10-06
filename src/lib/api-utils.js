// src/lib/api-utils.js
// Fonctions utilitaires intermédiaires entre l'API Sponsors Club et le front
import {
  getAthleteBySlug,
  followAthlete,
  unfollowAthlete,
  fetchAthletePhotos,
  // Ajoutez ici d'autres fonctions API si besoin
} from "./api";

/**
 * Récupère le profil public d'un athlète par son slug et normalise les données pour le front.
 */
export async function fetchAthleteProfile(slug) {
  const data = await getAthleteBySlug(slug);
  if (!data) return null;
  return {
    id: data.id,
    slug: data.slug,
    fullName: data.full_name,
    sport: data.sport,
    disciplines: data.disciplines,
    nationality: data.nationality,
    country: data.country,
    city: data.city,
    bio: data.bio,
    socialLinks: data.social_links,
    followers: data.followers_count_cached,
    engagementRate: data.engagement_rate_cached,
    avatar: data.avatar,
    photos: data.photos,
    cardPhotos: data.card_photos,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    // Ajoutez d'autres champs utiles ici
  };
}

/**
 * Suivre un athlète (retourne true si succès)
 */
export async function followAthleteById(athleteId) {
  try {
    await followAthlete(athleteId);
    return true;
  } catch {
    return false;
  }
}

/**
 * Désuivre un athlète (retourne true si succès)
 */
export async function unfollowAthleteById(athleteId) {
  try {
    await unfollowAthlete(athleteId);
    return true;
  } catch {
    return false;
  }
}

/**
 * Récupère les photos d'un athlète (galerie)
 */
export async function fetchAthleteGallery(athleteId) {
  try {
    return await fetchAthletePhotos(athleteId);
  } catch {
    return [];
  }
}

// Ajoutez d'autres helpers pour d'autres endpoints si besoin

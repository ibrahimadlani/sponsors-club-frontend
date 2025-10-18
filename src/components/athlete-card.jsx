/**
 * AthleteCard Component
 * 
 * Displays an athlete card with avatar, name, sport, location,
 * and action buttons (view profile, message).
 * 
 * @param {Object} athlete - The athlete data object
 * @param {Function} onMessageClick - Callback when message button is clicked
 * @param {boolean} messageLoading - Whether the message button is loading
 * @param {boolean} compact - Whether to show a compact version (optional)
 */

import Link from "next/link";
import { MessageSquare, User, MapPin } from "lucide-react";
import ResponsiveImage from "@/components/responsive-image";
import { Button } from "@/components/ui/button";

export default function AthleteCard({ 
  athlete, 
  onMessageClick, 
  messageLoading = false,
  compact = false 
}) {
  const avatarSrc = athlete.avatar || athlete.card_photos?.[0] || athlete.gallery_photos?.[0]?.image;
  const athleteName = athlete.full_name || athlete.name;
  const athleteLocation = [athlete.city, athlete.country].filter(Boolean).join(", ");
  const athleteSport = athlete.sport?.name || athlete.category;
  const profileUrl = athlete.slug ? `/athletes/${athlete.slug}` : `/athletes/${athlete.id}`;

  if (compact) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-colors">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Link href={profileUrl}>
            {avatarSrc ? (
              <ResponsiveImage
                alt={`${athleteName} avatar`}
                src={avatarSrc}
                fill
                className="size-12"
                imageClassName="rounded-full bg-gray-300 outline -outline-offset-1 outline-black/5 dark:bg-gray-700 dark:outline-white/10 object-cover"
                sizes="48px"
              />
            ) : (
              <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </Link>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <Link href={profileUrl}>
              <h3 className="text-sm font-semibold hover:text-pink-600 transition-colors line-clamp-1">
                {athleteName}
              </h3>
            </Link>
            {athleteSport && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {athlete.sport?.emoji && `${athlete.sport.emoji} `}{athleteSport}
              </p>
            )}
          </div>

          {/* Action */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMessageClick?.(athlete)}
            disabled={messageLoading}
            className="shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-colors">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <Link href={profileUrl}>
          {avatarSrc ? (
            <ResponsiveImage
              alt={`${athleteName} avatar`}
              src={avatarSrc}
              fill
              className="size-16"
              imageClassName="rounded-full bg-gray-300 outline -outline-offset-1 outline-black/5 dark:bg-gray-700 dark:outline-white/10 object-cover"
              sizes="64px"
            />
          ) : (
            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link href={profileUrl}>
            <h3 className="text-base font-semibold hover:text-pink-600 transition-colors line-clamp-1">
              {athleteName}
            </h3>
          </Link>
          
          {athleteSport && (
            <p className="text-sm text-muted-foreground line-clamp-1 flex items-center gap-1">
              {athlete.sport?.emoji && <span>{athlete.sport.emoji}</span>}
              <span>{athleteSport}</span>
            </p>
          )}
          
          {athleteLocation && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {athleteLocation}
            </p>
          )}

          {/* Stats */}
          {(athlete.followers_count_cached !== undefined || athlete.engagement_rate_cached) && (
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              {athlete.followers_count_cached !== undefined && (
                <span>👥 {athlete.followers_count_cached.toLocaleString('fr-FR')} abonnés</span>
              )}
              {athlete.engagement_rate_cached && (
                <span>📊 {athlete.engagement_rate_cached}% engagement</span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Link href={profileUrl}>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Voir le profil
            </Button>
          </Link>
          <Button
            variant="default"
            size="sm"
            onClick={() => onMessageClick?.(athlete)}
            disabled={messageLoading}
            className="bg-pink-600 hover:bg-pink-700 w-full sm:w-auto"
          >
            {messageLoading ? (
              "Chargement..."
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Heart, MapPin, Sparkles } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";

const formatEngagement = (value) => {
  if (value === null || value === undefined) return "N/A";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "N/A";
  const percentage = numeric > 1 ? numeric : numeric * 100;
  return `${Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(percentage)}%`;
};

const toAbsoluteMediaUrl = (value) => {
  if (!value || typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;
  if (/^(?:https?:)?\/\//i.test(raw)) {
    return raw;
  }
  const base = API_BASE_URL.replace(/\/$/, "");
  let path = raw;
  if (path.startsWith("./")) {
    path = path.slice(1);
  }
  path = path.replace(/^media\//i, "/media/");
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  if (!path.startsWith("/media/")) {
    const stripped = path.replace(/^\/+/, "").replace(/^media\//i, "");
    path = `/media/${stripped}`;
  }
  return `${base}${path}`;
};

const resolveImages = (item) => {
  let sources = [];
  if (Array.isArray(item.card_photos) && item.card_photos.length) {
    sources = item.card_photos.map((photo) => (typeof photo === "string" ? photo : photo?.image));
  } else if (Array.isArray(item.gallery_photos) && item.gallery_photos.length) {
    sources = item.gallery_photos.map((photo) => (typeof photo === "string" ? photo : photo?.image));
  } else if (Array.isArray(item.images) && item.images.length) {
    sources = item.images;
  } else {
    sources = [item.avatar, item.profile_picture, item.image1, item.image2, item.image3];
  }

  return sources
    .map((value) => toAbsoluteMediaUrl(value))
    .filter(Boolean);
};

const resolveProfileHref = (item) => {
  const normaliseSlug = (value) =>
    String(value || "")
      .trim()
      .replace(/^\/+|\/+$/g, "");

  const slugCandidate = normaliseSlug(item.slug || item.profile_slug);
  if (slugCandidate) {
    return `/athletes/${slugCandidate}`;
  }

  const profileUrl = String(item.profileUrl || item.profile_url || "").trim();
  if (profileUrl) {
    try {
      const resolved = profileUrl.startsWith("http")
        ? new URL(profileUrl).pathname
        : profileUrl;
      const segments = resolved.split("/").filter(Boolean);
      if (segments.length >= 2) {
        const last = segments[segments.length - 1];
        const before = segments[segments.length - 2];
        if (before === "athletes" && last) {
          return `/athletes/${last}`;
        }
      }
      if (segments.length === 1) {
        return `/athletes/${segments[0]}`;
      }
      if (resolved.startsWith("/")) {
        return resolved;
      }
    } catch (error) {
      console.warn("Unable to normalise profile URL", error);
    }
  }

  return item.id ? `/athletes/${item.id}` : "#";
};

const resolveName = (item) => {
  const parts = [item.first_name || item.firstName, item.last_name || item.lastName]
    .map((part) => part?.trim())
    .filter(Boolean);
  if (parts.length) return parts.join(" ");
  return item.name || item.full_name || item.display_name || "Athlète";
};

const resolveLocation = (item) => {
  const parts = [item.city, item.country].filter(Boolean);
  return parts.join(", ");
};

const resolveSportBadge = (item) => {
  if (item.category) return item.category;
  if (item.sport?.emoji || item.sport?.name) {
    return `${item.sport.emoji ? `${item.sport.emoji} ` : ""}${item.sport.name ?? ""}`.trim();
  }
  return null;
};

const ItemCard = ({ item, badgeColor = "bg-pink-600" }) => {
  const href = resolveProfileHref(item);
  const title = resolveName(item);
  const images = resolveImages(item);
  const hasMultipleImages = images.length > 1;
  const heroImage = images[0] || null;
  const location = resolveLocation(item);
  const bio =
    item.bio ||
    "Découvrez ses performances et son potentiel de sponsoring sur SponsorsClub.";
  const followers = item.followers_count_cached ?? item.followers ?? 0;
  const engagement = formatEngagement(item.engagement_rate_cached ?? item.engagement_rate);
  const sportBadge = resolveSportBadge(item);

  return (
    <div className="rounded-xl w-full group relative block transition-transform transform z-0">
      {sportBadge && (
        <span className="absolute top-4 right-4 flex items-center gap-1 text-black bg-white text-xs font-semibold px-2 py-1 rounded-lg shadow z-50">
          {sportBadge}
        </span>
      )}

      {hasMultipleImages ? (
        <div className="relative w-full h-64 rounded-xl border overflow-hidden">
          <Carousel className="w-full h-full">
            <CarouselContent className="h-full">
              {images.map((imageSrc, index) => (
                <CarouselItem key={index} className="h-64">
                  <Link href={href} className="relative block h-full w-full">
                    <Image
                      src={imageSrc}
                      alt={`${title} - image ${index + 1}`}
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 320px, 100vw"
                      className="object-cover object-center"
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
            <CarouselDots className="bottom-2" />
          </Carousel>
        </div>
      ) : (
        <Link href={href} className="relative block h-64 w-full rounded-xl border overflow-hidden">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={title}
              fill
              unoptimized
              sizes="(min-width: 1024px) 320px, 100vw"
              className="object-cover object-center"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
              Visuel en attente
            </div>
          )}
        </Link>
      )}

      <div className="flex flex-col mt-3">
        <div>
          <Link href={href} className="font-medium text-base leading-2 hover:underline flex items-center gap-2">
            {title}
            {item.level ? (
              <span
                className={`flex items-center gap-1 text-white ${badgeColor} text-xs font-semibold py-0.5 pl-0.5 pr-1.5 shadow rounded-full`}
              >
                <BadgeCheck className="w-4 h-4" strokeWidth={2} />
                {item.level}
              </span>
            ) : null}
          </Link>
          <p className="font-normal text-sm dark:text-white/50 text-black/50 leading-5 mt-1 flex flex-wrap items-start gap-2">
            {location ? (
              <span className="font-medium inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {location}
              </span>
            ) : null}
            {location && bio ? <span className="font-bold">·</span> : null}
            {bio ? <span className="max-w-prose line-clamp-3">{bio}</span> : null}
          </p>
        </div>

        <div className="font-medium text-sm dark:text-white/50 text-black/50 leading-5 flex flex-wrap items-center gap-4 my-3">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5" strokeWidth={1.5} />
            {formatNumber(followers)} abonnés
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" strokeWidth={1.5} />
            {engagement} engagement
          </div>
        </div>

        {item.price ? (
          <p className="font-normal text-sm leading-5">
            À partir de {" "}
            <span className="font-medium text-base">{item.price}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default ItemCard;

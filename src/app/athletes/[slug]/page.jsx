"use client";

// Page: Athlete detail
// Shows athlete header summary, media carousel, stats and charts.

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BadgeCheck, Instagram, Facebook, Youtube, MapIcon, Check, ThumbsUp, User as UserIcon } from "lucide-react";
import FollowerGrowthChart from "@/components/bar-chart";
import RadarChartComponent from "@/components/radar-chart";
import { formatNumber, formatPriceEUR } from "@/lib/utils";
const safeFormatPrice = (value) => {
  if (typeof formatPriceEUR === 'function') return formatPriceEUR(value);
  try {
    const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/\s|€/g, ''));
    if (Number.isNaN(num)) return `${value}€`;
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(num) + '€';
  } catch { return `${value}€`; }
};
import { getAthleteBySlug } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { NavUser } from "@/components/nav-user";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Globe, Euro, ChevronDown, Calendar as CalendarIcon, MapPin, Users, Image as ImageIcon } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AthleteProfileHeader from "@/components/athlete-profile";
import PageHeader from "@/components/page-header";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Helper to join class names
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Example timeline data (can be fed from API later)
const timeline = [
  {
    id: 1,
    content: "A intégré",
    target: "l'équipe nationale",
    href: "#",
    date: "2019",
    datetime: "2019-01-01",
    icon: UserIcon,
    iconBackground: "bg-gray-400 dark:bg-gray-600",
  },
  {
    id: 2,
    content: "Sélectionné et validé par",
    target: "le staff technique",
    href: "#",
    date: "2020",
    datetime: "2020-01-01",
    icon: ThumbsUp,
    iconBackground: "bg-blue-500",
  },
  {
    id: 3,
    content: "Vainqueur",
    target: "Championnat national",
    href: "#",
    date: "2021",
    datetime: "2021-01-01",
    icon: Check,
    iconBackground: "bg-green-500",
  },
  {
    id: 4,
    content: "MVP",
    target: "Compétition internationale",
    href: "#",
    date: "2022",
    datetime: "2022-01-01",
    icon: ThumbsUp,
    iconBackground: "bg-blue-500",
  },
  {
    id: 5,
    content: "Médaillé",
    target: "Jeux européens",
    href: "#",
    date: "2023",
    datetime: "2023-01-01",
    icon: Check,
    iconBackground: "bg-green-500",
  },
];

// Simple sports calendar (dummy data for demo)
const sportsCalendar = [
  { id: 'ev-1', date: '2025-03-18', title: 'Stage de préparation', location: 'INSEP, Paris' },
  { id: 'ev-2', date: '2025-04-05', title: 'Tournoi international', location: 'Madrid, Espagne' },
  { id: 'ev-3', date: '2025-04-22', title: 'Match amical', location: 'Lyon, France' },
  { id: 'ev-4', date: '2025-05-10', title: 'Championnat national', location: 'Marseille, France' },
];


const itemsData = [
  {
    id: 1,
    name: "Teddy Riner",
    location: "Paris, France",
    category: "🥋 Judo",
    price: "20 000",
    isCarousel: true,
    profileUrl: "/athletes/teddy-riner",
    certified: true,
    images: ["/images/teddy-1.jpg", "/images/teddy-2.jpg", "/images/teddy-3.jpg"],
    bio: "Triple champion olympique, 11 fois champion du monde. Un des plus grands judokas de l’histoire.",
    subscribers: { vb: 200000, instagram: 800000, youtube: 150000 },
    level: "PRO",
  },
  ,{
    id: 2,
    name: "Victor Wembanyama",
    location: "Paris, France",
    category: "🏀 Basketball",
    price: "18 500",
    isCarousel: true,
    profileUrl: "/athletes/victor-wembanyama",
    certified: true,
    images: ["/images/wemby-1.jpg", "/images/wemby-2.jpg", "/images/wemby-3.jpg"],
    bio: "Phénomène du basket français et star de la NBA. L’un des plus grands espoirs du basket mondial.",
    subscribers: { vb: 250000, instagram: 3_500_000, youtube: 500000 },
    level: "PRO",
  },
  {
    id: 3,
    name: "Kylian Mbappé",
    location: "Paris, France",
    category: "⚽ Football",
    price: "50 000",
    isCarousel: true,
    profileUrl: "/athletes/kylian-mbappe",
    certified: true,
    images: ["/images/mbappe-1.jpg", "/images/mbappe-2.jpg", "/images/mbappe-3.jpg"],
    bio: "Champion du monde 2018, joueur du Real Madrid, leader de l’équipe de France.",
    subscribers: { vb: 1_000_000, instagram: 120_000_000, youtube: 2_000_000 },
    level: "PRO",
  },
  {
    id: 4,
    name: "Léon Marchand",
    location: "Toulouse, France",
    category: "🏊‍♂️ Natation",
    price: "10 500",
    isCarousel: true,
    profileUrl: "/athletes/leon-marchand",
    certified: true,
    images: ["/images/leon-1.jpg", "/images/leon-2.jpg", "/images/leon-3.jpg"],
    bio: "Champion du monde du 400m 4 nages et espoir olympique français.",
    subscribers: { vb: 35000, instagram: 1_200_000, youtube: 180000 },
    level: "PRO",
  },
  {
    id: 5,
    name: "Antoine Dupont",
    location: "Toulouse, France",
    category: "🏉 Rugby",
    price: "15 000",
    isCarousel: true,
    profileUrl: "/athletes/antoine-dupont",
    certified: true,
    images: ["/images/dupont-1.jpg", "/images/dupont-2.jpg", "/images/dupont-3.jpg"],
    bio: "Capitaine du XV de France, meilleur joueur du monde en 2021.",
    subscribers: { vb: 80000, instagram: 1_300_000, youtube: 400000 },
    level: "PRO",
  },
  {
    id: 6,
    name: "Clarisse Agbegnenou",
    location: "Paris, France",
    category: "🥋 Judo",
    price: "9 000",
    isCarousel: true,
    profileUrl: "/athletes/clarisse-agbegnenou",
    certified: true,
    images: ["/images/clarisse-1.jpg", "/images/clarisse-2.jpg", "/images/clarisse-3.jpg"],
    bio: "Double championne olympique et six fois championne du monde de judo.",
    subscribers: { vb: 60000, instagram: 500000, youtube: 100000 },
    level: "PRO",
  },
  {
    id: 7,
    name: "Alizé Cornet",
    location: "Nice, France",
    category: "🎾 Tennis",
    price: "7 500",
    isCarousel: true,
    profileUrl: "/athletes/alize-cornet",
    certified: true,
    images: ["/images/alize-1.jpg", "/images/alize-2.jpg", "/images/alize-3.jpg"],
    bio: "Joueuse emblématique du tennis français, avec plus de 60 participations en Grand Chelem.",
    subscribers: { vb: 30000, instagram: 200000, youtube: 80000 },
    level: "PRO",
  },
  {
    id: 8,
    name: "Romain Bardet",
    location: "Clermont-Ferrand, France",
    category: "🚴‍♂️ Cyclisme",
    price: "6 000",
    isCarousel: true,
    profileUrl: "/athletes/romain-bardet",
    certified: true,
    images: ["/images/romain-1.jpg", "/images/romain-2.jpg", "/images/romain-3.jpg"],
    bio: "Meilleur grimpeur français, multiple vainqueur d’étape sur le Tour de France.",
    subscribers: { vb: 50000, instagram: 300000, youtube: 120000 },
    level: "PRO",
  },
  {
    id: 9,
    name: "Estelle Mossely",
    location: "Paris, France",
    category: "🥊 Boxe",
    price: "8 500",
    isCarousel: true,
    profileUrl: "/athletes/estelle-mossely",
    certified: true,
    images: ["/images/estelle-1.jpg", "/images/estelle-2.jpg", "/images/estelle-3.jpg"],
    bio: "Championne olympique et multiple championne du monde de boxe.",
    subscribers: { vb: 70000, instagram: 400000, youtube: 100000 },
    level: "PRO",
  },
  {
    id: 10,
    name: "Justine Braisaz-Bouchet",
    location: "Albertville, France",
    category: "🎿 Biathlon",
    price: "5 500",
    isCarousel: true,
    profileUrl: "/athletes/justine-braisaz",
    certified: true,
    images: ["/images/justine-1.jpg", "/images/justine-2.jpg", "/images/justine-3.jpg"],
    bio: "Championne olympique et étoile montante du biathlon français.",
    subscribers: { vb: 40000, instagram: 250000, youtube: 75000 },
    level: "PRO",
  },
  {
    id: 11,
    name: "Thibaut Pinot",
    location: "Besançon, France",
    category: "🚴‍♂️ Cyclisme",
    price: "7 200",
    isCarousel: true,
    profileUrl: "/athletes/thibaut-pinot",
    certified: true,
    images: ["/images/thibaut-1.jpg", "/images/thibaut-2.jpg", "/images/thibaut-3.jpg"],
    bio: "Ancien vainqueur du Tourmalet, l’un des cyclistes français les plus appréciés.",
    subscribers: { vb: 60000, instagram: 700000, youtube: 180000 },
    level: "PRO",
  },
  {
    id: 12,
    name: "Kevin Mayer",
    location: "Montpellier, France",
    category: "🏃‍♂️ Décathlon",
    price: "9 500",
    isCarousel: true,
    profileUrl: "/athletes/kevin-mayer",
    certified: true,
    images: ["/images/kevin-1.jpg", "/images/kevin-2.jpg", "/images/kevin-3.jpg"],
    bio: "Recordman du monde du décathlon, double vice-champion olympique.",
    subscribers: { vb: 75000, instagram: 500000, youtube: 120000 },
    level: "PRO",
  },
  {
    id: 13,
    name: "Earvin Ngapeth",
    location: "Poitiers, France",
    category: "🏐 Volley-ball",
    price: "8 000",
    isCarousel: true,
    profileUrl: "/athletes/earvin-ngapeth",
    certified: true,
    images: ["/images/earvin-1.jpg", "/images/earvin-2.jpg", "/images/earvin-3.jpg"],
    bio: "Star du volley français, champion olympique et joueur emblématique.",
    subscribers: { vb: 90000, instagram: 400000, youtube: 110000 },
    level: "PRO",
  },
  {
    id: 14,
    name: "Perrine Laffont",
    location: "Toulouse, France",
    category: "⛷ Ski",
    price: "950",
    isCarousel: true,
    profileUrl: "/athletes/perrine-laffont",
    certified: true,
    images: ["/images/perrine-1.jpg", "/images/perrine-2.jpg", "/images/perrine-3.jpg"],
    bio: "Championne olympique de ski de bosses, en route pour Los Angles 2028.",
    subscribers: { vb: 8000, instagram: 34000, youtube: 20000 },
    level: "PRO",
  },
  {
    id: 19,
    name: "Caroline Garcia",
    location: "Lyon, France",
    category: "🎾 Tennis",
    price: "9 800",
    isCarousel: true,
    profileUrl: "/athletes/caroline-garcia",
    certified: true,
    images: ["/images/garcia-1.jpg", "/images/garcia-2.jpg", "/images/garcia-3.jpg"],
    bio: "Joueuse de tennis professionnelle, vainqueure de plusieurs titres WTA en simple et double.",
    subscribers: { vb: 11000, instagram: 200000, youtube: 60000 },
    level: "PRO",
  },
  {
    id: 24,
    name: "Tony Yoka",
    location: "Paris, France",
    category: "🥊 Boxe",
    price: "10 000",
    isCarousel: true,
    profileUrl: "/athletes/tony-yoka",
    certified: true,
    images: ["/images/yoka-1.jpg", "/images/yoka-2.jpg", "/images/yoka-3.jpg"],
    bio: "Champion olympique des poids super-lourds en 2016, boxeur professionnel invaincu.",
    subscribers: { vb: 11500, instagram: 250000, youtube: 90000 },
    level: "PRO",
  },

];


const groupBy = (array, key) =>
  array.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});

const grouped = groupBy(itemsData, "location");
const athleteGroups = Object.entries(grouped).map(([location, athletes]) => ({
  title: `Athlètes à ${location}`,
  athletes,
}));

export default function AthletePage() {
  const { user } = useCurrentUser();
  const { athleteId } = useParams();
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [followAnim, setFollowAnim] = useState(false);
  const [activeTab, setActiveTab] = useState('profil');

  useEffect(() => {
    (async () => {
      const a = await getAthleteBySlug(athleteId);
      // Normalize backend data shape to the UI expectations
      const normalized = a
        ? {
            ...a,
            // Ensure a consistent subscribers object
            subscribers: {
              instagram: a?.subscribers?.instagram ?? a.subscribers_instagram ?? 0,
              vb: a?.subscribers?.vb ?? a.subscribers_facebook ?? 0,
              youtube: a?.subscribers?.youtube ?? a.subscribers_youtube ?? 0,
            },
            // Ensure a consistent images array
            images:
              Array.isArray(a.images) && a.images.length > 0
                ? a.images
                : [a.image1, a.image2, a.image3].filter(Boolean),
          }
        : null;
      setAthlete(normalized);
      setIsFollowed(Boolean(normalized?.is_followed));
      setLoading(false);
    })();
  }, [athleteId]);



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg font-semibold text-gray-500">Chargement…</p>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg font-semibold text-gray-500">Athlete not found.</p>
        <Link href="/explore" className="mt-4 text-pink-600 font-semibold hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <SidebarInset className="min-h-screen flex flex-col">
        {/* Shared header (with mobile Sponsor CTA in the rightSlot) */}
        <PageHeader
          user={user}
          rightSlot={
            <div className="flex items-center gap-2">
              <a
                href="/sponsor"
                className="md:hidden text-pink-600 font-semibold text-xs hover:underline"
              >
                Sponsor
              </a>
              <NavUser user={user} />
            </div>
          }
        />

        {/* Main athlete profile content */}
        <div className="max-w-6xl mx-auto px-4 py-8 flex-1">
          {/* Compact header summary (title, breadcrumbs, meta) */}
          <AthleteProfileHeader
            title={athlete.name}
            breadcrumbs={[
              { label: "Athletes", href: "/athletes" },
              { label: athlete.category },
            ]}
            levelLabel={athlete.level}
            ageLabel={Number.isInteger(athlete.age) ? `${athlete.age} ans` : undefined}
            nationalityLabel={athlete.nationality || undefined}
            images={(athlete.images || []).slice(0,4)}
            location={athlete.location}
            followersCount={athlete.followers_count || 0}
            priceLabel={safeFormatPrice(athlete.price)}
            calendarLabel="Disponible"
            isFollowed={isFollowed}
            onToggleFollow={handleToggleFollow}
            followAnimating={followAnim}
          />

          {/* Tabs: Profil / Audience & visibilité / Image & valeurs */}
          <div className="mt-6">
            {/* Mobile select */}
            <div className="grid grid-cols-1 sm:hidden relative">
              <select
                aria-label="Section"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-600 dark:bg-white/5 dark:text-gray-100 dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-pink-500"
              >
                <option value="profil">Profil</option>
                <option value="audience">Audience & visibilité</option>
                <option value="valeurs">Image & valeurs</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 dark:text-gray-400"
              />
            </div>
            {/* Desktop tabs */}
            <div className="hidden sm:block">
              <nav aria-label="Tabs" className="isolate flex divide-x divide-gray-200 rounded-lg bg-white shadow-sm dark:divide-white/10 dark:bg-gray-800/50 dark:shadow-none dark:outline dark:-outline-offset-1 dark:outline-white/10">
                {[
                  { key: 'profil', name: 'Profil' },
                  { key: 'audience', name: 'Audience & visibilité' },
                  { key: 'valeurs', name: 'Image & valeurs' },
                ].map((tab, idx, arr) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    aria-current={activeTab === tab.key ? 'page' : undefined}
                    className={classNames(
                      activeTab === tab.key
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white',
                      idx === 0 ? 'rounded-l-lg' : '',
                      idx === arr.length - 1 ? 'rounded-r-lg' : '',
                      'group relative min-w-0 flex-1 overflow-hidden px-4 py-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10 dark:hover:bg-white/5'
                    )}
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      {tab.key === 'profil' && (<UserIcon className="size-4" />)}
                      {tab.key === 'audience' && (<Users className="size-4" />)}
                      {tab.key === 'valeurs' && (<ImageIcon className="size-4" />)}
                      <span>{tab.name}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        activeTab === tab.key ? 'bg-pink-600 dark:bg-pink-500' : 'bg-transparent',
                        'absolute inset-x-0 bottom-0 h-0.5'
                      )}
                    />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab content */}
          <div className="mt-6 space-y-6">
            {activeTab === 'profil' && (
              <section className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow">
                <h3 className="text-base font-semibold mb-3">Profil sportif</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Discipline / Catégorie</dt>
                    <dd className="text-gray-900 dark:text-white">{athlete.category || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Niveau</dt>
                    <dd className="text-gray-900 dark:text-white">{athlete.level || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Club / Fédération / Équipe</dt>
                    <dd className="text-gray-900 dark:text-white">{athlete.location || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Calendrier de compétitions</dt>
                    <dd className="text-gray-900 dark:text-white">Voir la section “Calendrier sportif” ci‑dessous</dd>
                  </div>
                </dl>
                <div className="mt-5">
                  <h4 className="text-sm font-semibold mb-2">Palmarès</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                    {timeline.slice(0, 4).map((t) => (
                      <li key={t.id}>{t.content} {t.target} — {t.date}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {activeTab === 'audience' && (
              <section className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow">
                <h3 className="text-base font-semibold mb-3">Audience & visibilité</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="font-medium">Réseaux sociaux</div>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                      <li>Instagram: {formatNumber(athlete?.subscribers?.instagram ?? athlete.subscribers_instagram ?? 0)}</li>
                      <li>Facebook: {formatNumber(athlete?.subscribers?.vb ?? athlete.subscribers_facebook ?? 0)}</li>
                      <li>YouTube: {formatNumber(athlete?.subscribers?.youtube ?? athlete.subscribers_youtube ?? 0)}</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Données démographiques</div>
                    <p className="text-gray-700 dark:text-gray-300">Données détaillées à venir.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Reach moyen</div>
                    <p className="text-gray-700 dark:text-gray-300">À estimer selon les plateformes.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Relations médias</div>
                    <p className="text-gray-700 dark:text-gray-300">TV, radio, presse — à compléter.</p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'valeurs' && (
              <section className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow">
                <h3 className="text-base font-semibold mb-3">Image & valeurs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="font-medium">Positionnement</div>
                    <p className="text-gray-700 dark:text-gray-300">Santé, performance, durabilité, lifestyle, inclusion…</p>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Valeurs</div>
                    <p className="text-gray-700 dark:text-gray-300">Écologie, diversité, éducation…</p>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Réputation</div>
                    <p className="text-gray-700 dark:text-gray-300">Sentiment public (positif / négatif) — à préciser.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Alignement marque</div>
                    <p className="text-gray-700 dark:text-gray-300">Ex: banque → rigueur, boisson énergétique → performance, luxe → prestige.</p>
                  </div>
                </div>
              </section>
            )}
          </div>
          
          {/* Media + basic info (card layout) removed to avoid duplicate details under header */}
          {/* Charts section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow">
              <h2 className="text-lg font-semibold mb-2">Follower Growth</h2>
              <FollowerGrowthChart />
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow">
              <h2 className="text-lg font-semibold mb-2">Performance Radar</h2>
              <RadarChartComponent />
            </div>
          </div>

          {/* About / Large description */}
          <section className="mt-10 bg-white dark:bg-zinc-900 rounded-xl p-5 shadow">
            <h2 className="text-lg font-semibold mb-2">À propos</h2>
            <p className="text-sm text-black/80 dark:text-white/80 leading-6">
              {athlete.bio}
            </p>
            <p className="text-sm text-black/70 dark:text-white/70 leading-6 mt-3">
              Athlète confirmé au niveau {athlete.level}, basé à {athlete.location}. Disponible pour des
              collaborations, campagnes sponsorisées et événements. Expérience avec des marques premium,
              prise de parole publique et création de contenu.
            </p>
          </section>

          {/* Sports calendar */}
          <section className="mt-10 bg-white dark:bg-zinc-900 rounded-xl p-5 shadow">
            <h2 className="text-lg font-semibold mb-3">Calendrier sportif</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <Calendar
                className="rounded-md border"
                mode="single"
                modifiers={{ event: sportsCalendar.map(ev => new Date(ev.date)) }}
                modifiersClassNames={{ event: "bg-pink-600/15 text-foreground" }}
                onDayClick={(day) => {
                  const key = day.toDateString();
                  const evts = sportsCalendar.filter(ev => new Date(ev.date).toDateString() === key);
                  setSelectedDay(day); setSelectedDayEvents(evts); if (evts.length) setOpenEventDialog(true);
                }}
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">À venir</h3>
                <ul className="space-y-3">
                  {sportsCalendar.slice(0,4).map(ev => (
                    <li key={ev.id} className="flex items-start gap-2">
                      <CalendarIcon className="w-4 h-4 mt-0.5 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{ev.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(ev.date).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' })}
                          <span className="mx-1">·</span>
                          <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Dialog open={openEventDialog} onOpenChange={setOpenEventDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {selectedDay ? selectedDay.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : 'Événements'}
                  </DialogTitle>
                </DialogHeader>
                {selectedDayEvents.length ? (
                  <ul className="mt-2 space-y-3">
                    {selectedDayEvents.map(ev => (
                      <li key={ev.id} className="border rounded-md p-3">
                        <div className="text-sm font-semibold">{ev.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {ev.location}
                        </div>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Description de l’événement à venir. Détails, horaires, diffusion, etc. (données démo)</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aucun événement programmé ce jour.</p>
                )}
              </DialogContent>
            </Dialog>
          </section>

          {/* Photo gallery */}
          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-3">Galerie</h2>
            <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
              {(athlete.images || []).map((src, idx) => (
                <li key={`${src}-${idx}`} className="relative">
                  <div className="group overflow-hidden rounded-lg bg-gray-100 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 dark:bg-gray-800 dark:focus-within:outline-indigo-500">
                    <img
                      alt=""
                      src={src}
                      className="pointer-events-none aspect-[10/7] rounded-lg object-cover outline -outline-offset-1 outline-black/5 group-hover:opacity-75 dark:outline-white/10"
                    />
                    <button type="button" className="absolute inset-0 focus:outline-hidden">
                      <span className="sr-only">Voir {athlete.name}</span>
                    </button>
                  </div>
                  <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900 dark:text-white">
                    {athlete.name}
                  </p>
                  <p className="pointer-events-none block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Photo #{idx + 1}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Combined social feed (Instagram + Facebook) */}
          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-3">Fil social</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["instagram", "facebook"].map((platform, idx) => (
                <div key={platform} className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow">
                  <div className="flex items-center gap-2 mb-3">
                    {platform === "instagram" ? (
                      <Instagram className="w-5 h-5 text-pink-600" />
                    ) : (
                      <Facebook className="w-5 h-5 text-blue-600" />
                    )}
                    <span className="text-sm font-semibold capitalize">{platform}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(athlete.images || []).slice(0, 3).map((src, i) => (
                      <img
                        key={`${platform}-${i}`}
                        src={src}
                        alt={`${platform} post ${i + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Dernières publications visuelles – données de démonstration.
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sports accomplishments timeline */}
          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-3">Palmarès</h2>
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {timeline.map((event, eventIdx) => (
                  <li key={event.id}>
                    <div className="relative pb-8">
                      {eventIdx !== timeline.length - 1 ? (
                        <span
                          aria-hidden="true"
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-white/10"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={classNames(
                              event.iconBackground,
                              "flex size-8 items-center justify-center rounded-full ring-8 ring-white dark:ring-gray-900",
                            )}
                          >
                            <event.icon aria-hidden="true" className="size-5 text-white" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {event.content}{" "}
                              <a href={event.href} className="font-medium text-gray-900 dark:text-white">
                                {event.target}
                              </a>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                            <time dateTime={event.datetime}>{event.date}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* FOOTER (desktop, French) */}
        <footer className="w-full px-6 md:px-12 2xl:px-24 py-4 text-center border-t bg-background items-center justify-between text-sm hidden md:flex mt-auto">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="">
              &copy; {new Date().getFullYear()} SponsorsClub
            </span>
            <span> · </span>
            <Link href="/privacy" className="hover:underline">
              Confidentialité
            </Link>
            <span> · </span>
            <Link href="/terms-of-services" className="hover:underline">
              Conditions générales
            </Link>
            <span> · </span>
            <Link href="/sitemap" className="hover:underline">
              Plan du site
            </Link>
            <span> · </span>
            <Link href="/about" className="hover:underline">
              À propos
            </Link>
          </div>
          <div className="flex  items-center gap-2.5">
            <Link href="/privacy" className="font-semibold flex items-center gap-1 hover:underline  whitespace-nowrap">
              <Globe className="w-4 h-4" />
              Français
            </Link>
            <span> · </span>
            <Link href="/privacy" className="font-semibold flex items-center gap-1 hover:underline  whitespace-nowrap">
              <Euro className="w-4 h-4" />
              EUR
            </Link>
            <span> · </span>
            <Link href="/privacy" className="font-semibold flex items-center gap-1 hover:underline  whitespace-nowrap">
              Aide & ressources
              <ChevronDown className="w-4 h-4" />
            </Link>
    </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}

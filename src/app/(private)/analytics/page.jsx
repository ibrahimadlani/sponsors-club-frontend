"use client";

/**
 * Analytics Page
 * 
 * Displays comprehensive analytics and statistics for athletes.
 * Shows performance metrics, growth trends, and engagement data.
 * Role-specific views for agents and collaborators.
 */

import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  Eye,
  MessageCircle,
  BarChart3,
  Calendar,
  Download,
  Filter,
  ChevronDown,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowerGrowthChart from "@/components/bar-chart";
import RadarChartComponent from "@/components/radar-chart";

/**
 * Format number with K/M suffix
 */
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

/**
 * Stat Card Component
 */
function StatCard({ title, value, change, icon: Icon, trend }) {
  const isPositive = trend === "up" || (change && parseFloat(change) > 0);
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs flex items-center gap-1 mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
            <TrendIcon className="h-3 w-3" />
            <span>{change} depuis le mois dernier</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Athlete Performance Row Component
 */
function AthletePerformanceRow({ athlete }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
          {athlete.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium">{athlete.name}</p>
          <p className="text-sm text-muted-foreground">{athlete.sport}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Followers</p>
          <p className="font-semibold">{formatNumber(athlete.followers)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Engagement</p>
          <p className="font-semibold">{athlete.engagement}%</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Croissance</p>
          <p className={`font-semibold ${athlete.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
            {athlete.growth >= 0 ? "+" : ""}{athlete.growth}%
          </p>
        </div>
        <Badge variant={athlete.status === "active" ? "default" : "secondary"}>
          {athlete.status}
        </Badge>
      </div>
    </div>
  );
}

/**
 * Platform Stats Component
 */
function PlatformStats({ platform, data }) {
  const icons = {
    instagram: "📷",
    facebook: "👍",
    youtube: "▶️",
    twitter: "🐦",
    tiktok: "🎵",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span>{icons[platform] || "📱"}</span>
          <span className="capitalize">{platform}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Abonnés</span>
          <span className="font-semibold">{formatNumber(data.followers)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Posts</span>
          <span className="font-semibold">{data.posts}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Engagement</span>
          <span className="font-semibold">{data.engagement}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Portée moy.</span>
          <span className="font-semibold">{formatNumber(data.reach)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main Analytics Page
 */
export default function AnalyticsPage() {
  const { role, isLoading: roleLoading } = useUserRole();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedAthlete, setSelectedAthlete] = useState("all");

  // Mock data
  const [stats, setStats] = useState({
    totalFollowers: 2500000,
    avgEngagement: 4.2,
    totalPosts: 156,
    totalReach: 5800000,
  });

  const [athletes, setAthletes] = useState([
    {
      id: 1,
      name: "Léon Marchand",
      sport: "🏊‍♂️ Natation",
      followers: 450000,
      engagement: 5.2,
      growth: 12.5,
      status: "active",
    },
    {
      id: 2,
      name: "Teddy Riner",
      sport: "🥋 Judo",
      followers: 800000,
      engagement: 4.8,
      growth: 8.3,
      status: "active",
    },
    {
      id: 3,
      name: "Perrine Laffont",
      sport: "⛷ Ski",
      followers: 120000,
      engagement: 6.1,
      growth: 15.2,
      status: "active",
    },
  ]);

  const [platformStats, setPlatformStats] = useState({
    instagram: {
      followers: 1800000,
      posts: 89,
      engagement: 5.2,
      reach: 3200000,
    },
    facebook: {
      followers: 450000,
      posts: 34,
      engagement: 3.1,
      reach: 1500000,
    },
    youtube: {
      followers: 250000,
      posts: 23,
      engagement: 4.5,
      reach: 1100000,
    },
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // TODO: Remplacer par des appels API réels
        // const data = await analyticsEndpoints.listAthleteStats();
        
        // Simuler un chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Erreur lors du chargement des analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange, selectedAthlete]);

  if (roleLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Vue d&apos;ensemble de vos performances et statistiques
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 derniers jours</SelectItem>
            <SelectItem value="30d">30 derniers jours</SelectItem>
            <SelectItem value="90d">90 derniers jours</SelectItem>
            <SelectItem value="1y">1 an</SelectItem>
          </SelectContent>
        </Select>

        {role === "AGENT" && athletes.length > 1 && (
          <Select value={selectedAthlete} onValueChange={setSelectedAthlete}>
            <SelectTrigger className="w-full md:w-[250px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Athlète" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les athlètes</SelectItem>
              {athletes.map((athlete) => (
                <SelectItem key={athlete.id} value={athlete.id.toString()}>
                  {athlete.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Followers"
          value={formatNumber(stats.totalFollowers)}
          change="+12.5%"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Engagement Moyen"
          value={`${stats.avgEngagement}%`}
          change="+0.8%"
          icon={Heart}
          trend="up"
        />
        <StatCard
          title="Publications"
          value={stats.totalPosts}
          change="+23"
          icon={MessageCircle}
          trend="up"
        />
        <StatCard
          title="Portée Totale"
          value={formatNumber(stats.totalReach)}
          change="+18.2%"
          icon={Eye}
          trend="up"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Croissance des Followers</CardTitle>
            <CardDescription>Évolution sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <FollowerGrowthChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Globale</CardTitle>
            <CardDescription>Métriques clés comparées</CardDescription>
          </CardHeader>
          <CardContent>
            <RadarChartComponent />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="athletes" className="mb-6">
        <TabsList>
          <TabsTrigger value="athletes">Athlètes</TabsTrigger>
          <TabsTrigger value="platforms">Plateformes</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
        </TabsList>

        <TabsContent value="athletes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance par Athlète</CardTitle>
              <CardDescription>
                Comparaison des métriques clés par athlète
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {athletes.map((athlete) => (
                  <AthletePerformanceRow key={athlete.id} athlete={athlete} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(platformStats).map(([platform, data]) => (
              <PlatformStats key={platform} platform={platform} data={data} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performances du Contenu</CardTitle>
              <CardDescription>
                Analyse des publications les plus performantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Post Instagram - Victoire Championnats",
                    date: "Il y a 2 jours",
                    views: 250000,
                    likes: 45000,
                    comments: 2300,
                    engagement: 18.9,
                  },
                  {
                    title: "Vidéo YouTube - Entrainement intensif",
                    date: "Il y a 5 jours",
                    views: 180000,
                    likes: 12000,
                    comments: 890,
                    engagement: 7.2,
                  },
                  {
                    title: "Post Facebook - Nouveau partenariat",
                    date: "Il y a 1 semaine",
                    views: 95000,
                    likes: 8500,
                    comments: 450,
                    engagement: 9.4,
                  },
                ].map((post, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{post.title}</h4>
                      <p className="text-sm text-muted-foreground">{post.date}</p>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Vues</p>
                        <p className="font-semibold">{formatNumber(post.views)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Likes</p>
                        <p className="font-semibold">{formatNumber(post.likes)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Comments</p>
                        <p className="font-semibold">{post.comments}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Engagement</p>
                        <p className="font-semibold text-green-600">
                          {post.engagement}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommandations</CardTitle>
          <CardDescription>
            Analyses automatiques pour améliorer vos performances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">
                  Excellente croissance Instagram
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Votre engagement Instagram a augmenté de 15% ce mois-ci. Continuez à publier du contenu authentique et interactif.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                  Opportunité YouTube
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Vos vidéos longues performent bien. Envisagez d&apos;augmenter la fréquence de publication à 2-3 vidéos par semaine.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
              <TrendingDown className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">
                  Baisse d&apos;engagement Facebook
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  L&apos;engagement Facebook a diminué de 5%. Testez des formats de contenu différents (vidéos courtes, stories, lives).
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

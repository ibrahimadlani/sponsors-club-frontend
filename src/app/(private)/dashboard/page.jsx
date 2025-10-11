"use client";

import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAgentNavigation } from "@/hooks/useAgentNavigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BicepsFlexed,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Heart,
  MessageSquare,
  FileText,
  ChartNoAxesCombined,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Handshake,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { role, isLoading: roleLoading } = useUserRole();
  const { user } = useCurrentUser();
  const { navItems: agentNavItems, athletes } = useAgentNavigation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (role === "AGENT") {
        setStats({
          athletes: 8,
          activeContracts: 12,
          totalRevenue: "€245,000",
          pendingOffers: 5,
          recentActivity: [
            { id: 1, type: "contract", athlete: "Teddy Riner", action: "Nouveau contrat signé", date: "Il y a 2h", amount: "€50,000" },
            { id: 2, type: "meeting", athlete: "Clarisse Agbegnenou", action: "Réunion programmée", date: "Demain 14h" },
            { id: 3, type: "offer", athlete: "Romane Dicko", action: "Nouvelle offre reçue", date: "Il y a 1j", amount: "€35,000" },
          ],
          upcomingEvents: [
            { id: 1, title: "Réunion avec Nike", date: "2025-10-12", time: "14:00" },
            { id: 2, title: "Négociation contrat - Teddy", date: "2025-10-15", time: "10:00" },
          ],
        });
      } else {
        setStats({
          followedAthletes: 24,
          savedOpportunities: 8,
          activeCollaborations: 3,
          newAthletes: 15,
          recentActivity: [
            { id: 1, type: "follow", athlete: "Victor Wembanyama", action: "Nouvel athlète suivi", date: "Il y a 3h" },
            { id: 2, type: "collab", organisation: "Adidas France", action: "Nouvelle opportunité de collaboration", date: "Il y a 5h" },
            { id: 3, type: "update", athlete: "Kylian Mbappé", action: "Mise à jour du profil", date: "Il y a 1j" },
          ],
          trendingAthletes: [
            { id: 1, name: "Leon Marchand", sport: "Natation", followers: "+2.5k" },
            { id: 2, name: "Alexis Hanquinquant", sport: "Paratriathlon", followers: "+1.8k" },
            { id: 3, name: "Estelle Mossely", sport: "Boxe", followers: "+1.2k" },
          ],
        });
      }
    };

    if (role) {
      loadStats();
    }
  }, [role]);

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

  return (
    <SidebarInset className="min-h-screen flex flex-col">
      <div className="flex flex-1 flex-col gap-6 px-6 md:px-12 2xl:px-24 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
            <p className="text-muted-foreground mt-1">
              {role === "AGENT" 
                ? "Gérez vos athlètes et suivez vos performances"
                : "Découvrez et suivez vos athlètes favoris"
              }
            </p>
          </div>
          <Badge variant={role === "AGENT" ? "default" : "secondary"} className="text-sm px-3 py-1">
            {role === "AGENT" ? "Agent" : "Collaborateur"}
          </Badge>
        </div>

        {role === "AGENT" ? <AgentDashboard stats={stats} navItems={agentNavItems} athletes={athletes} /> : <CollaboratorDashboard stats={stats} />}
      </div>
    </SidebarInset>
  );
}

function AgentDashboard({ stats, navItems, athletes }) {
  if (!stats) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Mes Athlètes"
          value={stats.athletes}
          description="Athlètes sous contrat"
          icon={BicepsFlexed}
          trend="+2 ce mois"
          trendUp={true}
        />
        <StatsCard
          title="Contrats Actifs"
          value={stats.activeContracts}
          description="Contrats en cours"
          icon={FileText}
          trend="+3 ce mois"
          trendUp={true}
        />
        <StatsCard
          title="Revenus Totaux"
          value={stats.totalRevenue}
          description="Commissions ce mois"
          icon={DollarSign}
          trend="+12.5%"
          trendUp={true}
        />
        <StatsCard
          title="Offres en Attente"
          value={stats.pendingOffers}
          description="À traiter"
          icon={Clock}
          trend="2 urgentes"
          trendUp={false}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Dernières actions sur vos athlètes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Voir toute l&apos;activité
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Événements à Venir</CardTitle>
            <CardDescription>Vos prochains rendez-vous</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.upcomingEvents.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Calendar className="mr-2 h-4 w-4" />
              Voir le calendrier
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Gérez vos athlètes et contrats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href={navItems.find(item => item.label === "Mes Athlètes")?.href || "/athletes"}>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <BicepsFlexed className="h-5 w-5" />
                <span className="text-sm">
                  {athletes?.length === 1 ? "Mon Athlète" : "Mes Athlètes"}
                </span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2" disabled>
              <FileText className="h-5 w-5" />
              <span className="text-sm">Contrats</span>
            </Button>
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2" disabled>
              <ChartNoAxesCombined className="h-5 w-5" />
              <span className="text-sm">Analytics</span>
            </Button>
            <Link href="/messages">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <MessageSquare className="h-5 w-5" />
                <span className="text-sm">Messages</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CollaboratorDashboard({ stats }) {
  if (!stats) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Athlètes Suivis"
          value={stats.followedAthletes}
          description="Que vous suivez"
          icon={Heart}
          trend="+5 cette semaine"
          trendUp={true}
        />
        <StatsCard
          title="Opportunités"
          value={stats.savedOpportunities}
          description="Sauvegardées"
          icon={Handshake}
          trend="2 nouvelles"
          trendUp={true}
        />
        <StatsCard
          title="Collaborations"
          value={stats.activeCollaborations}
          description="En cours"
          icon={Building2}
          trend="1 en négociation"
          trendUp={true}
        />
        <StatsCard
          title="Nouveaux Profils"
          value={stats.newAthletes}
          description="Cette semaine"
          icon={Users}
          trend="+15%"
          trendUp={true}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Vos dernières interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} isCollaborator />
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Voir toute l&apos;activité
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Athlètes Tendance</CardTitle>
            <CardDescription>Les plus suivis cette semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.trendingAthletes.map((athlete) => (
                <TrendingAthleteItem key={athlete.id} athlete={athlete} />
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <TrendingUp className="mr-2 h-4 w-4" />
              Voir plus
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Explorer</CardTitle>
          <CardDescription>Découvrez de nouveaux athlètes et opportunités</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/athletes">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <BicepsFlexed className="h-5 w-5" />
                <span className="text-sm">Tous les Athlètes</span>
              </Button>
            </Link>
            <Link href="/followed">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Heart className="h-5 w-5" />
                <span className="text-sm">Mes Suivis</span>
              </Button>
            </Link>
            <Link href="/organisations">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Building2 className="h-5 w-5" />
                <span className="text-sm">Organisations</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2" disabled>
              <ChartNoAxesCombined className="h-5 w-5" />
              <span className="text-sm">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ title, value, description, icon: Icon, trend, trendUp }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${trendUp ? 'text-green-600' : 'text-orange-600'}`}>
            <TrendingUp className={`h-3 w-3 ${trendUp ? '' : 'rotate-180'}`} />
            <span>{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityItem({ activity, isCollaborator = false }) {
  const getIcon = () => {
    switch (activity.type) {
      case "contract":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "meeting":
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case "offer":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "follow":
        return <Heart className="h-4 w-4 text-pink-600" />;
      case "collab":
        return <Handshake className="h-4 w-4 text-purple-600" />;
      case "update":
        return <BicepsFlexed className="h-4 w-4 text-blue-600" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
      <div className="mt-1">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {activity.athlete || activity.organisation}
        </p>
        <p className="text-xs text-muted-foreground">{activity.action}</p>
        {activity.amount && (
          <Badge variant="outline" className="mt-1 text-xs">
            {activity.amount}
          </Badge>
        )}
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {activity.date}
      </span>
    </div>
  );
}

function EventItem({ event }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border">
      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
        <Calendar className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{event.title}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}
        </p>
      </div>
    </div>
  );
}

function TrendingAthleteItem({ athlete }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500" />
        <div>
          <p className="text-sm font-medium">{athlete.name}</p>
          <p className="text-xs text-muted-foreground">{athlete.sport}</p>
        </div>
      </div>
      <Badge variant="secondary" className="text-xs">
        <TrendingUp className="h-3 w-3 mr-1" />
        {athlete.followers}
      </Badge>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-96 bg-muted rounded-lg" />
        <div className="h-96 bg-muted rounded-lg" />
      </div>
    </div>
  );
}

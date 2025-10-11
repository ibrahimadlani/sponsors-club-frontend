"use client";

/**
 * Collaboration Detail Page
 * 
 * Displays detailed information about a specific collaboration/contract.
 * Shows contract clauses, timeline, documents, and signing status.
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  Download,
  Edit,
  Trash2,
  Users,
  Building2,
  AlertCircle,
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

/**
 * Format date
 */
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

/**
 * Format currency
 */
const formatCurrency = (amount, currency = "EUR") => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Get status badge variant
 */
const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
    case "signed":
      return "default";
    case "pending":
    case "draft":
      return "secondary";
    case "expired":
    case "terminated":
      return "destructive";
    default:
      return "outline";
  }
};

/**
 * Main Collaboration Detail Page
 */
export default function CollaborationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [collaboration, setCollaboration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollaboration = async () => {
      setLoading(true);
      try {
        // TODO: Remplacer par contractEndpoints.retrieve(id)
        // const data = await contractEndpoints.retrieve(id);

        // Mock data pour démonstration
        const mockData = {
          id: parseInt(id),
          title: "Campagne Nike Running 2025",
          organisation: {
            name: "Nike France",
            logo: "/images/nike-logo.png",
            contact: "Marie Dupont",
            email: "marie.dupont@nike.com",
          },
          athlete: {
            name: "Léon Marchand",
            full_name: "Léon Marchand",
            sport: { name: "Natation", emoji: "🏊‍♂️" },
          },
          status: "active",
          start_date: "2025-01-01",
          end_date: "2025-12-31",
          amount: 50000,
          currency: "EUR",
          description:
            "Campagne de promotion pour la nouvelle gamme de chaussures de running Nike. Comprend des apparitions publiques, des posts sur les réseaux sociaux et des événements promotionnels.",
          clauses: [
            {
              id: 1,
              title: "Exclusivité",
              content: "L'athlète s'engage à ne pas promouvoir de marques concurrentes pendant la durée du contrat.",
            },
            {
              id: 2,
              title: "Publications sur réseaux sociaux",
              content: "Minimum 4 publications par mois sur Instagram et Twitter mentionnant Nike.",
            },
            {
              id: 3,
              title: "Événements",
              content: "Participation à au moins 2 événements Nike par trimestre.",
            },
          ],
          timeline: [
            {
              id: 1,
              date: "2024-12-15",
              event: "Contrat créé",
              description: "Proposition initiale envoyée",
            },
            {
              id: 2,
              date: "2024-12-20",
              event: "Contrat modifié",
              description: "Révision des clauses financières",
            },
            {
              id: 3,
              date: "2025-01-01",
              event: "Contrat signé",
              description: "Signé par toutes les parties",
            },
          ],
          signed_by: [
            { name: "Léon Marchand", role: "Athlète", date: "2025-01-01" },
            { name: "Marie Dupont", role: "Nike France", date: "2025-01-01" },
          ],
        };

        setCollaboration(mockData);
      } catch (error) {
        console.error("Erreur lors du chargement de la collaboration:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCollaboration();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!collaboration) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Collaboration introuvable. Elle a peut-être été supprimée.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/collaborations">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux collaborations
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/collaborations">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux collaborations
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {collaboration.title}
            </h1>
            <Badge variant={getStatusVariant(collaboration.status)}>
              {collaboration.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{collaboration.description}</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Montant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(collaboration.amount, collaboration.currency)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Date de début
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              {formatDate(collaboration.start_date)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Date de fin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              {formatDate(collaboration.end_date)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold text-lg">
                {collaboration.organisation.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Contact: {collaboration.organisation.contact}
              </p>
              <p className="text-sm text-muted-foreground">
                {collaboration.organisation.email}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Athlète
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold text-lg">
                {collaboration.athlete.full_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {collaboration.athlete.sport.emoji}{" "}
                {collaboration.athlete.sport.name}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="clauses" className="mb-6">
        <TabsList>
          <TabsTrigger value="clauses">Clauses</TabsTrigger>
          <TabsTrigger value="timeline">Historique</TabsTrigger>
          <TabsTrigger value="signatures">Signatures</TabsTrigger>
        </TabsList>

        <TabsContent value="clauses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Clauses du contrat</CardTitle>
              <CardDescription>
                Termes et conditions de la collaboration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collaboration.clauses.map((clause, index) => (
                  <div key={clause.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div>
                      <h4 className="font-semibold mb-2">
                        {index + 1}. {clause.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {clause.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique du contrat</CardTitle>
              <CardDescription>
                Chronologie des événements et modifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collaboration.timeline.map((item, index) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-primary p-2">
                        <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                      </div>
                      {index < collaboration.timeline.length - 1 && (
                        <div className="w-px h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-semibold">{item.event}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signatures" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Signatures</CardTitle>
              <CardDescription>
                Parties ayant signé le contrat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collaboration.signed_by.map((signature, index) => (
                  <div key={index}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{signature.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {signature.role}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Signé
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(signature.date)}
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

      {/* Action Buttons */}
      {collaboration.status === "pending" && (
        <Alert className="mb-6">
          <Clock className="h-4 w-4" />
          <AlertTitle>En attente de signature</AlertTitle>
          <AlertDescription>
            Ce contrat est en attente de votre signature.
            <div className="mt-4 flex gap-2">
              <Button>Signer le contrat</Button>
              <Button variant="outline">Demander des modifications</Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

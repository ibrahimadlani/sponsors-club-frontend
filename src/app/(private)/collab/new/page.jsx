"use client";

// New Contract page: allows collaborators to create a new contract

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowLeft,
  Building2,
  User,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarInset } from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { createContract, getAvailableAgents } from "@/lib/api/contracts";
import { getOrganisations } from "@/lib/api/organisations";
import { getAthletes } from "@/lib/api/athletes";
import { toast } from "sonner";

// Form validation schema
const contractSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  agent_id: z.string().min(1, "Veuillez sélectionner un athlète"),
  effective_date: z.string().optional(),
  expiration_date: z.string().optional(),
  description: z.string().optional(),
});

export default function NewContractPage() {
  const { user } = useCurrentUser();
  const router = useRouter();
  const [organisation, setOrganisation] = useState(null);
  const [athletes, setAthletes] = useState([]);
  const [loadingOrg, setLoadingOrg] = useState(true);
  const [loadingAthletes, setLoadingAthletes] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      title: "",
      agent_id: "",
      effective_date: "",
      expiration_date: "",
      description: "",
    },
  });

  const selectedAgentId = watch("agent_id");

  // Load user's organisation
  useEffect(() => {
    const fetchOrganisation = async () => {
      try {
        setLoadingOrg(true);
        const data = await getOrganisations();
        const orgList = Array.isArray(data) ? data : data?.results ?? [];
        const userOrg = orgList[0] ?? null;
        setOrganisation(userOrg);
        
        if (!userOrg) {
          toast.error("Vous devez être associé à une organisation pour créer un contrat");
        }
      } catch (error) {
        console.error("Error fetching organisation:", error);
        toast.error("Erreur lors du chargement de votre organisation");
      } finally {
        setLoadingOrg(false);
      }
    };

    fetchOrganisation();
  }, []);

  // Load athletes
  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        setLoadingAthletes(true);
        
        // Try to fetch from available-agents endpoint first (for collaborators)
        let data;
        try {
          console.log("🔍 Trying /contracts/available-agents/ endpoint...");
          data = await getAvailableAgents();
          console.log("✅ Available agents endpoint succeeded");
        } catch (agentError) {
          // If available-agents fails, try the standard athletes endpoint
          console.log("⚠️ Available agents endpoint failed, trying /athletes/...");
          if (agentError.response?.status === 404) {
            console.log("ℹ️ Endpoint /contracts/available-agents/ not implemented yet");
          }
          
          data = await getAthletes();
          console.log("✅ Standard athletes endpoint succeeded");
        }
        
        // Extract athletes from response (may be paginated)
        const athletesList = Array.isArray(data) ? data : data?.results ?? [];
        setAthletes(athletesList);
        
        if (athletesList.length > 0) {
          console.log(`✅ ${athletesList.length} athlète(s) chargé(s)`);
        }
      } catch (error) {
        console.error("❌ Error fetching athletes:", error);
        
        // Check if 403 Forbidden (permission issue)
        if (error.response?.status === 403) {
          console.error("⚠️ Access denied to athletes endpoints");
          toast.error(
            "Accès refusé aux athlètes. Veuillez demander au backend de créer l'endpoint /contracts/available-agents/ pour les collaborateurs.",
            { duration: 8000 }
          );
        } else {
          toast.error("Erreur lors du chargement des athlètes");
        }
      } finally {
        setLoadingAthletes(false);
      }
    };

    fetchAthletes();
  }, []);

  const onSubmit = async (data) => {
    // Vérifier que l'organisation est disponible
    if (!organisation?.id) {
      toast.error("Aucune organisation associée à votre compte");
      return;
    }

    // Vérifier que l'agent_id est présent
    if (!data.agent_id) {
      toast.error("Veuillez sélectionner un athlète");
      return;
    }

    try {
      setSubmitting(true);

      // Payload to send - send only non-null values
      const payload = {
        title: data.title,
        organisation_id: organisation.id,
        agent_id: data.agent_id,
      };

      // Add dates only if provided
      if (data.effective_date) {
        payload.effective_date = data.effective_date;
      }
      if (data.expiration_date) {
        payload.expiration_date = data.expiration_date;
      }
      if (data.description) {
        payload.description = data.description;
      }

      console.log("📤 Creating contract with payload:", payload);

      // Create the contract with user's organisation
      const newContract = await createContract(payload);

      console.log("✅ Contract created successfully:", newContract);
      toast.success("Contrat créé avec succès !");
      router.push(`/collab/${newContract.id}`);
    } catch (error) {
      console.error("❌ Error creating contract:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        data: error.response?.data,
        status: error.response?.status,
      });
      
      // Extract error message
      let errorMessage = "Erreur lors de la création du contrat";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          // Si c'est un objet avec des erreurs de champs
          const fieldErrors = Object.entries(error.response.data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('; ');
          if (fieldErrors) {
            errorMessage = fieldErrors;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SidebarInset className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Nouveau contrat</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Créez un nouveau contrat de partenariat
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow border space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-pink-600" />
              <h2 className="text-lg font-semibold">Informations générales</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Titre du contrat <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ex: Contrat de sponsoring 2025"
                {...register("title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                placeholder="Décrivez brièvement l'objet du contrat..."
                rows={3}
                {...register("description")}
              />
            </div>
          </div>

          {/* Parties */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow border space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-pink-600" />
              <h2 className="text-lg font-semibold">Parties du contrat</h2>
            </div>

            {/* Organisation - Read only */}
            <div className="space-y-2">
              <Label>Organisation</Label>
              {loadingOrg ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Chargement de votre organisation...
                </div>
              ) : organisation ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md border">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{organisation.name}</span>
                </div>
              ) : (
                <div className="px-3 py-2 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-900">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Aucune organisation associée à votre compte
                  </p>
                </div>
              )}
            </div>

            {/* Athlete selection */}
            <div className="space-y-2">
              <Label htmlFor="agent_id">
                Athlète <span className="text-red-500">*</span>
              </Label>
              
              {/* Debug info */}
              {!loadingAthletes && athletes.length > 0 && (
                <div className="text-xs text-muted-foreground mb-2">
                  {athletes.filter(a => a.agent).length} athlète(s) avec agent disponible(s)
                </div>
              )}
              
              {loadingAthletes ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Chargement des athlètes...
                </div>
              ) : (
                <Select
                  value={selectedAgentId}
                  onValueChange={(value) => setValue("agent_id", value, { shouldValidate: true })}
                >
                  <SelectTrigger className={errors.agent_id ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionnez un athlète" />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      // Filter athletes with valid agents (agent is a UUID string)
                      const athletesWithAgents = athletes.filter(a => a.agent && typeof a.agent === 'string');
                      
                      if (athletes.length === 0) {
                        return (
                          <div className="p-2 text-sm text-muted-foreground">
                            Aucun athlète disponible
                          </div>
                        );
                      }
                      
                      if (athletesWithAgents.length === 0) {
                        return (
                          <div className="p-2 text-sm text-yellow-600">
                            Aucun athlète avec agent disponible.
                            <div className="text-xs mt-1 text-muted-foreground">
                              Les contrats nécessitent un agent représentant.
                            </div>
                          </div>
                        );
                      }
                      
                      return athletesWithAgents.map((athlete) => (
                        <SelectItem key={athlete.id} value={athlete.agent}>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span className="font-medium">{athlete.full_name}</span>
                            </div>
                            {athlete.sport?.name && (
                              <span className="text-xs text-muted-foreground ml-6">
                                {athlete.sport.emoji} {athlete.sport.name}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
              )}
              {errors.agent_id && (
                <p className="text-sm text-red-500">
                  {errors.agent_id.message}
                </p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow border space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-pink-600" />
              <h2 className="text-lg font-semibold">Période de validité</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effective_date">Date de début (optionnel)</Label>
                <Input
                  id="effective_date"
                  type="date"
                  {...register("effective_date")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiration_date">Date de fin (optionnel)</Label>
                <Input
                  id="expiration_date"
                  type="date"
                  {...register("expiration_date")}
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Les dates peuvent être modifiées ultérieurement avant la signature.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={submitting || loadingOrg || loadingAthletes || !organisation}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer le contrat"
              )}
            </Button>
          </div>
        </form>
      </div>
    </SidebarInset>
  );
}

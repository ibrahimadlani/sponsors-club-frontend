"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, Plus, ArrowRight, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { createOrganisation, joinOrganisation } from "@/lib/api";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Schémas de validation
const joinOrganisationSchema = z.object({
  invitation_code: z.string().min(1, "Le code d'invitation est requis"),
});

const createOrganisationSchema = z.object({
  name: z.string().min(1, "Le nom de l'organisation est requis").max(255, "Le nom ne peut pas dépasser 255 caractères"),
  type: z.enum(["BRAND", "SME", "STARTUP", "ASSOCIATION", "INDIVIDUAL", "AGENCY", "OTHER"]),
  industry: z.string().max(255, "L'industrie ne peut pas dépasser 255 caractères").optional(),
  description: z.string().optional(),
  website_url: z.string().url("URL invalide").optional().or(z.literal("")),
  email_contact: z.string().email("Email invalide").max(254, "Email trop long").optional().or(z.literal("")),
  phone_contact: z.string().max(50, "Numéro trop long").optional(),
  address_city: z.string().max(255, "Ville trop longue").optional(),
  address_country: z.string().max(100, "Pays trop long").optional(),
  address_postal_code: z.string().max(20, "Code postal trop long").optional(),
  founded_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
  employees_count: z.number().min(1).optional(),
  budget_range: z.string().max(50).optional(),
});

const organisationTypes = [
  { value: "BRAND", label: "Marque", icon: "🏢" },
  { value: "SME", label: "PME", icon: "🏬" },
  { value: "STARTUP", label: "Startup", icon: "🚀" },
  { value: "ASSOCIATION", label: "Association", icon: "🤝" },
  { value: "INDIVIDUAL", label: "Individuel", icon: "👤" },
  { value: "AGENCY", label: "Agence", icon: "🎯" },
  { value: "OTHER", label: "Autre", icon: "🏷️" },
];

export function OrganisationOnboardingForm({ className, isRequired = false, ...props }) {
  const router = useRouter();
  const [mode, setMode] = useState(null); // "join" ou "create"
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Form pour rejoindre une organisation
  const joinForm = useForm({
    resolver: zodResolver(joinOrganisationSchema),
  });

  // Form pour créer une organisation
  const createForm = useForm({
    resolver: zodResolver(createOrganisationSchema),
  });

  const handleJoinOrganisation = async (data) => {
    setLoading(true);
    try {
      await joinOrganisation(data.invitation_code);
      toast.success("Vous avez rejoint l'organisation avec succès!");
      
      // Redirection selon le contexte
      if (isRequired) {
        // Si l'onboarding était requis, rediriger vers explore pour les collaborateurs
        toast.success("Onboarding complété ! Bienvenue sur la plateforme.", { duration: 3000 });
        setTimeout(() => {
          router.push("/explore");
        }, 1500);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Erreur lors de la connexion à l'organisation");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganisation = async (data) => {
    setLoading(true);
    try {
      await createOrganisation(data);
      toast.success("Organisation créée avec succès!");
      
      // Redirection selon le contexte
      if (isRequired) {
        // Si l'onboarding était requis, rediriger vers explore pour les collaborateurs
        toast.success("Onboarding complété ! Bienvenue sur la plateforme.", { duration: 3000 });
        setTimeout(() => {
          router.push("/explore");
        }, 1500);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Erreur lors de la création de l'organisation");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      // Valider les champs requis du step 1
      const isValid = await createForm.trigger(["name", "type"]);
      if (!isValid) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }
    }
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  if (!mode) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-2">
            {isRequired ? "⚠️ Onboarding Obligatoire" : "Configuration de l'organisation"}
          </h1>
          <p className="text-muted-foreground">
            {isRequired 
              ? "Vous devez configurer votre organisation pour accéder à la plateforme"
              : "Rejoignez une organisation existante ou créez la vôtre"
            }
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50" onClick={() => setMode("join")}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Rejoindre une organisation</CardTitle>
                <CardDescription>
                  Utilisez un code d&apos;invitation pour rejoindre une organisation existante
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Accès instantané aux ressources
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Collaboration avec l&apos;équipe
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Configuration simplifiée
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50" onClick={() => setMode("create")}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Building2 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Créer une organisation</CardTitle>
                <CardDescription>
                  Créez votre propre organisation et invitez votre équipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Contrôle total des paramètres
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Invitez des collaborateurs
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Personnalisation complète
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        {!isRequired && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMode(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        )}
        {isRequired && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            Cette étape est obligatoire
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">
            {mode === "join" ? "Rejoindre une organisation" : "Créer une organisation"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "join" 
              ? "Saisissez votre code d'invitation" 
              : `Étape ${step} sur 3`
            }
          </p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === "join" && (
          <motion.div
            key="join"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Code d&apos;invitation
                </CardTitle>
                <CardDescription>
                  Entrez le code d&apos;invitation fourni par votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={joinForm.handleSubmit(handleJoinOrganisation)}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="invitation_code">Code d&apos;invitation</Label>
                      <Input
                        id="invitation_code"
                        placeholder="Ex: ABC123DEF456"
                        className="text-center text-lg font-mono tracking-wider"
                        {...joinForm.register("invitation_code")}
                      />
                      {joinForm.formState.errors.invitation_code && (
                        <p className="text-red-500 text-sm">
                          {joinForm.formState.errors.invitation_code.message}
                        </p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Vérification..." : "Rejoindre l'organisation"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {mode === "create" && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {step === 1 && "Informations de base"}
                  {step === 2 && "Détails de l'organisation"}
                  {step === 3 && "Informations de contact"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Commençons par les informations essentielles"}
                  {step === 2 && "Ajoutez plus de détails sur votre organisation"}
                  {step === 3 && "Comment peut-on vous contacter ?"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={createForm.handleSubmit(handleCreateOrganisation)}>
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid gap-4"
                      >
                        <div className="grid gap-2">
                          <Label htmlFor="name">Nom de l&apos;organisation *</Label>
                          <Input
                            id="name"
                            placeholder="Ex: Mon Entreprise SAS"
                            {...createForm.register("name")}
                          />
                          {createForm.formState.errors.name && (
                            <p className="text-red-500 text-sm">
                              {createForm.formState.errors.name.message}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="type">Type d&apos;organisation *</Label>
                          <Select onValueChange={(val) => createForm.setValue("type", val)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez le type" />
                            </SelectTrigger>
                            <SelectContent>
                              {organisationTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <span className="flex items-center gap-2">
                                    <span>{type.icon}</span>
                                    {type.label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {createForm.formState.errors.type && (
                            <p className="text-red-500 text-sm">
                              {createForm.formState.errors.type.message}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="industry">Secteur d&apos;activité</Label>
                          <Input
                            id="industry"
                            placeholder="Ex: Technologie, Sport, Finance..."
                            {...createForm.register("industry")}
                          />
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid gap-4"
                      >
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Décrivez votre organisation, sa mission, ses valeurs..."
                            rows={4}
                            {...createForm.register("description")}
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="grid gap-2">
                            <Label htmlFor="founded_year">Année de création</Label>
                            <Input
                              id="founded_year"
                              type="number"
                              min="1800"
                              max={new Date().getFullYear()}
                              placeholder="2020"
                              onChange={(e) => createForm.setValue("founded_year", e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="employees_count">Nombre d&apos;employés</Label>
                            <Input
                              id="employees_count"
                              type="number"
                              min="1"
                              placeholder="10"
                              onChange={(e) => createForm.setValue("employees_count", e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="budget_range">Budget annuel</Label>
                          <Select onValueChange={(val) => createForm.setValue("budget_range", val)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une fourchette" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="< 50k">Moins de 50k €</SelectItem>
                              <SelectItem value="50k-200k">50k - 200k €</SelectItem>
                              <SelectItem value="200k-1M">200k - 1M €</SelectItem>
                              <SelectItem value="1M-5M">1M - 5M €</SelectItem>
                              <SelectItem value="> 5M">Plus de 5M €</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid gap-4"
                      >
                        <div className="grid gap-2">
                          <Label htmlFor="website_url">Site web</Label>
                          <Input
                            id="website_url"
                            type="url"
                            placeholder="https://www.monentreprise.com"
                            {...createForm.register("website_url")}
                          />
                          {createForm.formState.errors.website_url && (
                            <p className="text-red-500 text-sm">
                              {createForm.formState.errors.website_url.message}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="grid gap-2">
                            <Label htmlFor="email_contact">Email de contact</Label>
                            <Input
                              id="email_contact"
                              type="email"
                              placeholder="contact@monentreprise.com"
                              {...createForm.register("email_contact")}
                            />
                            {createForm.formState.errors.email_contact && (
                              <p className="text-red-500 text-sm">
                                {createForm.formState.errors.email_contact.message}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="phone_contact">Téléphone</Label>
                            <Input
                              id="phone_contact"
                              type="tel"
                              placeholder="+33 1 23 45 67 89"
                              {...createForm.register("phone_contact")}
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="grid gap-4">
                          <h4 className="font-medium">Adresse</h4>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                              <Label htmlFor="address_city">Ville</Label>
                              <Input
                                id="address_city"
                                placeholder="Paris"
                                {...createForm.register("address_city")}
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="address_postal_code">Code postal</Label>
                              <Input
                                id="address_postal_code"
                                placeholder="75001"
                                {...createForm.register("address_postal_code")}
                              />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="address_country">Pays</Label>
                            <Input
                              id="address_country"
                              placeholder="France"
                              {...createForm.register("address_country")}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between pt-6">
                    {step > 1 && (
                      <Button type="button" variant="outline" onClick={prevStep}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Précédent
                      </Button>
                    )}

                    {step < 3 ? (
                      <Button type="button" onClick={nextStep} className="ml-auto">
                        Suivant
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={loading} className="ml-auto">
                        {loading ? "Création..." : "Créer l'organisation"}
                        <Building2 className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

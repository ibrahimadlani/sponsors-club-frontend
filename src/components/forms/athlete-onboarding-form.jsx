"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { User, Trophy, ArrowRight, ArrowLeft, CheckCircle, Calendar, MapPin, Globe, Camera, FileText } from "lucide-react";
import { fetchSports, fetchSportDisciplines, createAthlete } from "@/lib/api";

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

// Schéma de validation pour créer un athlète
const createAthleteSchema = z.object({
  sport_id: z.string().uuid("Veuillez sélectionner un sport"),
  full_name: z.string().min(1, "Le nom complet est requis").max(255, "Le nom ne peut pas dépasser 255 caractères"),
  birth_date: z.string().min(1, "La date de naissance est requise"),
  nationality: z.string().min(1, "La nationalité est requise").max(100, "La nationalité ne peut pas dépasser 100 caractères"),
  country: z.string().max(100, "Le pays ne peut pas dépasser 100 caractères").optional(),
  city: z.string().max(255, "La ville ne peut pas dépasser 255 caractères").optional(),
  bio: z.string().optional(),
  discipline_ids: z.array(z.string().uuid()).optional(),
  social_links: z.object({
    instagram: z.string().url("URL Instagram invalide").optional().or(z.literal("")),
    twitter: z.string().url("URL Twitter invalide").optional().or(z.literal("")),
    facebook: z.string().url("URL Facebook invalide").optional().or(z.literal("")),
    tiktok: z.string().url("URL TikTok invalide").optional().or(z.literal("")),
    youtube: z.string().url("URL YouTube invalide").optional().or(z.literal("")),
    website: z.string().url("URL site web invalide").optional().or(z.literal("")),
  }).optional(),
});

export function AthleteOnboardingForm({ className, ...props }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [disciplines, setDisciplines] = useState([]);

  const form = useForm({
    resolver: zodResolver(createAthleteSchema),
    defaultValues: {
      social_links: {
        instagram: "",
        twitter: "",
        facebook: "",
        tiktok: "",
        youtube: "",
        website: "",
      },
      discipline_ids: [],
    },
  });

  // Charger les sports disponibles
  useEffect(() => {
    const loadSports = async () => {
      try {
        const sportsData = await fetchSports();
        setSports(sportsData);
      } catch (error) {
        console.error("Erreur lors du chargement des sports:", error);
        toast.error("Erreur lors du chargement des sports");
        // Sports par défaut si l'API ne fonctionne pas
        setSports([
          { id: "1", name: "Football", emoji: "⚽", disciplines: [] },
          { id: "2", name: "Basketball", emoji: "🏀", disciplines: [] },
          { id: "3", name: "Tennis", emoji: "🎾", disciplines: [] },
          { id: "4", name: "Natation", emoji: "🏊", disciplines: [] },
          { id: "5", name: "Athlétisme", emoji: "🏃", disciplines: [] },
        ]);
      }
    };

    loadSports();
  }, []);

  // Charger les disciplines quand un sport est sélectionné
  useEffect(() => {
    const loadDisciplines = async (sportId) => {
      if (!sportId) return;
      
      try {
        const disciplinesData = await fetchSportDisciplines(sportId);
        setDisciplines(disciplinesData);
      } catch (error) {
        console.error("Erreur lors du chargement des disciplines:", error);
        setDisciplines([]);
      }
    };

    if (selectedSport) {
      loadDisciplines(selectedSport);
    }
  }, [selectedSport]);

  const handleCreateAthlete = async (data) => {
    setLoading(true);
    try {
      // Nettoyer les liens sociaux vides
      const cleanedSocialLinks = {};
      if (data.social_links) {
        Object.entries(data.social_links).forEach(([key, value]) => {
          if (value && value.trim() !== "") {
            cleanedSocialLinks[key] = value.trim();
          }
        });
      }

      const athleteData = {
        ...data,
        social_links: Object.keys(cleanedSocialLinks).length > 0 ? cleanedSocialLinks : undefined,
      };

      await createAthlete(athleteData);
      toast.success("Athlète créé avec succès!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message || "Erreur lors de la création de l'athlète");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      // Valider les champs requis du step 1
      const isValid = await form.trigger(["full_name", "sport_id", "birth_date", "nationality"]);
      if (!isValid) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Créer votre premier athlète</h1>
        <p className="text-muted-foreground">
          Configurez le profil de votre athlète pour commencer
        </p>
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step >= stepNumber
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div
                    className={cn(
                      "w-12 h-0.5 mx-2",
                      step > stepNumber ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {step === 1 && <><User className="h-5 w-5" />Informations personnelles</>}
            {step === 2 && <><Trophy className="h-5 w-5" />Sport et disciplines</>}
            {step === 3 && <><Globe className="h-5 w-5" />Réseaux sociaux</>}
            {step === 4 && <><FileText className="h-5 w-5" />Biographie et finalisation</>}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Renseignez les informations de base de votre athlète"}
            {step === 2 && "Sélectionnez le sport principal et les disciplines"}
            {step === 3 && "Ajoutez les comptes sur les réseaux sociaux (optionnel)"}
            {step === 4 && "Complétez le profil avec une biographie"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleCreateAthlete)}>
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
                    <Label htmlFor="full_name">Nom complet *</Label>
                    <Input
                      id="full_name"
                      placeholder="Ex: Marie Dupont"
                      {...form.register("full_name")}
                    />
                    {form.formState.errors.full_name && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.full_name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="birth_date">Date de naissance *</Label>
                      <Input
                        id="birth_date"
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        {...form.register("birth_date")}
                      />
                      {form.formState.errors.birth_date && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.birth_date.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="nationality">Nationalité *</Label>
                      <Input
                        id="nationality"
                        placeholder="Ex: Française"
                        {...form.register("nationality")}
                      />
                      {form.formState.errors.nationality && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.nationality.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="country">Pays</Label>
                      <Input
                        id="country"
                        placeholder="Ex: France"
                        {...form.register("country")}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        placeholder="Ex: Paris"
                        {...form.register("city")}
                      />
                    </div>
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
                    <Label htmlFor="sport_id">Sport principal *</Label>
                    <Select 
                      onValueChange={(value) => {
                        form.setValue("sport_id", value);
                        setSelectedSport(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un sport" />
                      </SelectTrigger>
                      <SelectContent>
                        {sports.map((sport) => (
                          <SelectItem key={sport.id} value={sport.id}>
                            <span className="flex items-center gap-2">
                              <span>{sport.emoji}</span>
                              {sport.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.sport_id && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.sport_id.message}
                      </p>
                    )}
                  </div>

                  {disciplines.length > 0 && (
                    <div className="grid gap-2">
                      <Label>Disciplines spécialisées (optionnel)</Label>
                      <div className="grid gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                        {disciplines.map((discipline) => (
                          <label
                            key={discipline.id}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              className="rounded"
                              onChange={(e) => {
                                const currentDisciplines = form.getValues("discipline_ids") || [];
                                if (e.target.checked) {
                                  form.setValue("discipline_ids", [...currentDisciplines, discipline.id]);
                                } else {
                                  form.setValue("discipline_ids", currentDisciplines.filter(id => id !== discipline.id));
                                }
                              }}
                            />
                            <span className="text-sm">{discipline.name}</span>
                            {discipline.is_olympic && (
                              <Badge variant="secondary" className="text-xs">Olympique</Badge>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
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
                  <div className="text-sm text-muted-foreground mb-2">
                    Ajoutez les comptes sur les réseaux sociaux de votre athlète pour améliorer sa visibilité.
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        type="url"
                        placeholder="https://instagram.com/username"
                        {...form.register("social_links.instagram")}
                      />
                      {form.formState.errors.social_links?.instagram && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.social_links.instagram.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="twitter">Twitter/X</Label>
                      <Input
                        id="twitter"
                        type="url"
                        placeholder="https://twitter.com/username"
                        {...form.register("social_links.twitter")}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="tiktok">TikTok</Label>
                      <Input
                        id="tiktok"
                        type="url"
                        placeholder="https://tiktok.com/@username"
                        {...form.register("social_links.tiktok")}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="youtube">YouTube</Label>
                      <Input
                        id="youtube"
                        type="url"
                        placeholder="https://youtube.com/@username"
                        {...form.register("social_links.youtube")}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        type="url"
                        placeholder="https://facebook.com/username"
                        {...form.register("social_links.facebook")}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="website">Site web personnel</Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://monsite.com"
                        {...form.register("social_links.website")}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid gap-4"
                >
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      placeholder="Racontez l'histoire de votre athlète, ses achievements, ses objectifs..."
                      rows={6}
                      {...form.register("bio")}
                    />
                    <div className="text-xs text-muted-foreground">
                      Décrivez le parcours sportif, les performances marquantes, les objectifs futurs...
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">🎯 Prochaines étapes après la création</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Ajouter des photos du profil et galerie
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Connecter les comptes sociaux pour l&apos;analytics
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Inviter l&apos;athlète à rejoindre la plateforme
                      </div>
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

              {step < 4 ? (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="ml-auto">
                  {loading ? "Création..." : "Créer l'athlète"}
                  <Trophy className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { userEndpoints } from "@/lib/endpoints";
import { toast } from "sonner"; // Notifications

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Mars, User, Users, Venus, CalendarIcon, ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// ✅ Définition du schéma de validation avec Zod - basé sur l'API users/me
const profileSchema = z.object({
  avatar: z.string().url("Lien d'image invalide").optional().or(z.literal("")),
  date_of_birth: z.string().optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "NON_BINARY"]).optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  language: z.string().optional().or(z.literal("")),
});

export function OnboardingForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // Stocke les infos de l'utilisateur
  const [gender, setGender] = useState("MALE"); // Genre par défaut
  const [dateOfBirth, setDateOfBirth] = useState(null); // Date de naissance
  const [calendarOpen, setCalendarOpen] = useState(false); // État du popover du calendrier
  const [avatarPreview, setAvatarPreview] = useState(null); // Aperçu de l'avatar
  const [avatarFile, setAvatarFile] = useState(null); // Fichier avatar
  const [country, setCountry] = useState(""); // Pays sélectionné
  const [language, setLanguage] = useState(""); // Langue sélectionnée

  // 🔹 Récupération des infos utilisateur au chargement
  useEffect(() => {
    const loadUser = async () => {
      // Attendre un court instant pour s'assurer que le token est bien configuré
      await new Promise(resolve => setTimeout(resolve, 200));
      
      try {
        const userData = await userEndpoints.me();
        setUser(userData);
        
        // Pré-remplir les champs avec les données existantes
        if (userData.avatar) {
          setAvatarPreview(userData.avatar);
          setValue("avatar", userData.avatar);
        }
        if (userData.date_of_birth) {
          setDateOfBirth(new Date(userData.date_of_birth));
          setValue("date_of_birth", userData.date_of_birth);
        }
        if (userData.gender) {
          setGender(userData.gender);
          setValue("gender", userData.gender);
        }
        if (userData.country) {
          setCountry(userData.country);
          setValue("country", userData.country);
        }
        if (userData.language) {
          setLanguage(userData.language);
          setValue("language", userData.language);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error);
        
        // Si erreur 403, vérifier si le token existe
        const token = localStorage.getItem("access_token");
        if (!token) {
          toast.error("Session expirée. Veuillez vous reconnecter.");
          router.push("/login");
        } else {
          toast.error("Impossible de charger les informations de l'utilisateur.");
        }
      }
    };

    loadUser();
  }, [router, setValue]);

  // Synchroniser le genre avec le formulaire
  useEffect(() => {
    setValue("gender", gender, { shouldValidate: true });
  }, [gender, setValue]);

  // Synchroniser la date de naissance avec le formulaire
  useEffect(() => {
    if (dateOfBirth) {
      const formattedDate = format(dateOfBirth, "yyyy-MM-dd");
      setValue("date_of_birth", formattedDate, { shouldValidate: true });
    }
  }, [dateOfBirth, setValue]);

  // Synchroniser le pays avec le formulaire
  useEffect(() => {
    if (country) {
      setValue("country", country, { shouldValidate: true });
    }
  }, [country, setValue]);

  // Synchroniser la langue avec le formulaire
  useEffect(() => {
    if (language) {
      setValue("language", language, { shouldValidate: true });
    }
  }, [language, setValue]);

  // Gérer le changement de fichier avatar
  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Créer un aperçu
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Si un fichier avatar a été sélectionné, utiliser FormData
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        if (data.date_of_birth) formData.append("date_of_birth", data.date_of_birth);
        if (data.gender) formData.append("gender", data.gender);
        if (data.country) formData.append("country", data.country);
        if (data.language) formData.append("language", data.language);
        
        await userEndpoints.partialUpdateMe(formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Sinon, envoyer les données JSON normalement (sans avatar)
        const { avatar, ...restData } = data;
        await userEndpoints.partialUpdateMe(restData);
      }
      
      toast.success("Votre profil a été mis à jour !");
      
      // Redirection vers l'onboarding spécifique selon le type de compte
      const accountType = user?.account_type;
      if (accountType === "AGENT") {
        router.push("/onboarding/athlete"); // Agent → créer un athlète
      } else if (accountType === "COLLABORATOR") {
        router.push("/onboarding/organisation"); // Collaborator → rejoindre/créer une organisation
      } else {
        router.push("/"); // Fallback
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Bienvenue {user?.first_name} ! 👋
          </CardTitle>
          <CardDescription>
            Complétez votre profil personnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              {/* Avatar */}
              <div className="grid gap-2">
                <Label htmlFor="avatar">Photo de profil</Label>
                <div className="flex items-center gap-4">
                  {avatarPreview && (
                    <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                {errors.avatar && (
                  <p className="text-red-500 text-sm">{errors.avatar.message}</p>
                )}
              </div>

              {/* Date de naissance */}
              <div className="grid gap-2">
                <Label htmlFor="date_of_birth">Date de naissance</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date_of_birth"
                      className={cn(
                        "w-full justify-between font-normal",
                        !dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      {dateOfBirth ? (
                        format(dateOfBirth, "PPP", { locale: fr })
                      ) : (
                        "Sélectionnez une date"
                      )}
                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={(date) => {
                        setDateOfBirth(date);
                        setCalendarOpen(false);
                      }}
                      locale={fr}
                      defaultMonth={dateOfBirth || new Date(2000, 0)}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
                <input type="hidden" {...register("date_of_birth")} value={dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : ""} readOnly />
                {errors.date_of_birth && (
                  <p className="text-red-500 text-sm">{errors.date_of_birth.message}</p>
                )}
              </div>

              {/* Genre */}
              <div className="grid gap-2">
                <Label htmlFor="gender">Genre</Label>
                <Tabs value={gender} onValueChange={setGender} className="w-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="MALE" className="flex items-center gap-2">
                      <Mars className="w-4 h-4" />
                      Homme
                    </TabsTrigger>
                    <TabsTrigger value="FEMALE" className="flex items-center gap-2">
                      <Venus className="w-4 h-4" />
                      Femme
                    </TabsTrigger>
                    <TabsTrigger value="NON_BINARY" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Autre
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <input type="hidden" {...register("gender")} value={gender} readOnly />
                {errors.gender && (
                  <p className="text-red-500 text-sm">{errors.gender.message}</p>
                )}
              </div>

              {/* Pays (ISO 3166-1 alpha-2) */}
              <div className="grid gap-2">
                <Label htmlFor="country">Pays</Label>
                <Select 
                  value={country} 
                  onValueChange={setCountry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FR">🇫🇷 France</SelectItem>
                    <SelectItem value="BE">🇧🇪 Belgique</SelectItem>
                    <SelectItem value="CH">🇨🇭 Suisse</SelectItem>
                    <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                    <SelectItem value="US">🇺🇸 États-Unis</SelectItem>
                    <SelectItem value="GB">🇬🇧 Royaume-Uni</SelectItem>
                    <SelectItem value="DE">🇩🇪 Allemagne</SelectItem>
                    <SelectItem value="ES">🇪🇸 Espagne</SelectItem>
                    <SelectItem value="IT">🇮🇹 Italie</SelectItem>
                    <SelectItem value="PT">🇵🇹 Portugal</SelectItem>
                    <SelectItem value="NL">🇳🇱 Pays-Bas</SelectItem>
                    <SelectItem value="LU">🇱🇺 Luxembourg</SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-red-500 text-sm">{errors.country.message}</p>
                )}
              </div>

              {/* Langue (ISO 639-1) */}
              <div className="grid gap-2">
                <Label htmlFor="language">Langue</Label>
                <Select 
                  value={language} 
                  onValueChange={setLanguage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">🇫🇷 Français</SelectItem>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                    <SelectItem value="es">🇪🇸 Español</SelectItem>
                    <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                    <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                    <SelectItem value="pt">🇵🇹 Português</SelectItem>
                    <SelectItem value="nl">🇳🇱 Nederlands</SelectItem>
                  </SelectContent>
                </Select>
                {errors.language && (
                  <p className="text-red-500 text-sm">{errors.language.message}</p>
                )}
              </div>

              {/* Boutons de soumission et skip */}
              <div className="grid gap-3 mt-6">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Mise à jour..." : (
                    user?.account_type === "AGENT" 
                      ? "Continuer vers la création d'un athlète →" 
                      : user?.account_type === "COLLABORATOR"
                      ? "Continuer vers l'organisation →"
                      : "Continuer →"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full text-muted-foreground" 
                  onClick={() => {
                    // Redirection vers l'onboarding spécifique selon le type de compte
                    const accountType = user?.account_type;
                    if (accountType === "AGENT") {
                      router.push("/onboarding/athlete");
                    } else if (accountType === "COLLABORATOR") {
                      router.push("/onboarding/organisation");
                    } else {
                      router.push("/");
                    }
                  }}
                  disabled={loading}
                >
                  Passer cette étape
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
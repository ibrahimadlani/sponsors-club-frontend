"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { fetchUserProfile, updateProfile } from "@/lib/api"; // Import API
import { toast } from "sonner"; // Notifications
import { motion } from "framer-motion"; // Animation du message de bienvenue

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

// ✅ Définition du schéma de validation avec Zod
const profileSchema = z.object({
  profile_picture_url: z.string().url("Lien d'image invalide").optional(),
  cover_photo_url: z.string().url("Lien d'image invalide").optional(),
  bio: z.string().max(300, "La bio ne peut pas dépasser 300 caractères").optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(["male", "female", "non-binary"]).optional(),
  address: z.string().max(255, "L'adresse est trop longue").optional(),
  country: z.string().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
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

  // 🔹 Récupération des infos utilisateur au chargement
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
      } catch (error) {
        toast.error("Impossible de charger les informations de l'utilisateur.");
      }
    };

    loadUser();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateProfile(data);
      toast.success("Votre profil a été mis à jour !");
      router.push("/"); // Redirection après la mise à jour
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* 🔥 Message de bienvenue animé */}
      {user && (
        <motion.h2
          className="text-2xl font-bold text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Bienvenue, {user.first_name} ! 👋
        </motion.h2>
      )}

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Complétez votre profil</CardTitle>
          <CardDescription>Ajoutez vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              {/* Photo de profil */}
              <div className="grid gap-2">
                <Label htmlFor="profile_picture_url">Photo de profil</Label>
                <Input
                  id="profile_picture_url"
                  type="url"
                  placeholder="Lien vers votre photo de profil"
                  {...register("profile_picture_url")}
                />
                {errors.profile_picture_url && (
                  <p className="text-red-500 text-sm">{errors.profile_picture_url.message}</p>
                )}
              </div>

              {/* Photo de couverture */}
              <div className="grid gap-2">
                <Label htmlFor="cover_photo_url">Photo de couverture</Label>
                <Input
                  id="cover_photo_url"
                  type="url"
                  placeholder="Lien vers votre photo de couverture"
                  {...register("cover_photo_url")}
                />
                {errors.cover_photo_url && (
                  <p className="text-red-500 text-sm">{errors.cover_photo_url.message}</p>
                )}
              </div>

              {/* Bio */}
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Décrivez-vous en quelques mots..."
                  {...register("bio")}
                />
                {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
              </div>

              {/* Date de naissance */}
              <div className="grid gap-2">
                <Label htmlFor="date_of_birth">Date de naissance</Label>
                <Input id="date_of_birth" type="date" {...register("date_of_birth")} />
              </div>

              {/* Genre */}
              <div className="grid gap-2">
                <Label htmlFor="gender">Genre</Label>
                <Select onValueChange={(val) => setValue("gender", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                    <SelectItem value="non-binary">Non-Binaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Adresse */}
              <div className="grid gap-2">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" type="text" {...register("address")} placeholder="Rue, Ville..." />
              </div>

              {/* Pays */}
              <div className="grid gap-2">
                <Label htmlFor="country">Pays</Label>
                <Select onValueChange={(val) => setValue("country", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">🇫🇷 France</SelectItem>
                    <SelectItem value="us">🇺🇸 États-Unis</SelectItem>
                    <SelectItem value="gb">🇬🇧 Royaume-Uni</SelectItem>
                    <SelectItem value="de">🇩🇪 Allemagne</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Langue */}
              <div className="grid gap-2">
                <Label htmlFor="language">Langue</Label>
                <Select onValueChange={(val) => setValue("language", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">🇫🇷 Français</SelectItem>
                    <SelectItem value="en">🇬🇧 Anglais</SelectItem>
                    <SelectItem value="es">🇪🇸 Espagnol</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bouton de soumission */}
              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? "Mise à jour..." : "Mettre à jour le profil"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
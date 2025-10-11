"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Pour les notifications toast
import { userEndpoints } from "@/lib/endpoints";

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
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { HandCoins, Medal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormFieldError from "@/components/forms/form-field-error";

// Règles de validation par indicatif
const PHONE_RULES = {
  "+33": { min: 9, max: 9, example: "ex: 6XXXXXXXX" }, // France (sans le 0)
  "+1": { min: 10, max: 10, example: "ex: 415XXXXXXX" }, // USA/Canada
  "+44": { min: 10, max: 10, example: "ex: 7XXXXXXXXX" }, // UK (mobile typique)
};

// 🔹 Définir le schéma de validation avec Zod
const registerSchema = z
  .object({
    first_name: z.string().min(2, "Le prénom est requis"),
    last_name: z.string().min(2, "Le nom est requis"),
    email: z.string().email("Format d'email invalide"),
    account_type: z.enum(["AGENT", "COLLABORATOR"], {
      required_error: "Veuillez sélectionner un type de compte",
    }),
    phone_country_code: z.string().min(2, "Veuillez sélectionner un indicatif"),
    phone_number: z.string().min(6, "Numéro de téléphone invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
      .regex(/[0-9]/, "Doit contenir au moins un chiffre")
      .regex(/[@$!%*?&]/, "Doit contenir au moins un caractère spécial"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirm_password"],
  })
  .superRefine((data, ctx) => {
    const raw = String(data.phone_number || "");
    const digits = raw.replace(/\D/g, "");
    const rule = PHONE_RULES[data.phone_country_code] || { min: 6, max: 15 };
    if (digits.length < rule.min || digits.length > rule.max) {
      ctx.addIssue({
        code: "custom",
        message: `Numéro invalide pour ${data.phone_country_code} (${rule.min}-${rule.max} chiffres)`,
        path: ["phone_number"],
      });
    }

  });

/**
 * RegisterForm renders the SponsorsClub onboarding form for agents and collaborators.
 * It validates input with Zod, normalises phone numbers and calls the register endpoint.
 *
 * @param {object} props - Component props.
 * @param {string} [props.className] - Optional Tailwind classes for the wrapper.
 * @returns {JSX.Element} Interactive registration form.
 */
export function RegisterForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      account_type: "AGENT",
      phone_country_code: "+33",
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [phoneCode, setPhoneCode] = useState("+33");
  const [accountType, setAccountType] = useState("AGENT");

  // Assure que l'indicatif est bien enregistré avec une valeur par défaut
  useEffect(() => {
    setValue("phone_country_code", phoneCode, { shouldValidate: true });
  }, [phoneCode, setValue]);

  useEffect(() => {
    setValue("account_type", accountType, { shouldValidate: true });
  }, [accountType, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Sanitize numéro: chiffres uniquement et retirer le 0 de tête si FR/UK
      const digitsOnly = String(data.phone_number || "").replace(/\D/g, "");
      const trimmed = ["+33", "+44"].includes(data.phone_country_code) && digitsOnly.startsWith("0")
        ? digitsOnly.slice(1)
        : digitsOnly;

      const userData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_country_code: data.phone_country_code,
        phone_number: trimmed,
        password: data.password,
        account_type: data.account_type,
      };

      await userEndpoints.register(userData);
      toast.success("Inscription réussie ! Un email de vérification vous a été envoyé.");
      router.push("/login");
    } catch (error) {
      const payload = error?.payload || {};
      const message =
        payload.detail ||
        payload.message ||
        payload.error ||
        Object.values(payload)?.[0]?.[0] ||
        error?.message ||
        "Une erreur est survenue lors de l'inscription.";
      toast.error(message);
      console.error("Registration Failed:", message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renders the animated error indicator displayed next to field labels.
   *
   * @param {{ message?: string }} props - Error indicator props.
   * @returns {JSX.Element|null} Animated error icon.
   */
  const ErrorIcon = ({ message }) => (
    <FormFieldError message={message} iconClassName="ml-2" showMessage={false} />
  );

  ErrorIcon.propTypes = {
    message: PropTypes.string,
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Créer un compte</CardTitle>
          <CardDescription>S&apos;inscrire avec Apple ou Google</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  {/* Bouton d'inscription avec Apple */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  S&apos;inscrire avec Apple
                </Button>
                <Button variant="outline" className="w-full">
                  {/* Bouton d'inscription avec Google */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  S&apos;inscrire avec Google
                </Button>
              </div>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Ou s&apos;inscrire ici
                </span>
              </div>

              {/* Email - 100% width */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="email">Email</Label>
                  <ErrorIcon message={errors.email?.message} />
                </div>
                <Input id="email" type="email" {...register("email")} placeholder="m@example.com" />
                <FormFieldError message={errors.email?.message} showIcon={false} className="min-h-[1rem]" />
              </div>

              {/* First Name & Last Name - 50% 50% */}
              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Label htmlFor="first_name">Prénom</Label>
                      <ErrorIcon message={errors.first_name?.message} />
                    </div>
                    <Input id="first_name" {...register("first_name")} placeholder="Jean" />
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Label htmlFor="last_name">Nom</Label>
                      <ErrorIcon message={errors.last_name?.message} />
                    </div>
                    <Input id="last_name" {...register("last_name")} placeholder="Dupont" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormFieldError message={errors.first_name?.message} showIcon={false} className="min-h-[1rem]" />
                  <FormFieldError message={errors.last_name?.message} showIcon={false} className="min-h-[1rem]" />
                </div>
              </div>

              {/* Account Type Tabs - 100% width displayed as 50% 50% */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="account_type">Type de compte</Label>
                  <ErrorIcon message={errors.account_type?.message} />
                </div>
                <Tabs value={accountType} onValueChange={setAccountType} className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="AGENT" className="flex items-center gap-2">
                      <HandCoins className="w-4 h-4" />
                      Sponsor
                    </TabsTrigger>
                    <TabsTrigger value="COLLABORATOR" className="flex items-center gap-2">
                      <Medal className="w-4 h-4" />
                      Athlete
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <input type="hidden" {...register("account_type")} value={accountType} readOnly />
                <FormFieldError message={errors.account_type?.message} showIcon={false} className="min-h-[1rem]" />
              </div>

              {/* Phone Number - Indicatif + Téléphone */}
              <div className="grid gap-2">
                <div className="grid grid-cols-8 gap-3">
                  <div className="col-span-3">
                    <div className="flex items-center mb-2">
                      <Label htmlFor="phone_country_code">Indicatif</Label>
                      <ErrorIcon message={errors.phone_country_code?.message} />
                    </div>
                    <Select value={phoneCode} onValueChange={(val) => setPhoneCode(val)}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+33">🇫🇷 +33</SelectItem>
                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("phone_country_code")} value={phoneCode} readOnly />
                  </div>

                  <div className="col-span-5">
                    <div className="flex items-center mb-2">
                      <Label htmlFor="phone_number">Numéro de téléphone</Label>
                      <ErrorIcon message={errors.phone_number?.message} />
                    </div>
                    <Input
                      id="phone_number"
                      placeholder={PHONE_RULES[phoneCode]?.example || "ex: numéro"}
                      {...register("phone_number")}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "");
                        const rule = PHONE_RULES[phoneCode];
                        const limited = rule ? digits.slice(0, rule.max) : digits.slice(0, 15);
                        e.target.value = limited;
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-8 gap-3">
                  <div className="col-span-3">
                    <FormFieldError message={errors.phone_country_code?.message} showIcon={false} className="min-h-[1rem]" />
                  </div>
                  <div className="col-span-5">
                    <FormFieldError message={errors.phone_number?.message} showIcon={false} className="min-h-[1rem]" />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password - 50% 50% */}
              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <ErrorIcon message={errors.password?.message} />
                    </div>
                    <Input id="password" type="password" {...register("password")} />
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Label htmlFor="confirm_password">Confirmer</Label>
                      <ErrorIcon message={errors.confirm_password?.message} />
                    </div>
                    <Input id="confirm_password" type="password" {...register("confirm_password")} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormFieldError message={errors.password?.message} showIcon={false} className="min-h-[1rem]" />
                  <FormFieldError message={errors.confirm_password?.message} showIcon={false} className="min-h-[1rem]" />
                </div>
              </div>

            {/* Bouton de soumission */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Inscription..." : "S'inscrire"}
            </Button>
          </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-sm">
        Vous avez déjà un compte?{" "}
        <a href="/login" className="underline underline-offset-4">
          Se connecter
        </a>
      </div>

      <div className="text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 ">
        En vous inscrivant, vous confirmez avoir lu et accepté nos{" "}
        <a href="/terms-of-service" className="hover:text-primary">
          Conditions Générales d&apos;Utilisation
        </a>{" "}
        ainsi que notre{" "}
        <a href="/privacy-policy" className="hover:text-primary">
          Politique de Confidentialité
        </a>.
      </div>
    </div>
  );
}
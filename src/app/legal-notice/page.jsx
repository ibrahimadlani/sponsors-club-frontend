"use client";

import AppHeader from "@/components/app-header";
import Footer from "@/components/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, Phone, Globe, FileText } from "lucide-react";

const sections = [
  {
    id: "editeur",
    title: "1. Éditeur de la plateforme",
    content: [
      "La plateforme SponsorsClub est éditée par la société SponsorsClub SAS, société par actions simplifiée au capital social de 100 000 euros, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789.",
      "Siège social : 42 Avenue des Champs-Élysées, 75008 Paris, France.",
      "Numéro TVA intracommunautaire : FR12 345 678 901.",
      "Directeur de la publication : Claire Dubois, Présidente.",
    ],
  },
  {
    id: "contact",
    title: "2. Coordonnées",
    content: [
      "Pour toute question relative à la plateforme ou aux services proposés, vous pouvez contacter l'équipe SponsorsClub via les moyens suivants :",
    ],
    list: [
      {
        icon: MapPin,
        label: "Adresse postale",
        value: "SponsorsClub SAS, 42 Avenue des Champs-Élysées, 75008 Paris, France",
      },
      {
        icon: Mail,
        label: "Adresse e-mail",
        value: "contact@sponsorsclub.com",
        href: "mailto:contact@sponsorsclub.com",
      },
      {
        icon: Phone,
        label: "Téléphone",
        value: "+33 (0)1 23 45 67 89",
      },
    ],
  },
  {
    id: "hebergeur",
    title: "3. Hébergement",
    content: [
      "SponsorsClub est hébergé par Vercel Inc., société de droit américain dont le siège social est situé à 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis.",
      "Vercel assure la disponibilité et la maintenance de l’infrastructure technique utilisée par la plateforme SponsorsClub.",
    ],
  },
  {
    id: "services",
    title: "4. Services proposés",
    content: [
      "La plateforme SponsorsClub permet la mise en relation d’athlètes, d’agents, de marques et de collaborateurs dans le cadre de partenariats et de campagnes de sponsoring.",
      "Les services proposés incluent notamment :",
    ],
    bulletList: [
      "Création et gestion de profils professionnels.",
      "Outils de découverte et de matching entre athlètes et marques.",
      "Gestion des contrats, signatures électroniques et suivis de campagnes.",
      "Accès à des tableaux de bord analytiques et reporting personnalisé.",
    ],
  },
  {
    id: "propriete",
    title: "5. Propriété intellectuelle",
    content: [
      "L’ensemble des éléments composant la plateforme (textes, visuels, interfaces, logos, bases de données, etc.) est protégé par le droit de la propriété intellectuelle et demeure la propriété exclusive de SponsorsClub ou de ses partenaires.",
      "Toute reproduction, représentation, adaptation ou exploitation non autorisée est interdite et susceptible de constituer un acte de contrefaçon.",
    ],
  },
  {
    id: "donnees",
    title: "6. Données personnelles",
    content: [
      "SponsorsClub accorde une importance particulière à la protection des données personnelles. Les traitements réalisés dans le cadre de l’utilisation de la plateforme sont décrits dans la Politique de confidentialité.",
      "Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d’un droit d’accès, de rectification, d’opposition, de suppression et de portabilité de vos données personnelles.",
      "Pour exercer vos droits, vous pouvez contacter notre délégué à la protection des données (DPO) à l’adresse privacy@sponsorsclub.com.",
    ],
  },
  {
    id: "responsabilite",
    title: "7. Responsabilité",
    content: [
      "SponsorsClub met tout en œuvre pour assurer l’exactitude et la mise à jour des informations disponibles sur la plateforme. Toutefois, la société ne saurait être tenue pour responsable des erreurs ou omissions, ou des conséquences de l’utilisation des informations fournies.",
      "SponsorsClub ne pourra être tenu responsable des dommages directs ou indirects liés à l’utilisation ou l’impossibilité d’utiliser la plateforme, sauf faute lourde ou intentionnelle de sa part.",
    ],
  },
  {
    id: "droit",
    title: "8. Droit applicable et juridiction compétente",
    content: [
      "Les présentes mentions légales sont régies et interprétées conformément au droit français.",
      "En cas de litige relatif à l’utilisation de la plateforme, les tribunaux compétents seront ceux du ressort de la Cour d’appel de Paris, sauf dispositions légales impératives contraires.",
    ],
  },
];

export default function LegalNoticePage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh flex-col bg-background text-foreground">
        <AppHeader />
        <main className="flex-1">
          <section className="border-b border-border bg-muted/40">
            <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit border-border text-foreground">
                  Mentions légales
                </Badge>
                <div className="space-y-3">
                  <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                    Informations légales SponsorsClub
                  </h1>
                  <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
                    Identité de l’éditeur, hébergeur, coordonnées et informations juridiques liées à l’utilisation de la plateforme SponsorsClub.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-4xl px-6 py-16 space-y-12 md:space-y-14">
            {sections.map(({ id, title, content, list, bulletList }, index) => (
              <article key={id} id={id} className="space-y-6">
                <Card className="overflow-hidden border-border/80 bg-card/90">
                  <CardHeader className="space-y-2 border-b border-border/60 bg-muted/40 px-6 py-5">
                    <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6 py-5 text-sm leading-relaxed text-muted-foreground">
                    {content.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}

                    {Array.isArray(list) && (
                      <div className="space-y-3">
                        {list.map(({ icon: Icon, label, value, href }) => (
                          <div key={label} className="flex items-start gap-3">
                            <Icon className="mt-1 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">{label}</p>
                              {href ? (
                                <a
                                  href={href}
                                  className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                  {value}
                                </a>
                              ) : (
                                <p className="text-sm text-muted-foreground">{value}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {Array.isArray(bulletList) && (
                      <ul className="list-disc space-y-2 pl-5">
                        {bulletList.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
                {index < sections.length - 1 ? <Separator className="my-10" /> : null}
              </article>
            ))}

            <Card className="border-border/80 bg-muted/50">
              <CardContent className="flex flex-col gap-4 px-6 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
                  <p>
                    Pour toute question supplémentaire d’ordre juridique ou administratif, contactez-nous à{" "}
                    <a
                      href="mailto:legal@sponsorsclub.com"
                      className="font-medium text-foreground hover:underline"
                    >
                      legal@sponsorsclub.com
                    </a>.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  Documents disponibles en français et en anglais sur demande.
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}


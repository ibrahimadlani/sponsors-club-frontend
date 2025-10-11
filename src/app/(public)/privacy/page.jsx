import Link from "next/link";
import AppHeader from "@/components/app-header";
import Footer from "@/components/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Lock, 
  Users, 
  FileText, 
  Clock, 
  Share2, 
  Key, 
  Globe, 
  Cookie, 
  Baby,
  Mail,
  AlertCircle 
} from "lucide-react";

export const metadata = {
  title: "Politique de confidentialité | SponsorsClub",
  description:
    "Découvrez comment SponsorsClub collecte, utilise et protège vos données personnelles.",
};

const sections = [
  {
    id: "responsable",
    icon: FileText,
    title: "1. Responsable du traitement",
    body: [
      "SponsorsClub SAS, société par actions simplifiée au capital de 100 000 euros, immatriculée au RCS de Paris sous le numéro 123 456 789, ayant son siège social au 42 Avenue des Champs-Élysées, 75008 Paris, France, est responsable du traitement des données personnelles collectées via la plateforme et les services associés.",
      "Notre Délégué à la Protection des Données (DPO) est à votre disposition pour toute question relative à la protection de vos données personnelles et à l&apos;exercice de vos droits.",
    ],
    contact: {
      email: "privacy@sponsorsclub.com",
      dpo: "dpo@sponsorsclub.com",
      address: "42 Avenue des Champs-Élysées, 75008 Paris, France"
    }
  },
  {
    id: "donnees-collectees",
    icon: Users,
    title: "2. Données collectées",
    body: [
      "Dans le cadre de l&apos;utilisation de notre plateforme, nous sommes amenés à collecter et traiter différentes catégories de données personnelles vous concernant. Ces données sont collectées de manière directe (informations que vous nous fournissez) ou indirecte (données générées lors de votre utilisation du service).",
      "La collecte de certaines données est obligatoire pour la création et la gestion de votre compte, tandis que d&apos;autres sont facultatives et permettent d&apos;enrichir votre expérience utilisateur.",
    ],
    subsections: [
      {
        subtitle: "2.1 Données d'identité et de profil",
        items: [
          "Nom, prénom, pseudonyme",
          "Date de naissance",
          "Photo de profil et images",
          "Genre (facultatif)",
          "Biographie et description personnelle"
        ]
      },
      {
        subtitle: "2.2 Données professionnelles",
        items: [
          "Rôle sur la plateforme (athlète, agent, collaborateur, marque)",
          "Sport(s) pratiqué(s) ou domaine d&apos;activité",
          "Organisation ou club d&apos;appartenance",
          "Niveau de pratique et palmarès",
          "Statistiques et performances sportives"
        ]
      },
      {
        subtitle: "2.3 Coordonnées",
        items: [
          "Adresse e-mail",
          "Numéro de téléphone",
          "Adresse postale",
          "Liens vers vos profils sur les réseaux sociaux"
        ]
      },
      {
        subtitle: "2.4 Données de connexion et d'utilisation",
        items: [
          "Identifiants de connexion (login, mot de passe haché)",
          "Adresse IP et localisation géographique approximative",
          "Type d&apos;appareil, système d&apos;exploitation, navigateur",
          "Logs de connexion (date, heure, durée)",
          "Pages consultées, fonctionnalités utilisées",
          "Préférences et paramètres personnalisés"
        ]
      },
      {
        subtitle: "2.5 Données de transaction et de facturation",
        items: [
          "Historique des abonnements et des paiements",
          "Moyens de paiement (via nos prestataires sécurisés)",
          "Factures et reçus",
          "Données relatives aux contrats et collaborations"
        ]
      },
      {
        subtitle: "2.6 Données de communication",
        items: [
          "Messages échangés via la messagerie de la plateforme",
          "E-mails et communications avec le support client",
          "Commentaires et retours utilisateurs",
          "Réponses aux enquêtes de satisfaction"
        ]
      }
    ]
  },
  {
    id: "finalites",
    icon: Shield,
    title: "3. Finalités du traitement",
    body: [
      "Vos données personnelles sont collectées et traitées pour des finalités déterminées, explicites et légitimes. Nous nous engageons à ne traiter vos données que dans le cadre strict de ces finalités.",
    ],
    list: [
      "**Gestion des comptes** : Création, authentification, mise à jour et suppression de votre compte utilisateur.",
      "**Fourniture du service** : Mise en relation entre athlètes, agents, collaborateurs et marques, gestion des profils et des contenus.",
      "**Personnalisation** : Adaptation de l&apos;expérience utilisateur, recommandations personnalisées, suggestions de contenu pertinent.",
      "**Communication** : Envoi de notifications liées au service, réponse aux demandes de support, envoi de newsletters (avec votre consentement).",
      "**Sécurité** : Prévention de la fraude, détection des abus, protection de la plateforme et de ses utilisateurs.",
      "**Analyse et amélioration** : Analyse statistique de l&apos;utilisation de la plateforme, amélioration continue de nos services et développement de nouvelles fonctionnalités.",
      "**Obligations légales** : Respect de nos obligations légales, réglementaires et fiscales (facturation, comptabilité, réponse aux demandes des autorités).",
      "**Gestion des litiges** : Exercice et défense de nos droits en cas de contentieux."
    ]
  },
  {
    id: "base-legale",
    icon: Key,
    title: "4. Base légale du traitement",
    body: [
      "Conformément au Règlement Général sur la Protection des Données (RGPD), chaque traitement de données personnelles doit reposer sur une base légale. Nos traitements s&apos;appuient sur les fondements juridiques suivants :",
    ],
    subsections: [
      {
        subtitle: "4.1 Exécution du contrat",
        items: [
          "Gestion de votre compte et authentification",
          "Fourniture des services de la plateforme",
          "Traitement des paiements et facturation"
        ]
      },
      {
        subtitle: "4.2 Consentement",
        items: [
          "Envoi de communications marketing et newsletters",
          "Utilisation de cookies non essentiels",
          "Partage de données avec des partenaires tiers (avec votre accord explicite)"
        ]
      },
      {
        subtitle: "4.3 Obligation légale",
        items: [
          "Conservation des données de facturation",
          "Réponse aux réquisitions judiciaires",
          "Respect des obligations fiscales et comptables"
        ]
      },
      {
        subtitle: "4.4 Intérêt légitime",
        items: [
          "Sécurité et prévention de la fraude",
          "Amélioration et optimisation de la plateforme",
          "Analyse statistique anonymisée",
          "Gestion des contentieux"
        ]
      }
    ]
  },
  {
    id: "conservation",
    icon: Clock,
    title: "5. Durée de conservation des données",
    body: [
      "Nous conservons vos données personnelles pendant la durée strictement nécessaire à l&apos;accomplissement des finalités pour lesquelles elles ont été collectées, conformément aux obligations légales applicables.",
    ],
    subsections: [
      {
        subtitle: "5.1 Durées de conservation",
        items: [
          "**Données de compte actif** : Pendant toute la durée de votre utilisation du service.",
          "**Données de compte inactif** : Suppression automatique après 3 ans d&apos;inactivité (absence de connexion).",
          "**Données de facturation** : Conservation pendant 10 ans conformément aux obligations comptables et fiscales.",
          "**Logs de connexion** : Conservation pendant 12 mois pour des raisons de sécurité.",
          "**Données de support client** : Conservation pendant 3 ans après la résolution de votre demande.",
          "**Données marketing** : Conservation jusqu&apos;à votre désinscription ou pendant 3 ans à compter du dernier contact."
        ]
      },
      {
        subtitle: "5.2 Suppression des données",
        items: [
          "À l&apos;issue des durées de conservation, vos données sont supprimées de manière sécurisée ou anonymisées.",
          "Vous pouvez à tout moment demander la suppression anticipée de vos données (voir section 7 - Vos droits)."
        ]
      }
    ]
  },
  {
    id: "partage",
    icon: Share2,
    title: "6. Partage et destinataires des données",
    body: [
      "SponsorsClub s&apos;engage à ne jamais vendre, louer ou échanger vos données personnelles à des fins commerciales. Vos données peuvent être partagées uniquement dans les cas suivants :",
    ],
    subsections: [
      {
        subtitle: "6.1 Au sein de SponsorsClub",
        items: [
          "Les membres de notre équipe habilités dans le cadre de leurs fonctions (support, développement, administration)",
          "Accès limité et encadré par des obligations de confidentialité strictes"
        ]
      },
      {
        subtitle: "6.2 Prestataires de services",
        items: [
          "**Hébergement** : OVH, AWS (stockage et traitement des données)",
          "**Paiement** : Stripe (traitement sécurisé des transactions)",
          "**E-mailing** : SendGrid, Mailchimp (envoi de communications)",
          "**Analytics** : Google Analytics, Mixpanel (analyse anonymisée de l&apos;usage)",
          "**Support client** : Zendesk, Intercom (gestion des demandes)"
        ]
      },
      {
        subtitle: "6.3 Partenaires (avec votre consentement)",
        items: [
          "Marques et sponsors dans le cadre de collaborations que vous acceptez",
          "Autres utilisateurs de la plateforme dans le cadre des fonctionnalités de mise en relation"
        ]
      },
      {
        subtitle: "6.4 Autorités légales",
        items: [
          "Transmission aux autorités compétentes si la loi l&apos;exige",
          "Protection de nos droits, de notre propriété ou de la sécurité de nos utilisateurs"
        ]
      }
    ]
  },
  {
    id: "droits",
    icon: Lock,
    title: "7. Vos droits",
    body: [
      "Conformément au RGPD et à la loi Informatique et Libertés, vous disposez de droits sur vos données personnelles que vous pouvez exercer à tout moment.",
    ],
    subsections: [
      {
        subtitle: "7.1 Droit d'accès",
        items: [
          "Vous pouvez demander une copie de toutes les données personnelles que nous détenons vous concernant.",
          "Ce droit vous permet de vérifier la licéité du traitement de vos données."
        ]
      },
      {
        subtitle: "7.2 Droit de rectification",
        items: [
          "Vous pouvez demander la correction de données inexactes ou incomplètes.",
          "Vous pouvez modifier la plupart de vos informations directement depuis votre compte."
        ]
      },
      {
        subtitle: "7.3 Droit à l'effacement (« droit à l'oubli »)",
        items: [
          "Vous pouvez demander la suppression de vos données dans certains cas.",
          "Ce droit s&apos;applique sauf obligation légale de conservation (ex : données de facturation)."
        ]
      },
      {
        subtitle: "7.4 Droit à la limitation du traitement",
        items: [
          "Vous pouvez demander le gel de vos données dans certaines situations.",
          "Utile en cas de contestation de l&apos;exactitude des données ou du traitement."
        ]
      },
      {
        subtitle: "7.5 Droit à la portabilité",
        items: [
          "Vous pouvez récupérer vos données dans un format structuré et lisible par machine.",
          "Vous pouvez demander le transfert direct de ces données à un autre responsable de traitement."
        ]
      },
      {
        subtitle: "7.6 Droit d'opposition",
        items: [
          "Vous pouvez vous opposer à tout moment au traitement de vos données à des fins de prospection.",
          "Vous pouvez vous opposer aux traitements fondés sur l&apos;intérêt légitime."
        ]
      },
      {
        subtitle: "7.7 Directives post-mortem",
        items: [
          "Vous pouvez définir des directives relatives au sort de vos données après votre décès.",
          "Ces directives peuvent être générales ou spécifiques à SponsorsClub."
        ]
      },
      {
        subtitle: "7.8 Comment exercer vos droits",
        items: [
          "**En ligne** : Depuis les paramètres de votre compte (rubrique « Confidentialité et données »)",
          "**Par e-mail** : privacy@sponsorsclub.com ou dpo@sponsorsclub.com",
          "**Par courrier** : SponsorsClub SAS - Service Protection des Données, 42 Avenue des Champs-Élysées, 75008 Paris, France"
        ]
      }
    ],
    additionalInfo: "Nous nous engageons à répondre à votre demande dans un délai d'un mois à compter de sa réception. Ce délai peut être prolongé de deux mois supplémentaires en cas de complexité ou de nombre élevé de demandes. Vous serez informé de toute prolongation."
  },
  {
    id: "securite",
    icon: Shield,
    title: "8. Sécurité des données",
    body: [
      "La protection de vos données personnelles est une priorité absolue. Nous mettons en œuvre des mesures techniques et organisationnelles robustes pour garantir la sécurité, la confidentialité et l&apos;intégrité de vos données.",
    ],
    subsections: [
      {
        subtitle: "8.1 Mesures techniques",
        items: [
          "**Chiffrement** : Toutes les communications sont sécurisées via HTTPS/TLS. Les données sensibles sont chiffrées au repos.",
          "**Authentification** : Mots de passe stockés sous forme de hash sécurisé (bcrypt), authentification à deux facteurs disponible.",
          "**Pare-feu et protection** : Infrastructure protégée par des pare-feu, systèmes de détection d&apos;intrusion et de prévention des attaques DDoS.",
          "**Sauvegardes** : Sauvegardes régulières et chiffrées de nos bases de données.",
          "**Tests de sécurité** : Audits de sécurité réguliers et tests d&apos;intrusion par des experts indépendants."
        ]
      },
      {
        subtitle: "8.2 Mesures organisationnelles",
        items: [
          "**Accès restreint** : Seuls les employés habilités ont accès aux données, sur la base du besoin d&apos;en connaître.",
          "**Formation** : Formation continue de nos équipes aux bonnes pratiques de sécurité et à la protection des données.",
          "**Confidentialité** : Tous nos employés et prestataires sont soumis à des obligations de confidentialité strictes.",
          "**Gestion des incidents** : Procédures documentées pour détecter, signaler et gérer les violations de données.",
          "**Supervision** : Notre DPO supervise la conformité et la sécurité des traitements."
        ]
      },
      {
        subtitle: "8.3 En cas de violation de données",
        items: [
          "En cas de violation de données susceptible d&apos;engendrer un risque pour vos droits et libertés, nous nous engageons à :",
          "Notifier la CNIL dans les 72 heures suivant la découverte de l&apos;incident",
          "Vous informer directement si le risque est élevé",
          "Mettre en œuvre toutes les mesures nécessaires pour limiter l&apos;impact de l&apos;incident"
        ]
      }
    ]
  },
  {
    id: "transferts",
    icon: Globe,
    title: "9. Transferts internationaux de données",
    body: [
      "Vos données personnelles sont principalement hébergées et traitées au sein de l&apos;Union européenne. Toutefois, certains de nos prestataires de services peuvent être situés en dehors de l&apos;UE.",
    ],
    subsections: [
      {
        subtitle: "9.1 Garanties appropriées",
        items: [
          "**Clauses Contractuelles Types (CCT)** : Contrats approuvés par la Commission européenne garantissant un niveau de protection adéquat.",
          "**Décisions d'adéquation** : Transferts vers des pays reconnus par la Commission européenne comme offrant un niveau de protection adéquat (ex : Royaume-Uni, Suisse).",
          "**Privacy Shield alternatifs** : Mécanismes de certification reconnus au niveau international."
        ]
      },
      {
        subtitle: "9.2 Prestataires concernés",
        items: [
          "**États-Unis** : Certains outils d&apos;analyse et de support (Google Analytics, Stripe, Intercom) peuvent impliquer des transferts encadrés par les CCT.",
          "**Autres pays** : En cas de nouveaux prestataires hors UE, nous veillons systématiquement à mettre en place les garanties appropriées."
        ]
      }
    ],
    additionalInfo: "Vous pouvez obtenir une copie des garanties mises en place en contactant notre DPO à l'adresse dpo@sponsorsclub.com."
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "10. Cookies et technologies similaires",
    body: [
      "Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur la plateforme, analyser l&apos;utilisation du service et personnaliser le contenu.",
    ],
    subsections: [
      {
        subtitle: "10.1 Qu'est-ce qu'un cookie ?",
        items: [
          "Un cookie est un petit fichier texte déposé sur votre appareil lors de votre visite sur notre site.",
          "Les cookies permettent de mémoriser vos préférences et d&apos;améliorer votre navigation."
        ]
      },
      {
        subtitle: "10.2 Types de cookies utilisés",
        items: [
          "**Cookies strictement nécessaires** : Indispensables au fonctionnement du site (authentification, sécurité). Ils ne nécessitent pas votre consentement.",
          "**Cookies de performance** : Permettent d&apos;analyser l&apos;utilisation du site et d&apos;améliorer nos services (Google Analytics).",
          "**Cookies de fonctionnalité** : Mémorisent vos préférences (langue, devise, thème sombre/clair).",
          "**Cookies de ciblage** : Utilisés pour afficher des contenus et publicités pertinents (si applicable)."
        ]
      },
      {
        subtitle: "10.3 Gestion des cookies",
        items: [
          "Vous pouvez accepter ou refuser les cookies non essentiels via notre bandeau de consentement.",
          "Vous pouvez modifier vos préférences à tout moment depuis les paramètres de votre compte.",
          "Vous pouvez configurer votre navigateur pour bloquer les cookies (certaines fonctionnalités pourraient être limitées)."
        ]
      },
      {
        subtitle: "10.4 Durée de vie des cookies",
        items: [
          "**Cookies de session** : Supprimés à la fermeture de votre navigateur.",
          "**Cookies persistants** : Conservés pour une durée maximale de 13 mois."
        ]
      }
    ]
  },
  {
    id: "mineurs",
    icon: Baby,
    title: "11. Protection des mineurs",
    body: [
      "SponsorsClub est une plateforme destinée aux professionnels du sport et aux adultes. Nous sommes particulièrement attentifs à la protection des données des mineurs.",
    ],
    list: [
      "**Âge minimum** : L&apos;utilisation de la plateforme est réservée aux personnes âgées de 16 ans et plus.",
      "**Consentement parental** : Pour les utilisateurs âgés de 16 à 18 ans, le consentement d&apos;un titulaire de l&apos;autorité parentale est requis.",
      "**Vérification** : Nous mettons en œuvre des mesures raisonnables pour vérifier l&apos;âge de nos utilisateurs.",
      "**Suppression** : Si nous apprenons qu&apos;un enfant de moins de 16 ans a créé un compte sans consentement parental, nous supprimerons immédiatement ce compte et les données associées.",
      "**Signalement** : Tout utilisateur ou parent peut signaler la présence d&apos;un mineur non autorisé à l&apos;adresse privacy@sponsorsclub.com."
    ]
  },
  {
    id: "modifications",
    icon: AlertCircle,
    title: "12. Modifications de la politique de confidentialité",
    body: [
      "Nous pouvons être amenés à modifier la présente politique de confidentialité pour refléter l&apos;évolution de nos pratiques, de nos services ou du cadre légal et réglementaire.",
    ],
    subsections: [
      {
        subtitle: "12.1 Notification des modifications",
        items: [
          "**Modifications mineures** : Mises à jour techniques ou corrections sans impact sur vos droits (mise à jour silencieuse avec nouvelle date).",
          "**Modifications importantes** : Changements significatifs affectant vos droits ou les traitements de données. Vous serez informé par e-mail et/ou via une notification sur la plateforme au moins 30 jours avant l&apos;entrée en vigueur.",
          "**Acceptation** : L&apos;utilisation continue du service après notification vaut acceptation des nouvelles conditions. Si vous n&apos;acceptez pas les modifications, vous pouvez supprimer votre compte."
        ]
      },
      {
        subtitle: "12.2 Historique des versions",
        items: [
          "Nous conservons un historique des versions précédentes de cette politique.",
          "Vous pouvez demander l&apos;accès aux versions antérieures en contactant notre DPO."
        ]
      }
    ]
  },
  {
    id: "reclamation",
    icon: Mail,
    title: "13. Droit de réclamation",
    body: [
      "Si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD, vous disposez du droit d&apos;introduire une réclamation auprès de l&apos;autorité de contrôle compétente.",
    ],
    subsections: [
      {
        subtitle: "13.1 Autorité de contrôle en France",
        items: [
          "**CNIL (Commission Nationale de l'Informatique et des Libertés)**",
          "Adresse : 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07",
          "Téléphone : +33 1 53 73 22 22",
          "Site web : www.cnil.fr",
          "Formulaire de plainte en ligne : www.cnil.fr/fr/plaintes"
        ]
      },
      {
        subtitle: "13.2 Avant de saisir la CNIL",
        items: [
          "Nous vous encourageons à nous contacter en premier lieu pour tenter de résoudre toute préoccupation.",
          "Notre équipe s&apos;engage à traiter rapidement et efficacement toute réclamation."
        ]
      }
    ]
  }
];

export default function PrivacyPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
        <AppHeader />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-6 py-12 md:py-20">
            {/* Hero Header */}
            <header className="space-y-6 text-center">
              <Badge variant="outline" className="mx-auto w-fit">
                <Shield className="mr-1.5 h-3.5 w-3.5" />
                Politique de confidentialité
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Vos données, notre{" "}
                <span className="text-primary">priorité</span>
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
                Chez SponsorsClub, nous nous engageons à protéger vos données personnelles 
                avec le plus grand soin. Découvrez comment nous collectons, utilisons et 
                sécurisons vos informations en toute transparence.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Dernière mise à jour : 15 janvier 2025</span>
              </div>
            </header>

            <Separator className="my-12" />

            {/* Table of Contents */}
            <nav className="my-12 rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <FileText className="h-5 w-5 text-primary" />
                Sommaire
              </h2>
              <ul className="grid gap-2 text-sm md:grid-cols-2">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="flex items-center gap-2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-primary" />
                        <span className="truncate">{section.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Sections */}
            <div className="space-y-16">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24 space-y-6"
                  >
                    {/* Section Header */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-primary/10 p-2.5">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            {section.title}
                          </h2>
                        </div>
                      </div>
                      <Separator />
                    </div>

                    {/* Section Body */}
                    <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                      {section.body.map((paragraph, idx) => (
                        <p key={idx} className="text-foreground/80">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Contact Info (for section 1) */}
                    {section.contact && (
                      <div className="rounded-lg border border-border bg-muted/50 p-4">
                        <h3 className="mb-3 font-semibold text-foreground">
                          Coordonnées
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <div>
                              <span className="font-medium">E-mail (questions générales) :</span>{" "}
                              <Link
                                href={`mailto:${section.contact.email}`}
                                className="text-primary underline-offset-4 hover:underline"
                              >
                                {section.contact.email}
                              </Link>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <div>
                              <span className="font-medium">DPO :</span>{" "}
                              <Link
                                href={`mailto:${section.contact.dpo}`}
                                className="text-primary underline-offset-4 hover:underline"
                              >
                                {section.contact.dpo}
                              </Link>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <div>
                              <span className="font-medium">Adresse :</span>{" "}
                              {section.contact.address}
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}

                    {/* List */}
                    {section.list && section.list.length > 0 && (
                      <ul className="space-y-3 pl-0">
                        {section.list.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span
                              className="text-foreground/80"
                              dangerouslySetInnerHTML={{
                                __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Subsections */}
                    {section.subsections && section.subsections.length > 0 && (
                      <div className="space-y-6">
                        {section.subsections.map((subsection, subIdx) => (
                          <div
                            key={subIdx}
                            className="rounded-lg border border-border bg-card p-5 shadow-sm"
                          >
                            <h3 className="mb-3 text-lg font-semibold text-foreground">
                              {subsection.subtitle}
                            </h3>
                            <ul className="space-y-2.5">
                              {subsection.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="flex items-start gap-2.5 text-sm">
                                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                                  <span
                                    className="text-muted-foreground"
                                    dangerouslySetInnerHTML={{
                                      __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
                                    }}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Additional Info */}
                    {section.additionalInfo && (
                      <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4">
                        <p className="text-sm text-foreground/80">
                          <AlertCircle className="mr-2 inline h-4 w-4 text-primary" />
                          {section.additionalInfo}
                        </p>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            <Separator className="my-16" />

            {/* CTA Contact */}
            <section className="rounded-xl border border-dashed border-primary/50 bg-primary/5 p-8 text-center">
              <div className="mx-auto max-w-2xl space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Des questions sur vos données ?
                </h3>
                <p className="text-muted-foreground">
                  Notre équipe dédiée à la protection des données est à votre écoute pour 
                  répondre à toutes vos questions et vous accompagner dans l&apos;exercice de vos droits.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <Link
                    href="mailto:privacy@sponsorsclub.com"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                  >
                    <Mail className="h-4 w-4" />
                    Nous contacter
                  </Link>
                  <Link
                    href="/settings#privacy"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
                  >
                    <Lock className="h-4 w-4" />
                    Gérer mes données
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </SidebarProvider>
  );
}

import Link from "next/link";
import AppHeader from "@/components/app-header";
import Footer from "@/components/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Scale, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle, 
  Gavel, 
  Ban,
  Mail,
  Lock,
  RefreshCw,
  UserX,
  Zap,
  Globe,
  Copyright,
  AlertCircle
} from "lucide-react";

export const metadata = {
  title: "Conditions Générales d'Utilisation | SponsorsClub",
  description:
    "Consultez les conditions générales d'utilisation de la plateforme SponsorsClub.",
};

const sections = [
  {
    id: "objet",
    icon: FileText,
    title: "1. Objet et champ d'application",
    body: [
      "Les présentes Conditions Générales d&apos;Utilisation (ci-après « CGU ») régissent l&apos;accès et l&apos;utilisation de la plateforme SponsorsClub (ci-après « la Plateforme »), éditée par SponsorsClub SAS, société par actions simplifiée au capital de 100 000 euros, immatriculée au RCS de Paris sous le numéro 123 456 789, ayant son siège social au 42 Avenue des Champs-Élysées, 75008 Paris, France.",
      "La Plateforme met en relation des athlètes, des agents sportifs, des collaborateurs et des marques dans le cadre de partenariats et de sponsoring sportif. Elle propose également des outils de gestion de profil, d&apos;analyse de données et de communication.",
      "L&apos;utilisation de la Plateforme implique l&apos;acceptation pleine et entière des présentes CGU. Si vous n&apos;acceptez pas ces conditions, vous ne devez pas utiliser la Plateforme."
    ],
    highlights: [
      {
        type: "info",
        text: "Ces CGU constituent un contrat juridiquement contraignant entre vous et SponsorsClub SAS."
      }
    ]
  },
  {
    id: "definitions",
    icon: FileText,
    title: "2. Définitions",
    body: [
      "Dans le cadre des présentes CGU, les termes suivants ont la signification indiquée ci-après :"
    ],
    subsections: [
      {
        subtitle: "Termes principaux",
        items: [
          "**Utilisateur** : Toute personne physique ou morale accédant et utilisant la Plateforme, qu&apos;elle soit inscrite ou non.",
          "**Membre** : Utilisateur ayant créé un compte sur la Plateforme (athlète, agent, collaborateur ou marque).",
          "**Athlète** : Membre exerçant une activité sportive de manière professionnelle ou semi-professionnelle.",
          "**Agent** : Membre représentant un ou plusieurs athlètes et gérant leurs intérêts professionnels.",
          "**Collaborateur** : Membre travaillant pour un agent ou une organisation sportive.",
          "**Marque** : Membre représentant une entreprise souhaitant établir des partenariats avec des athlètes.",
          "**Contenu** : Tout élément publié sur la Plateforme (textes, images, vidéos, données, commentaires, messages).",
          "**Services** : Ensemble des fonctionnalités et outils proposés par la Plateforme.",
          "**Abonnement** : Formule payante donnant accès à des fonctionnalités premium de la Plateforme."
        ]
      }
    ]
  },
  {
    id: "acces",
    icon: Users,
    title: "3. Accès à la Plateforme",
    body: [
      "L&apos;accès à la Plateforme est réservé aux personnes physiques âgées d&apos;au moins 16 ans révolus et aux personnes morales disposant de la capacité juridique. Pour les mineurs de 16 à 18 ans, l&apos;autorisation d&apos;un représentant légal est requise."
    ],
    subsections: [
      {
        subtitle: "3.1 Inscription",
        items: [
          "L&apos;accès à certaines fonctionnalités de la Plateforme nécessite la création d&apos;un compte.",
          "Lors de l&apos;inscription, vous devez fournir des informations exactes, complètes et à jour.",
          "Vous vous engagez à mettre à jour vos informations en cas de modification.",
          "Vous ne pouvez créer qu&apos;un seul compte par personne physique ou morale.",
          "Toute création de compte frauduleux ou avec de fausses informations entraînera la suspension ou la suppression immédiate du compte."
        ]
      },
      {
        subtitle: "3.2 Identifiants et sécurité",
        items: [
          "Vous êtes responsable de la confidentialité de vos identifiants (adresse e-mail et mot de passe).",
          "Vous vous engagez à ne pas partager vos identifiants avec des tiers.",
          "Vous devez notifier immédiatement SponsorsClub de toute utilisation non autorisée de votre compte.",
          "SponsorsClub ne pourra être tenu responsable des dommages résultant d&apos;une utilisation non autorisée de vos identifiants, sauf faute prouvée de notre part.",
          "Nous vous recommandons d&apos;utiliser un mot de passe fort et d&apos;activer l&apos;authentification à deux facteurs."
        ]
      },
      {
        subtitle: "3.3 Disponibilité du service",
        items: [
          "Nous nous efforçons d&apos;assurer une disponibilité de la Plateforme 24h/24 et 7j/7.",
          "La Plateforme peut être temporairement indisponible en raison de maintenances techniques, mises à jour ou circonstances indépendantes de notre volonté.",
          "SponsorsClub ne saurait être tenu responsable des dommages résultant d&apos;une indisponibilité temporaire du service.",
          "Nous nous engageons à informer les Membres, dans la mesure du possible, de toute maintenance planifiée."
        ]
      }
    ]
  },
  {
    id: "services",
    icon: Zap,
    title: "4. Description des Services",
    body: [
      "La Plateforme propose différents services selon le type de compte et le niveau d&apos;abonnement :"
    ],
    subsections: [
      {
        subtitle: "4.1 Services gratuits",
        items: [
          "Création et gestion d&apos;un profil basique",
          "Navigation et recherche de profils publics",
          "Consultation des offres et opportunités",
          "Messagerie limitée (selon les quotas)",
          "Accès aux statistiques basiques"
        ]
      },
      {
        subtitle: "4.2 Services premium (abonnement payant)",
        items: [
          "**Profil avancé** : Personnalisation étendue, galerie d&apos;images, vidéos, médias sociaux",
          "**Mise en relation prioritaire** : Visibilité accrue auprès des marques et partenaires",
          "**Messagerie illimitée** : Échanges sans restriction avec les autres Membres",
          "**Analytics avancés** : Tableaux de bord détaillés, rapports d&apos;engagement, statistiques en temps réel",
          "**Gestion de collaborations** : Outils de suivi des contrats et partenariats",
          "**Support prioritaire** : Assistance dédiée et temps de réponse réduits",
          "**API access** : Accès aux API pour intégration avec des outils tiers (selon formule)"
        ]
      },
      {
        subtitle: "4.3 Services spécifiques par rôle",
        items: [
          "**Athlètes** : Showcase de performances, mise en avant de palmarès, outil de recherche de sponsors",
          "**Agents** : Gestion multi-athlètes, tableau de bord consolidé, outils de prospection",
          "**Collaborateurs** : Accès délégué aux profils d&apos;athlètes, gestion de tâches",
          "**Marques** : Recherche avancée d&apos;athlètes, campagnes de sponsoring, suivi ROI"
        ]
      }
    ],
    highlights: [
      {
        type: "warning",
        text: "SponsorsClub se réserve le droit de modifier, suspendre ou interrompre tout ou partie des Services à tout moment, avec ou sans préavis."
      }
    ]
  },
  {
    id: "abonnements",
    icon: CreditCard,
    title: "5. Abonnements et tarifs",
    body: [
      "L&apos;accès aux Services premium est soumis à la souscription d&apos;un abonnement payant selon les tarifs en vigueur affichés sur la page dédiée."
    ],
    subsections: [
      {
        subtitle: "5.1 Formules d'abonnement",
        items: [
          "**Formule Starter** : Accès aux fonctionnalités de base, idéal pour débuter",
          "**Formule Pro** : Accès complet aux analytics et outils de gestion",
          "**Formule Enterprise** : Solution sur-mesure pour organisations et agences",
          "Les tarifs sont indiqués en euros (€) toutes taxes comprises (TTC).",
          "Les abonnements sont proposés au choix en mode mensuel ou annuel.",
          "Une réduction est appliquée sur les abonnements annuels."
        ]
      },
      {
        subtitle: "5.2 Souscription et paiement",
        items: [
          "La souscription s&apos;effectue directement en ligne via la page Tarifs de la Plateforme.",
          "Le paiement s&apos;effectue par carte bancaire via notre prestataire de paiement sécurisé (Stripe).",
          "SponsorsClub ne conserve aucune donnée bancaire. Toutes les transactions sont traitées par Stripe.",
          "L&apos;abonnement prend effet immédiatement après validation du paiement.",
          "Un e-mail de confirmation et une facture vous sont envoyés après chaque paiement."
        ]
      },
      {
        subtitle: "5.3 Renouvellement automatique",
        items: [
          "Sauf résiliation de votre part, votre abonnement est renouvelé automatiquement à l&apos;échéance pour la même durée.",
          "Le montant de l&apos;abonnement sera prélevé automatiquement selon la périodicité choisie (mensuelle ou annuelle).",
          "Vous serez informé par e-mail avant chaque renouvellement.",
          "Vous pouvez désactiver le renouvellement automatique à tout moment depuis les paramètres de votre compte."
        ]
      },
      {
        subtitle: "5.4 Modification des tarifs",
        items: [
          "SponsorsClub se réserve le droit de modifier ses tarifs à tout moment.",
          "Toute modification de tarif sera notifiée par e-mail au moins 30 jours avant son entrée en vigueur.",
          "Les nouveaux tarifs s&apos;appliqueront au prochain renouvellement de votre abonnement.",
          "Si vous n&apos;acceptez pas les nouveaux tarifs, vous pouvez résilier votre abonnement avant la date d&apos;effet."
        ]
      },
      {
        subtitle: "5.5 Résiliation",
        items: [
          "Vous pouvez résilier votre abonnement à tout moment depuis les paramètres de votre compte.",
          "La résiliation prend effet à la fin de la période d&apos;abonnement en cours.",
          "Aucun remboursement ne sera effectué au prorata de la période non utilisée.",
          "Après résiliation, vous conservez l&apos;accès aux Services premium jusqu&apos;à la fin de la période payée.",
          "Vous pourrez continuer à utiliser les Services gratuits après expiration de l&apos;abonnement."
        ]
      },
      {
        subtitle: "5.6 Période d'essai",
        items: [
          "Une période d&apos;essai gratuite peut être proposée pour certaines formules.",
          "La durée de la période d&apos;essai est indiquée lors de la souscription.",
          "À l&apos;issue de la période d&apos;essai, l&apos;abonnement devient payant sauf résiliation de votre part.",
          "Vous pouvez annuler votre période d&apos;essai à tout moment sans frais.",
          "La période d&apos;essai est limitée à une seule fois par utilisateur."
        ]
      }
    ]
  },
  {
    id: "obligations",
    icon: ShieldCheck,
    title: "6. Obligations des Utilisateurs",
    body: [
      "En utilisant la Plateforme, vous vous engagez à respecter les règles suivantes et à faire un usage conforme de nos Services."
    ],
    subsections: [
      {
        subtitle: "6.1 Comportement général",
        items: [
          "Utiliser la Plateforme de manière loyale et conformément aux présentes CGU.",
          "Respecter les lois et règlements applicables, notamment en matière de droit d&apos;auteur, de protection des données et de propriété intellectuelle.",
          "Ne pas porter atteinte aux droits de tiers ou à l&apos;ordre public.",
          "Ne pas utiliser la Plateforme à des fins illégales, frauduleuses ou contraires aux bonnes mœurs.",
          "Adopter un comportement respectueux envers les autres Utilisateurs et les équipes de SponsorsClub."
        ]
      },
      {
        subtitle: "6.2 Contenu publié",
        items: [
          "Vous êtes seul responsable du Contenu que vous publiez sur la Plateforme.",
          "Vous garantissez disposer de tous les droits nécessaires sur le Contenu publié.",
          "Vous vous engagez à ne pas publier de Contenu : illégal, diffamatoire, injurieux, obscène, pornographique, violent, raciste, xénophobe, discriminatoire, incitant à la haine ou à la violence.",
          "Vous vous engagez à ne pas publier de Contenu portant atteinte aux droits de propriété intellectuelle de tiers.",
          "SponsorsClub se réserve le droit de supprimer tout Contenu ne respectant pas ces règles, sans préavis ni indemnité."
        ]
      },
      {
        subtitle: "6.3 Interdictions spécifiques",
        items: [
          "**Usurpation d&apos;identité** : Ne pas créer de faux profil ou usurper l&apos;identité d&apos;une personne physique ou morale.",
          "**Spam et sollicitation** : Ne pas envoyer de messages non sollicités, de publicités ou de spam.",
          "**Collecte de données** : Ne pas collecter ou extraire des données de la Plateforme par des moyens automatisés (scraping, bots).",
          "**Perturbation du service** : Ne pas tenter de perturber, surcharger ou compromettre le fonctionnement de la Plateforme.",
          "**Contournement des mesures de sécurité** : Ne pas tenter de contourner les mesures de sécurité ou d&apos;accéder à des zones restreintes.",
          "**Ingénierie inverse** : Ne pas procéder à l&apos;ingénierie inverse, décompiler ou désassembler la Plateforme."
        ]
      }
    ],
    highlights: [
      {
        type: "danger",
        text: "Toute violation de ces obligations peut entraîner la suspension ou la suppression définitive de votre compte, sans préjudice de poursuites judiciaires."
      }
    ]
  },
  {
    id: "propriete-intellectuelle",
    icon: Copyright,
    title: "7. Propriété intellectuelle",
    body: [
      "La Plateforme et l&apos;ensemble de son contenu (structure, logiciels, textes, images, graphismes, logos, icônes, sons, vidéos, bases de données) sont protégés par le droit de la propriété intellectuelle."
    ],
    subsections: [
      {
        subtitle: "7.1 Droits de SponsorsClub",
        items: [
          "SponsorsClub est titulaire ou licencié de l&apos;ensemble des droits de propriété intellectuelle portant sur la Plateforme.",
          "Toute reproduction, représentation, modification, publication, adaptation, totale ou partielle, de la Plateforme ou de son contenu, par quelque procédé que ce soit, est interdite sans autorisation préalable écrite de SponsorsClub.",
          "Le nom « SponsorsClub », le logo et tous les signes distinctifs sont des marques déposées. Toute utilisation non autorisée est strictement interdite.",
          "Les bases de données de la Plateforme sont protégées par le droit sui generis des producteurs de bases de données."
        ]
      },
      {
        subtitle: "7.2 Droits sur votre Contenu",
        items: [
          "Vous conservez l&apos;intégralité de vos droits de propriété intellectuelle sur le Contenu que vous publiez.",
          "En publiant du Contenu sur la Plateforme, vous accordez à SponsorsClub une licence mondiale, non exclusive, gratuite et transférable pour utiliser, reproduire, distribuer, modifier et afficher ce Contenu dans le cadre de la fourniture des Services.",
          "Cette licence prend fin lorsque vous supprimez votre Contenu ou votre compte, sauf si le Contenu a été partagé avec d&apos;autres Utilisateurs et n&apos;a pas été supprimé par eux.",
          "Vous autorisez SponsorsClub à sous-licencier ces droits à ses prestataires de services et partenaires."
        ]
      },
      {
        subtitle: "7.3 Signalement de violation",
        items: [
          "Si vous estimez qu&apos;un Contenu publié sur la Plateforme porte atteinte à vos droits de propriété intellectuelle, vous pouvez nous contacter à l&apos;adresse legal@sponsorsclub.com.",
          "Votre signalement doit comporter : vos coordonnées complètes, la description précise du Contenu litigieux, la preuve de vos droits, une déclaration de bonne foi.",
          "Nous nous engageons à traiter rapidement votre demande et à retirer le Contenu litigieux si la violation est avérée."
        ]
      }
    ]
  },
  {
    id: "donnees-personnelles",
    icon: Lock,
    title: "8. Données personnelles",
    body: [
      "La collecte et le traitement de vos données personnelles sont régis par notre Politique de Confidentialité, accessible à tout moment sur la Plateforme.",
      "En utilisant la Plateforme, vous reconnaissez avoir pris connaissance de cette politique et acceptez les traitements de données qui y sont décrits.",
      "Vos données sont traitées dans le respect du Règlement Général sur la Protection des Données (RGPD) et de la loi Informatique et Libertés."
    ],
    subsections: [
      {
        subtitle: "8.1 Données collectées",
        items: [
          "Données d&apos;identification et de contact",
          "Données professionnelles et sportives",
          "Données de connexion et d&apos;utilisation",
          "Données de transaction et de facturation",
          "Contenus publiés et messages échangés"
        ]
      },
      {
        subtitle: "8.2 Vos droits",
        items: [
          "Conformément au RGPD, vous disposez de droits sur vos données personnelles : accès, rectification, effacement, limitation, portabilité, opposition.",
          "Pour exercer vos droits, consultez notre Politique de Confidentialité ou contactez notre DPO à l&apos;adresse dpo@sponsorsclub.com.",
          "Vous pouvez également introduire une réclamation auprès de la CNIL si vous estimez que vos droits ne sont pas respectés."
        ]
      }
    ],
    highlights: [
      {
        type: "info",
        text: "Pour plus d'informations sur la protection de vos données, consultez notre Politique de Confidentialité complète."
      }
    ]
  },
  {
    id: "responsabilite",
    icon: AlertTriangle,
    title: "9. Responsabilité et garanties",
    body: [
      "L&apos;utilisation de la Plateforme se fait à vos propres risques. SponsorsClub s&apos;efforce d&apos;assurer la qualité et la fiabilité de ses Services, mais ne peut garantir une disponibilité et un fonctionnement sans interruption ni erreur."
    ],
    subsections: [
      {
        subtitle: "9.1 Limitation de responsabilité de SponsorsClub",
        items: [
          "SponsorsClub agit en tant qu&apos;intermédiaire technique mettant en relation des Utilisateurs. Nous ne sommes pas partie aux relations contractuelles établies entre les Membres.",
          "SponsorsClub ne garantit pas l&apos;exactitude, la complétude ou la fiabilité du Contenu publié par les Utilisateurs.",
          "SponsorsClub ne saurait être tenu responsable : des dommages indirects (perte de données, perte de chance, préjudice commercial), de l&apos;utilisation frauduleuse de vos identifiants (sauf faute prouvée), des interruptions de service pour maintenance ou cas de force majeure.",
          "En tout état de cause, la responsabilité de SponsorsClub est limitée au montant des sommes effectivement versées par l&apos;Utilisateur au titre de l&apos;abonnement au cours des 12 derniers mois."
        ]
      },
      {
        subtitle: "9.2 Responsabilité des Utilisateurs",
        items: [
          "Vous êtes seul responsable de l&apos;utilisation que vous faites de la Plateforme et du Contenu que vous publiez.",
          "Vous vous engagez à indemniser SponsorsClub de tout préjudice subi du fait de votre utilisation non conforme de la Plateforme.",
          "Vous garantissez SponsorsClub contre toute réclamation de tiers relative au Contenu que vous avez publié."
        ]
      },
      {
        subtitle: "9.3 Contenu des tiers",
        items: [
          "La Plateforme peut contenir des liens vers des sites web de tiers.",
          "SponsorsClub n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.",
          "L&apos;accès à ces sites se fait à vos propres risques."
        ]
      },
      {
        subtitle: "9.4 Force majeure",
        items: [
          "SponsorsClub ne saurait être tenu responsable de l&apos;inexécution ou des retards dans l&apos;exécution de ses obligations résultant d&apos;un cas de force majeure.",
          "Sont considérés comme cas de force majeure : catastrophes naturelles, guerres, émeutes, incendies, grèves, pannes de réseau ou d&apos;électricité, actes de cyberattaque, décisions gouvernementales."
        ]
      }
    ]
  },
  {
    id: "suspension-resiliation",
    icon: Ban,
    title: "10. Suspension et résiliation",
    body: [
      "SponsorsClub se réserve le droit de suspendre ou de résilier votre accès à la Plateforme dans les cas suivants, sans préavis ni indemnité."
    ],
    subsections: [
      {
        subtitle: "10.1 Suspension par SponsorsClub",
        items: [
          "En cas de violation des présentes CGU, notamment des règles d&apos;utilisation et des interdictions.",
          "En cas de comportement frauduleux, abusif ou préjudiciable aux intérêts de SponsorsClub ou d&apos;autres Utilisateurs.",
          "En cas de non-paiement de l&apos;abonnement (pour les Services premium).",
          "En cas de plainte ou de signalement d&apos;un autre Utilisateur justifié.",
          "À la demande d&apos;une autorité administrative ou judiciaire."
        ]
      },
      {
        subtitle: "10.2 Résiliation par l'Utilisateur",
        items: [
          "Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre compte.",
          "La suppression du compte entraîne la suppression définitive de votre profil et de vos données personnelles (sauf données devant être conservées pour des raisons légales).",
          "Le Contenu que vous avez publié et qui a été partagé avec d&apos;autres Utilisateurs peut ne pas être supprimé si ces Utilisateurs l&apos;ont conservé.",
          "En cas de résiliation pendant la période d&apos;abonnement, aucun remboursement ne sera effectué."
        ]
      },
      {
        subtitle: "10.3 Conséquences de la résiliation",
        items: [
          "En cas de suspension ou de résiliation, vous perdez immédiatement l&apos;accès à votre compte et aux Services.",
          "Vous restez responsable de toutes les obligations nées avant la résiliation.",
          "Les dispositions des présentes CGU qui, par nature, doivent survivre à la résiliation (propriété intellectuelle, responsabilité, litiges) restent en vigueur."
        ]
      }
    ],
    highlights: [
      {
        type: "danger",
        text: "En cas de suspension ou de résiliation pour violation des CGU, SponsorsClub se réserve le droit de refuser toute nouvelle inscription."
      }
    ]
  },
  {
    id: "modifications-cgu",
    icon: RefreshCw,
    title: "11. Modifications des CGU",
    body: [
      "SponsorsClub se réserve le droit de modifier les présentes CGU à tout moment pour refléter l&apos;évolution de la Plateforme, de la législation ou de nos pratiques commerciales."
    ],
    subsections: [
      {
        subtitle: "11.1 Notification des modifications",
        items: [
          "Toute modification des CGU sera notifiée aux Utilisateurs inscrits par e-mail et/ou par notification sur la Plateforme.",
          "Les nouvelles CGU seront mises en ligne sur la Plateforme avec indication de la date de dernière mise à jour.",
          "Un délai minimum de 30 jours sera accordé avant l&apos;entrée en vigueur de modifications substantielles.",
          "Pour les modifications mineures (corrections, précisions), la nouvelle version entre en vigueur immédiatement."
        ]
      },
      {
        subtitle: "11.2 Acceptation des nouvelles CGU",
        items: [
          "L&apos;utilisation continue de la Plateforme après notification des modifications vaut acceptation des nouvelles CGU.",
          "Si vous n&apos;acceptez pas les nouvelles CGU, vous devez cesser d&apos;utiliser la Plateforme et supprimer votre compte.",
          "Nous vous recommandons de consulter régulièrement les CGU pour prendre connaissance des éventuelles modifications."
        ]
      }
    ]
  },
  {
    id: "litiges",
    icon: Gavel,
    title: "12. Droit applicable et règlement des litiges",
    body: [
      "Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation, leur exécution ou leur validité relève de la compétence exclusive des tribunaux français."
    ],
    subsections: [
      {
        subtitle: "12.1 Médiation",
        items: [
          "Conformément aux dispositions du Code de la consommation, en cas de litige, vous pouvez recourir gratuitement à un médiateur de la consommation.",
          "**Médiateur de la consommation** : Nous adhérons à [Nom du médiateur] - Contact : [coordonnées]",
          "Le recours à la médiation est facultatif et ne vous prive pas de votre droit d&apos;agir en justice.",
          "Avant de saisir le médiateur, vous devez avoir tenté de résoudre le litige directement avec notre service client."
        ]
      },
      {
        subtitle: "12.2 Règlement des litiges en ligne",
        items: [
          "Conformément au Règlement européen n°524/2013, la Commission européenne met à disposition une plateforme de résolution en ligne des litiges (RLL).",
          "Vous pouvez y accéder à l&apos;adresse suivante : https://ec.europa.eu/consumers/odr/",
          "Cette plateforme permet aux consommateurs de l&apos;Union européenne de régler leurs litiges liés aux achats en ligne."
        ]
      },
      {
        subtitle: "12.3 Juridiction compétente",
        items: [
          "En cas d&apos;échec de la médiation ou si vous choisissez de ne pas y recourir, tout litige sera porté devant les tribunaux compétents.",
          "**Pour les professionnels** : Les tribunaux de Paris sont seuls compétents.",
          "**Pour les consommateurs** : Conformément au Code de la consommation, vous pouvez saisir, à votre choix, l&apos;une des juridictions territorialement compétentes (domicile du consommateur, lieu de livraison, siège social du professionnel)."
        ]
      }
    ]
  },
  {
    id: "divers",
    icon: Globe,
    title: "13. Dispositions diverses",
    body: [
      "Les présentes dispositions complètent les CGU et précisent certains aspects juridiques de notre relation."
    ],
    subsections: [
      {
        subtitle: "13.1 Intégralité de l'accord",
        items: [
          "Les présentes CGU, ainsi que la Politique de Confidentialité, constituent l&apos;intégralité de l&apos;accord entre vous et SponsorsClub concernant l&apos;utilisation de la Plateforme.",
          "Elles remplacent tous accords, représentations, garanties ou communications antérieures, écrits ou oraux."
        ]
      },
      {
        subtitle: "13.2 Nullité partielle",
        items: [
          "Si une disposition des présentes CGU est jugée invalide, illégale ou inapplicable par un tribunal compétent, les autres dispositions resteront pleinement en vigueur.",
          "La disposition invalide sera remplacée par une disposition valide ayant un effet économique similaire."
        ]
      },
      {
        subtitle: "13.3 Renonciation",
        items: [
          "Le fait pour SponsorsClub de ne pas exercer ou faire valoir un droit ou une disposition des présentes CGU ne constitue pas une renonciation à ce droit ou à cette disposition.",
          "Toute renonciation doit être expresse et écrite pour être opposable."
        ]
      },
      {
        subtitle: "13.4 Cession",
        items: [
          "Vous ne pouvez pas céder ou transférer vos droits ou obligations en vertu des présentes CGU sans le consentement préalable écrit de SponsorsClub.",
          "SponsorsClub peut librement céder ou transférer ses droits et obligations, notamment en cas de fusion, acquisition ou cession d&apos;activité."
        ]
      },
      {
        subtitle: "13.5 Langue",
        items: [
          "Les présentes CGU sont rédigées en langue française.",
          "En cas de traduction dans une autre langue, seule la version française fait foi en cas de divergence."
        ]
      }
    ]
  },
  {
    id: "contact",
    icon: Mail,
    title: "14. Contact",
    body: [
      "Pour toute question relative aux présentes CGU ou à l&apos;utilisation de la Plateforme, vous pouvez nous contacter par les moyens suivants :"
    ],
    contact: {
      company: "SponsorsClub SAS",
      address: "42 Avenue des Champs-Élysées, 75008 Paris, France",
      email: "contact@sponsorsclub.com",
      legal: "legal@sponsorsclub.com",
      support: "support@sponsorsclub.com",
      phone: "+33 1 23 45 67 89"
    },
    subsections: [
      {
        subtitle: "Horaires du support",
        items: [
          "Du lundi au vendredi : 9h00 - 18h00 (heure de Paris)",
          "Support premium : 24h/24, 7j/7 pour les abonnés Enterprise"
        ]
      }
    ]
  }
];

export default function TermsOfServicePage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
        <AppHeader />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-6 py-12 md:py-20">
            {/* Hero Header */}
            <header className="space-y-6 text-center">
              <Badge variant="outline" className="mx-auto w-fit">
                <Scale className="mr-1.5 h-3.5 w-3.5" />
                Conditions Générales d&apos;Utilisation
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Conditions d&apos;utilisation de{" "}
                <span className="text-foreground font-semibold">SponsorsClub</span>
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
                En utilisant notre plateforme, vous acceptez les présentes conditions générales 
                d&apos;utilisation. Nous vous invitons à les lire attentivement pour comprendre 
                vos droits et obligations.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4" />
                <span>Dernière mise à jour : 15 janvier 2025</span>
              </div>
            </header>

            <Separator className="my-12" />

            {/* Important Notice */}
            <div className="my-8 rounded-xl border-2 border-gray-300 bg-gray-100 p-6 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-gray-200 p-2 dark:bg-gray-800">
                  <AlertCircle className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-foreground">
                    Document juridiquement contraignant
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ces Conditions Générales d&apos;Utilisation constituent un contrat entre vous et SponsorsClub SAS. 
                    En accédant à la plateforme ou en l&apos;utilisant, vous acceptez d&apos;être lié par ces conditions. 
                    Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser nos services.
                  </p>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <nav className="my-12 rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <FileText className="h-5 w-5 text-foreground" />
                Sommaire
              </h2>
              <ul className="grid gap-2 text-sm md:grid-cols-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="flex items-center gap-2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-foreground" />
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
                        <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-800">
                          <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
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

                    {/* Contact Info (for contact section) */}
                    {section.contact && (
                      <div className="rounded-lg border border-border bg-muted/50 p-5">
                        <h3 className="mb-4 font-semibold text-foreground">
                          {section.contact.company}
                        </h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <div>
                              <span className="font-medium">Adresse :</span>{" "}
                              {section.contact.address}
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <div>
                              <span className="font-medium">Contact général :</span>{" "}
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
                              <span className="font-medium">Questions juridiques :</span>{" "}
                              <Link
                                href={`mailto:${section.contact.legal}`}
                                className="text-primary underline-offset-4 hover:underline"
                              >
                                {section.contact.legal}
                              </Link>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <div>
                              <span className="font-medium">Support technique :</span>{" "}
                              <Link
                                href={`mailto:${section.contact.support}`}
                                className="text-primary underline-offset-4 hover:underline"
                              >
                                {section.contact.support}
                              </Link>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div>
                              <span className="font-medium">Téléphone :</span>{" "}
                              {section.contact.phone}
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}

                    {/* Highlights */}
                    {section.highlights && section.highlights.length > 0 && (
                      <div className="space-y-3">
                        {section.highlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border-l-4 border-primary bg-muted/50 p-4"
                          >
                            <p className="text-sm font-medium text-foreground">
                              <AlertCircle className="mr-2 inline h-4 w-4 text-primary" />
                              {highlight.text}
                            </p>
                          </div>
                        ))}
                      </div>
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
                  Questions sur nos conditions ?
                </h3>
                <p className="text-muted-foreground">
                  Notre équipe juridique et notre service support sont à votre disposition pour 
                  répondre à toutes vos questions concernant ces conditions d&apos;utilisation.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <Link
                    href="mailto:legal@sponsorsclub.com"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                  >
                    <Mail className="h-4 w-4" />
                    Contacter le service juridique
                  </Link>
                  <Link
                    href="/privacy"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
                  >
                    <Lock className="h-4 w-4" />
                    Politique de confidentialité
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

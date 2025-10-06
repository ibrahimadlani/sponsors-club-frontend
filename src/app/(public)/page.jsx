"use client";

/**
 * Home Page - Landing Page Vitrine
 *
 * Page d'accueil vitrine moderne pour SponsorsClub
 * Présente la plateforme et incite à l'inscription/connexion
 */

// React Imports
import { useState, useEffect } from "react";

// Next.js Imports
import Link from "next/link";
import Image from "next/image";

// Third-Party Library Imports
import {
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Search,
  Building2,
  Trophy,
  PlayCircle,
  CheckCircle,
  Globe,
  Euro,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/ui/logo";

// Hooks
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Données statiques pour la vitrine
const featuredAthletes = [
  {
    name: "Kylian Mbappé",
    sport: "Football ⚽",
    image: "/images/mbappe-1.jpg",
    followers: "110M",
    engagement: "4.2%",
    country: "France"
  },
  {
    name: "Victor Wembanyama",
    sport: "Basketball 🏀", 
    image: "/images/wemby-1.jpg",
    followers: "2.1M",
    engagement: "8.7%",
    country: "France"
  },
  {
    name: "Teddy Riner", 
    sport: "Judo 🥋",
    image: "/images/teddy-1.jpg",
    followers: "850K",
    engagement: "5.1%",
    country: "France"
  }
];

const testimonials = [
  {
    name: "Sarah Martinez",
    role: "Directrice Marketing chez Nike",
    content: "SponsorsClub nous a permis de découvrir des talents émergents et de créer des partenariats authentiques.",
    avatar: "/images/avatar-1.jpg",
    rating: 5
  },
  {
    name: "Alexandre Dupont", 
    role: "Agent sportif",
    content: "La plateforme facilite énormément la mise en relation avec des marques pertinentes pour mes athlètes.",
    avatar: "/images/avatar-2.jpg", 
    rating: 5
  },
  {
    name: "Marie Chen",
    role: "Fondatrice de SportTech",
    content: "Interface intuitive et données précieuses pour nos décisions de sponsoring.",
    avatar: "/images/avatar-3.jpg",
    rating: 5
  }
];

const features = [
  {
    icon: Search,
    title: "Découverte intelligente",
    description: "Trouvez les athlètes parfaits grâce à notre algorithme de matching avancé"
  },
  {
    icon: TrendingUp,
    title: "Analytics avancées", 
    description: "Analysez les performances et l'engagement avec des métriques détaillées"
  },
  {
    icon: Shield,
    title: "Partenariats sécurisés",
    description: "Contractualisation et gestion des accords en toute sécurité"
  },
  {
    icon: Users,
    title: "Communauté active",
    description: "Rejoignez un écosystème dynamique de sportifs et de marques"
  }
];

const stats = [
  { value: "10K+", label: "Athlètes" },
  { value: "500+", label: "Marques" }, 
  { value: "50M€", label: "Contrats signés" },
  { value: "95%", label: "Satisfaction" }
];

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const { user } = useCurrentUser();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo />
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Explorer
            </Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              À propos
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Tarifs
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            {user ? (
              <Button asChild>
                <Link href="/explore">
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Se connecter</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">
                    Commencer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate={isVisible ? "animate" : "initial"}
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="secondary" className="mb-6">
                🚀 La plateforme N°1 du sponsoring sportif
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
              variants={fadeInUp}
            >
              Connectez{" "}
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                athlètes
              </span>{" "}
              et{" "}
              <span className="text-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                marques
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              La première plateforme qui révolutionne le sponsoring sportif avec des outils d&apos;analyse avancés et des partenariats authentiques.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              {user ? (
                <Button size="lg" asChild>
                  <Link href="/explore">
                    Découvrir les athlètes
                    <Search className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link href="/register">
                      Créer un compte
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login">
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Voir la démo
                    </Link>
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Athletes */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nos athlètes stars
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez quelques-uns des talents exceptionnels présents sur notre plateforme
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {featuredAthletes.map((athlete, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative h-64">
                    <Image
                      src={athlete.image}
                      alt={athlete.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary">
                        {athlete.sport}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2">{athlete.name}</h3>
                    <p className="text-muted-foreground mb-4">{athlete.country}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">{athlete.followers}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{athlete.engagement}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi choisir SponsorsClub ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des outils puissants pour créer des partenariats gagnant-gagnant
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ce qu&apos;ils disent de nous
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez les témoignages de nos utilisateurs satisfaits
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="p-6">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      &quot;{testimonial.content}&quot;
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-muted mr-3" />
                      <div>
                        <div className="font-semibold text-sm">{testimonial.name}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à révolutionner vos partenariats sportifs ?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Rejoignez des milliers d&apos;athlètes et de marques qui font confiance à SponsorsClub
            </p>
            {user ? (
              <Button size="lg" variant="secondary" asChild>
                <Link href="/explore">
                  Découvrir maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/register">
                    Créer un compte gratuit
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <Link href="/login">
                    Se connecter
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Logo />
              <p className="text-sm text-muted-foreground">
                La plateforme de référence pour connecter athlètes et marques dans le monde entier.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/explore" className="hover:text-primary transition-colors">Explorer</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Tarifs</Link></li>
                <li><Link href="/features" className="hover:text-primary transition-colors">Fonctionnalités</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">À propos</Link></li>
                <li><Link href="/careers" className="hover:text-primary transition-colors">Carrières</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-primary transition-colors">Centre d&apos;aide</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Confidentialité</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Conditions</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SponsorsClub. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                <Globe className="w-4 h-4" />
                Français
              </Link>
              <Link href="/currency" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                <Euro className="w-4 h-4" />
                EUR
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

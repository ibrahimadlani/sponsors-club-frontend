import Link from "next/link";
import { CalendarDays, Clock, Tag, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/lib/blog";
import AppHeader from "@/components/app-header";
import Footer from "@/components/footer";

export const metadata = {
  title: "Blog SponsorsClub",
  description: "Insights et retours d'expérience pour accélérer vos partenariats sportifs.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto flex flex-1 max-w-6xl flex-col gap-12 px-6 py-16 lg:px-12">
      <section className="space-y-4 text-center">
        <Badge variant="outline" className="border-pink-500/40 text-pink-500">
          Nouveautés &amp; Retours d&apos;expérience
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Histoires pour piloter vos partenariats avec impact.
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
          Plongez dans nos analyses, méthodologies et conseils opérationnels pour agents, marques et athlètes.
        </p>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.slug} className="flex flex-col overflow-hidden border-border/70 bg-card/80 transition hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(post.date))}
                {post.readingTime ? (
                  <>
                    <span>•</span>
                    <Clock className="h-4 w-4" />
                    {post.readingTime}
                  </>
                ) : null}
              </div>
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <CardDescription>{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
              {Array.isArray(post.tags) && post.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-xs">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
              <div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Lire l&apos;article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
      </main>
      <Footer />
    </div>
  );
}

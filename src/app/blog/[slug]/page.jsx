import { notFound } from "next/navigation";
import { CalendarDays, Clock, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import Markdown from "@/components/markdown";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/app-header";
import Footer from "@/components/footer";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogArticlePage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto flex-1 max-w-3xl px-6 py-16">
      <Link
        href="/blog"
        className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au blog
      </Link>

      <article className="space-y-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
            {post.date ? (
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(post.date))}
              </span>
            ) : null}
            {post.readingTime ? (
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readingTime}
              </span>
            ) : null}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">{post.title}</h1>
          <p className="text-base text-muted-foreground">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {post.author ? (
              <span>
                Écrit par <span className="font-medium text-foreground">{post.author}</span>
              </span>
            ) : null}
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
          </div>
        </header>

        <Markdown content={post.content} />
      </article>
      </main>
      <Footer />
    </div>
  );
}


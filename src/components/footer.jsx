import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <p className="text-center">
            &copy; {currentYear} SponsorsClub
          </p>
          <span className="hidden sm:inline text-muted-foreground/40">•</span>
          <Link 
            href="/help" 
            className="transition-colors hover:text-foreground"
          >
            Centre d&apos;aide
          </Link>
          <span className="hidden sm:inline text-muted-foreground/40">•</span>
          <Link 
            href="/privacy" 
            className="transition-colors hover:text-foreground"
          >
            Confidentialité
          </Link>
          <span className="hidden sm:inline text-muted-foreground/40">•</span>
          <Link 
            href="/terms-of-service" 
            className="transition-colors hover:text-foreground"
          >
            CGU
          </Link>
          <span className="hidden sm:inline text-muted-foreground/40">•</span>
          <Link 
            href="/legal-notice" 
            className="transition-colors hover:text-foreground"
          >
            Mentions légales
          </Link>
          <span className="hidden sm:inline text-muted-foreground/40">•</span>
          <Link 
            href="/contact" 
            className="transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

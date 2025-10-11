import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider";
import "./styles/globals.css";

/**
 * Load the Inter font from Google Fonts.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/**
 * Application metadata for SEO and favicon configuration.
 */
export const metadata = {
  title: "SponsorsClub",
  description:
    "SponsorsClub is a platform for connecting sponsors with creators.",
  icons: {
    icon: "/../favicon/favicon.ico",
  },
};

/**
 * RootLayout Component
 *
 * This is the main layout component for the application.
 * It wraps the entire application with authentication and theming providers.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The child components to be rendered.
 * @returns {JSX.Element} The rendered root layout.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.variable} antialiased`}>
        {/* ThemeProvider manages the application's theme (light/dark/system) */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

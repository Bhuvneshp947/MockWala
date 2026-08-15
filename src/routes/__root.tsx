import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SessionProvider } from "@/components/session-provider";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react"; // 🆕 Icons Imported Here

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MockWala" },
      { name: "description", content: "MockWala exam preparation dashboard and mock test platform - Bina Mock ke sab adhura." },
      { name: "author", content: "MockWala" },
      { property: "og:title", content: "MockWala" },
      { property: "og:description", content: "MockWala mock tests and performance reports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@MockWala" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <div className="flex min-h-screen flex-col bg-background">
          {/* Header standard layout */}
          <SiteHeader />
          
          {/* Main Website Pages Layout */}
          <main className="flex-1">
            <Outlet />
          </main>

          {/* 🆕 Beautiful New Footer Added Down Here */}
          <footer className="border-t border-border bg-muted/30">
            <div className="mx-auto max-w-6xl px-4 py-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-5 items-start">
                
                {/* Brand Column */}
                <div className="md:col-span-2 flex flex-col gap-3">
                  <span className="font-display text-lg font-bold tracking-tight text-foreground">
                    Mock<span className="text-primary">Wala</span>
                  </span>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-sm">
                    Bina Mock ke sab adhura, MockWala Karega Sapna pure
                  </p>
                </div>

                {/* Quick Links Column */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                    Quick Links
                  </h3>
                  <nav className="flex flex-col gap-2">
                    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Browse Exams
                    </Link>
                    <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Sign Up
                    </Link>
                    <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Dashboard
                    </Link>
                  </nav>
                </div>

                {/* Social Circles Column with border line divider links */}
                <div className="flex flex-col gap-3 md:border-x md:border-border/60 md:px-6 h-full justify-start">
                  <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                    Follow Us
                  </h3>
                  <div className="flex gap-3 items-center mt-1 flex-wrap">
                    {/* Instagram Profile */}
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-10 rounded-full bg-black text-white hover:bg-zinc-800 transition-colors shadow-sm">
                      <Instagram className="size-[22px]" />
                    </a>
                    {/* Facebook Link */}
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-10 rounded-full bg-black text-white hover:bg-zinc-800 transition-colors shadow-sm">
                      <Facebook className="size-[22px]" />
                    </a>
                    {/* YouTube Channel */}
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-10 rounded-full bg-black text-white hover:bg-zinc-800 transition-colors shadow-sm">
                      <Youtube className="size-[22px]" />
                    </a>
                    {/* X (Twitter) Profile */}
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-10 rounded-full bg-black text-white hover:bg-zinc-800 transition-colors shadow-sm">
                      <Twitter className="size-[22px]" />
                    </a>
                  </div>
                </div>

                {/* Exams Static View Column */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                    Exams
                  </h3>
                  <nav className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground cursor-default">UPSC CSE</span>
                    <span className="text-sm text-muted-foreground cursor-default">Banking Exams</span>
                    <span className="text-sm text-muted-foreground cursor-default">SSC Exams</span>
                  </nav>
                </div>

              </div>

              {/* Bottom Copyright Strip */}
              <div className="mt-12 border-t border-border/60 pt-6 text-center md:text-left">
                <p className="text-xs text-muted-foreground">
                  Mock tests for Indian competitive exams. Always verify official dates on the conducting body's website. &copy; {new Date().getFullYear()} MockWala. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
        <Toaster position="top-center" richColors />
      </SessionProvider>
    </QueryClientProvider>
  );
}

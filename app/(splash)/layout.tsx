import ConvexClientProvider from "@/components/ConvexClientProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

export default function SplashPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-20 border-b bg-background/80 px-6 backdrop-blur">
        <nav className="px-8 w-full justify-between gap-6 md:text-lg font-medium flex flex-row items-center md:gap-5 text-sm lg:gap-6">
          <Link href="/">
            <h1 className="text-2xl font-semibold">Puff Counter</h1>
          </Link>
          <div className="flex items-center gap-4">
            <SplashPageNav />
          </div>
        </nav>
      </header>
      <main className="flex grow px-6">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </main>
      <footer className="border-t">
        <div className="container py-4 text-center text-sm leading-loose">
          Built with ❤️ at{" "}
          <FooterLink href="https://www.linkedin.com/company/carbon-crushers">
            Carbon Crushers
          </FooterLink>
        </div>
      </footer>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="underline underline-offset-4 hover:no-underline"
      target="_blank"
    >
      {children}
    </Link>
  );
}

function SplashPageNav() {
  return (
    <>
      <Link
        href="https://docs.convex.dev"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        Docs
      </Link>
      <Link
        href="https://stack.convex.dev"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        Stack
      </Link>
      <Link
        href="/Strains"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        Strains
      </Link>
      <Link
        href="/Origins"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        Origins
      </Link>
      <Link
        href="/Users"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        Users
      </Link>
      <Link
        href="/Consumption"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        Consumption
      </Link>
    </>
  );
}

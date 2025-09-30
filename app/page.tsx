import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-background text-foreground">
      <main className="flex flex-col gap-10 row-start-2 items-center text-center sm:items-start sm:text-left max-w-2xl">
        {/* Logo */}
        <Image
          src="/GivvaLogo.svg"
          alt="Givva Logo"
          width={180}
          height={38}
          priority
        />

        {/* Headline + Subtext */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-snug">
          Welcome to <span className="text-primary">Ogivva</span>
        </h1>
        <p className="text-card-foreground text-base sm:text-lg">
          This is a placeholder for the Ogivva landing page. Sign up to get
          started or sign in to continue your journey.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 items-center flex-col sm:flex-row w-full sm:w-auto">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:bg-primary-hover transition"
          >
            Get Started
          </Link>
          <Link
            href="/signin"
            className="w-full sm:w-auto rounded-lg border border-button-border bg-background px-6 py-3 text-sm font-semibold hover:bg-muted transition"
          >
            Sign In
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Ogivva. All rights reserved.</span>
      </footer>
    </div>
  );
}

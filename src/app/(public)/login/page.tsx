import Link from "next/link";
import { headers } from "next/headers";
import { safeNext } from "@/lib/auth/safe-redirect";
import { SmartLoginForm } from "@/components/portal-student/smart-login-form";

import "./login.css";

export const metadata = { title: "Sign in — Tray" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string;
    tenant?: string;
    error?: string;
    role?: string;
    msg?: string;
  }>;
}) {
  const sp = await searchParams;
  const h = await headers();
  const slug = sp.tenant ?? h.get("x-tenant-slug") ?? "";
  const next = safeNext(sp.next, slug ? `/c/${slug}/menu` : "/");

  const infoMsg =
    sp.msg === "select-canteen"
      ? "Signed in! Share your stall link with customers so they can start ordering."
      : sp.msg === "already-has-canteen"
        ? "Your stall is already set up. Sign in to open your dashboard."
        : undefined;

  const roleHint =
    sp.role === "owner"
      ? "FOR STALL OWNERS"
      : sp.role === "kitchen"
        ? "FOR KITCHEN STAFF"
        : "YOUR STALL, CONNECTED";

  return (
    <div className="tray-login">
      <a className="login-skip" href="#login-main">
        Skip to sign in
      </a>
      <header className="login-header">
        <Link href="/" className="login-brand" aria-label="Tray home">
          tray<span>.</span>
        </Link>
        <Link href="/#demos" className="login-back">
          Explore the demos <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <main id="login-main" className="login-main">
        <div className="login-card">
          <p className="login-eyebrow">{roleHint}</p>
          <h1>Welcome back.</h1>
          <p className="login-intro">
            Sign in to open your menu, kitchen or dashboard.
          </p>
          {(infoMsg || sp.error) && (
            <p
              className={`login-notice${sp.error ? " login-error" : ""}`}
              role={sp.error ? "alert" : "status"}
            >
              {sp.error ?? infoMsg}
            </p>
          )}
          <SmartLoginForm next={next} slug={slug} hintRole={sp.role} />
          <p className="login-signup">
            New to Tray?{" "}
            <Link
              href={
                slug
                  ? `/signup?tenant=${encodeURIComponent(slug)}`
                  : "/get-started"
              }
            >
              {slug ? "Create an account" : "Set up your stall"}
            </Link>
          </p>
          <div className="login-demo">
            <p>Just looking around?</p>
            <Link href="/#demos">
              Try Tray with sample data <span aria-hidden="true">→</span>
            </Link>
            <span>No account or payment needed.</span>
          </div>
        </div>
      </main>
      <footer className="login-footer">
        <span>Built for the daily rush.</span>
        <nav aria-label="Legal">
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
        </nav>
      </footer>
    </div>
  );
}

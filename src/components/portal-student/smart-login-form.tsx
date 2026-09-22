"use client";

/**
 * SmartLoginForm — clean, role-free sign-in used by all portals.
 *
 * Design principle (Vercel / Linear / Notion pattern):
 *   - User signs in once
 *   - System detects their role and routes them to the right portal
 *   - No "are you a Student / Kitchen / Admin?" tab dance
 *   - Google OAuth as the hero method (one tap on mobile)
 *   - Email + password as fallback
 *
 * Routing after sign-in (privilege-ordered, matches auth/callback):
 *   canteen_admin / super_admin → /c/slug/admin/dashboard
 *   kitchen_staff             → /c/slug/kitchen/staff-select
 *   student                   → /c/slug/menu
 *   no membership             → /get-started (owner) or helpful message
 */

import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/browser";

type Props = {
  next: string;
  slug?: string;
  /** hint from the URL (?role=owner|kitchen) — used to save a cookie for
   *  the auth callback but NOT shown to the user as a required choice */
  hintRole?: string;
};

export function SmartLoginForm({ next, slug = "", hintRole }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, start] = useTransition();
  const [method, setMethod] = useState<"google" | "email">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  // ── Smart redirect: same privilege-order as auth/callback/route.ts ──────
  const smartRedirect = async () => {
    const sb = getBrowserClient();
    const {
      data: { session },
    } = await sb.auth.getSession();
    if (!session?.user) {
      window.location.href = next;
      return;
    }

    const { data: membershipsRaw } = await sb
      .from("tenant_memberships")
      .select("tenant_id, role")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    const memberships = (membershipsRaw ?? []) as {
      tenant_id: string;
      role: string;
    }[];

    if (!memberships.length) {
      // Any hint toward owner/admin, or no hint at all (plain login) — send to get-started
      // rather than showing "No account found" which causes a redirect loop for admins
      // who signed up but whose membership wasn't cached yet.
      if (hintRole === "kitchen") {
        window.location.href = `/login?error=${encodeURIComponent("No kitchen staff account found. Ask your canteen admin to add you.")}`;
      } else {
        // Default for owners, admins, students with no membership, or unknown role
        window.location.href = "/get-started?new=1";
      }
      return;
    }

    // Privilege order: admin > kitchen > student
    const adminMem = memberships.find(
      (m) => m.role === "canteen_admin" || m.role === "super_admin",
    );
    const kitchenMem = memberships.find(
      (m) => m.role === "kitchen_staff" || m.role === "kitchen",
    );
    const activeMem = adminMem ?? kitchenMem ?? memberships[0];

    // Resolve slug for this membership.
    // Always look up the slug from the selected membership's tenant_id so we
    // route to the correct canteen even when the URL slug and the membership
    // tenant differ (e.g. admin has memberships in multiple canteens).
    let resolvedSlug = slug;
    let resolvedCollegeSlug: string | null = null;
    const { data: tenantRow } = (await sb
      .from("tenants")
      .select("slug, colleges(slug)")
      .eq("id", activeMem.tenant_id)
      .maybeSingle()) as unknown as {
      data: { slug: string; colleges: { slug: string } | null } | null;
    };
    if (tenantRow?.slug) resolvedSlug = tenantRow.slug;
    resolvedCollegeSlug =
      (tenantRow?.colleges as { slug: string } | null)?.slug ?? null;

    if (!resolvedSlug) {
      window.location.href = "/get-started?new=1";
      return;
    }

    const role = activeMem.role;
    if (role === "canteen_admin" || role === "super_admin") {
      window.location.href = `/c/${resolvedSlug}/admin/dashboard`;
    } else if (role === "kitchen_staff" || role === "kitchen") {
      window.location.href = `/c/${resolvedSlug}/kitchen/staff-select`;
    } else {
      // Students → college portal (all canteens at their institution) if it exists
      if (resolvedCollegeSlug) {
        window.location.href = `/college/${resolvedCollegeSlug}`;
      } else {
        window.location.href = next.startsWith("/c/")
          ? next
          : `/c/${resolvedSlug}/menu`;
      }
    }
  };

  const onGoogleSignIn = () => {
    setFormError("");
    setMethod("google");
    start(async () => {
      try {
        const ctx = JSON.stringify({
          role: hintRole ?? "owner",
          tenant: slug,
          next,
        });
        document.cookie = `_tray_auth_ctx=${encodeURIComponent(ctx)}; path=/; max-age=300; SameSite=Lax`;
      } catch {
        /* non-fatal */
      }

      try {
        const sb = getBrowserClient();
        const redirectTo = new URL(
          `/auth/callback?next=${encodeURIComponent(next)}&tenant=${encodeURIComponent(slug)}&role=${encodeURIComponent(hintRole ?? "")}`,
          window.location.origin,
        ).toString();

        const { error } = await sb.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo },
        });
        if (error)
          setFormError("Google sign-in failed. Try again or use email below.");
      } catch {
        setFormError(
          "Could not open Google sign-in. Check your connection and try again.",
        );
      }
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setMethod("email");
    start(async () => {
      try {
        const sb = getBrowserClient();
        const { data, error } = await sb.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          const msg = error.message.toLowerCase().includes("invalid")
            ? "Wrong email or password."
            : error.message.toLowerCase().includes("not confirmed")
              ? "Check your inbox — you need to confirm your email first."
              : error.message;
          setFormError(msg);
          return;
        }
        if (data.user) await smartRedirect();
      } catch {
        setFormError(
          "Could not finish signing in. Check your connection and try again.",
        );
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="login-form" aria-busy={pending}>
      <button
        type="button"
        onClick={onGoogleSignIn}
        disabled={pending}
        className="login-button login-google"
      >
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
            fill="#34A853"
          />
          <path
            d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z"
            fill="#EA4335"
          />
        </svg>
        {pending && method === "google"
          ? "Opening Google…"
          : "Continue with Google"}
      </button>
      <div className="login-divider">or use email</div>
      <label className="login-field" htmlFor="login-email">
        Email address
        <input
          id="login-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="you@example.com"
          readOnly={pending}
        />
      </label>
      <div className="login-field">
        <label htmlFor="login-password">Password</label>
        <div className="login-password">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            readOnly={pending}
          />
          <button
            type="button"
            className="login-password-toggle"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-controls="login-password"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {formError && (
        <p className="login-notice login-error" role="alert">
          {formError}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="login-button login-submit"
      >
        {pending && method === "email" ? "Signing in…" : "Sign in"}
        {!pending && <ArrowRight size={16} aria-hidden="true" />}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/profile`,
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          router.push("/profile");
          router.refresh();
          return;
        }

        setSuccessMsg(
          "Check your email for the confirmation link to finish creating your ShukAI account."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }

        router.push("/profile");
        router.refresh();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred during authentication.";

      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp((current) => !current);
    setErrorMsg("");
    setSuccessMsg("");
    setPassword("");
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-black text-white">
      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center px-5 py-12">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center">

          {/* LEFT SIDE */}

          <section className="hidden lg:block">
            <div className="mb-6 inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-400">
              ShukAI Landscaping
            </div>

            <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight">
              Landscaping jobs,
              <span className="text-yellow-400"> without the hassle.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-400">
              Manage requests, compare quotes, communicate with local pros,
              and keep your landscaping projects organized in one place.
            </p>

            <div className="mt-10 space-y-4 text-zinc-300">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 font-bold text-black">
                  ✓
                </span>
                Request landscaping quotes
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 font-bold text-black">
                  ✓
                </span>
                Manage jobs and providers
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 font-bold text-black">
                  ✓
                </span>
                Free for homeowners
              </div>
            </div>
          </section>

          {/* AUTH CARD */}

          <section className="w-full lg:ml-auto lg:max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <div className="mb-4 lg:hidden">
                <span className="inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-400">
                  ShukAI
                </span>
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                {isSignUp
                  ? "Create your ShukAI account"
                  : "Welcome back"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {isSignUp
                  ? "Create an account to manage landscaping jobs, quotes, and providers."
                  : "Sign in to manage your landscaping jobs, quotes, and account."}
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-yellow-500/5 sm:p-8">
              <form className="space-y-5" onSubmit={handleAuth}>

                {errorMsg && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm leading-6 text-green-400">
                    {successMsg}
                  </div>
                )}

                {isSignUp && (
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Full name
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="block w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-zinc-300"
                    >
                      Password
                    </label>

                    {!isSignUp && (
                      <Link
                        href="/forgot-password"
                        className="text-xs font-semibold text-yellow-400 transition hover:text-yellow-300"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>

                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete={
                      isSignUp ? "new-password" : "current-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-yellow-400 px-4 py-3.5 text-sm font-black text-black transition hover:bg-yellow-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Please wait..."
                    : isSignUp
                    ? "Create Account"
                    : "Sign In"}
                </button>
              </form>

              <div className="mt-6 border-t border-zinc-900 pt-6 text-center">
                <p className="mb-3 text-sm text-zinc-500">
                  {isSignUp
                    ? "Already have an account?"
                    : "New to ShukAI?"}
                </p>

                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sm font-bold text-yellow-400 transition hover:text-yellow-300"
                >
                  {isSignUp
                    ? "Sign in instead"
                    : "Create a free account"}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="mt-6 text-center text-sm text-zinc-500">
                Need landscaping help?{" "}
                <Link
                  href="/assistant"
                  className="font-semibold text-yellow-400 hover:text-yellow-300"
                >
                  Get free quotes
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

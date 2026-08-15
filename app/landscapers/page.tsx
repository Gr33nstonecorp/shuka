"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Job = {
  id: string;
  problem: string;
  zip_code: string;
  status: string;
  created_at: string;
};

export default function LandscapersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] =
    useState(false);

  const [amounts, setAmounts] =
    useState<Record<string, string>>({});

  const [messages, setMessages] =
    useState<Record<string, string>>({});

  const [submitting, setSubmitting] =
    useState<string | null>(null);

  const [notice, setNotice] = useState("");

  async function getToken() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token || null;
  }

  async function loadJobs() {
    setLoading(true);

    const token = await getToken();

    if (!token) {
      setAuthRequired(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "/api/landscaper/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Could not load jobs."
        );
      }

      setJobs(data.jobs || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function submitQuote(jobId: string) {
    const amount = Number(amounts[jobId]);

    if (!amount || amount <= 0) {
      setNotice("Enter a valid quote amount.");
      return;
    }

    const token = await getToken();

    if (!token) {
      setAuthRequired(true);
      return;
    }

    setSubmitting(jobId);
    setNotice("");

    try {
      const res = await fetch(
        "/api/landscaper/submit-quote",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            jobId,
            amount,
            message:
              messages[jobId] || "",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Could not submit quote."
        );
      }

      setNotice(
        "✓ Quote submitted successfully."
      );

      setAmounts((current) => ({
        ...current,
        [jobId]: "",
      }));

      setMessages((current) => ({
        ...current,
        [jobId]: "",
      }));
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not submit quote."
      );
    } finally {
      setSubmitting(null);
    }
  }

  if (authRequired) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-4">
            ShukAI Pros
          </div>

          <h1 className="text-4xl font-black">
            Sign in to view jobs
          </h1>

          <p className="text-zinc-400 mt-4">
            Landscapers need a ShukAI account
            before submitting quotes.
          </p>

          <Link
            href="/login"
            className="inline-block mt-8 rounded-xl bg-yellow-400 px-8 py-4 font-black text-black"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-5 py-10">

      <div className="mx-auto max-w-4xl">

        <div className="mb-10">

          <div className="text-sm font-bold uppercase tracking-widest text-yellow-400">
            ShukAI Pros
          </div>

          <h1 className="mt-2 text-4xl font-black">
            Open Landscaping Jobs
          </h1>

          <p className="mt-3 text-zinc-400">
            Submit a quote. You only pay ShukAI
            when you win the job.
          </p>

        </div>

        {notice && (
          <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            {notice}
          </div>
        )}

        {loading ? (
          <div className="text-zinc-500">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <h2 className="text-xl font-bold">
              No open jobs right now
            </h2>

            <p className="mt-2 text-zinc-500">
              New homeowner requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {jobs.map((job) => (

              <div
                key={job.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-7"
              >

                <div className="flex items-start justify-between gap-6">

                  <div>

                    <div className="text-xs uppercase tracking-widest text-yellow-400">
                      ZIP {job.zip_code}
                    </div>

                    <h2 className="mt-2 text-xl font-bold">
                      {job.problem}
                    </h2>

                  </div>

                  <div className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                    OPEN
                  </div>

                </div>

                <div className="mt-6">

                  <label className="text-sm text-zinc-400">
                    Your quote
                  </label>

                  <div className="relative mt-2">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-500">
                      $
                    </span>

                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={
                        amounts[job.id] || ""
                      }
                      onChange={(e) =>
                        setAmounts((current) => ({
                          ...current,
                          [job.id]:
                            e.target.value,
                        }))
                      }
                      placeholder="450"
                      className="w-full rounded-xl border border-zinc-700 bg-black py-4 pl-9 pr-4 text-white outline-none focus:border-yellow-400"
                    />

                  </div>

                </div>

                <div className="mt-4">

                  <label className="text-sm text-zinc-400">
                    Message
                  </label>

                  <textarea
                    value={
                      messages[job.id] || ""
                    }
                    onChange={(e) =>
                      setMessages((current) => ({
                        ...current,
                        [job.id]:
                          e.target.value,
                      }))
                    }
                    placeholder="Includes trimming, cleanup and debris removal..."
                    className="mt-2 min-h-[100px] w-full rounded-xl border border-zinc-700 bg-black p-4 text-white outline-none focus:border-yellow-400"
                  />

                </div>

                <button
                  onClick={() =>
                    submitQuote(job.id)
                  }
                  disabled={
                    submitting === job.id
                  }
                  className="mt-5 w-full rounded-xl bg-yellow-400 py-4 font-black text-black hover:bg-yellow-300 disabled:opacity-50"
                >
                  {submitting === job.id
                    ? "Submitting..."
                    : "Submit Quote"}
                </button>

              </div>

            ))}

          </div>
        )}

      </div>

    </main>
  );
}

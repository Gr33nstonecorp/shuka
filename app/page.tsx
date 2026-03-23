"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-black">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-xl font-bold">Shuka</h1>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 border rounded-lg"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/pricing")}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Start Free Trial
          </button>
        </div>
      </div>

      {/* HERO */}
      <section className="text-center px-6 py-20">
        <h1 className="text-5xl font-bold mb-6">
          AI-powered procurement for modern teams
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Source vendors, compare quotes, manage approvals, and streamline purchasing —
          all in one platform.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push("/pricing")}
            className="px-6 py-3 bg-black text-white rounded-lg text-lg"
          >
            Start Free Trial
          </button>

          <button
            onClick={() => router.push("/pricing")}
            className="px-6 py-3 border rounded-lg text-lg"
          >
            View Pricing
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">

          <div className="p-6 bg-white rounded-xl border">
            <h3 className="font-semibold text-lg mb-2">
              AI sourcing
            </h3>
            <p className="text-gray-600">
              Automatically find and compare vendors in seconds.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border">
            <h3 className="font-semibold text-lg mb-2">
              Compare vendors
            </h3>
            <p className="text-gray-600">
              See pricing, reviews, and options side by side.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border">
            <h3 className="font-semibold text-lg mb-2">
              Smart approvals
            </h3>
            <p className="text-gray-600">
              Streamline approvals and manage purchasing workflows.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-12">How it works</h2>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">

          <div>
            <h3 className="font-semibold text-lg mb-2">1. Submit request</h3>
            <p className="text-gray-600">
              Tell Shuka what you need.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">2. AI finds vendors</h3>
            <p className="text-gray-600">
              Get multiple options instantly.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">3. Approve & manage</h3>
            <p className="text-gray-600">
              Track orders and streamline procurement.
            </p>
          </div>

        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="px-6 py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-10">Simple pricing</h2>

        <div className="flex justify-center">
          <div className="p-8 bg-white border rounded-xl w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-2">Starter</h3>
            <p className="text-3xl font-bold mb-4">$9/mo</p>

            <p className="text-gray-600 mb-6">
              AI sourcing, vendor comparison, and basic automation.
            </p>

            <button
              onClick={() => router.push("/pricing")}
              className="w-full py-3 bg-black text-white rounded-lg"
            >
              Start 7-Day Trial
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Start your free trial today
        </h2>

        <button
          onClick={() => router.push("/pricing")}
          className="px-8 py-4 bg-black text-white rounded-lg text-lg"
        >
          Get Started
        </button>
      </section>

    </div>
  );
}

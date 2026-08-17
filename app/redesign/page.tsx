"use client";

import { useState } from "react";

const styles = [
  {
    id: "modern",
    name: "Modern",
    emoji: "🏡",
    description: "Clean lines, structured beds, contemporary landscaping",
  },
  {
    id: "low-maintenance",
    name: "Low Maintenance",
    emoji: "🌿",
    description: "Easy-care plants, mulch, stone and simple layouts",
  },
  {
    id: "luxury",
    name: "Luxury",
    emoji: "✨",
    description: "Premium landscaping with dramatic visual impact",
  },
  {
    id: "natural",
    name: "Natural",
    emoji: "🌾",
    description: "Organic planting, native greenery and softer lines",
  },
  {
    id: "minimal",
    name: "Minimal",
    emoji: "◻️",
    description: "Simple, uncluttered and highly structured",
  },
];

export default function RedesignPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");

  const [selectedStyle, setSelectedStyle] =
    useState("modern");

  const [instructions, setInstructions] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload an image.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError(
        "Please choose an image smaller than 10 MB."
      );
      return;
    }

    setError("");
    setFile(selectedFile);

    const objectUrl =
      URL.createObjectURL(selectedFile);

    setPreview(objectUrl);
    setResult("");
  }

  async function generateRedesign() {
    if (!file) {
      setError(
        "Upload a photo of your yard first."
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const formData =
        new FormData();

      formData.append("image", file);

      formData.append(
        "style",
        selectedStyle
      );

      formData.append(
        "instructions",
        instructions
      );

      const response = await fetch(
        "/api/redesign",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not redesign image."
        );
      }

      setResult(data.image);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not generate redesign."
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview("");
    setResult("");
    setInstructions("");
    setError("");
  }

  return (
    <main className="min-h-screen bg-black text-white pb-24">

      <div className="mx-auto max-w-6xl px-5 py-12">

        {/* HEADER */}

        <section className="mb-12 text-center">

          <div className="mb-4 inline-flex rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-400">
            ✨ ShukAI Visualizer
          </div>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Redesign Your Yard
            <span className="text-yellow-400">
              {" "}with AI
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Upload a photo of your property and
            preview a completely redesigned
            landscape before hiring a pro.
          </p>

        </section>


        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">

          {/* LEFT */}

          <section>

            {!preview ? (
              <label className="flex min-h-[460px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-700 bg-zinc-950 p-8 text-center transition hover:border-yellow-400">

                <div className="mb-5 text-6xl">
                  📸
                </div>

                <h2 className="text-2xl font-black">
                  Upload Your Yard
                </h2>

                <p className="mt-3 max-w-sm text-zinc-500">
                  Take a clear photo showing as
                  much of the yard as possible.
                </p>

                <div className="mt-7 rounded-xl bg-yellow-400 px-6 py-3 font-black text-black">
                  Choose Photo
                </div>

                <p className="mt-4 text-xs text-zinc-600">
                  JPG, PNG or WEBP • Max 10 MB
                </p>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    handleFileChange
                  }
                />

              </label>
            ) : (

              <div className="space-y-6">

                {/* BEFORE */}

                <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">

                  <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">

                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                        Original
                      </div>

                      <div className="font-bold">
                        Your Yard
                      </div>
                    </div>

                    <button
                      onClick={reset}
                      className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-400 hover:text-white"
                    >
                      Change Photo
                    </button>

                  </div>

                  <img
                    src={preview}
                    alt="Original yard"
                    className="max-h-[650px] w-full object-contain"
                  />

                </div>


                {/* RESULT */}

                {loading && (

                  <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-yellow-400/20 bg-yellow-400/5">

                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-800 border-t-yellow-400" />

                    <div className="mt-6 text-xl font-black">
                      Redesigning your yard...
                    </div>

                    <p className="mt-2 text-zinc-500">
                      ShukAI is creating your
                      landscape concept.
                    </p>

                  </div>

                )}


                {result && !loading && (

                  <div className="overflow-hidden rounded-3xl border border-yellow-400/30 bg-zinc-950">

                    <div className="border-b border-zinc-800 px-5 py-4">

                      <div className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                        AI Redesign
                      </div>

                      <div className="font-bold">
                        Your New Yard
                      </div>

                    </div>

                    <img
                      src={result}
                      alt="AI redesigned yard"
                      className="max-h-[650px] w-full object-contain"
                    />

                    <div className="grid grid-cols-2 gap-3 p-5">

                      <button
                        onClick={
                          generateRedesign
                        }
                        className="rounded-xl border border-zinc-700 px-4 py-4 font-bold hover:border-yellow-400"
                      >
                        ↻ Try Again
                      </button>

                      <button
                        className="rounded-xl bg-yellow-400 px-4 py-4 font-black text-black hover:bg-yellow-300"
                      >
                        Get This Built
                      </button>

                    </div>

                  </div>

                )}

              </div>
            )}

          </section>


          {/* CONTROLS */}

          <aside className="h-fit rounded-3xl border border-zinc-800 bg-zinc-950 p-6 lg:sticky lg:top-28">

            <div className="mb-7">

              <div className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                Step 1
              </div>

              <h2 className="mt-2 text-2xl font-black">
                Choose a Style
              </h2>

            </div>


            <div className="space-y-3">

              {styles.map((style) => {

                const active =
                  selectedStyle ===
                  style.id;

                return (

                  <button
                    key={style.id}
                    type="button"
                    onClick={() =>
                      setSelectedStyle(
                        style.id
                      )
                    }
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-yellow-400 bg-yellow-400/10"
                        : "border-zinc-800 bg-black hover:border-zinc-600"
                    }`}
                  >

                    <div className="flex items-start gap-4">

                      <div className="text-2xl">
                        {style.emoji}
                      </div>

                      <div>

                        <div
                          className={`font-black ${
                            active
                              ? "text-yellow-400"
                              : "text-white"
                          }`}
                        >
                          {style.name}
                        </div>

                        <div className="mt-1 text-sm leading-5 text-zinc-500">
                          {style.description}
                        </div>

                      </div>

                    </div>

                  </button>

                );
              })}

            </div>


            <div className="mt-8">

              <div className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                Step 2
              </div>

              <label className="mt-2 block text-lg font-black">
                Anything specific?
              </label>

              <textarea
                value={instructions}
                onChange={(e) =>
                  setInstructions(
                    e.target.value
                  )
                }
                placeholder="Add a stone walkway, remove the bushes, add privacy trees, keep the existing patio..."
                className="mt-3 min-h-[130px] w-full rounded-2xl border border-zinc-800 bg-black p-4 text-sm text-white placeholder-zinc-600 outline-none focus:border-yellow-400"
              />

            </div>


            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}


            <button
              onClick={generateRedesign}
              disabled={
                !file || loading
              }
              className="mt-7 w-full rounded-2xl bg-yellow-400 py-5 text-lg font-black text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading
                ? "Creating Redesign..."
                : "✨ Redesign My Yard"}
            </button>


            <p className="mt-4 text-center text-xs leading-5 text-zinc-600">
              AI concepts are visual estimates.
              Final designs, measurements and
              construction requirements should
              be confirmed with your landscaper.
            </p>

          </aside>

        </div>

      </div>

    </main>
  );
}

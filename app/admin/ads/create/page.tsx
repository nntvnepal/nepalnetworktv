"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AD_PLACEMENTS } from "@/lib/adPlacements";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function CreateAd() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    link: "",
    placement: "homepage_top",
    type: "image",
    adsenseCode: "",
    startDate: "",
    endDate: "",
    priority: 1,
    totalBudget: "",
    cpc: "",
    maxClicks: "",
    status: "active",
  });

  const selectedPlacement = useMemo(() => {
    return AD_PLACEMENTS.find((p) => p.value === form.placement);
  }, [form.placement]);

  const handleImageUpload = async (e: any) => {

    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    }

    setUploading(false);
  };

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    if (!form.title) return alert("Ad title required");

    if (form.type === "image" && !form.imageUrl)
      return alert("Upload image");

    if (form.type === "adsense" && !form.adsenseCode)
      return alert("Paste adsense code");

    setLoading(true);

    const res = await fetch("/api/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        totalBudget: form.totalBudget ? Number(form.totalBudget) : null,
        cpc: form.cpc ? Number(form.cpc) : null,
        maxClicks: form.maxClicks ? Number(form.maxClicks) : null,
        priority: Number(form.priority),
      }),
    });

    setLoading(false);

    if (res.ok) router.push("/admin/ads");
    else alert("Ad creation failed");
  };

  return (
    <div className="p-10 text-white max-w-3xl">

      <h1 className="text-3xl font-bold mb-8">
        Create Advertisement
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        <input
          required
          placeholder="Ad Title"
          className="w-full p-3 bg-gray-800 rounded"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <select
          className="w-full p-3 bg-gray-800 rounded"
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="image">Image Ad</option>
          <option value="adsense">Adsense Code</option>
        </select>

        {/* Placement */}

        <select
          className="w-full p-3 bg-gray-800 rounded"
          value={form.placement}
          onChange={(e) =>
            setForm({ ...form, placement: e.target.value })
          }
        >
          {AD_PLACEMENTS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label} ({p.size})
            </option>
          ))}
        </select>

        {selectedPlacement && (
          <div className="bg-gray-800 p-3 rounded text-sm">
            Recommended size: {selectedPlacement.size}
          </div>
        )}

        {/* Image Upload */}

        {form.type === "image" && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-3 bg-gray-800 rounded"
            />

            {uploading && <p>Uploading image...</p>}

            {form.imageUrl && (
              <img
                src={form.imageUrl}
                className="max-h-40 border rounded"
              />
            )}

            <input
              placeholder="Target URL"
              className="w-full p-3 bg-gray-800 rounded"
              value={form.link}
              onChange={(e) =>
                setForm({ ...form, link: e.target.value })
              }
            />
          </>
        )}

        {form.type === "adsense" && (
          <textarea
            placeholder="Paste Adsense Code"
            className="w-full p-3 bg-gray-800 rounded h-32"
            value={form.adsenseCode}
            onChange={(e) =>
              setForm({ ...form, adsenseCode: e.target.value })
            }
          />
        )}

        <input
          type="date"
          className="w-full p-3 bg-gray-800 rounded"
          value={form.startDate}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
        />

        <input
          type="date"
          className="w-full p-3 bg-gray-800 rounded"
          value={form.endDate}
          onChange={(e) =>
            setForm({ ...form, endDate: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Priority"
          className="w-full p-3 bg-gray-800 rounded"
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: Number(e.target.value) })
          }
        />

        <input
          type="number"
          placeholder="Budget"
          className="w-full p-3 bg-gray-800 rounded"
          value={form.totalBudget}
          onChange={(e) =>
            setForm({ ...form, totalBudget: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="CPC"
          className="w-full p-3 bg-gray-800 rounded"
          value={form.cpc}
          onChange={(e) =>
            setForm({ ...form, cpc: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Max Clicks"
          className="w-full p-3 bg-gray-800 rounded"
          value={form.maxClicks}
          onChange={(e) =>
            setForm({ ...form, maxClicks: e.target.value })
          }
        />

        <button
          disabled={loading}
          className="bg-orange-500 px-8 py-3 rounded hover:bg-orange-600 transition"
        >
          {loading ? "Creating..." : "Create Ad"}
        </button>

      </form>

    </div>
  );
}
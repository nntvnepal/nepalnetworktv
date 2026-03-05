"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function EditForm({ ad }: any) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: ad.title,
    imageUrl: ad.imageUrl,
    targetUrl: ad.targetUrl,
    status: ad.status,
  });

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  // 🎯 Size from DB size field (better than placement switch)
  const [width, height] = ad.size.split("x").map(Number);

  const ctr =
    ad.views > 0
      ? ((ad.clicks / ad.views) * 100).toFixed(2)
      : "0.00";

  // 🔥 Upload to Cloudinary
  async function handleImageUpload(file: File) {
    setError("");

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      if (img.width !== width || img.height !== height) {
        setError(`Image must be exactly ${width}x${height}px`);
        return;
      }

      setUploading(true);
      setProgress(0);

      const data = new FormData();
      data.append("file", file);
      data.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round(
            (event.loaded / event.total) * 100
          );
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        const res = JSON.parse(xhr.responseText);
        setForm((prev) => ({
          ...prev,
          imageUrl: res.secure_url,
        }));
        setUploading(false);
      };

      xhr.onerror = () => {
        setError("Upload failed. Try again.");
        setUploading(false);
      };

      xhr.send(data);
    };

    img.src = objectUrl;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    await fetch(`/api/ads/${ad._id}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/admin/ads");
    router.refresh();
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this ad?"
    );
    if (!confirmDelete) return;

    await fetch(`/api/ads/${ad._id}/delete`, {
      method: "DELETE",
    });

    router.push("/admin/ads");
    router.refresh();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12">

      {/* LEFT - FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="text-sm text-gray-400">
            Ad Title
          </label>
          <input
            className="w-full p-3 bg-gray-800 rounded mt-2"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">
            Target URL
          </label>
          <input
            className="w-full p-3 bg-gray-800 rounded mt-2"
            value={form.targetUrl}
            onChange={(e) =>
              setForm({ ...form, targetUrl: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">
            Status
          </label>
          <select
            className="w-full p-3 bg-gray-800 rounded mt-2"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>

        {/* Upload */}
        <div>
          <label className="text-sm text-gray-400">
            Replace Image ({width}x{height})
          </label>

          <label className="block mt-2 cursor-pointer bg-gray-800 p-4 rounded text-center hover:bg-gray-700 transition">
            {uploading
              ? `Uploading ${progress}%`
              : "Click to Upload Image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files &&
                handleImageUpload(e.target.files[0])
              }
            />
          </label>

          {uploading && (
            <div className="w-full bg-gray-700 h-2 mt-3 rounded">
              <div
                className="bg-orange-500 h-2 rounded transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm mt-2">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button className="bg-orange-500 px-6 py-3 rounded hover:bg-orange-600 transition">
            Update Ad
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 px-6 py-3 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </form>

      {/* RIGHT - PREVIEW */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Live Preview
        </h3>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">

          <div className="text-xs text-gray-500 uppercase mb-2">
            Advertisement
          </div>

          <div className="flex justify-center">
            <div
              className="bg-gray-800 rounded overflow-hidden flex items-center justify-center"
              style={{
                width: "100%",
                maxWidth: width,
                height: height,
              }}
            >
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="object-contain"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                />
              ) : (
                <span className="text-gray-500 text-sm">
                  No Image
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-400">
            Target: {form.targetUrl || "—"}
          </div>

          <div className="mt-2">
            Status:{" "}
            <span
              className={
                form.status === "active"
                  ? "text-green-400"
                  : "text-yellow-400"
              }
            >
              {form.status}
            </span>
          </div>

          <div className="mt-3 text-sm text-gray-400">
            Views: {ad.views} | Clicks: {ad.clicks}
          </div>

          <div className="mt-1 text-orange-400 font-semibold">
            CTR: {ctr}%
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Editor from "@/components/Editor";
export const dynamic = "force-dynamic";
export const revalidate = 0;
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

export default function CreatePost() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const typeFromUrl = searchParams.get("type") || "news";

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [slugLocked, setSlugLocked] = useState(true);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    categoryId: "",
    postType: typeFromUrl,

    breaking: false,
    flash: false,
    featured: false,

    breakingPriority: 0,
    flashPriority: 0,

    status: "pending",
    videoUrl: "",

    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",

    images: [] as string[],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (form.title && slugLocked) {
      setForm((prev) => ({
        ...prev,
        slug: generateSlug(prev.title),
        metaTitle: prev.metaTitle || prev.title,
      }));
    }
  }, [form.title, slugLocked]);

  useEffect(() => {
    if (form.content && !form.metaDescription) {
      const text = form.content.replace(/<[^>]+>/g, "");
      setForm((prev) => ({
        ...prev,
        metaDescription: text.substring(0, 155),
      }));
    }
  }, [form.content]);

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (files: FileList) => {
    if (files.length + form.images.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setUploading(true);
    setError("");

    const uploaded: string[] = [];

    for (let file of Array.from(files)) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Each image must be under 2MB");
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        uploaded.push(data.secure_url);
      }
    }

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...uploaded],
    }));

    setUploading(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    if (!form.title || !form.content || !form.categoryId) {
      setError("Title, Content and Category are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setMessage("Post created successfully 🎉 Redirecting...");

      if (data?.category?.slug) {
        setTimeout(() => {
          router.push(`/${data.category.slug}/${data.slug}`);
        }, 1000);
      } else {
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch {
      setError("Failed to create post");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-2">
        Create {typeFromUrl.charAt(0).toUpperCase() + typeFromUrl.slice(1)} Post
      </h1>

      <p className="text-orange-500 mb-6">Post Type: {typeFromUrl}</p>

      {message && (
        <div className="bg-green-600 p-3 mb-4 rounded">{message}</div>
      )}

      {error && (
        <div className="bg-red-600 p-3 mb-4 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-8">

        <div className="col-span-2 space-y-6">

          <input
            type="text"
            placeholder="Headline"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full p-4 bg-slate-800 rounded text-lg font-semibold focus:ring-2 ring-orange-500"
          />

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Slug"
              value={form.slug}
              onChange={(e) =>
                setForm({ ...form, slug: e.target.value })
              }
              className="w-full p-3 bg-slate-800 rounded"
            />

            <button
              type="button"
              onClick={() => setSlugLocked(!slugLocked)}
              className="px-4 bg-slate-700 rounded"
            >
              {slugLocked ? "Auto" : "Manual"}
            </button>

          </div>

          <div className="bg-white rounded text-black">
            <Editor
              value={form.content}
              onChange={(value: string) =>
                setForm({ ...form, content: value })
              }
            />
          </div>

          <input
            type="text"
            placeholder="Video URL"
            value={form.videoUrl}
            onChange={(e) =>
              setForm({ ...form, videoUrl: e.target.value })
            }
            className="w-full p-3 bg-slate-800 rounded"
          />

          <div>
            <label className="block mb-2 font-semibold">
              Upload Images (Max 5)
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleImageUpload(e.target.files)
              }
            />

            {uploading && (
              <p className="text-yellow-400 mt-2">Uploading...</p>
            )}

            <div className="flex gap-4 mt-4 flex-wrap">
              {form.images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    className="w-28 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-slate-900 p-6 rounded-xl sticky top-6 h-fit">

          <h2 className="font-bold text-lg">Publishing</h2>

          <select
            value={form.categoryId}
            onChange={(e) =>
              setForm({ ...form, categoryId: e.target.value })
            }
            className="w-full p-3 bg-slate-800 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            className="w-full p-3 bg-slate-800 rounded"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="draft">Draft</option>
            <option value="rejected">Rejected</option>
          </select>

          <label className="flex justify-between">
            Breaking News
            <input
              type="checkbox"
              checked={form.breaking}
              onChange={(e) =>
                setForm({ ...form, breaking: e.target.checked })
              }
            />
          </label>

          <label className="flex justify-between">
            Flash News
            <input
              type="checkbox"
              checked={form.flash}
              onChange={(e) =>
                setForm({ ...form, flash: e.target.checked })
              }
            />
          </label>

          <label className="flex justify-between">
            Featured
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm({ ...form, featured: e.target.checked })
              }
            />
          </label>

          <input
            type="number"
            placeholder="Breaking Priority"
            value={form.breakingPriority}
            onChange={(e) =>
              setForm({ ...form, breakingPriority: Number(e.target.value) })
            }
            className="w-full p-3 bg-slate-800 rounded"
          />

          <input
            type="number"
            placeholder="Flash Priority"
            value={form.flashPriority}
            onChange={(e) =>
              setForm({ ...form, flashPriority: Number(e.target.value) })
            }
            className="w-full p-3 bg-slate-800 rounded"
          />

          <hr className="border-slate-700" />

          <h2 className="font-bold text-lg">SEO Settings</h2>

          <input
            type="text"
            placeholder="Meta Title"
            value={form.metaTitle}
            onChange={(e) =>
              setForm({ ...form, metaTitle: e.target.value })
            }
            className="w-full p-3 bg-slate-800 rounded"
          />

          <textarea
            placeholder="Meta Description"
            value={form.metaDescription}
            maxLength={160}
            onChange={(e) =>
              setForm({ ...form, metaDescription: e.target.value })
            }
            className="w-full p-3 bg-slate-800 rounded"
          />

          <p className="text-xs text-gray-400">
            {form.metaDescription.length}/160 characters
          </p>

          <input
            type="text"
            placeholder="Meta Keywords"
            value={form.metaKeywords}
            onChange={(e) =>
              setForm({ ...form, metaKeywords: e.target.value })
            }
            className="w-full p-3 bg-slate-800 rounded"
          />

          <button
            disabled={loading}
            className="w-full bg-orange-600 py-3 rounded-lg hover:opacity-90 transition font-semibold"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>

        </div>

      </form>
    </div>
  );
}
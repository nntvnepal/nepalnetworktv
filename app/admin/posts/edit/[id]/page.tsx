"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function EditPost() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    content: "",
    images: [] as string[],
    videoUrl: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!id) return;

    fetch(`/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setForm({
            title: data.article.title || "",
            content: data.article.content || "",
            images: data.article.images || [],
            videoUrl: data.article.videoUrl || "",
            seoTitle: data.article.seoTitle || "",
            seoDescription: data.article.seoDescription || "",
            seoKeywords: data.article.seoKeywords || "",
          });
        }
      });
  }, [id]);

  /* ================= CLOUDINARY UPLOAD ================= */

  const uploadImage = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "YOUR_UPLOAD_PRESET");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();

    setForm({
      ...form,
      images: [...form.images, result.secure_url],
    });
  };

  /* ================= SEO AUTO ================= */

  const autoSEO = () => {
    setForm({
      ...form,
      seoTitle: form.title,
      seoDescription: form.content.replace(/<[^>]*>?/gm, "").slice(0, 160),
      seoKeywords: form.title.split(" ").join(", "),
    });
  };

  /* ================= UPDATE ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(`/api/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Updated Successfully ✅");
      router.push("/admin/posts");
    } else {
      alert("Update Failed ❌");
    }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">

        {/* TITLE */}
        <input
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full p-3 rounded bg-white text-black"
          placeholder="Title"
        />

        {/* CONTENT */}
        <textarea
          value={form.content}
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
          rows={8}
          className="w-full p-3 rounded bg-white text-black"
          placeholder="Content"
        />

        {/* IMAGE UPLOAD */}
        <div>
          <h3 className="font-semibold mb-2">Upload Images</h3>

          <input
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                uploadImage(e.target.files[0]);
              }
            }}
          />

          <div className="flex gap-4 mt-3 flex-wrap">
            {form.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="preview"
                className="w-40 h-28 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        {/* VIDEO */}
        <input
          value={form.videoUrl}
          onChange={(e) =>
            setForm({ ...form, videoUrl: e.target.value })
          }
          className="w-full p-3 rounded bg-white text-black"
          placeholder="Video URL"
        />

        {/* SEO */}
        <div className="border-t border-gray-700 pt-4 space-y-3">
          <h3 className="text-lg font-semibold">SEO</h3>

          <button
            type="button"
            onClick={autoSEO}
            className="bg-purple-600 px-4 py-1 rounded"
          >
            Auto Generate SEO
          </button>

          <input
            value={form.seoTitle}
            onChange={(e) =>
              setForm({ ...form, seoTitle: e.target.value })
            }
            className="w-full p-3 rounded bg-white text-black"
            placeholder="SEO Title"
          />

          <textarea
            value={form.seoDescription}
            onChange={(e) =>
              setForm({ ...form, seoDescription: e.target.value })
            }
            rows={3}
            className="w-full p-3 rounded bg-white text-black"
            placeholder="SEO Description"
          />

          <input
            value={form.seoKeywords}
            onChange={(e) =>
              setForm({ ...form, seoKeywords: e.target.value })
            }
            className="w-full p-3 rounded bg-white text-black"
            placeholder="SEO Keywords"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 px-6 py-2 rounded"
        >
          Update Article
        </button>
      </form>
    </div>
  );
}
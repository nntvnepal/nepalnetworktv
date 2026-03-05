"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import imageCompression from "browser-image-compression";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

import "react-quill/dist/quill.snow.css";

export default function CreateEditorial() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [approved, setApproved] = useState(true);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= SEO AUTO ================= */

  const autoGenerateSEO = () => {
    const plain = content.replace(/<[^>]+>/g, "");
    setMetaTitle(title);
    setMetaDescription(plain.slice(0, 160));
    setMetaKeywords(title.split(" ").join(", "));
  };

  /* ================= IMAGE COMPRESS ================= */

  const handleImages = async (e: any) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    const compressed: File[] = [];
    const previews: string[] = [];

    for (let file of files as File[]) {
      const result = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });

      compressed.push(result);
      previews.push(URL.createObjectURL(result));
    }

    setImages(compressed);
    setPreview(previews);
  };

  /* ================= CLOUDINARY UPLOAD ================= */

  const uploadToCloudinary = async () => {
    const urls: string[] = [];

    for (let img of images) {
      const formData = new FormData();
      formData.append("file", img);
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

      if (!data.secure_url) {
        console.error(data);
        throw new Error("Image upload failed");
      }

      urls.push(data.secure_url);
    }

    return urls;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and Content required");
      return;
    }

    try {
      setLoading(true);

      const imageUrls = await uploadToCloudinary();

      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          videoUrl,
          images: imageUrls,
          isEditorial: true,
          status: approved ? "approved" : "pending",
          metaTitle: metaTitle || title,
          metaDescription:
            metaDescription ||
            content.replace(/<[^>]+>/g, "").slice(0, 160),
          metaKeywords: metaKeywords || title,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed");
      }

      alert("Editorial Created Successfully 🚀");

      // Reset
      setTitle("");
      setContent("");
      setVideoUrl("");
      setImages([]);
      setPreview([]);
      setMetaTitle("");
      setMetaDescription("");
      setMetaKeywords("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#0f172a] text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">
        Create Editorial
      </h1>

      <div className="grid grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="col-span-2 space-y-6">

          <input
            placeholder="Title"
            className="w-full bg-[#1e293b] p-3 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="bg-white text-black rounded">
            <ReactQuill value={content} onChange={setContent} />
          </div>

          <input
            placeholder="Video URL"
            className="w-full bg-[#1e293b] p-3 rounded"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          <div>
            <input type="file" multiple onChange={handleImages} />

            <div className="flex gap-4 mt-4 flex-wrap">
              {preview.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">

          <div className="bg-[#1e293b] p-6 rounded-xl">
            <h2 className="font-semibold mb-4">
              Publishing
            </h2>

            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={approved}
                onChange={() => setApproved(!approved)}
              />
              Approved
            </label>

            <button
              onClick={handleSubmit}
              className="w-full bg-orange-600 py-2 mt-6 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Publishing..." : "Create Editorial"}
            </button>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-xl space-y-4">
            <div className="flex justify-between">
              <h2 className="font-semibold">
                SEO Settings
              </h2>
              <button
                onClick={autoGenerateSEO}
                className="text-sm bg-gray-600 px-3 rounded"
              >
                Auto
              </button>
            </div>

            <input
              placeholder="Meta Title"
              className="w-full bg-[#0f172a] p-2 rounded"
              value={metaTitle}
              onChange={(e) =>
                setMetaTitle(e.target.value)
              }
            />

            <textarea
              placeholder="Meta Description"
              className="w-full bg-[#0f172a] p-2 rounded"
              value={metaDescription}
              onChange={(e) =>
                setMetaDescription(e.target.value)
              }
            />

            <input
              placeholder="Meta Keywords"
              className="w-full bg-[#0f172a] p-2 rounded"
              value={metaKeywords}
              onChange={(e) =>
                setMetaKeywords(e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
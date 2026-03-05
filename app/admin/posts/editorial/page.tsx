"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function EditorialDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEditorial();
  }, []);

  const fetchEditorial = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "/api/articles?status=approved&editorial=true"
      );
      const data = await res.json();
      setPosts(data.articles || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 text-white bg-[#0f172a] min-h-screen">
      <h1 className="text-3xl font-bold mb-8">
        Editorial Dashboard
      </h1>

      <div className="mb-6">
        <Link
          href="/admin/posts/editorial/create"
          className="bg-purple-600 px-4 py-2 rounded"
        >
          + Create Editorial
        </Link>
      </div>

      <div className="overflow-x-auto bg-[#1e293b] rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[#0f172a]">
            <tr>
              <th className="p-3">Title</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-6">
                  No Editorial Posts
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-t border-gray-700"
                >
                  <td className="p-3">{post.title}</td>

                  <td>
                    <span className="bg-green-600 px-2 py-1 rounded text-xs">
                      {post.status}
                    </span>
                  </td>

                  <td>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>

                  <td className="space-x-3">
                    <Link
                      href={`/admin/posts/edit/${post.id}`}
                      className="text-blue-400"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/article/${post.slug}`}
                      target="_blank"
                      className="text-green-400"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"use client";

import { useRouter } from "next/navigation";

const FREE_LIMIT = 3;

type Story = {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
};

export default function StoryCard({ story }: { story: Story }) {
  const router = useRouter();

  const handleClick = () => {
    try {
      const count = Number(localStorage.getItem("stories_read") || 0);

      if (count >= FREE_LIMIT) {
        alert("🔒 Please login or subscribe to continue");
        return;
      }

      localStorage.setItem("stories_read", String(count + 1));

      router.push(`/kids/stories/${story.id}`);
    } catch (err) {
      console.error("Story click error:", err);
    }
  };

  return (
    <div className="bg-orange-100 border border-orange-300 rounded-2xl p-4 shadow-md hover:shadow-xl transition">

      <img
        src={story.thumbnail}
        alt={story.title}
        className="w-full h-40 object-cover rounded-xl mb-4"
      />

      <h3 className="text-lg font-bold text-center mb-1">
        {story.title}
      </h3>

      <p className="text-center text-gray-600 text-sm mb-2">
        ⏱ {story.duration || "2 min"}
      </p>

      <div className="flex justify-center gap-1 mb-4 text-yellow-500">
        ⭐ ⭐ ⭐
      </div>

      <button
        onClick={handleClick}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-full transition"
      >
        ▶ Start Story
      </button>

    </div>
  );
}
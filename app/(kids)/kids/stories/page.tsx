"use client";

import { useState, useEffect } from "react";
import { stories } from "./data/stories";
import StoryCard from "@/components/kids/story/StoryCard";

import {
  BookOpen,
  Star,
  Smile,
  Brain,
  Dog,
  Moon,
  Sparkles,
  ScrollText,
} from "lucide-react";

const categories = [
  { name: "All", icon: BookOpen, color: "from-indigo-500 to-blue-500" },
  { name: "Moral", icon: Star, color: "from-green-500 to-emerald-500" },
  { name: "Fun", icon: Smile, color: "from-pink-500 to-rose-500" },
  { name: "Learning", icon: Brain, color: "from-yellow-500 to-orange-500" },
  { name: "Animal", icon: Dog, color: "from-purple-500 to-violet-500" },
  { name: "Bedtime", icon: Moon, color: "from-sky-500 to-cyan-500" },
  { name: "Spiritual", icon: Sparkles, color: "from-orange-500 to-amber-500" },
  { name: "Mini", icon: ScrollText, color: "from-teal-500 to-cyan-500" },
];

const FREE_LIMIT = 3;

export default function StoriesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [readCount, setReadCount] = useState(0);

  useEffect(() => {
    const count = Number(localStorage.getItem("stories_read") || 0);
    setReadCount(count);
  }, []);

  const filteredStories =
    activeCategory === "All"
      ? stories
      : stories.filter((s) => s.category === activeCategory);

  return (
    <div className="w-full px-8 py-6 flex gap-8">

      {/* 🟢 LEFT SIDEBAR */}
      <div className="w-56 flex flex-col gap-4">

        {categories.map((cat) => {
          const active = activeCategory === cat.name;
          const Icon = cat.icon;

          return (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl font-semibold
                bg-gradient-to-r ${cat.color}
                text-white transition-all duration-300
                ${
                  active
                    ? "shadow-xl scale-105 ring-2 ring-white"
                    : "opacity-90 hover:scale-105 hover:shadow-md"
                }
              `}
            >
              <Icon size={18} />
              {cat.name}
            </button>
          );
        })}

      </div>

      {/* 🔵 CENTER CONTENT */}
      <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl min-h-[550px]">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen size={26} />
            Stories
          </h2>

          <div className="text-sm text-gray-600 bg-white px-4 py-1 rounded-full shadow">
            {readCount}/{FREE_LIMIT} Free
          </div>
        </div>

        {/* STORIES */}
        <div className="flex flex-wrap gap-6">

          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="w-[260px] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <StoryCard story={story} />
            </div>
          ))}

          {/* 🔒 LOCK CARD */}
          {readCount >= FREE_LIMIT && (
            <div className="w-[260px] bg-white rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-center shadow-sm">

              <div className="text-4xl mb-3">🔒</div>

              <p className="font-semibold mb-2">
                Unlock Premium Stories
              </p>

              <p className="text-sm text-gray-500 mb-4">
                Access 10,000+ stories
              </p>

              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition">
                Subscribe
              </button>

            </div>
          )}

        </div>

      </div>

      {/* 🟡 RIGHT PANEL */}
      <div className="w-80 flex flex-col gap-5">

        {/* CONTINUE */}
        <div className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition">
          <h3 className="font-bold mb-2 text-gray-800">
            Continue Reading
          </h3>
          <p className="text-sm text-gray-500">
            The Brave Little Bird
          </p>
          <button className="mt-3 text-green-600 font-semibold hover:underline">
            Resume →
          </button>
        </div>

        {/* STORY OF DAY */}
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-5 shadow">
          <h3 className="font-bold mb-2 text-gray-800">
            Story of the Day
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            A tiny bird showed courage during a storm...
          </p>
          <button className="text-sm bg-orange-500 text-white px-3 py-1 rounded-full">
            Read Now
          </button>
        </div>

        {/* REWARD */}
        <div className="bg-white rounded-2xl p-5 shadow">
          <h3 className="font-bold mb-2 text-gray-800">
            Earn Rewards
          </h3>

          <p className="text-sm text-gray-500 mb-3">
            Read 3 stories to earn coins
          </p>

          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${(readCount / FREE_LIMIT) * 100}%` }}
            />
          </div>
        </div>

        {/* PREMIUM CTA */}
        <div className="bg-green-100 rounded-2xl p-5 text-center shadow">
          <p className="font-semibold mb-2">
            Premium Stories
          </p>

          <p className="text-sm mb-3">
            Panchatantra, Mythology & more
          </p>

          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition">
            Unlock Now
          </button>
        </div>

      </div>

    </div>
  );
}
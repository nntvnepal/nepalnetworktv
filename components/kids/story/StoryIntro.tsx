"use client";

export default function StoryIntro({ story, onStart }: any) {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">

      {/* 🔥 CARD */}
      <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-5 rounded-2xl shadow-xl w-full max-w-[320px] text-center border-2 border-orange-300">

        {/* IMAGE */}
        <img
          src={story.thumbnail}
          alt="story"
          className="w-[180px] h-[140px] object-cover mx-auto rounded-xl mb-4 border-2 border-white shadow"
        />

        {/* TITLE */}
        <h2 className="text-lg font-bold mb-1">
          {story.title}
        </h2>

        {/* DURATION */}
        <p className="text-sm text-gray-600 mb-4">
          ⏱ {story.duration || "2 min story"}
        </p>

        {/* ⭐ OPTIONAL STARS */}
        <div className="flex justify-center gap-1 mb-4">
          <span>⭐</span>
          <span>⭐</span>
          <span>⭐</span>
        </div>

        {/* ▶ START BUTTON */}
        <button
          onClick={onStart}
          className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-xl shadow"
        >
          ▶ Start Story
        </button>
      </div>
    </div>
  );
}
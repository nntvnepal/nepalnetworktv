"use client";

import { useEffect, useState } from "react";

export default function StoryPlayer({ story }: any) {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [fade, setFade] = useState(false);
  const [flip, setFlip] = useState(false);

  const scene = story.scenes[index];
  const fullText = Array.isArray(scene.text)
    ? scene.text.join(" ")
    : scene.text;

  const progress = ((index + 1) / story.scenes.length) * 100;

  // ✨ TYPEWRITER
  useEffect(() => {
    setDisplayText("");
    setFade(false);

    let i = 0;

    const typing = setInterval(() => {
      setDisplayText(fullText.slice(0, i));
      i++;

      if (i > fullText.length) {
        clearInterval(typing);

        // 🌫️ fade after typing
        setTimeout(() => setFade(true), 300);
      }
    }, 20);

    return () => clearInterval(typing);
  }, [index]);

  // 📖 PAGE FLIP
  const goNext = () => {
    if (index < story.scenes.length - 1) {
      setFlip(true);
      setTimeout(() => {
        setIndex(index + 1);
        setFlip(false);
      }, 250);
    }
  };

  const goBack = () => {
    if (index > 0) {
      setFlip(true);
      setTimeout(() => {
        setIndex(index - 1);
        setFlip(false);
      }, 250);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">

      {/* 🔥 ROTATING GLOW RING */}
      <div className="relative">

        <div className="absolute inset-0 rounded-2xl border-2 border-green-300 animate-spinSlow opacity-30"></div>

        {/* 📦 CARD */}
        <div
          className={`relative bg-white rounded-xl p-6 shadow-xl w-[500px] transition-all duration-300 ${
            flip ? "opacity-0 translate-x-6" : "opacity-100"
          }`}
        >
          {/* TITLE */}
          <div className="bg-gradient-to-r from-green-600 to-teal-500 text-white text-center py-2 rounded-md mb-4">
            <h1 className="text-lg font-semibold">{story.title}</h1>
          </div>

          {/* 🐦 IMAGE */}
          {scene.image && (
            <img
              src={scene.image}
              alt="story"
              className="mx-auto w-[250px] h-[190px] object-cover rounded-lg mb-4 shadow float"
            />
          )}

          {/* TEXT */}
          <p
            className={`comicFont text-[17px] text-gray-800 leading-relaxed text-center min-h-[60px] transition-all duration-500 ${
              fade ? "opacity-100 scale-100" : "opacity-90"
            }`}
          >
            {displayText}
          </p>

          {/* PROGRESS */}
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-green-500 to-teal-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* LEFT */}
          {index > 0 && (
            <button
              onClick={goBack}
              className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-green-500 text-white w-10 h-10 rounded-full shadow-lg hover:scale-110 active:scale-95 transition"
            >
              ←
            </button>
          )}

          {/* RIGHT */}
          <button
            onClick={goNext}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-green-500 text-white w-10 h-10 rounded-full shadow-lg hover:scale-110 active:scale-95 transition"
          >
            →
          </button>
        </div>
      </div>

      {/* 🎨 ANIMATIONS */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }

        .float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spinSlow {
          animation: spinSlow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
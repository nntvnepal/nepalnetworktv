"use client";

import { useState } from "react";
import { stories } from "../data/stories";
import StoryPlayer from "@/components/kids/story/StoryPlayer";
import StoryIntro from "@/components/kids/story/StoryIntro";

export default function StoryPage({ params }: any) {
  const story = stories.find((s) => s.id === params.id);
  const [started, setStarted] = useState(false);

  if (!story) return <div>Story not found</div>;

  return (
    <>
      {!started ? (
        <StoryIntro story={story} onStart={() => setStarted(true)} />
      ) : (
        <StoryPlayer story={story} />
      )}
    </>
  );
}
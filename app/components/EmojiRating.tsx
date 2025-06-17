"use client";

import { useState } from "react";

interface EmojiRatingProps {
  onRatingSelect: (rating: number) => void;
  selectedRating?: number;
}

// const emojis = ["😞", "😐", "🙂", "😊", "😄"];
const emojis = ["😞", "🙂", "😄"];

export default function EmojiRating({
  onRatingSelect,
  selectedRating,
}: EmojiRatingProps) {
  return (
    <div className="flex justify-center gap-6 py-4">
      {emojis.map((emoji, index) => {
        const isSelected = selectedRating === index + 1;
        return (
          <button
            key={index}
            type="button"
            className={`text-6xl p-4 transition-all rounded-full
              ${
                isSelected
                  ? "bg-blue-100 border-4 border-blue-500 scale-125"
                  : ""
              }`}
            onClick={(e) => {
              e.preventDefault();
              onRatingSelect(index + 1);
            }}
            aria-label={`Rate ${index + 1} out of 5`}
          >
            {emoji}
          </button>
        );
      })}
    </div>
  );
}

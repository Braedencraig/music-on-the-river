"use client";

import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase";
import EmojiRating from "./EmojiRating";

interface SurveyFormProps {
  concertDate: string;
}

export default function SurveyForm({ concertDate }: SurveyFormProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  // Reset form after 3 seconds on success
  useEffect(() => {
    if (submitStatus === "success") {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
        setRating(null);
        setFeedback("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("survey_responses").insert([
        {
          concert_date: concertDate,
          rating,
          feedback: feedback || null,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setSubmitStatus("success");
    } catch (error) {
      console.error("Error submitting survey:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {submitStatus === "success" && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-12 text-center max-w-md mx-4 transform transition-all">
            <h2 className="text-4xl font-bold text-green-600 mb-6">
              Thank you for your feedback!
            </h2>
            <p className="text-xl text-gray-600">
              Your response has been recorded.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">How was your experience?</h2>
          <EmojiRating
            onRatingSelect={setRating}
            selectedRating={rating ?? undefined}
          />
        </div>

        <div>
          <label
            htmlFor="feedback"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Additional Feedback (optional)
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Share your thoughts about the concert..."
          />
        </div>

        <button
          type="submit"
          disabled={!rating || isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Survey"}
        </button>

        {submitStatus === "error" && (
          <p className="text-red-600 text-center">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </>
  );
}

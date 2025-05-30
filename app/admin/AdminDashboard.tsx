"use client";

import { useState } from "react";

const RATING_EMOJIS = ["😞", "😐", "🙂", "😊", "😄"] as const;
const VALID_HOURS = [16, 17, 18, 19, 20, 21]; // 4 PM to 9 PM

interface SurveyResponse {
  id: string;
  concert_date: string;
  rating: number;
  feedback: string | null;
  created_at: string | null;
}

interface AggregatedData {
  date: string;
  totalResponses: number;
  averageRating: number;
  ratingDistribution: number[];
  feedback: string[];
  hourlyData: {
    [hour: string]: {
      total: number;
      ratings: number[];
      feedback: string[];
      responses: SurveyResponse[];
    };
  };
}

interface AdminDashboardProps {
  responses: SurveyResponse[];
}

export default function AdminDashboard({ responses }: AdminDashboardProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<{
    hour: string;
    responses: SurveyResponse[];
  } | null>(null);

  // Aggregate data by concert date and hour
  const aggregatedData = responses.reduce(
    (acc: { [key: string]: AggregatedData }, response: SurveyResponse) => {
      // Use concert_date for the date display
      const date = new Date(response.concert_date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Use current time if created_at is NULL
      const responseTime = response.created_at
        ? new Date(response.created_at)
        : new Date();
      let hour = responseTime.getHours();

      // If hour is after 9 PM, group it with 9 PM
      if (hour > 21) {
        hour = 21;
      }
      // If hour is before 4 PM, group it with 4 PM
      else if (hour < 16) {
        hour = 16;
      }

      const hourKey = `${hour}:00`;

      if (!acc[date]) {
        acc[date] = {
          date,
          totalResponses: 0,
          averageRating: 0,
          ratingDistribution: [0, 0, 0, 0, 0],
          feedback: [],
          hourlyData: {},
        };
      }

      if (!acc[date].hourlyData[hourKey]) {
        acc[date].hourlyData[hourKey] = {
          total: 0,
          ratings: [0, 0, 0, 0, 0],
          feedback: [],
          responses: [],
        };
      }

      // Update overall stats
      acc[date].totalResponses++;
      acc[date].averageRating += response.rating;
      acc[date].ratingDistribution[response.rating - 1]++;
      if (response.feedback) {
        acc[date].feedback.push(response.feedback);
      }

      // Update hourly stats
      acc[date].hourlyData[hourKey].total++;
      acc[date].hourlyData[hourKey].ratings[response.rating - 1]++;
      if (response.feedback) {
        acc[date].hourlyData[hourKey].feedback.push(response.feedback);
      }
      acc[date].hourlyData[hourKey].responses.push(response);

      return acc;
    },
    {}
  );

  // Calculate final averages
  Object.values(aggregatedData).forEach((data: AggregatedData) => {
    data.averageRating = data.averageRating / data.totalResponses;
  });

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "Time not recorded";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Survey Analytics
        </h1>

        <div className="space-y-8">
          {Object.values(aggregatedData).map((data: AggregatedData) => (
            <div key={data.date} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">{data.date}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Overall Summary</h3>
                  <div className="space-y-2">
                    <p>Total Responses: {data.totalResponses}</p>
                    <p>
                      Average Rating: {data.averageRating.toFixed(1)}{" "}
                      {RATING_EMOJIS[Math.round(data.averageRating) - 1]}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Overall Rating Distribution
                  </h3>
                  <div className="space-y-2">
                    {data.ratingDistribution.map(
                      (count: number, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="w-8">{RATING_EMOJIS[index]}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-4">
                            <div
                              className="bg-blue-500 h-4 rounded-full"
                              style={{
                                width: `${
                                  (count / data.totalResponses) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="w-12 text-right">{count}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-medium mb-4">Hourly Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {VALID_HOURS.map((hour) => {
                    const hourKey = `${hour}:00`;
                    const hourData = data.hourlyData[hourKey] || {
                      total: 0,
                      ratings: [0, 0, 0, 0, 0],
                      feedback: [],
                      responses: [],
                    };

                    return (
                      <div key={hourKey} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">
                          {hour === 21
                            ? "9:00 PM+"
                            : `${hour % 12 || 12}:00 ${
                                hour >= 12 ? "PM" : "AM"
                              }`}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Responses: {hourData.total}
                        </p>
                        <div className="space-y-1">
                          {hourData.ratings.map(
                            (count: number, index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="w-6">
                                  {RATING_EMOJIS[index]}
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-3">
                                  <div
                                    className="bg-blue-500 h-3 rounded-full"
                                    style={{
                                      width: `${
                                        (count / (hourData.total || 1)) * 100
                                      }%`,
                                    }}
                                  />
                                </div>
                                <span className="w-8 text-right text-sm">
                                  {count}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                        {hourData.responses.length > 0 && (
                          <div className="mt-2">
                            <button
                              className="text-sm text-blue-600 hover:text-blue-800"
                              onClick={() =>
                                setSelectedFeedback({
                                  hour: hourKey,
                                  responses: hourData.responses,
                                })
                              }
                            >
                              View {hourData.responses.length} submissions
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {data.feedback.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-2">All Feedback</h3>
                  <div className="space-y-2">
                    {data.feedback.map((feedback: string, index: number) => (
                      <p key={index} className="text-gray-600 italic">
                        "{feedback}"
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Submissions for {selectedFeedback.hour}
              </h3>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {selectedFeedback.responses
                .sort((a, b) => {
                  const timeA = a.created_at
                    ? new Date(a.created_at).getTime()
                    : 0;
                  const timeB = b.created_at
                    ? new Date(b.created_at).getTime()
                    : 0;
                  return timeB - timeA;
                })
                .map((response) => (
                  <div
                    key={response.id}
                    className="border-b border-gray-200 pb-4 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {RATING_EMOJIS[response.rating - 1]}
                        </span>
                        <span className="font-medium">
                          Rating: {response.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatTime(response.created_at)}
                      </span>
                    </div>
                    {response.feedback && (
                      <p className="text-gray-600 italic mt-2">
                        "{response.feedback}"
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

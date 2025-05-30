import { notFound } from "next/navigation";
import SurveyForm from "../components/SurveyForm";

const validDates = [
  "2024-01-01",
  "2024-03-19",
  "2024-06-26",
  "2024-07-31",
  "2024-08-28",
  "2024-09-25",
];

export default async function ConcertSurveyPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  if (!validDates.includes(date)) {
    notFound();
  }

  // Parse the date string and adjust for timezone
  const [year, month, day] = date.split("-").map(Number);
  const concertDate = new Date(year, month - 1, day);

  const formattedDate = concertDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Music on the River - {formattedDate}
        </h1>
        <SurveyForm concertDate={date} />
      </div>
    </main>
  );
}

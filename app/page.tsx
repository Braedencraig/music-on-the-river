import Link from "next/link";

const concertDates = [
  { date: "2024-01-01", label: "Test Date" },
  { date: "2024-03-19", label: "Today's Test Date" },
  { date: "2024-06-26", label: "June 26th, 2024" },
  { date: "2024-07-31", label: "July 31st, 2024" },
  { date: "2024-08-28", label: "August 28th, 2024" },
  { date: "2024-09-25", label: "September 25th, 2024" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Music on the River
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Select a concert date to provide your feedback
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {concertDates.map(({ date, label }) => (
            <Link
              key={date}
              href={`/${date}`}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-center">{label}</h2>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

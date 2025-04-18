"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";


/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface Course {
  title: string;
  link: string;
  image: string;
  category: string;
  language: string;
  instructor: string;
  rating: string;
  enrolled: string;
  price: string;
  description: string;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function Scraper() {
  const {
    data = [],              // empty array fallback
    isLoading,
    isError,
    refetch,
  } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: () =>
      api.get<Course[]>("/json").then((res) => res.data),
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* ───── toolbar ────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Udemy Freebies Courses</h1>

        <div className="space-x-3">
          <button
            className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
            onClick={() => refetch()}
          >
            Refresh list
          </button>

          <Link
            href={`${process.env.NEXT_PUBLIC_API_BASE}/download`}
            className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
          >
            Download CSV
          </Link>

          {/* call Flask endpoint directly */}
          <a
            href={`${process.env.NEXT_PUBLIC_API_BASE}/scrape`}
            className="px-3 py-1 bg-emerald-600 text-white rounded text-sm"
          >
            Run Scraper
          </a>
        </div>
      </header>

      {/* ───── state messages ─────────────────────────────────────────────── */}
      {isLoading && <p>Loading…</p>}
      {isError   && <p className="text-red-600">Could not load courses.</p>}

      {/* ───── cards grid ─────────────────────────────────────────────────── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((c, idx) => (
          <CourseCard key={`${idx}-${c.link}`} course={c} />
        ))}
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card component                                                            */
/* -------------------------------------------------------------------------- */

function CourseCard({ course }: { course: Course }) {
  return (
    <article className="rounded border shadow-sm overflow-hidden bg-white">
      <h1>hello word</h1>
      <Image
        src={course.image}
        alt={course.title}
        width={400}
        height={225}
        className="w-full object-cover"
      />

      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-lg leading-snug">
          <a href={course.link} target="_blank" rel="noopener noreferrer">
            {course.title}
          </a>
        </h3>

        <p className="text-sm text-gray-600">{course.instructor}</p>

        <p className="text-xs text-gray-500 line-clamp-3">
          {course.description}
        </p>

        <span className="text-xs mt-auto inline-block bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
          {course.category}
        </span>
      </div>
    </article>
  );
}

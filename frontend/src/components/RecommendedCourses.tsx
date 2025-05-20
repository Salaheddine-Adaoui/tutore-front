"use client";
import React from "react";
import { useRecommendedCourses } from "@/lib/hooks/useRecommendedCourses";

export default function RecommendedCourses() {
  const { data, isLoading, error } = useRecommendedCourses(1);

  // send history, then open link
  const handleClick = async (
    e: React.MouseEvent,
    course: any
  ) => {
    e.preventDefault();  // stop the default navigation
    console.log(course)
    console.log(course.category)
    try {
      await fetch("http://localhost:5000/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_etudiant: 2,                   // or the real user ID
          id_formation: course.id_formation
        }),
      });
    } catch (err) {
      console.error("Failed to log history:", err);
    }
    // now actually open the course link
    window.open(course.link, "_blank", "noopener");
  };

  return (
    <section className="bg-[#0B0D17] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Formations recommandées pour vous
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            {isLoading
              ? "Chargement…"
              : error
              ? `Erreur : ${error}`
              : "Basé sur votre historique ou vos centres d’intérêt."}
          </p>
        </div>

        {isLoading ? (
          <p className="text-center">Chargement...</p>
        ) : error ? (
          <p className="text-center text-red-500">Erreur : {`${error}`}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.map((course: any, i: number) => (
              <div
                key={i}
                onClick={(e) => handleClick(e, course)}
                className="cursor-pointer bg-[#111827] hover:scale-[1.05] transition rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                <div className="w-full h-48 bg-gray-800 flex-shrink-0">
                  <img
                    src={course.image || course.image_link}
                    alt={course.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        Score : {(course.similarity * 100).toFixed(1)}%
                      </span>
                      <span className="text-gray-400 text-sm">
                        {course.price}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {course.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {course.enrolled}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

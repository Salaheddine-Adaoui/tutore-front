"use client";
import React from "react";
import { useRecommendedCourses } from "@/lib/hooks/useRecommendedCourses";

export default function RecommendedCourses() {
  // 1) on récupère directement la liste “magique”
  const { data, isLoading, error } = useRecommendedCourses(1); // id 1 par défaut

  return (
    <section className="bg-white text-white py-12">
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
              <a
                key={i}
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#111827] hover:scale-[1.05] transition rounded-lg shadow-md overflow-hidden flex flex-col"
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
                  {/* CTA si besoin */}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

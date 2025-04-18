// src/components/RecommendedCourses.tsx

import React from "react";

export default function RecommendedCourses() {
  return (
    <section className="bg-[#0B0D17] text-white py-12">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Formations recommandées pour vous
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto">
          
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-[#111827] rounded-lg shadow-md overflow-hidden">
            <img
              src="/images/course-1.jpg"
              alt="Formation 1"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  Nouveauté
                </span>
                <span className="text-gray-400 text-sm">Durée: 4h</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Introduction à Next.js
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Découvrez les bases de Next.js, un framework React moderne pour
                des applications web performantes et SEO friendly.
              </p>
              <div className="flex items-center justify-between text-gray-400 text-sm">
                <span>Par Jean Dupont</span>
                <span>Avril 2025</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#111827] rounded-lg shadow-md overflow-hidden">
            <img
              src="/images/course-2.jpg"
              alt="Formation 2"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  Populaire
                </span>
                <span className="text-gray-400 text-sm">Durée: 6h</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Maîtriser Tailwind CSS
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Apprenez à concevoir des interfaces modernes et réactives avec
                Tailwind CSS, un utilitaire puissant et léger.
              </p>
              <div className="flex items-center justify-between text-gray-400 text-sm">
                <span>Par Marie Rossi</span>
                <span>Mars 2025</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#111827] rounded-lg shadow-md overflow-hidden">
            <img
              src="/images/course-3.jpg"
              alt="Formation 3"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  Avancé
                </span>
                <span className="text-gray-400 text-sm">Durée: 8h</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Approfondir React & Hooks
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Plongez dans les Hooks avancés de React et apprenez à gérer
                efficacement l’état et le cycle de vie de vos composants.
              </p>
              <div className="flex items-center justify-between text-gray-400 text-sm">
                <span>Par Luc Martin</span>
                <span>Fév 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

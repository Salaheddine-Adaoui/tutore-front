'use client'

import React, { useState } from 'react'
import axios from 'axios'
import Breadcrumb from '@/components/Common/Breadcrumb'
import RecommendedCourses from '@/components/RecommendedCourses'

const Recommandation = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return
    try {
      const response = await axios.get('http://localhost:5000/recommendsearch', {
        params: {
          q: query,
          k: 9,
        },
      })
      setResults(response.data)
      setError(null)
    } catch (err) {
      setError("Erreur lors de la recherche.")
      setResults([])
    }
  }

  return (
    <main className="bg-[#ffffff] min-h-screen mt-20">
      <header className="text-center py-10 text-black">
        <h1 className="text-4xl font-bold">Welcome to our platform</h1>
        <p className="text-blue-900 mt-4 max-w-xl mx-auto">
          We have selected the best courses for you to boost your skills.
        </p>

        {/* Barre de recherche */}
        <div className="mt-6 flex justify-center">
          <input
            type="text"
            placeholder="Search for a course..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-2 border border-gray-400 w-96 rounded-none focus:outline-none text-black focus:ring-2 focus:ring-blue-500 border-r-0"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 border border-blue-600 hover:bg-blue-700 transition"
          >
             Search
          </button>
        </div>
      </header>

      <section className="text-white max-w-5xl mx-auto px-4 py-8">
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Afficher les résultats de recherche s'il y en a, sinon les recommandations par défaut */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((course, index) => (
            <a
                key={index}
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#ffffff] hover:scale-[1.05] transition rounded-lg shadow-md overflow-hidden flex flex-col"
            >
                {/* 1. Conteneur image */}
                <div className="w-full h-48 bg-gray-800 flex-shrink-0">
                <img
                    src={course.image}
                    alt={course.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                />
                </div>

                {/* 2. Contenu */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-600 text-whit text-xs font-semibold px-2 py-1 rounded">
                        Score : {(course.similarity * 100).toFixed(1)}%
                    </span>
                    <span className="text-black text-sm">{course.price}</span>
                    </div>
                    <h3 className="text-xl text-black font-semibold mb-3">{course.title}</h3>
                    <p className="text-black text-sm mb-4">{course.enrolled}</p>
                </div>
                </div>
            </a>
            ))}
          </div>
        ) : (
          <RecommendedCourses />
        )}
      </section>
    </main>
  )
}

export default Recommandation

'use client'

import React, { useState } from 'react'
import axios from 'axios'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { api } from '@/lib/api'
import Cookies from 'universal-cookie'

const Recommandation = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState<{ [key: number]: boolean }>({})
  const [isSearch, setisSearch] = useState<boolean>(false)

  const cokie = new Cookies()
  const id = cokie.get('id')

  const savetodb = async (link) => {
    await api.post(`saveCourseLiked?link=${link}&id=${id}`)
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response?.data || err.message))
  }

  const handleClick = async (e: React.MouseEvent, course: any) => {
    e.preventDefault()
    try {
      await fetch(`http://localhost:5000/history?id_etudiant=${id}&id_formation=${course.id_formation}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
    } catch (err) {
      console.error("Failed to log history:", err)
    }
    window.open(course.link, "_blank", "noopener")
	window.location.reload()
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    setisSearch(true)
    try {
      const response = await axios.get('http://localhost:5000/recommendsearch', {
        params: {
          id: id,
          q: query,
          k: 9,
        },
      })
      setisSearch(false)
      setResults(response.data)
      setError(null)
    } catch (err) {
      setError("An error occurred during the search.")
      setResults([])
      setisSearch(false)
    }
  }

  return (
    <main className="bg-[#ffffff] min-h-screen mt-20">
      <header className="text-center py-10 text-black">
        <h1 className="text-4xl font-bold">Welcome to our platform</h1>
        <p className="text-blue-900 mt-4 max-w-xl mx-auto">
          We have selected the best courses for you to boost your skills.
        </p>

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
            {isSearch ? 'Searching...' : 'Search'}
          </button>
        </div>
      </header>

      <section className="text-white max-w-5xl mx-auto px-4 py-8">
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((course, index) => (
              <div
                key={index}
                onClick={(e) => handleClick(e, course)}
                rel="noopener noreferrer"
                className="bg-[#ffffff] hover:scale-[1.05] transition rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                <div className="w-full h-48 bg-white flex-shrink-0">
                  <img
                    src={course.image}
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
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 text-sm">{course.price}</span>
                        <FontAwesomeIcon
                          icon={faHeart}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setLiked((prev) => ({
                              ...prev,
                              [index]: !prev[index],
                            }))
                            savetodb(course.link)
                          }}
                          className={`cursor-pointer text-lg transition duration-300 ${
                            liked[index] ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                          }`}
                        />
                      </div>
                    </div>
                    <h3 className="text-xl text-black font-semibold mb-3">{course.title}</h3>
                    <p className="text-black text-sm mb-4">{course.enrolled}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-black mt-10">
            <h2 className="text-2xl font-semibold mb-4">Search for Courses</h2>
            <p className="text-md max-w-xl mx-auto">
              Use the search bar above to find courses that match your interests. Enter a keyword to begin your personalized course search.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default Recommandation
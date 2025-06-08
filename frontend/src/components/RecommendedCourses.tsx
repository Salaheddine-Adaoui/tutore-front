
'use client'
import React, { useState } from 'react'
import { useRecommendedCourses } from '@/lib/hooks/useRecommendedCourses'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie'
import { api } from '@/lib/api'


export default function RecommendedCourses({id}) {
  const cokie=new Cookies()
  const id_etudiant=cokie.get('id')
 
  const { data, isLoading, error } = useRecommendedCourses()
  const [liked, setLiked] = useState<{ [key: number]: boolean }>({})

  

  const savetodb = async (link)=>{
  
      await api.post(`saveCourseLiked?link=${link}&id=${id_etudiant}`)
               .then(res=>console.log(res.data))
               .catch(err=>console.log(err.response.data))
      }

  // send history, then open link
  const handleClick = async (
    e: React.MouseEvent,
    course: any
  ) => {
    e.preventDefault();  // stop the default navigation
    console.log(course)
    console.log(course.category)
    try {
      await fetch(`http://localhost:5000/history?id_etudiant=${id_etudiant}&id_formation=${course.id_formation}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("Failed to log history:", err);
    }
    // now actually open the course link
    window.open(course.link, "_blank", "noopener");
    window.location.reload()

  };


  return (
    <section className="bg-white text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Formations recommandées pour vous
          </h2>
<p className="text-gray-900 text-xl font-semibold max-w-xl mx-auto">
            {isLoading
              ? 'Chargement…'
              : error
              ? `Erreur : ${error}`
              : 'Recomendation pour vous'}
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
                className="cursor-pointer bg-[#040720] hover:scale-[1.05] transition rounded-lg shadow-md overflow-hidden flex flex-col"
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
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">{course.price}</span>
                        <FontAwesomeIcon
                          icon={faHeart}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setLiked((prev) => ({
                              ...prev,
                              [i]: !prev[i],
                            }))

                            savetodb(course.link)

                          }}
                          className={`cursor-pointer text-lg transition duration-300 ${
                            liked[i] ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                          }`}
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{course.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{course.enrolled}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}


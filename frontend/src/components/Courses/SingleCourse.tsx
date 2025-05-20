'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie'
import { api } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'

const SingleCourse = ({ formation,etat }) => {
  const cookies = new Cookies()
  const id_etudiant = cookies.get('id')

  const [liked, setLiked] = useState(etat === 'liked')

  const saveToDb = async () => {
      await api.post(`saveCourseLiked?link=${formation.lien}&id=${id_etudiant}`)
      .then(res=>{
        console.log(res.data)
        setLiked(prev=>!prev)
      })
      .catch(err=>console.log(err.response.data))
  }

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl dark:bg-dark dark:hover:shadow-gray-dark">
      <Link href="/blog-details" className="relative block aspect-[37/22] w-full">
        <span className="absolute right-6 top-6 z-20 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold capitalize text-white">
          {formation.plateforme || 'Udemy'}
        </span>
        <Image src={formation.image} alt={formation.titre} fill className="object-cover" />
      </Link>
      <div className="p-6 sm:p-8">
        <h3>
          <Link
            href="/blog-details"
            className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
          >
            {formation.titre}
          </Link>
        </h3>
        <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
          formation.description
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative h-10 w-10 overflow-hidden rounded-full mr-4">
              <Image src={formation.image} alt={formation.titre} fill />
            </div>
            <div>
              <h4 className="text-sm font-medium text-dark dark:text-white">{formation.instructor}</h4>
              <p className="text-xs text-body-color">{formation.instructorBio || 'Bio'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <h4 className="text-sm font-medium text-dark dark:text-white">Date</h4>
              <p className="text-xs text-body-color">{formation.publishDate || '12-01-2024'}</p>
            </div>
            <FontAwesomeIcon
              icon={faHeart}
              onClick={saveToDb}
              className={`cursor-pointer text-lg transition duration-300 ${
                liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleCourse

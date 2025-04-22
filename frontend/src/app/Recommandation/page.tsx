import Breadcrumb from '@/components/Common/Breadcrumb'
import RecommendedCourses from '@/components/RecommendedCourses'
import React from 'react'

const Recommandation = () => {
  return (
    <>
      
       <main className="bg-[#0B0D17] min-h-screen mt-20">
            <header className="text-center py-10 text-white">
                <h1 className="text-4xl font-bold">Bienvenue sur notre plateforme</h1>
                <p className="text-gray-300 mt-4 max-w-xl mx-auto">
                    Nous avons sélectionné pour vous les meilleures formations pour booster vos compétences.
                </p>
                        {/* Barre de recherche avec bouton */}
                {/* Barre de recherche */}
                <div className="mt-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Rechercher une formation..."
                        className="px-4 py-2 border border-gray-400 w-96 rounded-none focus:outline-none text-white focus:ring-2 focus:ring-blue-500 border-r-0"

                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 border border-blue-600 hover:bg-blue-700 transition"
                    >
                        Rechercher
                    </button>
                </div>

            </header>

            <RecommendedCourses />
        </main>
    </>
    
  )
}
export default Recommandation
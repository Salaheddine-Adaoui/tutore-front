'use client'

import React, { useState,useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faLock, faRobot } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Cookies from "universal-cookie";   


const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
    const cookies = new Cookies()
  // → Protege la page
  useEffect(() => {
    const email = cookies.get('email_admin')
    if (!email) {
      router.push('/admin/signinadmin')
    }
  }, [cookies, router])
  const handleScraping = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch("http://localhost:5000/scr");
      const data = await res.json();

      if (data.status === "success") {
        setMessage("Scraping completed and database updated.");
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Network error during scraping.");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    cookies.remove('email_admin')
    router.push('/admin/signinadmin')
  }

  return (
    
    <div>
            <button
    onClick={handleLogout}
    className="absolute top-4 right-4 z-20 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded transition"
  >
    Déconnexion
  </button>
      <section className="relative z-10 overflow-hidden pb-12 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container mx-auto flex flex-wrap justify-center gap-20">

          {/* Card 1: Change Password */}
          <div
            className="cursor-pointer w-80 h-52 rounded-lg bg-white shadow-lg p-5 flex items-center justify-center transition-transform duration-300 hover:scale-105"
            onClick={() => { router.push('/admin/updatepassword') }}

          >
            
            <div className="w-72 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4 mx-auto">
                <FontAwesomeIcon icon={faLock} className="text-blue-600 w-5 h-5" />
              </div>
              <h1 className="text-gray-600 text-lg font-semibold">Change Password</h1>
              <p className="text-gray-400 text-sm mt-2">Update your password to keep your account secure.</p>
            </div>
          </div>

          {/* Card 2: Edit Knowledge Base PDF */}
          <div
            className="cursor-pointer w-80 h-52 rounded-lg bg-white shadow-lg p-5 flex items-center justify-center transition-transform duration-300 hover:scale-105"
            onClick={() => { router.push('/admin/editpdf') }}
          >
            <div className="w-72 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4 mx-auto">
                <FontAwesomeIcon icon={faFilePdf} className="text-red-600 w-5 h-5" />
              </div>
              <h1 className="text-gray-600 text-lg font-semibold">Edit Knowledge Base PDF</h1>
              <p className="text-gray-400 text-sm mt-2">Modify the PDF used by the chatbot as a knowledge source.</p>
            </div>
          </div>

          {/* Card 3: Launch Scraping */}
          <div

            className={`cursor-pointer w-80 h-52 rounded-lg bg-white shadow-lg p-5 flex items-center justify-center transition-transform duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
            onClick={!loading ? handleScraping : undefined}

          >
            <div className="w-72 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4 mx-auto">
                <FontAwesomeIcon icon={faRobot} className="text-green-600 w-5 h-5" />
              </div>

              <h1 className="text-gray-600 text-lg font-semibold">
                {loading ? "Scraping..." : "Launch Scraping"}
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                {loading ? "Please wait..." : "Start the web scraping process"}
              </p>

            </div>
          </div>

        </div>


        {/* Message */}
        {message && (
          <div className="mt-6 text-center text-sm font-medium text-blue-700">
            {message}
          </div>
        )}

      </section>
    </div>
  )
}

export default Page;


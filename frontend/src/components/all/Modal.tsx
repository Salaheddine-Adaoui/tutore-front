import React from 'react'
import { motion, AnimatePresence } from "framer-motion";

export const Modal = ({nature,message,closed}) => {
  return (
    <div>
        {/* Modal: AnimatePresence handles mounting/unmounting animations */}
        <AnimatePresence>
      
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-80" ></div>
            
            {/* Modal window */}
            <motion.div
              className="relative z-10 w-full max-w-xl rounded-lg bg-white p-8 shadow-xl dark:bg-[#2C303B]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-6 text-xl font-bold dark:text-[#C80A37] text-center ">
              { nature ==='error'?
                <svg xmlns="http://www.w3.org/2000/svg" className="ionicon h-8 inline mr-3" fill="#C80A37" viewBox="0 0 512 512"><path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm0 319.91a20 20 0 1120-20 20 20 0 01-20 20zm21.72-201.15l-5.74 122a16 16 0 01-32 0l-5.74-121.94v-.05a21.74 21.74 0 1143.44 0z"/></svg>
              :'succes'
              }
                {message}
              </h2>
              <p className="mb-8 dark:text-gray-300 text-center">
                The email address and password you entered do not match our records. Please check your credentials and try again.
              </p>
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={closed}
                  className="rounded-[10px] bg-gray-300 px-4 py-2 text-gray-700 transition-colors duration-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
      </AnimatePresence>
    </div>
  )
}

import React from 'react'
import { motion, AnimatePresence } from "framer-motion";

export const EmailModal = () => {
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
              <h2 className="mb-6 text-xl font-bold dark:text-white text-center ">
                Email Confirmation
              </h2>
              <p className="mb-4 dark:text-gray-300">
                We have sent a confirmation to your academic email. Please check your email.
              </p>
              <p className="mb-4 dark:text-gray-400 text-center">
                Please enter the confirmation code:
              </p>
              <input
                type="text"
               
                placeholder="Enter code"
                className="mb-8 w-full rounded-[20px] border px-4 py-2 text-base text-body-color  transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#f1f1f1] dark:text-[#2C303B]"
              />
              <div className="flex justify-center items-center gap-4">
                <button
                
                  className="rounded-[10px] bg-primary px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-600"
                >
                  Confirm
                </button>
                <button
    
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

"use client";
import { useState } from "react";
import { loginAdmin } from "@/lib/hooks/admin";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SigninPageadmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isModalForgetOpen, setModalForgetOpen] = useState(false);
  const [isModalErrerOpen, setModalErrerOpen] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    const result = await loginAdmin(email, password);
    if (result.success) {
      // ✅ Redirection vers /signup après login
      router.push("/signup");
    } else {
      // ❌ Affiche le modal d'erreur
      setModalErrerOpen(true);
    }
  };

  const handleCancel = () => {
    setModalErrerOpen(false);
    setModalForgetOpen(false);
  };

  const handleConfirm = () => {
    setModalForgetOpen(false);
    setModalErrerOpen(false);
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px] bg-white px-6 py-10 dark:bg-dark sm:p-[60px] rounded-[20px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Log in to your account
                </h3>

                <div className="mb-8 flex items-center justify-center">
                  <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
                  <p className="w-full px-5 mb-3 text-center text-base font-medium text-body-color text-nowrap">
                    Welcome, Admin, to your space.
                  </p>
                  <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
                </div>

                <div>
                  <div className="mb-8">
                    <label htmlFor="email" className="mb-3 block text-sm text-dark dark:text-white">
                      Your Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your Email"
                      className="w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary"
                    />
                  </div>

                  <div className="mb-8">
                    <label htmlFor="password" className="mb-3 block text-sm text-dark dark:text-white">
                      Your Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your Password"
                      className="w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary"
                    />
                  </div>

                  <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
                    <div className="mb-4 sm:mb-0">
                      <label htmlFor="checkboxLabel" className="flex items-center text-sm font-medium text-body-color">
                        <input type="checkbox" className="mr-2" />
                        Keep me signed in
                      </label>
                    </div>
                    <div>
                      <a href="#" className="text-sm font-medium text-primary hover:underline" onClick={() => setModalForgetOpen(true)}>
                        Forgot Password?
                      </a>
                    </div>
                  </div>

                  <div className="mb-6">
                    <button
                      className="w-full rounded-[20px] bg-primary px-9 py-4 text-base font-medium text-white hover:bg-opacity-90"
                      onClick={handleLogin}
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔒 MODAL: Mot de passe oublié */}
      <AnimatePresence>
        {isModalForgetOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black opacity-80" onClick={handleCancel}></div>
            <motion.div
              className="relative z-10 w-full max-w-xl rounded-lg bg-white p-8 shadow-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-6 text-xl font-bold text-center">Email Confirmation</h2>
              <p className="mb-4 text-center">We have sent a confirmation to your email.</p>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                className="mb-8 w-full rounded border px-4 py-2"
              />
              <div className="flex justify-center gap-4">
                <button onClick={handleConfirm} className="rounded bg-primary px-4 py-2 text-white hover:bg-blue-600">
                  Confirm
                </button>
                <button onClick={handleCancel} className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ❌ MODAL: Erreur login */}
      <AnimatePresence>
        {isModalErrerOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black opacity-80" onClick={handleCancel}></div>
            <motion.div
              className="relative z-10 w-full max-w-xl rounded-lg bg-white p-8 shadow-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-6 text-xl font-bold text-center text-red-600">Email or password incorrect</h2>
              <p className="mb-8 text-center">Please check your credentials and try again.</p>
              <div className="flex justify-center gap-4">
                <button onClick={handleCancel} className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SigninPageadmin;

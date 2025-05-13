"use client";
import { useState } from "react";
import { loginAdmin } from "@/lib/hooks/admin";
import { useRouter } from "next/navigation";
import Image from "next/image";                  // ← import Image
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
      router.push("/signup");
    } else {
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

                {/* ← Add your centered image here */}
                <div className="flex justify-center mb-8">
                  <Image
                    src="/images/logo/logoensakh.jpg"        // ← update to your image path
                    alt="Admin Logo"
                    width={200}                         // ← adjust size as needed
                    height={200}
                    className="object-contain"
                  />
                </div>

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

      {/* ... modals unchanged ... */}
    </>
  );
};

export default SigninPageadmin;

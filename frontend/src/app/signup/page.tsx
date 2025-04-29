"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Metadata } from "next";
import { api } from "@/lib/api";
import { EmailModal } from "@/components/all/EmailModal";
import { Modal } from "@/components/all/Modal";
import { useRouter } from "next/navigation";



const SignupPage = () => {

  const router = useRouter()


  // State to handle modal visibility and the entered confirmation code.
  const [isModalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [form,setForme]=useState({
    firstName:"",
    lastName:"",
    email:"",
    password:""
  })
  const [err,setErr]= useState({status:false,msg:'default message'})
  const [succ,setSucc]= useState({status:false,msg:'default message'})

  const handlchange=(e)=>{
    setForme({...form,[e.target.name]:e.target.value})
  }

  const handlclose=()=>{
    setErr({...err,status:false})
    setSucc({...succ,status:false})
  }
  // Called when user clicks confirm inside modal.
  const handleConfirm = () => {
    // Add your confirmation logic here.
    console.log("Entered confirmation code:", code);
    setModalOpen(false);
  };

  // Called when the user clicks cancel or the overlay.
  const handleCancel = () => {
    setModalOpen(false);
  };

  // apis 

  const signup=()=>{
    api.post('/register',form)
    .then(res=>{
      setSucc({...succ,status:true,msg:res.data.success})
      setErr({...err,status:false})
      router.push(`/formulaire?email=${form.email}`)
    })
    .catch(errr=>{
      setErr({...err,status:true,msg:errr.response.data.error})
      setSucc({...succ,status:false})
    })
  }

  // validation de formualire 

    const validateForm = () => {
      const { firstName, lastName, email, password } = form;
    
      if (!firstName.trim()) {
        setErr({...err,status:true,msg:"Le prénom est requis."})
        setSucc({...succ,status:false})
        return false;
      }
    
      if (!lastName.trim()) {
        setErr({...err,status:true,msg:"Le nom est requis."})
        setSucc({...succ,status:false})
        return false;
      }
    
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim() || !emailRegex.test(email)) {
        if(!email.trim()){
          setErr({...err,status:true,msg:"Le email est requis."})
        }
        else{
          setErr({...err,status:true,msg:"Le email ne matche pas bien"})
        }
        setSucc({...succ,status:false})
        return false;
      }
    
      if (!password || password.length < 6) {
        setErr({...err,status:true,msg:"Le password est requis."})
        setSucc({...succ,status:false})
        return false;
      }
      setErr({...err,status:false})
      return true;
    };
    

  // handlsubmit

  const handlsubmit=(e)=>{
    e.preventDefault()
    if(validateForm()){
      signup()
    }
  }

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px] bg-white px-6 py-10 dark:bg-dark sm:p-[60px] rounded-[20px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Create your account
                </h3>
                <div className="mb-8 flex items-center justify-center">
                  <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
                  <p className="w-full px-5 text-center text-base font-medium text-body-color text-nowrap">
                    Use your university email and password
                  </p>
                  <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
                </div>
                <form onSubmit={handlsubmit}>
                  <div className="mb-8 flex justify-center items-center gap-8">
                    {/* First Name Input */}
                    <div>
                      <label htmlFor="firstName" className="mb-3 block text-sm text-dark dark:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="ionicon h-[19px] inline mr-1" fill="#f1f1f1" viewBox="0 0 512 512"><path d="M332.64 64.58C313.18 43.57 286 32 256 32c-30.16 0-57.43 11.5-76.8 32.38-19.58 21.11-29.12 49.8-26.88 80.78C156.76 206.28 203.27 256 256 256s99.16-49.71 103.67-110.82c2.27-30.7-7.33-59.33-27.03-80.6zM432 480H80a31 31 0 01-24.2-11.13c-6.5-7.77-9.12-18.38-7.18-29.11C57.06 392.94 83.4 353.61 124.8 326c36.78-24.51 83.37-38 131.2-38s94.42 13.5 131.2 38c41.4 27.6 67.74 66.93 76.18 113.75 1.94 10.73-.68 21.34-7.18 29.11A31 31 0 01432 480z"/></svg>
                        First Name
                      </label>
                      <input
                        id="firstName"
                        onChange={handlchange}
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        placeholder="Your first name"
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"/>
                    </div>
                    {/* Last Name Input */}
                    <div>
                      <label htmlFor="lastName" className="mb-3 block text-sm text-dark dark:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="ionicon h-[19px] inline mr-1" fill="#f1f1f1" viewBox="0 0 512 512"><path d="M332.64 64.58C313.18 43.57 286 32 256 32c-30.16 0-57.43 11.5-76.8 32.38-19.58 21.11-29.12 49.8-26.88 80.78C156.76 206.28 203.27 256 256 256s99.16-49.71 103.67-110.82c2.27-30.7-7.33-59.33-27.03-80.6zM432 480H80a31 31 0 01-24.2-11.13c-6.5-7.77-9.12-18.38-7.18-29.11C57.06 392.94 83.4 353.61 124.8 326c36.78-24.51 83.37-38 131.2-38s94.42 13.5 131.2 38c41.4 27.6 67.74 66.93 76.18 113.75 1.94 10.73-.68 21.34-7.18 29.11A31 31 0 01432 480z"/></svg>
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handlchange}
                        placeholder="Your last name"
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                        />
                    </div>
                  </div>
                  <div className="mb-8">
                    <label htmlFor="email" className="mb-3 block text-sm text-dark dark:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="ionicon h-5 inline mr-2" fill="#f1f1f1" viewBox="0 0 512 512"><path d="M424 80H88a56.06 56.06 0 00-56 56v240a56.06 56.06 0 0056 56h336a56.06 56.06 0 0056-56V136a56.06 56.06 0 00-56-56zm-14.18 92.63l-144 112a16 16 0 01-19.64 0l-144-112a16 16 0 1119.64-25.26L256 251.73l134.18-104.36a16 16 0 0119.64 25.26z"/></svg>
                      University Email
                    </label>
                    <input
                      id="email"
                      type="text"
                      name="email"
                      value={form.email}
                      onChange={handlchange}
                      placeholder="Enter your email"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                  <div className="mb-8">
                    <label htmlFor="password" className="mb-3 block text-sm text-dark dark:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="ionicon h-5 inline mr-2" fill="#f1f1f1" viewBox="0 0 512 512"><path d="M368 192h-16v-80a96 96 0 10-192 0v80h-16a64.07 64.07 0 00-64 64v176a64.07 64.07 0 0064 64h224a64.07 64.07 0 0064-64V256a64.07 64.07 0 00-64-64zm-48 0H192v-80a64 64 0 11128 0z"/></svg>
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handlchange}
                      placeholder="Enter your password"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                  
                  {/* This button triggers the modal */}
                  <div className="mb-6">
                    <button
                      type='submit'
                      className="flex w-full items-center justify-center rounded-[20px] bg-primary px-9 py-4 text-base font-medium text-white transition-all duration-300 hover:bg-[#edeeef11] hover:text-primary shadow-submit dark:shadow-submit-dark"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
                <p className="text-center text-base font-medium text-body-color">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-primary hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {err.status&&<Modal nature={'error'} message={err.msg} closed={handlclose}/>}
      {succ.status&&<Modal nature={'succes'} message={succ.msg} closed={handlclose}/>}
    </>
  );
};

export default SignupPage;

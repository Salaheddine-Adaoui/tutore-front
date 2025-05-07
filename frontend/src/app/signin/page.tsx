"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Modal } from "@/components/all/Modal";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";




const cokie= new Cookies()

const SigninPage = () => {

  const router = useRouter();

    // State to handle modal visibility and the entered confirmation code.
    const [isModalForgetOpen, setModalForgetOpen] = useState(false);
    const [err,setErr]= useState({status:false,msg:'default err message'})
    const [succ,setSucc]= useState({status:false,msg:'default succes message'})
    const [code, setCode] = useState("");
    const [code_back,setCodeback]=useState('')




    const handlclose=()=>{
      setErr({...err,status:false})
      setSucc({...succ,status:false})
    }

    // state for login form 
    const [form,setForm]=useState({
      email:"",
      password:""
    })

    const handlremeber = async() => {
      await api.post(`/chekcode?email=${form.email}&code=${code}`)
      .then(res=>{
        console.log(res.data)
   
        router.push(`/signin/changpass?email=${form.email}`) // ajouter page de changement de password 
      })
      .catch(err=>console.log(err.response.data))
    }

    const handlsendCode=async()=>{
      await api.post(`remamber?email=${form.email}`)
        .then(res=>{
          console.log(res.data)
          setCodeback(res.data.code)
        })
        .catch(err=>console.log(err.repsonse.data))
    }

    const handlchange =(e)=>{
      setForm({...form,[e.target.name]:e.target.value})
    }

    const validateForm=()=>{
      const {email, password } = form;
    
      if (!email.trim()) {
        setErr({...err,status:true,msg:"Le prénom est requis."})
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
    

    const Signin =async()=>{
      await api.post('/login',form)
      .then(res=>{
        const email=res.data.email
        const id_compte=res.data.id_compte
        const id=res.data.id
        const nom=res.data.nom
        const prenom=res.data.prenom
        cokie.set('email', email, { path: '/' });
        cokie.set('id_compte',id_compte)
        cokie.set('id',id_compte)
        cokie.set('nom',nom)
        cokie.set('prenom',prenom)
        router.push(`/`)
        setSucc({...succ,status:true,msg:res.data.succes})
        setErr({...err,status:false})
       
      })
    .catch(err=>{
      setErr({...err,status:true,msg:err.response.data.error})
      setSucc({...err,status:false})
    })
    }

    const handlsumbit =(e)=>{
      e.preventDefault()
      Signin()
    }


  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px] ">
        <div className="container">
          <div className="-mx-4 flex flex-wrap ">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px]  bg-white px-6 py-10 dark:bg-dark sm:p-[60px] rounded-[20px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Log in to your account 
                </h3>
                <div className="mb-8 flex items-center justify-center">
                  <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
                  <p className="w-full px-5 mb-3 text-center text-base font-medium text-body-color text-nowrap">
                    Use your university email and password
                  </p>
                  <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
                </div>
                <form onSubmit={handlsumbit}>
                  <div className="mb-8">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="ionicon h-5 inline mr-2" fill="#f1f1f1" viewBox="0 0 512 512"><path d="M424 80H88a56.06 56.06 0 00-56 56v240a56.06 56.06 0 0056 56h336a56.06 56.06 0 0056-56V136a56.06 56.06 0 00-56-56zm-14.18 92.63l-144 112a16 16 0 01-19.64 0l-144-112a16 16 0 1119.64-25.26L256 251.73l134.18-104.36a16 16 0 0119.64 25.26z"/></svg>
                      Your Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handlchange}
                      placeholder="Enter your Email"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                  <div className="mb-8">
                    <label
                      htmlFor="password"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="ionicon h-5 inline mr-2" fill="#f1f1f1" viewBox="0 0 512 512"><path d="M368 192h-16v-80a96 96 0 10-192 0v80h-16a64.07 64.07 0 00-64 64v176a64.07 64.07 0 0064 64h224a64.07 64.07 0 0064-64V256a64.07 64.07 0 00-64-64zm-48 0H192v-80a64 64 0 11128 0z"/></svg>
                      Your Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handlchange}
                      placeholder="Enter your Password"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                  <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
                    <div className="mb-4 sm:mb-0">
                      <label
                        htmlFor="checkboxLabel"
                        className="flex cursor-pointer select-none items-center text-sm font-medium text-body-color"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="checkboxLabel"
                            className="sr-only"
                          />
                          <div className="box mr-4 flex h-5 w-5 items-center justify-center rounded border border-body-color border-opacity-20 dark:border-white dark:border-opacity-10">
                            <span className="opacity-0">
                              <svg
                                width="11"
                                height="8"
                                viewBox="0 0 11 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                  fill="#3056D3"
                                  stroke="#3056D3"
                                  strokeWidth="0.4"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                        Keep me signed in
                      </label>
                    </div>
                    <div>
                      <a
                        href="#0"
                        className="text-sm font-medium text-primary hover:underline"
                        onClick={async()=>{
                          handlsendCode()
                          setModalForgetOpen(true)
                          
                  
                        }}
                      >
                        Forgot Password?
                      </a>
                    </div>
                  </div>
                  <div className="mb-6">
                    <button type="submit" className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-[20px] bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-[#edeeef11] hover:text-primary" >
                      Sign in
                    </button>
                  </div>
                </form>
                <p className="text-center text-base font-medium text-body-color">
                  Don’t you have an account?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    Sign up
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

      <AnimatePresence>
        {isModalForgetOpen && (
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
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                className="mb-8 w-full rounded border px-4 py-2 text-base text-body-color  transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#f1f1f1] dark:text-[#2C303B]"
              />
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={handlremeber}
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
        )}
      </AnimatePresence>
      {err.status&&<Modal nature={'error'} message={err.msg} closed={handlclose}/>}
      {succ.status&&<Modal nature={'succes'} message={succ.msg} closed={handlclose}/>}
      
      
    </>
  );
};

export default SigninPage;

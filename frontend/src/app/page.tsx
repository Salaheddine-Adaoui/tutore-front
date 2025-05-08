'use client'

// src/app/page.tsx (or wherever your Home component is located)


import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
//import Pricing from "@/components/Pricing";
// import Testimonials from "@/components/Testimonials";
// import Video from "@/components/Video";
import Dashboard from "../components/Dashboard";
//import Chatbot from "../components/Chatbot1"; // Import Chatbot
import { Metadata } from "next";
import RecommendedCourses from "@/components/RecommendedCourses";
import Chatbot from "@/components/Chatbot1";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";



export default function Home() {


  const cokie = new Cookies()

  // si besoin de email en home page concernant statistique
  const email=cokie.get('email')
  const id=cokie.get('id')
  const nom=cokie.get('nom')
  const prenom=cokie.get('prenom') 

  useEffect(()=>{
    console.log(email)
    console.log(nom)
    console.log(id)
    console.log(prenom)
  },[])




  

  
  return (
    <>
      <ScrollUp />
     
      <Hero />
        {/* <Features /> 
              <Brands />
      <AboutSectionOne />
      <AboutSectionTwo />
      <Testimonials />
      <Pricing />
      <Blog />
*/}
      {/* Dashboard Section */}
   
  

      <Dashboard />
      <Chatbot />
      <RecommendedCourses />
      
       {/*<Contact />*/}
    </>
  );
}

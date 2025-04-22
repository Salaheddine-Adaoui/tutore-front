// src/app/page.tsx (or wherever your Home component is located)


import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";
import Dashboard from "../components/Dashboard";
//import Chatbot from "../components/Chatbot1"; // Import Chatbot
import { Metadata } from "next";
import RecommendedCourses from "@/components/RecommendedCourses";
import Chatbot from "@/components/Chatbot1";

export const metadata: Metadata = {
  title: "Free Next.js Template for Startup and SaaS",
  description: "This is Home for Startup Nextjs Template",
};

export default function Home() {
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

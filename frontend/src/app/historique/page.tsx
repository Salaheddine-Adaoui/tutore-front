"use client";

import { Course } from '@/types/course';
import SingleCourse from '@/components/Courses/SingleCourse';
import courseData from '@/components/Courses/courseData'; // Utiliser courseData ici
import Breadcrumb from '@/components/Common/Breadcrumb';
import { Metadata } from 'next';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';



const HistoriquePage = () => {
  //console.log(courseData); // Vérifier le contenu de courseData

  const [hist,setHist]=useState([])
  
  const cokie = new Cookies()
  const email = cokie.get('email')

  const getHistorique=()=>{

    api.get(`/getHistorique?email=${email}`)
    .then(res=>{
      setHist(res.data.historique)
      console.log(res.data)
    })
    .catch(err=>console.log(err.response.data))

  }

  useEffect(()=>{
    getHistorique()
  },[])

  return (
    <>
      <Breadcrumb
        pageName="History page"
        description="This page is for displaying the courses you have visited!"
      />
      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {/* Utiliser le type Course pour typer les éléments de courseData */}
            {
            hist.length>0
            ?
            hist.map((v,k)=>{
              return (
                <div key={k} className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                  <SingleCourse formation={v.formation} />
              </div>
              )
            })
            :  
            <p className="text-center text-lg text-gray-600 mt-8">
              Aucun cours consulté pour le moment.
            </p>
            }
          </div>
        </div>
      </section>
    </>
  );
};

export default HistoriquePage;
{/*courseData.map((course: Course) => (
              <div key={course.id} className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                <SingleCourse course={course} />
              </div>
            ))*/}
            
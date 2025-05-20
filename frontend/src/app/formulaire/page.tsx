'use client'

import { Modal } from "@/components/all/Modal";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const interests = [
  { with: "Big_Data", without: "Big Data" },
  { with: "Software_Development", without: "Software Development" },
  { with: "Data_Analytics", without: "Data Analytics" },
  { with: "ML", without: "ML" },
  { with: "AI", without: "AI" },
  { with: "DevOps", without: "DevOps" },
  { with: "Cybersecurity", without: "Cybersecurity" },
  { with: "Networking", without: "Networking" },
  { with: "Network_Security", without: "Network Security" },
  { with: "Chemical_Engineering", without: "Chemical Engineering" },
  { with: "Renewable_Energy", without: "Renewable Energy" },
  { with: "Water_Treatment", without: "Water Treatment" },
  { with: "Waste_Management", without: "Waste Management" },
  { with: "Electronics", without: "Electronics" },
  { with: "Electrical_Engineering", without: "Electrical Engineering" },
  { with: "Control_Systems", without: "Control Systems" },
  { with: "Smart_Grids", without: "Smart Grids" }
];



const Formular = () => {

  const router =useRouter()

  const [modal,setModal]=useState(false)
  const [selectedInterests, setSelectedInterests] = useState([]);
  const param = useSearchParams()
  const email = param.get('email')


  const handlclose=()=>{
    setModal(false)
  }

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      // Ajouter l'intérêt sélectionné
      setSelectedInterests((prev) => [...prev, value]);
    } else {
      // Retirer l'intérêt si décoché
      setSelectedInterests((prev) => prev.filter((interest) => interest !== value));
    }
  };

  const saveInetreste = ()=>{
    const obj={
      interet:selectedInterests
    }
    api.post(`/saveInteret?email=${email}`,obj)
    .then(res=>{
      console.log(res.data)
      router.push('/signin')
    })
    .catch(err=>console.log(err.response.data))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    saveInetreste()
  };


  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Registration Formular
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                   To help us suggest suitable courses
                </p>
                <form onSubmit={handleSubmit}>
                  
                  <div className="mb-8">
                    <label className="mb-3 block text-sm text-dark dark:text-white">
                       You are interested in:
                    </label>
                    {interests.map((interest, index) => (
                      <div key={index} className="mb-2 flex items-center">
                        <input
                          type="checkbox"
                          id={`interest-${index}`}
                          name="interests"
                          value={interest.with}
                          checked={selectedInterests.includes(interest.with)}
                          onChange={handleCheckboxChange}
                        
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor={`interest-${index}`} className="text-sm text-dark dark:text-white">
                          {interest.without}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="mb-6">
                    <button className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90">
                       Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {modal?<Modal nature={'succes'} message={'interets saved whit success'} closed={handlclose}/>:''}
    </>
  );
};

export default Formular;

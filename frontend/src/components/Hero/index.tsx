// src/components/Hero.tsx
import { Scraper } from "@/lib/QueryClient";

import Link from "next/link";
import Image from "next/image";

// Chemin absolu depuis public/
const HERO_IMG = "/images/hero/ensaimg.jpeg";

const Hero = () => (
  <section
    id="home"
    className="
      relative z-10 overflow-hidden
      pb-4 pt-[60px]
      md:pb-[40px] md:pt-[70px]
      xl:pb-[80px] xl:pt-[90px]
      2xl:pb-[100px] 2xl:pt-[110px]
    "
  >
    {/* Background Image */}
    <div className="absolute inset-0 -z-10">
      <Image
        src={HERO_IMG}
        alt="Background Hero ENSA"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        priority
      />
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50" />
    </div>

    {/* Contenu principal */}
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap -mx-4">
        <div className="w-full px-4">
          <div className="mx-auto max-w-[800px] text-center">
            <h1 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              Bienvenue sur votre espace
            </h1>
            <p className="mb-12 text-base leading-relaxed text-white sm:text-lg md:text-xl">
              {/* Votre slogan ou description ici */}
            </p>
            {/* Conteneur flex avec centrage horizontal et vertical */}
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link
                href="http://localhost:3000/Recommandation"
                className="
                  rounded-sm bg-primary px-8 py-4
                  text-base font-semibold text-white
                  hover:bg-primary/80 transition
                "
              >
                🔥 Accéder à l'espace de recommandationn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* <section id="scraper-test" className="bg-gray-50 py-16 dark:bg-gray-900">
       <div className="container mx-auto max-w-6xl px-4">
         <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 dark:text-white">
           Test du Scraper
         </h2>
 
         <Scraper />   
       </div>
     </section> */}

  </section>

  
);

export default Hero;

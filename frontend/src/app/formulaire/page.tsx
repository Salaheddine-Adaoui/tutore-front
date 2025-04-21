import Link from "next/link";

const interests = [
  "Big Data",
  "Développement informatique",
  "Data Analytics",
  "Machine Learning",
  "AI",
  "Devops",
  "Cyber Sécurité",
  "Réseaux Informatiques (Networking)",
  "Sécurité Réseaux (Network Security)",
  "Génie des Procédés Chimiques",
  "Énergie Renouvelable",
  "Traitement des Eaux et Dépollution",
  "Gestion des Déchets et Économie Circulaire",
  "Électronique (Analogique et Numérique)",
  "Électrotechnique (Machines et Systèmes Électriques)",
  "Automatismes et Commande des Systèmes",
  "Réseaux Électriques et Smart Grids",

];

const Formular = () => {
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
                <form>
                  
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
                          value={interest}
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor={`interest-${index}`} className="text-sm text-dark dark:text-white">
                          {interest}
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
    </>
  );
};

export default Formular;

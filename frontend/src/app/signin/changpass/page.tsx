"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";


const ChangePass = () => {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState({ status: false, msg: "" });
  const [succ, setSucc] = useState({ status: false, msg: "" });

  const param = useSearchParams()
  const email = param.get('email')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      setErr({ status: true, msg: "Le mot de passe doit contenir au moins 6 caractères." });
      setSucc({ status: false, msg: "" });
      return;
    }

    try {
      const res = await api.post(`updatepassword?email=${email}&password=${password}`);
      setSucc({ status: true, msg: res.data.succes });
      setErr({ status: false, msg: "" });
      console.log(res.data)
    } catch (error: any) {
      setErr({ status: true, msg: error.response?.data?.error || "Erreur lors du changement du mot de passe." });
      setSucc({ status: false, msg: "" });
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three mx-auto max-w-[500px] bg-white px-6 py-10 dark:bg-dark sm:p-[60px] rounded-[20px]">
              <h3 className="mb-6 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Changer le mot de passe
              </h3>

              

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="password" className="mb-3 block text-sm text-dark dark:text-white">
                    Nouveau mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez le nouveau mot de passe"
                    className="w-full rounded border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:bg-[#2C303B] dark:focus:border-primary"
                  />
                </div>
                <div className="mb-6">
                  <button
                    type="submit"
                    className="w-full rounded bg-primary px-6 py-3 text-white transition hover:bg-opacity-90"
                  >
                    Confirmer le changement
                  </button>
                </div>
              </form>
              {(err.status || succ.status) && (
                <div className={`mb-4 flex items-center justify-center gap-2 px-4 h-14 rounded-lg border shadow-md text-sm font-semibold
                  ${err.status 
                    ? 'bg-red-50 border-red-400 text-red-700' 
                    : 'bg-green-50 border-green-400 text-green-700'
                  }
                `}>
                  <span className="text-lg">
                    {err.status ? '⚠️' : '✅'}
                  </span>
                  <p>{err.status ? err.msg : succ.msg}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePass;

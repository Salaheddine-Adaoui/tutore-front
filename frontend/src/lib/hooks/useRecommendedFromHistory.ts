import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import Cookies from "universal-cookie";


export function useRecommendedFromHistory() {

  const cokie = new Cookies()
  const id_etudiant = cokie.get("id")

  return useQuery({
    queryKey: ["recommended-history"],
    queryFn: async () => {
      const res = await api.get(`/recommend_history?id_etudiant=${id_etudiant}`);
      return res.data;
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export function useRecommendedFromHistory() {
  return useQuery({
    queryKey: ["recommended-history"],
    queryFn: async () => {
      const res = await api.get("/recommend_history");
      return res.data;
    },
  });
}

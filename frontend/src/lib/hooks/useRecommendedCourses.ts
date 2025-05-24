"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import Cookies from "universal-cookie";

export function useRecommendedCourses() {
  const cokie = new Cookies()
    const id_etudiant = cokie.get("id")
  return useQuery({
    queryKey: ["recommended-courses", id_etudiant],
    queryFn: async () => {
      const res = await api.get(`/recommend_courses?id_etudiant=${id_etudiant}`);
      return res.data;
    },
  });
}

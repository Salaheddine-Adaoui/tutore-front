"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export function useRecommendedCourses(id_etudiant: number = 1) {
  return useQuery({
    queryKey: ["recommended-courses", id_etudiant],
    queryFn: async () => {
      const res = await api.get(`/recommend_courses?id_etudiant=${id_etudiant}`);
      return res.data;
    },
  });
}

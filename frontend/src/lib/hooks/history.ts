// src/lib/hooks/history.ts
import { api } from "@/lib/api";
export const deleteHistoryOfStudent = (id: number) =>
  api.delete<{ message: string }>(`/history/${id}`);

// lib/hooks/admin.ts
import { api } from "../api";

export async function loginAdmin(email: string, password: string) {
  try {
    const response = await api.post("/admin/login", { email, password });
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "Login failed",
    };
  }
}

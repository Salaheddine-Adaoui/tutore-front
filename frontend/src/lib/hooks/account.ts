 // lib/hooks/account.ts
import { api } from "@/lib/api";   // axios avec baseURL

export const updatePassword = (
  userId: number,
  oldPassword: string,
  newPassword: string
) =>
  api.post("/updatepassword", null, {
    params: {                     // ← tes routes actuelles utilisent des query params
      email: userId,              // si ton back attend l’e-mail, adapte ici
      password: newPassword,
      oldPassword,
    },
  });

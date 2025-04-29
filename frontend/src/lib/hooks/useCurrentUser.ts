// ─── src/hooks/useCurrentUser.ts ---------------------------------------------
export type CurrentUser = {
  id_etudiant: number;
  email: string;
  // … autres champs …
};

export const useCurrentUser = (): CurrentUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? (JSON.parse(raw) as CurrentUser) : null;
  } catch {
    return null;
  }
};

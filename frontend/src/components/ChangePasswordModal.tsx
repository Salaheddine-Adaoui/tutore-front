 /* components/modals/ChangePasswordModal.tsx */
"use client";

import { useState } from "react";
import { updatePassword } from "../lib/hooks/account";   // ← ton service axios
import { toast } from "react-hot-toast";

type Props = {
  userId: number;          // = 1 dans tes tests
  onClose: () => void;
};

const ChangePasswordModal = ({ userId, onClose }: Props) => {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirm) {
      toast.error("Les mots de passe de confirmation ne sont pas identiques");
      return;
    }
    try {
      setLoading(true);
      await updatePassword(userId, oldPwd, newPwd);   // POST /updatepassword
      toast.success("Mot de passe mis à jour avec succès !");
      onClose();
    } catch (err: any) {
      // 👉 ICI pour afficher le message d’erreur venant du backend
      toast.error(
        err.response?.data?.error ?? "Impossible de changer le mot de passe"
      );
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Changer le mot de passe</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Mot de passe actuel"
            className="input"
            value={oldPwd}
            onChange={e => setOldPwd(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            className="input"
            value={newPwd}
            onChange={e => setNewPwd(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirme le mot de passe"
            className="input"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              disabled={loading}
              className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-opacity-90 disabled:opacity-60"
            >
              {loading ? "…": "Valider"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

/* petit helper Tailwind pour l’input */
const base =
  "w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-600";
const Input = (p: any) => <input {...p} className={`${base} ${p.className}`} />;

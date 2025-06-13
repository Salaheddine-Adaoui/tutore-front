'use client';

import { api } from '@/lib/api';
import React, { useState } from 'react';
import Cookies from 'universal-cookie';

const UpdatePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState({ status: false, msg: '' });
  const [success, setSuccess] = useState({ status: false, msg: '' });

  const cookie = new Cookies();
  const email = cookie.get('email_admin');

  const validate = () => {
    if (
      currentPassword.length < 6 ||
      newPassword.length < 6 ||
      confirmPassword.length < 6
    ) {
      setError({
        status: true,
        msg: '⚠️ Tous les champs doivent contenir au moins 6 caractères.',
      });
      setSuccess({ status: false, msg: '' });
      return false;
    }
    setError({ status: false, msg: '' });
    return true;
  };

  const handleUpdatePassword = async () => {
    const obj = {
      password: currentPassword,
      new: newPassword,
      confirm: confirmPassword,
    };

    try {
      const res = await api.post(`/updateadminpassword?email=${email}`, obj);
      setSuccess({ status: true, msg: `✅ ${res.data.success}` });
      setError({ status: false, msg: '' });
    } catch (err: any) {
      setError({
        status: true,
        msg: `❌ ${err.response?.data?.error || 'Erreur inconnue'}`,
      });
      setSuccess({ status: false, msg: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      handleUpdatePassword();
    }
  };

  const inputStyle =
    'w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200';

  return (
    <section className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="font-extrabold text-2xl text-center text-gray-800 mb-6">
          🔒 Update Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputStyle}
              placeholder="Entrez le mot de passe actuel"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputStyle}
              placeholder="Entrez le nouveau mot de passe"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputStyle}
              placeholder="Confirmez le mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-xl hover:bg-blue-700 transition duration-300"
          >
            Mettre à jour
          </button>
        </form>

        {/* Alertes */}
        {error.status && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error.msg}
          </div>
        )}
        {success.status && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm">
            {success.msg}
          </div>
        )}
      </div>
    </section>
  );
};

export default UpdatePasswordPage;
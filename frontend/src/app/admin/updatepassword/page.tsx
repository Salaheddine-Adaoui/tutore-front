'use client';

import { api } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';

const UpdatePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const [error,setErro] = useState({
    status:false,
    msg:"default msg"
  })

  const [succ,setSucc] = useState({
    status:false,
    msg:"default msg"
  })

  const validate=()=>{
    if (currentPassword.length<0 || newPassword.length<0 || confirmPassword.length<0){
      setErro({...error,status:true,msg:"all filed must be grether than 6 caractere"})
      setSucc({...succ,status:false})
      return false 
    }
    setErro({...error,status:false})
    setSucc({...succ,status:false})
    return true
  }

  const cokie =new Cookies()
  const email=cokie.get('email_admin')

  const handlUpdatePassword = async()=>{
    const obj={
      password:currentPassword,
      new:newPassword,
      confirm:confirmPassword
    }
    await api.post(`/updateadminpassword?email=${email}`,obj)
    .then(res=>console.log(res.data))
    .catch(err=>console.log(err.response.data))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()){
      handlUpdatePassword()
    }
  };

  


  

  

  

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mt-20">
        <p className="font-bold text-2xl  text-center text-gray-700 mb-8">Update Password</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px]  text-gray-500 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[13px] text-gray-500 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[13px]  text-gray-500 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Update Password
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdatePasswordPage;

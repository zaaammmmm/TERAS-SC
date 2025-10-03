// file: src/components/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- DEFINISI ROLE OTENTIKASI ---
const ADMIN_EMAIL = 'admin@teras-sc.id';
const ADMIN_PASSWORD = 'admin123';
const USER_EMAIL = 'user@student.uin-suka.ac.id';
const USER_PASSWORD = '12345';
// ---------------------------------


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let userRole = null;
    let redirectPath = '/';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        userRole = 'admin';
        redirectPath = '/admin/dashboard'; 
    } else if (email === USER_EMAIL && password === USER_PASSWORD) {
        userRole = 'user';
        redirectPath = '/dashboard'; 
    }

    if (userRole) {
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userRole', userRole);
        
        alert(`Login Berhasil! Role: ${userRole.toUpperCase()}`);
        navigate(redirectPath, { replace: true });
    } else {
        alert('Email atau Password salah.');
    }
  };

  // Warna Primer Login: #3f72af (digunakan sebagai bg-[#3f72af])
  return (
    <div className="flex justify-center items-center w-full min-h-screen pt-20 bg-[#F0F8FF]">
      <div className="bg-white p-12 rounded-xl shadow-2xl shadow-black/15 w-full max-w-md text-center">
        <h1 className="text-[#3f72af] mb-1 text-3xl font-bold">TERAS SC</h1>
        <p className="text-gray-600 mt-0 mb-6 text-sm">Student Center Reservation System</p>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          
          <input 
            type="email" 
            placeholder="Email" 
            className="p-3 mb-4 border border-gray-300 rounded-lg text-base focus:border-[#3f72af] focus:ring-1 focus:ring-[#3f72af] focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input 
            type="password" 
            placeholder="Password" 
            className="p-3 mb-4 border border-gray-300 rounded-lg text-base focus:border-[#3f72af] focus:ring-1 focus:ring-[#3f72af] focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-between items-center mb-6 text-sm">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="/forgot-password" className="text-[#3f72af] hover:text-[#2b578c] transition-colors">Forgot Password ?</a>
          </div>

          <button 
            type="submit" 
            className="bg-[#3f72af] text-white p-3 rounded-lg cursor-pointer text-base font-semibold transition-colors duration-300 hover:bg-[#2b578c]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
// src/components/Login.js (Kode UTUH)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // --- Logika Otentikasi (Contoh Sederhana) ---
    console.log('Login attempt:', email, password);
    
    // Simulasikan login berhasil
    if (email === 'user@student.uin-suka.ac.id' && password === '12345') {
        alert('Login Berhasil!');
        navigate('/dashboard'); 
    } else {
        alert('Email atau Password salah.');
    }
    // ---------------------------------------------
  };

  return (
    <div className="login-page-container">
      
      {/* Kotak Utama Login */}
      <div className="login-card">
        <h1 className="title">TERAS SC</h1>
        <p className="subtitle">Student Center Reservation System</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Input Email */}
          <input 
            type="email" 
            placeholder="Youremail@student.uin-suka.ac.id" 
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Input Password */}
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Opsi Remember Me & Forgot Password */}
          <div className="options-row">
            <label className="remember-me-label">
              <input type="checkbox" className="checkbox-input" />
              Remember me
            </label>
            {/* Perbaikan href untuk menghilangkan peringatan jsx-a11y/anchor-is-valid */}
            <a href="/forgot-password" className="forgot-password">Forgot Password ?</a>
          </div>

          {/* Tombol Login */}
          <button type="submit" className="login-submit-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
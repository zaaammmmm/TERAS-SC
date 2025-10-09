import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const API_BASE_URL = 'http://localhost:5000';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      login(data, data.token);
      const redirectPath = data.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-[#F0F8FF] px-4 sm:px-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/10 w-full max-w-[360px] sm:max-w-md text-center">
        {/* Logo / Judul */}
        <h1 className="text-[#3f72af] text-2xl sm:text-3xl font-bold mb-1">TERAS SC</h1>
        <p className="text-gray-600 text-xs sm:text-sm mb-6">
          Student Center Reservation System
        </p>

        {/* Form Login */}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

          {/* Input Email */}
          <input
            type="email"
            placeholder="Email"
            className="p-2 sm:p-3 mb-3 border border-gray-300 rounded-lg text-sm focus:border-[#3f72af] focus:ring-1 focus:ring-[#3f72af] focus:outline-none w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Input Password + Toggle Eye */}
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="p-2 sm:p-3 w-full border border-gray-300 rounded-lg text-sm focus:border-[#3f72af] focus:ring-1 focus:ring-[#3f72af] focus:outline-none pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#3f72af] cursor-pointer transition-colors"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#3f72af] text-white p-2 sm:p-3 rounded-lg text-sm font-semibold hover:bg-[#2b578c] transition-colors duration-300 disabled:opacity-50 w-full"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;

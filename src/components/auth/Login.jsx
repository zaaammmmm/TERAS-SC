import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const API_BASE_URL = 'http://localhost:5000';
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="flex justify-center items-center w-full min-h-screen pt-5 bg-[#F0F8FF]">
      <div className="bg-white p-12 rounded-xl shadow-2xl shadow-black/15 w-full max-w-md text-center">
        <h1 className="text-[#3f72af] mb-1 text-3xl font-bold">TERAS SC</h1>
        <p className="text-gray-600 mt-0 mb-6 text-sm">Student Center Reservation System</p>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}

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

          <button
            type="submit"
            disabled={loading}
            className="bg-[#3f72af] text-white p-3 rounded-lg cursor-pointer text-base font-semibold transition-colors duration-300 hover:bg-[#2b578c] disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          <p>Test Accounts:</p>
          <p>Admin: admin@teras-sc.id / admin123</p>
          <p>User: user@student.uin-suka.ac.id / 12345</p>
          <p>User2: user2@student.uin-suka.ac.id / 12345</p>
          <p>User3: user3@student.uin-suka.ac.id / 12345</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

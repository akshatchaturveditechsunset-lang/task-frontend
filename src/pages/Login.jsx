import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 shadow-xl rounded-2xl w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold rounded-lg px-4 py-3 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}
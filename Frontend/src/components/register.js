import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/resume/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Registration successful!', {
          autoClose: 3000,
          onClose: () => navigate('/'),
        });
      } else {
        const data = await response.json();
        toast.error(data.error || 'Registration failed', {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred. Please try again.', {
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="mb-6 text-2xl font-bold text-center">Register</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
            <button
  type="submit"
  className="flex items-center justify-center w-full py-2 text-white bg-blue-500 rounded-md"
>
  {isLoading ? 'Registering...' : 'Register'}
  <ArrowRight className="ml-2" size={20} />
</button>

          </form>
          <div className="mt-4 text-center">
            <a href="/login" className="text-blue-500 hover:underline">
              Already have an account? Login
            </a>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;

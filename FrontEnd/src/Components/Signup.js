import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      setError('Please verify that you are human.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/register', {
        email,
        password,
        captcha: captchaValue,
      });

      if (response.status === 201) {
        navigate('/login');
      } else {
        setError('This email is already registered');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError('This email is already registered');
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1723384747376-90f201a3bd55?q=80&w=1542&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-blue-600/20 z-0"></div>

      <motion.div
        className="relative z-10 bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl px-10 py-12 max-w-md w-full"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-6">Create Account</h2>

        <form onSubmit={handleSignup}>
          <div className="mb-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-4 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-4 pr-12 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-4 text-gray-500 hover:text-blue-600 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <div className="mb-6">
            <ReCAPTCHA
              sitekey="6LdnSycrAAAAAMouYN_TxyO-57vrZHiZ7jALjuK2"
              onChange={(value) => setCaptchaValue(value)}
            />
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

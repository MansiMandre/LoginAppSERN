import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../AuthContext';
import { FaBoxOpen, FaPlusCircle, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [productCount, setProductCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    axios.get('http://localhost:3001/product')
      .then(res => setProductCount(res.data.length))
      .catch(err => console.error('Error fetching product count', err));

    // Live clock update
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToProducts = () => navigate('/product');
  const handleAddProduct = () => navigate('/addproduct');

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://cdn.pixabay.com/video/2020/04/07/35264-407130725_large.mp4" // Replace with your video path
        type="video/mp4"
        autoPlay
        loop
        muted
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Navbar */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-blue-800 text-xl font-semibold">
          <FaUserCircle className="text-2xl" />
          {user?.email || 'User'}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </nav>

      {/* Dashboard Content */}
      <motion.div
        className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-xl text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-blue-700 mb-1">Welcome Back!</h2>
          <p className="text-gray-600 mb-4">Effortlessly manage your inventory</p>

          {/* Live Clock */}
          <p className="text-sm text-gray-500 mb-4">
            {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
          </p>

          {/* Stats */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6"
          >
            <p className="text-lg font-semibold text-blue-900">
              Total Products: <span className="font-bold">{productCount}</span>
            </p>
          </motion.div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={goToProducts}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow transition duration-300"
            >
              <FaBoxOpen />
              View Products
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddProduct}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md shadow transition duration-300"
            >
              <FaPlusCircle />
              Add Product
            </motion.button>
          </div>

          {/* Tips Section */}
          <div className="mt-8 text-sm text-left text-gray-700 border-t pt-4">
            <h3 className="font-semibold mb-2 text-blue-800">Quick Tips:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Click "Add Product" to expand your inventory.</li>
              <li>Use the search bar in product list to quickly find items.</li>
              <li>Always double-check before deleting a product.</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

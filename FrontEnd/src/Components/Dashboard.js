import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../AuthContext';
import './Dashboard.css'; // Optional: additional custom CSS

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToProducts = () => {
    navigate('/product');
  };

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-white to-purple-100 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-2">
          Welcome, <span className="text-gray-800">{user.email || 'User'}</span>
        </h2>
        <p className="text-gray-600 mb-6">
          You're now logged in to your dashboard.
        </p>

        <div className="space-y-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={goToProducts}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow transition duration-300"
          >
            View Products
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddProduct}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md shadow transition duration-300"
          >
            Add Product
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md shadow transition duration-300"
          >
            Logout
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;

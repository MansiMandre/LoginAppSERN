// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Dashboard from './Components/Dashboard';
import { AuthProvider } from './AuthContext';
import axios from 'axios';
import ProductList from './Components/ProductsList';
import AddProductForm from './Components/AddProductForm';
import EditProduct from './Components/EditProduct';


// Axios request interceptor to add the token to the headers
axios.interceptors.request.use(
  (config) => { console.log('API Request:', config);
    // console.log(config.data.email,'eeeeeeeeeeeeeeeeeeee');
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => { console.error('API Request Error:', error); // Log any errors
    return Promise.reject(error);
  }
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product" element={<ProductList />} />
          <Route path="/addproduct" element={<AddProductForm />} />
          <Route path="/edit-product/:id" element={<EditProduct/>} />
        


        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

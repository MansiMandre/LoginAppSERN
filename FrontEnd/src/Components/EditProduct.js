import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProductForm = () => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/editproduct/${id}`);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/productedit/${id}`, {
        ...product,
      });
      alert('Product updated successfully');
      navigate('/product'); // Redirect to product list
    } catch (err) {
      setError('Failed to update product');
    }
  };

  if (error) return <p className="text-center text-red-600 mt-8">{error}</p>;

  return product ? (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 px-4 pt-28">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md py-4 px-6 fixed top-0 left-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Product Manager</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/product')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Product List
            </button>
            <button
              onClick={() => navigate('/addproduct')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Add Product
            </button>
          </div>
        </div>
      </nav>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Edit Product</h2>

        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring focus:ring-blue-400 outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring focus:ring-blue-400 outline-none"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring focus:ring-blue-400 outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 font-semibold mb-2">Image URL</label>
          <input
            type="text"
            name="image_url"
            value={product.image_url}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full mb-4 bg-gray-300 text-gray-800 py-3 rounded-md hover:bg-gray-400 transition"
        >
          Back
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  ) : (
    <p className="text-center mt-8">Loading...</p>
  );
};

export default EditProductForm;

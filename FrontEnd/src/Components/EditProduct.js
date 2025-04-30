import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditProductForm = () => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams();

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
    

    
    // let { id, product } = product;
    try {
      await axios.put(`http://localhost:3001/productedit/${id}`, {
       
       ...product,
      });
      alert('Product updated successfully');
    } catch (err) {
      setError('Failed to update product');
    }
  };

  if (error) return <p className="text-center text-red-600 mt-8">{error}</p>;

  return product ? (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
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

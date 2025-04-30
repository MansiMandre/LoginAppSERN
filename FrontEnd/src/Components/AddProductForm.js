import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Optional for subtle animation

const AddProductForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !price) {
      setError("Please fill all the required fields.");
      return;
    }

    const newProduct = {
      name,
      description,
      price,
      image_url: image_url || "https://source.unsplash.com/300x200/?product",
    };

    try {
      await axios.post("http://localhost:3001/addProduct", newProduct);
      setSuccess("✅ Product added successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
    } catch (err) {
      setError("❌ Failed to add product. Try again.");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Add a New Product
        </h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Product Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 shadow-sm resize-none"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Price<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              value={image_url}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://source.unsplash.com/..."
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
          </div>

          <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-200 shadow-lg"
            whileTap={{ scale: 0.95 }}
          >
            Add Product
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddProductForm;

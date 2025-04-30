import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Optional for smooth fade-in
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/product")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/product/${id}`);
      setProducts(products.filter((product) => product.id !== id)); // Remove deleted product from the list
      alert("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product");
    }
  };

  return (
    <motion.div
      className="p-6 md:p-10 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8 drop-shadow-md">
        Explore Our Products
      </h1>

      {/* Search Bar */}
      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="🔍 Search products..."
          className="w-full max-w-md p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={product.image_url || "https://source.unsplash.com/400x300/?product"}
              alt={product.name}
              className="w-full h-48 object-cover transition-all duration-500 ease-in-out hover:scale-110"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
              <p className="text-gray-600 text-sm mt-2">{product.description}</p>
              <p className="text-blue-700 font-semibold mt-4 text-lg">
                ${product.price}
              </p>
              {/* Delete and Edit buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/edit-product/${product.id}`)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)} // Trigger deletion
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductList;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaSignOutAlt } from "react-icons/fa"; // ✅ Import this


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Removed undefined logout()
    navigate("/login");
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/product")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: "#f9f9f9",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/productdel/${id}`); // ✅ fixed backticks
        setProducts(products.filter((product) => product.id !== id));
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire("Error!", "There was a problem deleting the product.", "error");
      }
    }
  };

  return (
    <motion.div
      className="p-5 md:p-20 bg-gray-100 min-h-screen pt-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md py-4 px-6 fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Product Manager</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/product")}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Product List
            </button>
            <button
              onClick={() => navigate("/addproduct")}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Add Product
            </button>
            {/* ✅ Logout button placed right after Add Product */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
            
          </div>
        </div>
      </nav>

      <h1 className="text-4xl mt-28 font-extrabold text-center text-blue-800 mb-4 drop-shadow-md">
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
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/edit-product/${product.id}`)} // ✅ fixed string
                  className="bg-yellow-500 text-white py-1 px-3 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
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

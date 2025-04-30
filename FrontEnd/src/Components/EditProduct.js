import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams ,useParams} from 'react-router-dom';
const EditProductForm = ({ match }) => {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const { id } = useParams(); // Access the dynamic route parameter `id`
  console.log(id)
  console.log(id)
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
        await axios.put(`http://localhost:3001/product/${product.id}`, product);
        alert('Product updated successfully');
        // Redirect or update state as needed
      } catch (err) {
        setError('Failed to update product');
      }
    };
  
    if (error) return <p>{error}</p>;
  
    return product ? (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
        />
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
        />
        <input
          type="text"
          name="image_url"
          value={product.image_url}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <button type="submit">Save Changes</button>
      </form>
    ) : (
      <p>Loading...</p>
    );
  };
  export default EditProductForm;
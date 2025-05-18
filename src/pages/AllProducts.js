
import React, { useEffect, useState } from "react";
import "../styles/AllProducts.css"; // Assuming you have a separate CSS file for styling
import { FaTrashAlt } from 'react-icons/fa';
const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all products on component mount
  useEffect(() => {
    fetch("https://women-backend-production.up.railway.app/api/allproducts")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.products) {
          setProducts(data.products); // Assuming data.products contains the product list
        } else {
          setError("No products found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Error fetching products.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle remove product
  const handleRemoveProduct = async (productId) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("You need to be logged in first.");
      return;
    }

    try {
      const response = await fetch(`https://women-backend-production.up.railway.app/api/admin/product/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Send token as Bearer token
        },
      });

      if (response.ok) {
        setProducts(products.filter((product) => product._id !== productId)); // Remove the product from state
        alert("Product removed successfully");
      } else {
        const data = await response.json();
        setError(data.error || "Error removing product");
      }
    } catch (error) {
      setError("Error removing product");
    }
  };

  return (
    <div className="all-products-container">
      <h2>All Products</h2>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td>
                    <img
                      src={product.images[0]} // Assuming the first image is the main image
                      alt={product.name}
                      width="100" // Adjust the width as per your design
                      style={{ borderRadius: "10px" }}
                    />
                  </td>
                  <td>

                    <button onClick={() => handleRemoveProduct(product._id)} className="remove-btn">
              <FaTrashAlt /> {/* React Icons Trash Icon */}
                </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No products available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProducts;


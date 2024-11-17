import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const getProducts = async (searchTerm='') => {
    setLoading(true);
    try {
      const data = await fetchProducts(searchTerm);
      setProducts(data);
      console.log(data);
      
    } catch (error) {
      console.log(error);
      setErrors(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return { products, loading, errors, getProducts };
};

export default useProducts;

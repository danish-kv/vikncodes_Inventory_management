import React, { useEffect, useState } from "react";
import { fetchProductDetails } from "../services/productService";

const useProductDetails = (slug) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const getProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProductDetails(slug);
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

export default useProductDetails;

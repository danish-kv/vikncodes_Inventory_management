import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getProducts = async (
    searchTerm = "",
    category = null,
    sortBy = null,
    currentPage = page
  ) => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (category) params.category = category;
      if (sortBy) params.ordering = sortBy;
      
      const data = await fetchProducts(currentPage, params);
      console.log(params);
            
      setProducts(data.results);
      setTotalPages(Math.ceil(data.count / 9));
      setPage(currentPage);
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

  return { 
    products, 
    loading, 
    errors, 
    getProducts, 
    page, 
    setPage, 
    totalPages 
  };
};

export default useProducts;
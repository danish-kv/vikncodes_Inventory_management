import React, { useEffect, useState } from "react";
import { fetchVariant } from "../services/adminServices";

const useVariants = (slug) => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const getVariants = async () => {
    setLoading(true);
    try {
      const data = await fetchVariant(slug);
      setVariants(data);
    } catch (error) {
      console.log(error); 
      setErrors(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVariants();
  }, []);

  return { variants, loading, errors, getVariants };
};

export default useVariants;

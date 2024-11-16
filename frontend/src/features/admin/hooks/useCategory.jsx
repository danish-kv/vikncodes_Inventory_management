import React, { useEffect, useState } from 'react'
import { fetchCategory } from '../services/adminServices';

const useCategory = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)

    const getCategories = async () => {
        setLoading(true);
        try {
          const data = await fetchCategory();
          setCategories(data);
        } catch (error) {
          console.log(error);
          setErrors(error);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        getCategories();
      }, []);
    
      return { categories, loading, errors, getCategories };
    };
    
    export default useCategory;
    
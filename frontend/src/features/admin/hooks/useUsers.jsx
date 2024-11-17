import { useState, useEffect } from "react";
import { fetchUsers } from "../services/adminServices";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [pagination, setPagination] = useState(null);

  const getUsers = async (searchQuery = "", page = 1) => {
    setLoading(true);
    try {
      const res = await fetchUsers(searchQuery, page);
      setUsers(res.results);
      console.log(res);
      
    } catch (error) {
      console.log(error);
      setErrors(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return { users, loading, errors, getUsers, pagination };
};

export default useUsers;
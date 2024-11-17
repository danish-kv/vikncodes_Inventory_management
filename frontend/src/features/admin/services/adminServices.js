import api from "../../../services/api";

export const fetchCategory = async () => {
  const res = await api.get("/api/category/");
  return res.data;
};

export const fetchUsers = async (search_query = "", page=1) => {
  const res = await api.get("/api/register/", {
    params: {
      search: search_query,
      page : page
    },
  });
  
  return res.data;
};

export const fetchVariant = async (slug) => {
  const res = await api.get(`/api/product/${slug}/variants/`);
  return res.data;
};

export const fetchDashboard = async (slug) => {
  const res = await api.get(`/api/dashboard/`);
  return res.data;
};

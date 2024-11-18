import api from "../../../services/api";

export const fetchProducts = async (params = {}) => {
  const res = await api.get("api/product/", { params });
  return res.data;
};

export const fetchProductDetails = async (slug) => {
  const res = await api.get(`api/product/${slug}/`);
  return res.data;
};

export const fetchCategory = async () => {
  const res = await api.get(`api/category/`);
  return res.data;
};

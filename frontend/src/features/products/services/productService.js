import api from "../../../services/api";

export const fetchProducts = async (page, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await api.get(`/api/product/?page=${page}&${queryString}`);
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

import api from "../../../services/api"

export const fetchProducts = async () =>{
    const res = await api.get('api/product/')
    return res.data
}


export const fetchProductDetails = async (slug) =>{
    const res = await api.get(`api/product/{slug}/`)
    return res.data
}
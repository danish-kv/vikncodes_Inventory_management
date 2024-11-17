import api from "../../../services/api"


export const fetchCategory = async () => {
    const res = await api.get('/api/category/')
    return res.data
}

export const fetchUsers = async () => {
    const res = await api.get('/api/register/')
    return res.data
}

export const fetchVariant = async (slug) => {
    const res = await api.get(`/api/product/${slug}/variants/`)
    return res.data
}





import api from "../../../services/api"


export const fetchCategory = async () => {
    const res = await api.get('/api/category/')
    return res.data
}

export const fetchUsers = async () => {
    const res = await api.get('/api/register/')
    return res.data
}





import axios from 'axios'
const baseUrl = '/api/persons'

let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}
const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const create = async newPhone => {
    const config = {
        headers: {Authorization: token},
    }
    const response = await axios.post(baseUrl, newPhone, config)
    return response.data
}

const updatePerson = (newPhone, id) => {
    return axios.put(`${baseUrl}`,newPhone).then(response=>response.data)
}

const deletePerson = id => {

    return axios.delete(`${baseUrl}/${id}`).then(response=>response.data)
}

export default {getAll, create, updatePerson, deletePerson, setToken}
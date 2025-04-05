import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const create = newPhone => {
    return axios.post(baseUrl, newPhone).then(response=>response.data)
}

const updatePerson = (newPhone, id) => {
    return axios.put(`${baseUrl}`,newPhone).then(response=>response.data)
}

const deletePerson = id => {

    return axios.delete(`${baseUrl}/${id}`).then(response=>response.data)
}

export default {getAll, create, updatePerson, deletePerson}
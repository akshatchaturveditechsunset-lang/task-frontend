import axios from 'axios';

const API = axios.create({
    baseURL: 'https://task-api-be6q.onrender.com/api',
    withCredentials: true,
});

export default API;
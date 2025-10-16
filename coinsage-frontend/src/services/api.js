import axios from 'axios';

const api = axios.create({
    baseURL: 'https://coinsage-backend.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = config.headers.Authorization?.split(' ')[1];
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401) {
            console.error('Unauthorised, token may have expired');
        }
        return Promise.reject(error);
    }
);

export default api;
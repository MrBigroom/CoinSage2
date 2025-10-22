import AsyncStorage from '@react-native-async-storage/async-storage';
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
    async(error) => {
        const originalRequest = error.config;
        if(error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await api.post('/api/auth/refresh-token', { refreshToken: await AsyncStorage.getItem('refreshToken') });
                const { token } = refreshResponse.data;
                await AsyncStorage.setItem('token', token);
                api.defaults.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch(refreshError) {
                console.error('Refresh token failed: ', refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
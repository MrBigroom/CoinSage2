import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'http://192.168.0.176:5000/api',
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async(config) => {
    const token = await AsyncStorage.getItem('token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getTransactions = () => api.get('/transactions');
export const createTransaction = (data) => api.post('/transactions', data);
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);
export const getBalance = () => api.get('/transactions/balance');
export const categoriseTransaction = (data) => api.post('/ai/categorise', data);
export const getCategories = () => api.get('/categories');
export const getBudgets = () => api.get('/budgets');
export const createBudget = (data) => api.post('/budgets', data);
export const updateBudget = (id, data) => api.put(`/budgets/${id}`, data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);
export const getAIModelLogs = () => api.get('/transactions/logs');
export const getAIPerformance = () => api.get('/transactions/performance');
export const getOverallAccuracy = () => api.get('/transactions/overall-accuracy');
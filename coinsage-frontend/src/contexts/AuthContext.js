import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        const loadStorageData = async() => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                const storedUser = await AsyncStorage.getItem('user');
                if(storedToken && storedUser) {
                    api.defaults.headers.Authorization = `Bearer ${storedToken}`;
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch(error) {
                console.error('Error loading storage data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadStorageData();
    }, []);

    const login = async(username, password) => {
        try {
            const response = await api.post('/api/auth/login', { username, password });
            if(response.data.success) {
                const { token, data: { user } } = response.data;
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('user', JSON.stringify(user));
                setToken(token);
                setUser(user);
            }
        } catch(error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const signup = async(username, email, password) => {
        try {
            const response = await api.post('/api/auth/register', { username, email, password });
            if(response.data.success) {
                const { token, data: { user } } = response.data;
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('user', JSON.stringify(user));
                setToken(token);
                setUser(user);
            } 
        } catch(error) {
                throw new Error(error.response?.data?.message || 'Sign up failed');
        }
    };

    const logout = async() => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        api.defaults.headers.Authorization = null;
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
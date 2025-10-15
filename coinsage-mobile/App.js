import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { registerRootComponent } from 'expo';
import { getUser } from './src/services/api';
import axios from 'axios';
import { View, ActivityIndicator, Alert } from 'react-native';
import { UserProvider, useUser } from './src/contexts/UserContext';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, setAccessToken, setRefreshToken, logout } = useUser();

  useEffect(() => {
    const refreshAccessToken = async() => {
      try {
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
        if(storedRefreshToken) {
          const response = await axios.post('https://coinsage-backend.onrender.com/api/auth/refresh-token', { refreshToken: storedRefreshToken });
          const { token, refreshToken: newRefreshToken } = response.data;
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
          setAccessToken(token);
          setRefreshToken(newRefreshToken);
          return true;
        }
        return false;
      } catch(error) {
        console.error('Token refresh failed: ', error);
        await logout();
        return false;
      }
    };

    const bootstrapApp = async() => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
        
        if(storedToken && storedRefreshToken) {
          const isRefreshed = await refreshAccessToken();
          if(isRefreshed) {
            setAccessToken(storedToken);
            setRefreshToken(storedRefreshToken);

            const userResponse = await getUser();
            setUser(userResponse.data.data.user);
          }
        }
      } catch(error) {
        console.error('Bootstrap error: ', error);
        Alert.alert('Error', 'Failed to load app. Please log in again');
        await logout();
      } finally {
        setIsLoading(false);
      }
    };
    bootstrapApp();
  }, [setUser, setAccessToken, setRefreshToken, logout]);

  if(isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF"></ActivityIndicator>
      </View>
      );
  }
  return <AppNavigator />
}

function App() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const logout = async() => {
    await AsyncStorage.multiRemove(['token', 'refreshToken']);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <UserProvider value={{ user, accessToken, refreshToken, logout, setUser, setAccessToken, setRefreshToken }}>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </UserProvider>
  );
}
  

export default registerRootComponent(App);
import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { registerRootComponent } from 'expo';
import { getUser } from './src/services/api';
import axios from 'axios';
import { View, ActivityIndicator, Alert } from 'react-native';

const UserContext = React.createContext();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const refreshAccessToken = async() => {
    try {
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      if(storedRefreshToken) {
        const response = await axios.post('http://192.168.0.176:5000/api/auth/refresh-token', { refreshToken: storedRefreshToken });
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

  const logout = async() => {
    await AsyncStorage.multiRemove(['token', 'refreshToken']);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setInitialRoute('Login');
  };

  useEffect(() => {
    const bootstrapApp = async() => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
        
        if(storedToken && storedRefreshToken) {
          const isRefreshed = await refreshAccessToken();
          if(isRefreshed) {
            setAccessToken(storedToken);
            setRefreshToken(storedRefreshToken);
            setInitialRoute('Main');

            const userResponse = await getUser();
            setUser(userResponse.data.data.user);
          } else {
            setInitialRoute('Login');
          }
        } else {
          setInitialRoute('Login');
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
  }, []);

  if(isLoading) {
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF"></ActivityIndicator>
    </View>
  }

  return (
    <UserContext.Provider value={{ user, accessToken, refreshToken, logout }}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </UserContext.Provider>
  );
}

export default registerRootComponent(App);

export const useUser = () => useContext(UserContext);
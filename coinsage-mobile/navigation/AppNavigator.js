import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useUser } from '../App';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator();

function AppNavigator() {
    const { user, accessToken, logout } = useUser();
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
        >
            {!user ? (
                <>
                    <Stack.Screen name='Login' component={LoginScreen} />
                    <Stack.Screen name='Signup' component={SignupScreen} />
                </>
            ) : (
                <Stack.Screen name='Main' component={MainTabNavigator} />
            )}
        </Stack.Navigator>
    );
}

export default AppNavigator;
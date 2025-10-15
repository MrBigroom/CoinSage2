import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, TouchableOpacity } from 'react-native';
import { useUser } from '../src/contexts/UserContext';
import { useNavigation } from '@react-navigation/native'
import TransactionsScreen from '../screens/Transactions/TransactionsScreen';
import BudgetsScreen from '../screens/Budgets/BudgetsScreen';
import AnalyticsScreen from '../screens/Analytics/AnalyticsScreen';
import AIModelLogScreen from '../screens/AI Model Log/AIModelLogScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ route }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{route.name} Screen (Coming Soon)</Text>
    </View>
);

function MainTabNavigator() {
    const { user, logout } = useUser();
    const navigation = useNavigation();

    if(!user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Please log in to use the app</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text>Go to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#666',
            }}
        >
            <Tab.Screen
                name='Transactions'
                component={TransactionsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Icon name='list' color={color} size={size} />
                }}
            />
            <Tab.Screen
                name='Budgets'
                component={BudgetsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Icon name='account-balance' color={color} size={size} />
                }}
            />
            <Tab.Screen
                name='Analytics'
                component={AnalyticsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Icon name='bar-chart' color={color} size={size} />
                }}
            />
            <Tab.Screen
                name='AI Model Log'
                component={AIModelLogScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Icon name='model-training' color={color} size={size} />
                }}
            />
            <Tab.Screen
                name='Logout'
                component={() => {
                    logout();
                    return null;
                }}
                options={{
                    tabBarLabel: 'Logout',
                    tabBarIcon: ({ color, size }) => <Icon name='logout' color={color} size={size} />
                }}

            />
        </Tab.Navigator>
    );
}

export default MainTabNavigator;
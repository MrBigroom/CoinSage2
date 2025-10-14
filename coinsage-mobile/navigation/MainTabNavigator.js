import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, TouchableOpacity } from 'react-native';
import { useUser } from '../App';
import { useNavigation } from '@react-navigation/native'
import TransactionsScreen from '../screens/Transactions/TransactionsScreen';
import BudgetsScreen from '../screens/Budgets/BudgetsScreen';
import AnalyticsScreen from '../screens/Analytics/AnalyticsScreen';
import AIModelLogScreen from '../screens/AI Model Log/AIModelLogScreen';

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
        <Tab.Navigator>
            <Tab.Screen name='Transactions' component={TransactionsScreen} />
            <Tab.Screen name='Budgets' component={BudgetsScreen} />
            <Tab.Screen name='Analytics' component={AnalyticsScreen} />
            <Tab.Screen name='AI Model Log' component={AIModelLogScreen} />
            <Tab.Screen
                name='Logout'
                component={() => {
                    logout();
                    return null;
                }}
                options={{ tabBarLabel: 'Logout' }}
            />
        </Tab.Navigator>
    );
}

export default MainTabNavigator;
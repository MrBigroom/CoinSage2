import React, { useContext, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../src/contexts/AuthContext";
import TransactionsScreen from "../screens/Transactions/TransactionsScreen";
import BudgetsScreen from "../screens/Budgets/BudgetsScreen"
import AnalyticsScreen from "../screens/Analytics/AnalyticsScreen";
import AIModelLogScreen from "../screens/AI Model Log/AIModelLogScreen";

const Tab = createBottomTabNavigator();

const LogoutScreen = () => {
    const { logout } = useContext(AuthContext);
    const navigation = useNavigation();

    useEffect(() => {
        logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }, [logout, navigation]);

    return null;
};

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#666',
            }}
        >
            <Tab.Screen
                name="Transactions"
                component={TransactionsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Budgets"
                component={BudgetsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="logo-usd" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Analytics"
                component={AnalyticsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="AI Model Log"
                component={AIModelLogScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="logo-python" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Logout"
                component={LogoutScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="log-out" color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
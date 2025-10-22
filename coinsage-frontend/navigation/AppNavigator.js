import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../src/contexts/AuthContext";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignupScreen from "../screens/Auth/SignupScreen";
import AddTransactionDialog from "../screens/Transactions/AddTransactionDialog";
import EditTransactionDialog from "../screens/Transactions/EditTransactionDialog";
import AddBudgetDialog from "../screens/Budgets/AddBudgetDialog";
import EditBudgetDialog from "../screens/Budgets/EditBudgetDialog";
import TransactionsScreen from "../screens/Transactions/TransactionsScreen";
import BudgetsScreen from "../screens/Budgets/BudgetsScreen";
import AnalyticsScreen from "../screens/Analytics/AnalyticsScreen";
import AIModelLogScreen from "../screens/AI Model Log/AIModelLogScreen";
import MainTabNavigator from "./MainTabNavigator";

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useContext(AuthContext);
    
    if(loading) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={user ? 'Tab' : 'Login'}
                screenOptions={{ headerShown: false }}
            >
                {user ? (
                    <>
                        <Stack.Screen name="Tab" component={MainTabNavigator} />
                        <Stack.Screen
                            name="AddTransaction"
                            component={AddTransactionDialog}
                            options={{ presentation: 'modal' }}
                        />
                        <Stack.Screen
                            name="EditTransaction"
                            component={EditTransactionDialog}
                            options={{ presentation: 'modal' }}
                        />
                        <Stack.Screen
                            name="AddBudget"
                            component={AddBudgetDialog}
                            options={{ presentation: 'modal' }}
                        />
                        <Stack.Screen
                            name="EditBudget"
                            component={EditBudgetDialog}
                            options={{ presentation: 'modal' }}
                        />
                        <Stack.Screen name="Transactions" component={TransactionsScreen} />
                        <Stack.Screen name="Budgets" component={BudgetsScreen} />
                        <Stack.Screen name="Analytics" component={AnalyticsScreen} />
                        <Stack.Screen name="AIModelLog" component={AIModelLogScreen} />
                    </>
                        
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;
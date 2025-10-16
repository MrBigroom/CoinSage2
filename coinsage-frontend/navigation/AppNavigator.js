import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../src/contexts/AuthContext";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignupScreen from "../screens/Auth/SignupScreen";
import TransactionsScreen from "../screens/Transactions/TransactionsScreen";
import AddTransactionDialog from "../screens/Transactions/AddTransactionDialog";
import EditTransactionDialog from "../screens/Transactions/EditTransactionDialog";

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useContext(AuthContext);
    
    if(loading) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={user ? 'Transactions' : 'Login'}
                screenOptions={{ headerShown: false }}
            >
                {user ? (
                    <>
                        <Stack.Screen name="Transactions" component={TransactionsScreen} />
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
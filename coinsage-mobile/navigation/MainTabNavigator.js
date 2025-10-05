import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ route }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{route.name} Screen (Coming Soon)</Text>
    </View>
);

function MainTabNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name='Transactions' component={PlaceholderScreen} />
            <Tab.Screen name='Budgets' component={PlaceholderScreen} />
            <Tab.Screen name='Analytics' component={PlaceholderScreen} />
            <Tab.Screen name='AI Model Log' component={PlaceholderScreen} />
        </Tab.Navigator>
    );
}

export default MainTabNavigator;
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { getOverallAccuracy } from '../../src/services/api';
import RecentLogsTab from "./RecentLogsTab";
import PerformanceTab from "./PerformanceTab";
import styles from './AIModelLogStyles';

const Tab = createMaterialTopTabNavigator();

const AIModelLogScreen = () => {
    const [overallAccuracy, setOverallAccuracy] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOverallAccuracy = async() => {
            try {
                setLoading(true);
                const response = await getOverallAccuracy();
                setOverallAccuracy(response.data.data.overall_accuracy);
            } catch(error) {
                Alert.alert('Error', 'Failed to fetch overall accuracy');
            } finally {
                setLoading(false);
            }
        };
        fetchOverallAccuracy();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>AI Model Log</Text>
            <Text style={styles.accuracyText}>Overall Accuracy: {overallAccuracy.toFixed(2)}%</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <Tab.Navigator
                    screenOptions={{
                        tabBarActiveTintColor: '#007AFF',
                        tabBarInactiveTintColor: '#666',
                        tabBarIndicatorStyle: { backgroundColor: '#007AFF' },
                        tabBarLabelStyle: { fontSize: 16, fontWeight: '500' },
                    }}
                >
                    <Tab.Screen name="Recent Logs" component={RecentLogsTab} />
                    <Tab.Screen name="Performance" component={PerformanceTab} />
                </Tab.Navigator>
            )}
        </ScrollView>
    );
 };

 export default AIModelLogScreen;
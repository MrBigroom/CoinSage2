import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { getAIPerformance } from '../../src/services/api';
import styles from './AIModelLogSytles';

const PerformanceTab = () => {
    const [performance, setPerformance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerformance = async() => {
            try {
                setLoading(true);
                const response = await getAIPerformance();
                setPerformance(response.data.data);
            } catch(error) {
                Alert.alert('Error', 'Failed to fetch performance');
            } finally {
                setLoading(false);
            }
        };
        fetchPerformance();
    }, []);

    return (
        <View style={styles.tabContainer}>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <FlatList
                    data={performance}
                    keyExtractor={(item) => item.category_name}
                    renderItem={({ item }) => (
                        <PerformanceTab
                            category_name={item.category_name}
                            totalTransactions={item.totalTransactions}
                            accuracy={item.accuracy}
                            averageConfidence={item.average_confidence}
                        />
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No performance found</Text>}
                />
            )}
        </View>
    );
};

export default PerformanceTab;
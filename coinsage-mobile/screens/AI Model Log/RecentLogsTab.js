import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { getAIModelLogs } from '../../src/services/api';
import LogItem from './LogItem';
import styles from './AIModelLogStyles';

const RecentLogsTab = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async() => {
            try {
                setLoading(true);
                const response = await getAIModelLogs();
                setLogs(response.data.data);
            } catch(error) {
                Alert.alert('Error', 'Failed to fetch logs');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    console.log('RecentLogsTab styles: ', styles);

    return (
        <View style={styles.tabContainer}>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <FlatList
                    data={logs}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <LogItem
                            title={item.transaction_id.title}
                            date={item.transaction_id.date}
                            predictedCategory={item.predicted_category}
                            confidence={item.confidence_score}
                            actualCategory={item.status === 'Incorrect' ? item.actual_category : null}
                            status={item.status}
                            amount={item.transaction_id.transaction_amount}
                        />
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No logs found</Text>}
                />
            )}
        </View>
    );
};

export default RecentLogsTab;
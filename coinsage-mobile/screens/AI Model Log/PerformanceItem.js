import React from "react";
import { View, Text } from 'react-native';
import styles from './AIModelLogStyles';

const PerformanceItem = ({ categoryName, totalTransactions, accuracy, averageConfidence }) => {
    return (
        <View style={styles.performanceItem}>
            <Text style={styles.performanceText}>{categoryName}</Text>
            <Text style={styles.performanceSubText}>Total: {totalTransactions}</Text>
            <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>Accuracy: {accuracy.toFixed(2)}%</Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${Math.min(accuracy, 100)}%` }]}/>
                </View>
            </View>
            <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>Avg Confidence: {averageConfidence.toFixed(2)}%</Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${Math.min(averageConfidence, 100)}%` }]} />
                </View>
            </View>
        </View>
    );
};

export default PerformanceItem;
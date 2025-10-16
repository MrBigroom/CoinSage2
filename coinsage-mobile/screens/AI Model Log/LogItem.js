import React from 'react';
import { View, Text } from 'react-native';
import { format } from 'date-fns';
import styles from './AIModelLogStyles';

const LogItem = ({ title, date, predictedCategory, confidence, actualCategory, status, amount }) => {
    console.log('LogItem styles: ', styles);
    
    return (
        <View style={styles.logItem}>
            <View>
                <Text style={styles.logText}>{title}</Text>
                <Text style={styles.logSubText}>
                    {format(new Date(date), 'MM/dd/yyyy')} • Predicted: 
                    {predictedCategory} ({(confidence * 100).toFixed(2)}%)
                </Text>
                {actualCategory && (
                    <Text style={styles.logSubText}>
                        Actual: {actualCategory} • Status {status}
                    </Text>
                )}
                {!actualCategory && (
                    <Text style={styles.logSubText}>Status: {status}</Text>
                )}
            </View>
            <Text style={[
                styles.logAmount,
                amount < 0 ? styles.expense : styles.income,
            ]}>
                {amount < 0 ? '-' : '+'}RM{Math.abs(amount).toFixed(2)}
            </Text>
        </View>
    );
};

export default LogItem;
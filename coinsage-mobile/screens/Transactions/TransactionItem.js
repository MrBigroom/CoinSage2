import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { format } from "date-fns";
import styles from './TransactionsStyles';

const TransactionItem = ({ transaction, onEdit }) => {
    return (
        <View style={styles.transactionItem}>
            <View>
                <Text style={styles.transactionText}>{transaction.title} ({transaction.category_id?.name || 'Uncategorised'})</Text>
                <Text style={styles.transactionSubText}>
                    {format(new Date(transaction.date), 'MM dd, yyyy')} - {transaction.category_id}
                </Text>
            </View>
            <View style={styles.transactionRight}>
                <Text style={[styles.transactionText, transaction.transaction_amount < 0 ? styles.expense : styles.income,]}>
                    {transaction.transaction_amount < 0 ? '-' : '+'}RM{Math.abs(transaction.transaction_amount).toFixed(2)}
                </Text>
                <TouchableOpacity style={styles.editButton} onPress={() => onEdit(transaction)}>
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default TransactionItem;
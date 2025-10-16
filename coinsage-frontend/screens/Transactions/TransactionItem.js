import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import styles from "./TransactionsStyles";

const TransactionItem = ({ transaction, onEdit }) => {
    const { title, category_id, date, description, transaction_amount } = transaction;
    const isIncome = transaction_amount > 0;

    return (
        <TouchableOpacity onPress={() => onEdit(transaction)}>
            <View style={styles.itemContainer}>
                <View style={styles.itemLeft}>
                    <Text style={styles.itemTitle}>
                        {title} <Text style={styles.itemCategory}>({category_id.name})</Text>
                    </Text>
                    <Text style={styles.itemDate}>{new Date(date).toLocaleDateString()}</Text>
                    {description ? <Text style={styles.itemDescription}>{description}</Text> : null}
                </View>
                <Text style={isIncome ? styles.itemAmountIncome : styles.itemAmountExpense}>
                    {isIncome ? '+' : '-'}RM{Math.abs(transaction_amount).toFixed(2)}
                </Text>
            </View>
        </TouchableOpacity>
    );;
};

export default TransactionItem;
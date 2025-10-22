import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getTransactions, getBalance } from "../../src/services/api";
import AddTransactionDialog from "./AddTransactionDialog";
import EditTransactionDialog from "./EditTransactionDialog";
import TransactionItem from "./TransactionItem";
import styles from './TransactionsStyles';

const TransactionsScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [isAddDialogVisible, setAddDialogVisible] = useState(false);
    const [isEditDialogVisible, setEditDialogVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async() => {
        try {
            setLoading(true);
            const [transactionResponse, balanceResponse] = await Promise.all([getTransactions(), getBalance()]);
            setTransactions(transactionResponse.data.data);
            setBalance(balanceResponse.data.data.balance);
        } catch(error) {
            Alert.alert('Error', 'Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleEdit = (transaction) => {
        setSelectedTransaction(transaction);
        setEditDialogVisible(true);
    };

    console.log('TransactionsScreen styles:', styles);
    console.log('Rendering TransactionsScreen');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transactions</Text>
            <Text style={[styles.balanceText, balance < 0 ? styles.expense : styles.income]}>
                Current Balance: RM{balance.toFixed(2)}
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => setAddDialogVisible(true)}>
                <Text style={styles.buttonText}>+ Add</Text>
            </TouchableOpacity>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TransactionItem transaction={item} onEdit={handleEdit} />
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
                />
            )}
            <AddTransactionDialog
                isVisible={isAddDialogVisible}
                onClose={() => setAddDialogVisible(false)}
                onTransactionAdded={fetchTransactions}
            />
            <EditTransactionDialog
                isVisible={isEditDialogVisible}
                onClose={() => {
                    setEditDialogVisible(false);
                    setSelectedTransaction(null);
                }}
                transaction={selectedTransaction}
                onTransactionUpdated={fetchTransactions}
            />
        </View>
    );
};

export default TransactionsScreen;
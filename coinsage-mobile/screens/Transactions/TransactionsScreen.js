import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getTransactions } from "../../src/services/api";
import AddTransactionDialog from "./AddTransactionDialog";
import EditBudgetDialog from "../Budgets/EditBudgetDialog";
import TransactionItem from "./TransactionItem";
import styles from './TransactionsStyles';

const TransactionsScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [isAddDialogVisible, setAddDialogVisible] = useState(false);
    const [isEditDialogVisible, setEditDialogVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async() => {
        try {
            setLoading(true);
            const response = await getTransactions();
            setTransactions(response.data.data);
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transactions</Text>
            <TouchableOpacity style={styles.button} onPress={() => setAddDialogVisible(true)}>
                <Text style={styles.buttonText}>Add Transaction</Text>
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
            <EditBudgetDialog
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
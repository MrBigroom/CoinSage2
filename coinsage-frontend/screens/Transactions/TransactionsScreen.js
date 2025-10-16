import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../src/contexts/AuthContext";
import TransactionItem from "./TransactionItem";
import api from "../../src/services/api";
import styles from "../Auth/AuthStyles";

const TransactionsScreen = () => {
    const { logout } = useContext(AuthContext);
    const navigation = useNavigation();
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchTransactions = async() => {
            try {
                const response = await api.get('/api/transactions');
                if(response.data.success) {
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    const monthlyTransactions = response.data.data.filter((t) => {
                        const date = new Date(t.date);
                        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                    });
                    setTransactions(response.data.data);
                    const monthlyBalance = monthlyTransactions.reduce((sum, t) => sum + t.transaction_amount, 0);
                    setBalance(monthlyBalance);
                }
            } catch(error) {
            console.error('Error fetching transactions: ', error);
            }
        };
        fetchTransactions();
    }, []);

    const handleEdit = (transaction) => {
        NavigationActivation.navigate('EditTransaction', { transaction });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transactions</Text>
            <Text style={styles.balance}>
                Monthly Balance: {balance >= 0 ? '+' : '-'}RM{Math.abs(balance).toFixed(2)}
            </Text>
            <FlatList
                data={transactions}
                renderItem={({ item }) => <TransactionItem transaction={item} onEdit={handleEdit} />}
                keyExtractor={(item) => item._id}
                style={styles.list}
            />
            <TouchableOpacity style={styles.cancelButton} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddTransaction')}>
                <Text style={styles.buttonText}>Add Transaction</Text>
            </TouchableOpacity>
            
        </View>
    );
};

export default TransactionsScreen;
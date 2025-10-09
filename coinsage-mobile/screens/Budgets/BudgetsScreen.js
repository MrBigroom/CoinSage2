import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import { getBudgets, getTransactions } from '../../src/services/api';
import AddBudgetDialog from './AddBudgetDialog';
import EditBudgetDialog from './EditBudgetDialog';
import BudgetItem from './BudgetItem';
import styles from './BudgetsStyles';

const BudgetsScreen = () => {
    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isAddDialogVisible, setAddDialogVisible] = useState(false);
    const [isEditDialogVisible, setEditDialogVisible] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async() => {
        try {
            setLoading(true);
            const [budgetResponse, transactionResponse] = await Promise.all([
                getBudgets(),
                getTransactions(),
            ]);
            setBudgets(budgetResponse.data.data);
            setTransactions(transactionResponse.data.data);
        } catch(error) {
            Alert.alert('Error', 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getCurrentMonthBudgets = () => {
        const now = new Date();
        const startOfCurrentMonth = startOfMonth(now);
        const endOfCurrentMonth = endOfMonth(now);
        return budgets.filter(
            (b) =>
                new Date(b.start_date) <= endOfCurrentMonth &&
                new Date(b.end_date) >= startOfCurrentMonth
        );
    };

    const calculateComparison = () => {
        const now = new Date();
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = endOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));

        const thisMonthBudgets = budgets.filter(
            (b) => new Date(b.start_date) <= thisMonthEnd && new Date(b.end_date) >= thisMonthStart
        );
        const lastMonthBudgets = budgets.filter(
            (b) => new Date(b.start_date) <= lastMonthEnd && new Date(b.end_date) >= lastMonthStart
        );

        const thisMonthSpending = thisMonthBudgets.reduce((sum, b) => sum + b.spent_amount, 0);
        const lastMonthSpending = lastMonthBudgets.reduce((sum, b) => sum + b.spent_amount, 0);
        const thisMonthBudget = thisMonthBudgets.reduce((sum, b) => sum + b.budget_amount, 0);
        const lastMonthBudget = lastMonthBudgets.reduce((sum, b) => sum + b.budget_amount, 0);

        const spendingChange = lastMonthSpending > 0
            ? ((thisMonthSpending - lastMonthSpending) / lastMonthSpending) * 100
            : thisMonthSpending > 0 ? 100 : 0;
        const adherenceThisMonth = thisMonthBudget > 0
            ? (thisMonthSpending / thisMonthBudget) * 100
            : 0;
        const adherenceLastMonth = lastMonthBudget > 0
            ? (lastMonthSpending / lastMonthBudget) * 100
            : 0;
        const adherenceChange = adherenceThisMonth - adherenceLastMonth;

        return {
            spending: { thisMonth: thisMonthSpending, lastMonth: lastMonthSpending, change: spendingChange },
            adherence: { thisMonth: adherenceThisMonth, lastMonth: adherenceLastMonth, change: adherenceChange },
        };
    };

    const comparison = calculateComparison();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>Budgets</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setAddDialogVisible(true)}
            >
                <Text style={styles.buttonText}>Add Budget</Text>
            </TouchableOpacity>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <>
                    <FlatList
                        data={getCurrentMonthBudgets()}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <BudgetItem budget={item} onEdit={setSelectedBudget} />
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>No budgets found</Text>}
                    />
                    <View style={styles.comparisonContainer}>
                        <Text style={styles.comparisonTitle}>This Month vs Last Month</Text>
                        <Text style={styles.comparisonText}>
                            Total Spending: RM{comparison.spending.thisMonth.toFixed(2)}
                            (Last: RM{comparison.spending.lastMonth.toFixed(2)},{' '}
                            {comparison.spending.change >= 0 ? '+' : ''}{comparison.spending.change.toFixed(1)}%)
                        </Text>
                        <Text style={styles.comparisonText}>
                            Budget Adherence: {comparison.adherence.thisMonth.toFixed(1)}%
                            (Last: {comparison.adherence.lastMonth.toFixed(1)}%,{' '}
                            {comparison.adherence.change >= 0 ? '+' : ''}{comparison.adherence.change.toFixed(1)}%)
                        </Text>
                    </View>
                </>
            )}
            <AddBudgetDialog
                isVisible={isAddDialogVisible}
                onClose={() => setAddDialogVisible}
                onBudgetAdded={fetchData}
            />
            <EditBudgetDialog
                isVisible={isEditDialogVisible}
                onClose={() => {
                    setEditDialogVisible(false);
                    setSelectedBudget(null);
                }}
                budget={selectedBudget}
                onBudgetUpdated={fetchData}
            />
        </ScrollView>
    );
};

export default BudgetsScreen;
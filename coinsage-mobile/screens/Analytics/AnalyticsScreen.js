import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-svg-charts';
import { Picker } from '@react-native-picker/picker';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, subMonths, formatISO } from 'date-fns';
import { getTransactions, getCategories } from "../../src/services/api";
import styles from './AnalyticsStyles';

const AnalyticsScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
    const [loading, setLoading] = useState(true);

    const monthOptions = [
        { value: format(new Date(), 'yyyy-MM'), label: 'Current Month' },
        ...Array.from({ length: 11 }, (_, i) => {
            const date = subMonths(new Date(), i + 1);
            return { value: format(date, 'yyyy-MM'), label: format(date, 'MMMM yyyy') };
        }),
    ];

    useEffect(() => {
        const fetchData = async() => {
            try {
                setLoading(true);
                const [transactionResponse, categoryResponse] = await Promise.all([
                    getTransactions(),
                    getCategories(),
                ]);
                setTransactions(transactionResponse.data.data);
                setCategories(categoryResponse.data.data);
            } catch(error) {
                Alert.alert('Error', 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getSpendingByCategory = () => {
        const monthStart = startOfMonth(new Date(selectedMonth));
        const monthEnd = endOfMonth(new Date(selectedMonth));
        const expenses = transactions.filter(
            (t) => new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd && t.transaction_amount < 0
        );

        const categoryTotals = expenses.reduce((acc, t) => {
            const category = categories.find((c) => c._id === t.category_id);
            const categoryName = category ? category.name : 'Uncategorised';
            acc[categoryName] = (acc[categoryName] || 0) + Math.abs(t.transaction_amount);
            return acc;
        }, {});

        return Object.entries(categoryTotals).map(([key, value], index) => ({
            key,
            value,
            svg: { fill: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'][index % 5] },
            arc: { outerRadius: '100%', cornerRadius: 5 },
        }));
    };

    const getMonthlyIncomeExpense = () => {
        const monthStart = startOfMonth(new Date(selectedMonth));
        const monthEnd = endOfMonth(new Date(selectedMonth));
        const monthTransactions = transactions.filter(
            (t) => new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd
        );

        const income = monthTransactions
                    .filter((t) => t.transaction_amount > 0)
                    .reduce((sum, t) => sum + t.transaction_amount, 0);
        const expense = monthTransactions
                    .filter((t) => t.transaction_amount < 0)
                    .reduce((sum, t) => sum + Math.abs(t.transaction_amount) , 0);
        
        return [
            { value: income, svg: { fill: '#28A745' } },
            { value: expense, svg: { fill: '#FF4D4F' } },
        ];
    };

    const getWeeklySpending = () => {
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
        const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

        return days.map((day) => {
            const dayStr = formatISO(day, { representation: 'date' });
            const dailySpending = transactions
                            .filter((t) => t.date.startsWith(dayStr) && t.transaction_amount < 0)
                            .reduce((sum, t) => sum + Math.abs(t.transaction_amount), 0);
            return dailySpending;
        });
    };

    if(loading) {
        return <ActivityIndicator size="large" color="#007AFF" style={styles.container} />;
    }

    const pieData = getSpendingByCategory();
    const barData = getMonthlyIncomeExpense();
    const lineData = getWeeklySpending();

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Analytics</Text>

            <Text style={styles.sectionTitle}>Select Month</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedMonth}
                    onValueChange={(value) => setSelectedMonth(value)}
                    style={styles.picker}
                >
                    {monthOptions.map((option) => (
                        <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                </Picker>
            </View>

            <Text style={styles.sectionTitle}>Spending by Category ({monthOptions.find((o) => o.value === selectedMonth)?.label})</Text>
            {pieData.length > 0 ? (
                <View>
                    <PieChart
                        style={styles.chart}
                        data={pieData}
                        innerRadius="0"
                        padAngle={0.02}
                    />
                    <View style={styles.legend}>
                        {pieData.map((item) => (
                            <View key={item.key} style={styles.legendItem}>
                                <View style={[styles.legendColor, { backgroundColor: item.svg.fill }]} />
                                <Text style={styles.legendText}>
                                    {item.key}: RM{(item.value).toFixed(2)} ({((item.value / pieData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%)
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            ) : (
                <Text style={styles.emptyText}>No expenses for this month</Text>
            )}

            <Text style={styles.sectionTitle}>Monthly Income vs Expense</Text>
            <BarChart
                style={styles.chart}
                data={barData}
                gridMin={0}
                yAccessor={({ item }) => item.value}
                contentInset={{ top: 20, bottom: 20 }}
            >
                <View style={styles.barLabels}>
                    <Text style={styles.barLabel}>Income: RM{barData[0].value.toFixed(2)}</Text>
                    <Text style={styles.barLabel}>Expense: RM{barData[1].value.toFixed(2)}</Text>
                </View>
            </BarChart>

            <Text style={styles.sectionTitle}>This Week&apos;s Spending Pattern</Text>
            {lineData.some((value) => value > 0) ? (
                <LineChart
                    style={styles.chart}
                    data={lineData}
                    svg={{ stroke: '#007AFF', strokeWidth: 2 }}
                    contentInset={{ top: 20, bottom: 20 }}
                >
                    <View style={styles.lineLabels}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                            <Text key={day} style={styles.lineLabel}>{day}</Text>
                        ))}
                    </View>
                </LineChart>
            ) : (
                <Text style={styles.emptyText}>No spending this week</Text>
            )}
        </ScrollView>
    );
};

export default AnalyticsScreen;
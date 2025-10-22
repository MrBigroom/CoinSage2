import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../src/contexts/AuthContext';
import api from '../../src/services/api';
import BudgetItem from './BudgetItem';
import styles from './BudgetsStyles';

const BudgetsScreen = () => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const [budgets, setBudgets] = useState([]);
  const [monthlyComparison, setMonthlyComparison] = useState({ thisMonth: null, lastMonth: null, change: null });
  const [loading, setLoading] = useState(true);
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await api.get('/api/budgets');
        if (response.data.success) {
          setBudgets(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    const fetchMonthlyComparison = async () => {
      const now = new Date('2025-10-17T10:06:00+08:00');
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
      const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;

      try {
        const [thisMonthResponse, lastMonthResponse] = await Promise.all([
          api.get(`/api/transactions?month=${thisMonth}&year=${thisYear}`),
          api.get(`/api/transactions?month=${lastMonth}&year=${lastYear}`),
        ]);
        if (thisMonthResponse.data.success && lastMonthResponse.data.success) {
          const thisMonthSpent = thisMonthResponse.data.data.reduce((sum, t) => sum + Math.abs(t.transaction_amount), 0);
          const lastMonthSpent = lastMonthResponse.data.data.reduce((sum, t) => sum + Math.abs(t.transaction_amount), 0);
          setMonthlyComparison({
            thisMonth: thisMonthSpent,
            lastMonth: lastMonthSpent,
            change: lastMonthSpent > 0 ? ((thisMonthSpent - lastMonthSpent) / lastMonthSpent * 100) : (thisMonthSpent > 0 ? 100 : 0),
          });
        }
      } catch (error) {
        console.error('Error fetching monthly comparison:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
    fetchMonthlyComparison();
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Budgets</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddBudget')}>
        <Text style={styles.buttonText}>Add Budget</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    !loading && monthlyComparison.thisMonth !== null && monthlyComparison.lastMonth !== null && (
      <View style={styles.footer}>
        <Text style={styles.label}>This Month vs Last Month</Text>
        <Text style={styles.balance}>
          This Month: RM{monthlyComparison.thisMonth.toFixed(2)} | Last Month:RM{monthlyComparison.lastMonth.toFixed(2)}
        </Text>
        <Text style={styles.balance}>
          Change: {monthlyComparison.change.toFixed(2)}% {monthlyComparison.change >= 0 ? '↑' : '↓'}
        </Text>
      </View>
    )
  );

  return (
    <SafeAreaView style={styles.screenContainer}>
      {renderHeader()}
      <FlatList
        data={budgets}
        renderItem={({ item }) => <BudgetItem budget={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        style={[styles.list, { height: screenHeight - styles.header.height - styles.footer.height }]}
      />
      {renderFooter()}
    </SafeAreaView>
  );
};

export default BudgetsScreen;
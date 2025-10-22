import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../src/services/api';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit'
import styles from './AnalyticsStyles';

const AnalyticsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const screenWidth = Dimensions.get('window').width - 40;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/api/transactions');
        if (response.data.success) {
          setTransactions(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, []);

  const now = new Date('2025-10-17T08:56:00+08:00');
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const categorySpending = transactions
    .filter(t => new Date(t.date).getMonth() === thisMonth && new Date(t.date).getFullYear() === thisYear && t.transaction_amount < 0)
    .reduce((acc, t) => {
      const cat = t.category_id.name;
      acc[cat] = (acc[cat] || 0) + Math.abs(t.transaction_amount);
      return acc;
    }, {});
  const pieData = Object.keys(categorySpending).map((cat) => ({
    name: cat,
    population: categorySpending[cat],
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  }));

  const monthlyData = transactions
    .filter(t => new Date(t.date).getMonth() === thisMonth && new Date(t.date).getFullYear() === thisYear)
    .reduce((acc, t) => {
      const amount = Math.abs(t.transaction_amount);
      if (t.transaction_amount > 0) acc.income += amount;
      else acc.expense += amount;
      return acc;
    }, { income: 0, expense: 0 });
  const barData = {
    labels: ['Income', 'Expense'],
    datasets: [{
      data: [monthlyData.income, monthlyData.expense],
    }],
  };

  const oneWeekAgo = new Date(now.setDate(now.getDate() - 6));
  const weeklySpending = Array(7).fill(0).map((_, i) => {
    const date = new Date(oneWeekAgo);
    date.setDate(oneWeekAgo.getDate() + i);
    return transactions
      .filter(t => new Date(t.date).toDateString() === date.toDateString() && t.transaction_amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.transaction_amount), 0);
  });
  const lineData = {
    labels: Array(7).fill().map((_, i) => {
      const date = new Date(oneWeekAgo);
      date.setDate(oneWeekAgo.getDate() + i);
      return date.getDate().toString();
    }),
    datasets: [{ data: weeklySpending }],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Analytics</Text>
      <View style={styles.chartContainer}>
        <Text style={styles.subtitle}>Spending by Category</Text>
        <PieChart
          data={pieData}
          width={screenWidth}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.subtitle}>Monthly Income vs Expense</Text>
        <BarChart
          data={barData}
          width={screenWidth}
          height={220}
          yAxisLabel="RM"
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            barPercentage: 0.5,
            propsForBackgroundLines: { stroke: '#ccc' },
          }}
          style={styles.barChart}
          fromZero={true}
          withCustomBarColor={(value, index) => (index === 0 ? '#28A745' : '#FF4D4F')}
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.subtitle}>This Week&apos;s Spending Pattern</Text>
        <LineChart
          data={lineData}
          width={screenWidth}
          height={220}
          yAxisLabel="RM"
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '6', strokeWidth: '2', stroke: '#007AFF' },
          }}
          bezier
          style={styles.lineChart}
        />
      </View>
    </ScrollView>
  );
};

export default AnalyticsScreen;
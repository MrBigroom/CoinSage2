import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AuthContext } from '../../src/contexts/AuthContext';
import api from '../../src/services/api';
import { ProgressBar } from 'react-native-progress';
import styles from '../Analytics/AnalyticsStyles';

const Tab = createMaterialTopTabNavigator();

const LogItem = ({ item }) => {
  const isCorrect = item.category_id.name === item.predicted_category;
  const status = isCorrect ? 'Correct' : 'Incorrect';
  const actualCategory = isCorrect ? '' : ` (Actual: ${item.category_id.name})`;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemCategory}>
          {new Date(item.date).toLocaleDateString()} | Predicted: {item.predicted_category}{actualCategory}
        </Text>
        <Text style={styles.itemDescription}>
          Confidence: {(item.confidence_score * 100).toFixed(2)}% | Status: {status}
        </Text>
      </View>
      <Text style={styles.itemAmountExpense}>
        ${Math.abs(item.transaction_amount).toFixed(2)}
      </Text>
    </View>
  );
};

const PerformanceItem = ({ category, total, accuracy, avgConfidence }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemTitle}>{category}</Text>
        <Text style={styles.itemCategory}>Total: {total}</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Accuracy</Text>
          <ProgressBar progress={accuracy} width={200} height={10} color="#28A745" />
          <Text style={styles.itemDescription}>{(accuracy * 100).toFixed(2)}%</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Avg Confidence</Text>
          <ProgressBar progress={avgConfidence} width={200} height={10} color="#007AFF" />
          <Text style={styles.itemDescription}>{(avgConfidence * 100).toFixed(2)}%</Text>
        </View>
      </View>
    </View>
  );
};

const RecentLogsScreen = () => {
  const [transactions, setTransactions] = useState([]);

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

  return (
    <FlatList
      data={transactions}
      renderItem={({ item }) => <LogItem item={item} />}
      keyExtractor={(item) => item._id}
      style={styles.list}
    />
  );
};

const PerformanceScreen = () => {
  const [performanceData, setPerformanceData] = useState({});

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/api/transactions');
        if (response.data.success) {
          const categoryStats = response.data.data.reduce((acc, t) => {
            const cat = t.category_id.name;
            acc[cat] = acc[cat] || { total: 0, correct: 0, confidenceSum: 0, count: 0 };
            acc[cat].total += 1;
            acc[cat].confidenceSum += t.confidence_score || 0;
            acc[cat].count += 1;
            if (t.category_id.name === t.predicted_category) acc[cat].correct += 1;
            return acc;
          }, {});
          const data = Object.keys(categoryStats).map((cat) => ({
            category: cat,
            total: categoryStats[cat].total,
            accuracy: categoryStats[cat].correct / categoryStats[cat].total,
            avgConfidence: categoryStats[cat].confidenceSum / categoryStats[cat].count,
          }));
          setPerformanceData(data);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <FlatList
      data={Object.values(performanceData)}
      renderItem={({ item }) => <PerformanceItem {...item} />}
      keyExtractor={(item) => item.category}
      style={styles.list}
    />
  );
};

const AIModelLogScreen = () => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const [overallAccuracy, setOverallAccuracy] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/api/transactions');
        if (response.data.success) {
          const correct = response.data.data.filter(t => t.category_id.name === t.predicted_category).length;
          const total = response.data.data.length;
          setOverallAccuracy(total > 0 ? correct / total : 0);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, []);

  const renderHeader = () => (
    <View>
      <Text style={styles.title}>AI Model Log</Text>
      <Text style={styles.subtitle}>Overall Accuracy: {(overallAccuracy * 100).toFixed(2)}%</Text>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666',
        }}
      >
        <Tab.Screen name="Recent Logs" component={RecentLogsScreen} />
        <Tab.Screen name="Performance" component={PerformanceScreen} />
      </Tab.Navigator>
    </View>
  );

  return (
    <FlatList
      data={[]}
      renderItem={null}
      ListHeaderComponent={renderHeader}
      keyExtractor={(item, index) => index.toString()}
      style={styles.container}
    />
  );
};

export default AIModelLogScreen;
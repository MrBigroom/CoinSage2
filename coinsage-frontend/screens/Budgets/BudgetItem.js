import React from 'react';
import { View, Text } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import styles from '../Transactions/TransactionsStyles';

const BudgetItem = ({ budget }) => {
  const spent = budget.spent || 0;
  const amount = budget.amount;
  const progress = Math.min(spent / amount, 1);
  const remaining = amount - spent;
  const percentage = (progress * 100).toFixed(2);
  const riskLevel = percentage >= 90 ? 'High' : percentage >= 75 ? 'Medium' : 'Low';
  const status = percentage >= 100 ? 'Exceeded!' : percentage >= 90 ? 'Almost Full' : 'On Track';
  const remainingColor = remaining >= 0 ? '#28A745' : '#FF4D4F';

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemTitle}>{budget.category_id.name}</Text>
        <Text style={styles.itemCategory}>
          ${spent.toFixed(2)} of ${amount.toFixed(2)}
        </Text>
        <ProgressBar
          progress={progress}
          width={200}
          height={10}
          color="#007AFF"
          borderRadius={5}
        />
        <Text style={[styles.itemDescription, { color: remainingColor }]}>
          Remaining: ${remaining.toFixed(2)}
        </Text>
      </View>
      <View>
        <Text style={styles.itemAmountExpense}>
          {percentage}% ({riskLevel})
        </Text>
        <Text style={styles.itemDescription}>{status}</Text>
      </View>
    </View>
  );
};

export default BudgetItem;
import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import styles from './BudgetsStyles';

const BudgetItem = ({ budget, onEdit }) => {
    const remaining = budget.remaining_amount;
    const spentPercentage = (budget.spent_amount / budget.budget_amount) * 100;
    const riskLevel = spentPercentage > 100 ? 'Exceeded!' : spentPercentage >= 80 ? 'Almost Full' : 'On Track';

    return (
        <View style={styles.budgetItem}>
            <View style={styles.budgetLeft}>
                <Text style={styles.budgetTitle}>{budget.category_id.name}</Text>
                <Text style={styles.budgetStats}>
                    RM{budget.spent_amount.toFixed(2)} of RM{budget.budget_amount.toFixed(2)}
                </Text>
                <Progress.Bar
                    progress={Math.min(budget.spent_amount / budget.budget_amount, 1)}
                    width={200}
                    color={remaining >= 0 ? '#28A745' : '#FF4D4F'}
                    unfilledColor="#DDD"
                    borderWidth={0}
                    height={8}
                    style={styles.progressBar}
                />
                <Text style={[styles.budgetRemaining, remaining >= 0 ? styles.remainingPositive : styles.remainingNegative]}>
                    Remaining: RM{Math.abs(remaining).toFixed(2)}
                </Text>
            </View>
            <View style={styles.budgetRight}>
                <Text style={styles.riskLevel}>{riskLevel}</Text>
                <Text style={styles.percentage}>{spentPercentage.toFixed(0)}%</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => onEdit(budget)}>
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BudgetItem;
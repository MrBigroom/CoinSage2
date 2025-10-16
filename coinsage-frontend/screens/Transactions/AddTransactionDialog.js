import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from "@react-navigation/native";
import api from "../../src/services/api";
import styles from "./TransactionsStyles";

const TransactionSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    transaction_amount: Yup.number()
                            .required('Amount is required')
                            .min(0.01, 'Amount must be at least 0.01'),
    type: Yup.string().oneOf(['Income', 'Expense']).required('Type is required'),
    date: Yup.date().required('Date is required'),
    description: Yup.string().optional(),
});;

const AddTransactionDialog = () => {
    const navigation = useNavigation();
    const [showDatePicker, setShowDatePicker] = useState(null);
    const [prediction, setPrediction] = useState(null);

    const handlePredictCategory = async(values, setFieldValue) => {
        if(values.title && values.transaction_amount) {
            try {
                const response = await api.post('/api/transactions', {
                    title: values.title,
                    transaction_amount: values.transaction_amount * (values.type === 'Income' ? 1 : -1),
                });
                if(response.data.success) {
                    setPrediction({
                        category: response.data.data.category_id.name,
                        confidence: response.data.data.confidence_score || 0.9,
                    });
                    setFieldValue('category_id', response.data.data.category_id._id);
                }
            } catch(error) {
                console.error('Prediction error: ', error);
            }
        }
    };

    const handleSubmit = async(values, { setSubmitting, setErrors }) => {
        try {
            const response = await api.post('/api/transactions', {
                ...values,
                transaction_amount: values.transaction_amount * (values.type === 'Income' ? 1 : -1),
            });
            if(response.data.success) {
                navigation.goBack();
            }
        } catch(error) {
            setErrors({ submit: error.response?.data?.message || 'Failed to add transaction' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>Add Transaction</Text>
            <Formik
                initialValues={{
                    title: '',
                    transaction_amount: '',
                    type: 'Expense',
                    date: new Date(),
                    description: '',
                    category_id: '',
                }}
                validationSchema={TransactionSchema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, isSubmitting }) => (
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Title</Text>
                            <TextInput
                                style={[styles.input, touched.title && errors.title ? styles.inputError : null]}
                                onChangeText={(text) => {
                                    handleChange('title')(text);
                                    handlePredictCategory({ ...values, title: text }, setFieldValue);
                                }}
                                onBlur={handleBlur('title')}
                                value={values.title}
                            />
                            {touched.title && errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Amount</Text>
                            <TextInput
                                style={[styles.input, touched.transaction_amount && errors.transaction_amount ? styles.inputError : null]}
                                onChangeText={(text) => {
                                    handleChange('transaction_amount')(text);
                                    handlePredictCategory({ ...values, transaction_amount: text }, setFieldValue);
                                }}
                                onBlur={handleBlur('transaction_amount')}
                                value={values.transaction_amount}
                                keyboardType="numeric"
                            />
                            {touched.transaction_amount && errors.transaction_amount && (
                                <Text style={styles.errorText}>{errors.transaction_amount}</Text>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Type</Text>
                            <Picker
                                selectedValue={values.type}
                                onValueChange={(value) => {
                                    setFieldValue('type', value);
                                    handlePredictCategory({ ...values, type: value }, setFieldValue);
                                }}
                                style={styles.picker}
                            >
                                <Picker.Item label="Expense" value="Expense" />
                                <Picker.Item label="Income" value="Income" />
                            </Picker>
                            {touched.type && errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Date</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                <TextInput
                                    style={styles.input}
                                    value={values.date.toLocaleDateString()}
                                    editable={false}
                                />
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={values.date}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(Platform.OS === 'ios');
                                        if(selectedDate) {
                                            setFieldValue('date', selectedDate);
                                        }
                                    }}
                                />
                            )}
                            {touched.date && errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Description (optional)</Text>
                            <TextInput
                                style={[styles.input, touched.description && errors.description ? styles.inputError : null]}
                                onChangeText={handleChange('description')}
                                onBlur={handleBlur('description')}
                                value={values.description}
                                multiline
                            />
                            {touched.description && errors.description && (
                                <Text style={styles.errorText}>{errors.description}</Text>
                            )}
                        </View>

                        {prediction && (
                            <Text style={styles.predictionText}>
                                Predicted Category: {prediction.category} (Confidence: {(prediction.confidence * 100).toFixed(2)}%)
                            </Text>
                        )}

                        {errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>}

                        <TouchableOpacity
                            style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.buttonText}>Add Transaction</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </View>
    );
};

export default AddTransactionDialog;
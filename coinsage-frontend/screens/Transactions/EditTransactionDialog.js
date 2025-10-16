import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, useRoute } from "@react-navigation/native";
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
    category_id: Yup.string().required('Category is required'),
});

const EditTransactionDialog = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { transaction } = route.params;
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async() => {
            try {
                const response = await api.get('/api/categories');
                if(response.data.success) {
                    setCategories(response.data.data);
                }
            } catch(error) {
                console.error('Error fetching categories: ', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async(values, { setSubmitting, setErrors }) => {
        try {
            const response = await api.put(`/api/transactions/${transaction._id}`, {
                ...values,
                transaction_amount: values.transaction_amount * (values.type === 'Income' ? 1 : -1),
            });
            if(response.data.success) {
                navigation.goBack();
            }
        } catch(error) {
            setErrors({ submit: error.response?.data?.message || 'Failed to update transaction' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>Edit Transaction</Text>
            <Formik
                initialValues={{
                    title: transaction.title,
                    transaction_amount: Math.abs(transaction.transaction_amount).toString(),
                    type: transaction.transaction_amount > 0 ? 'Income' : 'Expense',
                    date: new Date(transaction.date),
                    description: transaction.description || '',
                    category_id: transaction.category_id._id,
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
                                onChangeText={handleChange('title')}
                                onBlur={handleBlur('title')}
                                value={values.title}
                            />
                            {touched.title && errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Amount</Text>
                            <TextInput
                                style={[styles.input, touched.transaction_amount && errors.transaction_amount ? styles.inputError : null]}
                                onChangeText={handleChange('transaction_amount')}
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
                                onValueChange={(value) => setFieldValue('type', value)}
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
                            <Text style={styles.label}>Category</Text>
                            <Picker
                                selectedValue={values.category_id}
                                onValueChange={(value) => setFieldValue('category_id', value)}
                                style={styles.picker}
                            >
                                {categories.map((category) => (
                                    <Picker.Item key={category._id} label={category.name} value={category._id} />
                                ))}
                            </Picker>
                            {touched.category_id && errors.category_id && (
                                <Text style={styles.errorText}>{errors.category_id}</Text>
                            )}
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

                        {errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>}

                        <TouchableOpacity
                            style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.buttonText}>Update Transaction</Text>
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

export default EditTransactionDialog;
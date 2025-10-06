import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker'
import { categoriseTransaction, updateTransaction, getCategories } from '../../src/services/api';
import styles from './TransactionsStyles';

const TransactionSchema = Yup.object().shape({
    transaction_amount: Yup.number()
                            .required('Amount is required')
                            .test('non-zero', 'Amount cannot be zero', (value) => value !== 0),
    description: Yup.string()
                        .required('Description is required')
                        .max(100, 'Description must not exceed 100 characters'),
    date: Yup.date().required('Date is required'),
    category_id: Yup.string().required('Category is required'),
});

const EditTransactionDialog = ({ isVisible, onClose, transaction, onTransactionUpdated }) => {
    const [predictedCategory, setPredictedCategory] = useState(transaction?.category_id || '');
    const [confidence, setConfidence] = useState(null);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [categories, setCategories] = useState([]);

    const predictCategory = async(description, amount) => {
        try {
            const response = await categoriseTransaction({ description, amount });
            setPredictedCategory(response.data.category);
            setConfidence(response.data.confidence);
        } catch(error) {
            Alert.alert('Error', 'Failed to predict category');
        }
    };

    const fetchCategories = async() => {
        try {
            const response = await getCategories();
            setCategories(response.data.data);
        } catch(error) {
            Alert.alert('Error', 'Failed to fetch categories');
        }
    };

    useEffect(() => {
        fetchCategories();
        if(transaction?.description && transaction?.transaction_amount) {
            predictCategory(transaction.description, transaction.transaction_amount);
        }
    }, [transaction]);

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Edit Transaction</Text>
                <Formik
                    initialValues={{
                        transaction_amount: transaction?.transaction_amount?.toString() || '',
                        description: transaction?.description || '',
                        date: transaction?.date ? new Date(transaction.date) : new Date(),
                        category_id: transaction?.category_id || predictedCategory,
                    }}
                    validationSchema={TransactionSchema}
                    enableReinitialize
                    onSubmit={async(values, { setSubmitting }) => {
                        try {
                            await updateTransaction(transaction._id, {
                                ...values,
                                date: format(values.date, 'yyyy-MM-dd'),
                            });
                            Alert.alert('Success', 'Transaction updated successfully');
                            onTransactionUpdated();
                            onClose();
                        } catch(error) {
                            Alert.alert('Error', error.response?.data?.message || 'Failed to update transaction');
                        } finally {
                            setSubmitting(false)
                        }
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
                        <View style={styles.input}>
                            <TextInput
                                style={styles.input}
                                placeholder='Amount'
                                keyboardType='numeric'
                                onChangeText={(text) => {
                                    handleChange('transaction_amount')(text);
                                    if(values.description && text) {
                                        predictCategory(values.description, text);
                                    }
                                }}
                                onBlur={handleBlur('transaction_amount')}
                                value={values.transaction_amount}
                            />
                            {touched.transaction_amount && errors.transaction_amount && (
                                <Text style={styles.errorText}>{errors.transaction_amount}</Text>
                            )}
                            <TextInput 
                                style={styles.input}
                                placeholder='Description (e.g., Starbucks)'
                                onChangeText={(text) => {
                                    handleChange('description')(text);
                                    if(text && values.transaction_amount) {
                                        predictCategory(text, values.transaction_amount);
                                    }
                                }}
                                onBlur={handleBlur('description')}
                                value={values.description}
                            />
                            {touched.description && errors.description && (
                                <Text style={styles.errorText}>{errors.description}</Text>
                            )}
                            <TouchableOpacity style={styles.input} onPress={() => setOpenDatePicker(true)}>
                                <Text>{format(values.date, 'yyyy-MM-dd')}</Text>
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                open={openDatePicker}
                                date={values.date}
                                mode='date'
                                onConfirm={(date) => {
                                    setOpenDatePicker(false);
                                    setFieldValue('date', date);
                                }}
                                onCancel={() => setOpenDatePicker(false)}
                            />
                            {touched.date && errors.date && (
                                <Text style={styles.errorText}>{errors.date}</Text>
                            )}

                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={values.category_id}
                                    onValueChange={(value) => setFieldValue('category_id', value)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label='Select a category' value='' />
                                    {categories.map((category) => (
                                        <Picker.Item key={category._id} label={category.name} value={category.name} />
                                    ))}
                                </Picker>
                            </View>
                            {touched.category_id && errors.category_id && (
                                <Text style={styles.errorText}>{errors.category_id}</Text>
                            )}

                            {touched.predictedCategory && (
                                <Text style={styles.predictionText}>
                                    Predicted Category: {predictedCategory} (Confidence: {(confidence * 100).toFixed(2)}%)
                                </Text>
                            )}

                            <View>
                                <TouchableOpacity
                                    style={[styles.button, isSubmitting && styles.buttonDisabled]}
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    <Text style={styles.buttonText}>Update Transaction</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>
            </View>
        </Modal>
    );
};

export default EditTransactionDialog;
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { categoriseTransaction, createTransaction } from '../../src/services/api';
import styles from './TransactionsStyles';

const TransactionSchema = Yup.object().shape({
    transaction_amount: Yup.number()
                            .required('Amount is required')
                            .test('non-zero', 'Amount cannot be zero', (value) => value !== 0),
    title: Yup.string()
                .required('Title is required')
                .max(100, 'Title must not exceed 100 characters'),
    description: Yup.string().optional(),
    date: Yup.date().required('Date is required'),
});

const AddTransactionDialog = ({ isVisible, onClose, onTransactionAdded }) => {
    const [predictedCategory, setPredictedCategory] = useState('');
    const [confidence, setConfidence] = useState(null);
    const [openDatePicker, setOpenDatePicker] = useState(false);

    const predictCategory = async(title, amount) => {
        try {
            const response = await categoriseTransaction({ title, amount });
            setPredictedCategory(response.data.category);
            setConfidence(response.data.confidence);
        } catch(error) {
            Alert.alert('Error', 'Failed to predict category');
        }
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Add Transaction</Text>
                <Formik
                    initialValues={{ transaction_amount: '', title: '', description: '', date: new Date() }}
                    validationSchema={TransactionSchema}
                    onSubmit={async(values, { setSubmtting, resetForm }) => {
                        try {
                            await createTransaction({
                                ...values,
                                date: format(values.date, 'yyyy-MM-dd'),
                                category_id: predictedCategory,
                            });
                            Alert.alert('Success', 'Transaction added successfully');
                            resetForm();
                            setPredictedCategory('');
                            setConfidence(null);
                            onTransactionAdded();
                            onClose();
                        } catch(error) {
                            Alert.alert('Error', error.response?.data?.message || 'Failed to add transaction');
                        } finally {
                            setSubmtting(false);
                        }
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
                        <View style={styles.form}>
                            <Text style={styles.label}>Amount</Text>
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

                            <Text style={styles.label}>Title</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => {
                                    handleChange('title')(text);
                                    if(text && values.transaction_amount) {
                                        predictCategory(text, values.transaction_amount);
                                    }
                                }}
                                onBlur={handleBlur('title')}
                                value={values.title}
                            />
                            {touched.title && errors.title && (
                                <Text style={styles.errorText}>{errors.title}</Text>
                            )}

                            <Text style={styles.label}>Description (optional)</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder='Description (e.g., Starbucks)'
                                onChangeText={handleChange('description')}
                                onBlur={handleBlur('description')}
                                value={values.description}
                            />
                            {touched.description && errors.description && (
                                <Text style={styles.errorText}>{errors.description}</Text>
                            )}

                            <Text style={styles.label}>Date</Text>
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
                            
                            {predictedCategory && (
                                <Text style={styles.predictionText}>
                                    Predicted Category: {predictedCategory} (Confidence: {(confidence * 100).toFixed(2)}%)
                                </Text>
                            )}

                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, isSubmitting && styles.buttonDisabled]}
                                    onPress={handleSubmit}
                                    disabled={isSubmitting || !predictedCategory}
                                >
                                    <Text style={styles.buttonText}>Add Transaction</Text>
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

export default AddTransactionDialog;
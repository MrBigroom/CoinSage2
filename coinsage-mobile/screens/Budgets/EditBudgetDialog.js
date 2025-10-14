import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import DatePicker from "react-native-date-picker";
import { format } from 'date-fns';
import { getCategories, updateBudget, deleteBudget } from '../../src/services/api';
import styles from './BudgetsStyles';

const BudgetSchema = Yup.object().shape({
    category_id: Yup.string().required('Category is required'),
    budget_amount: Yup.number()
                        .required('Budget amount is required')
                        .positive('Budget amount must be positive')
                        .test('non-zero', 'Budget amount cannot be zero', (value) => value !== 0),
    start_date: Yup.date().required('Start date is required'),
    end_date: Yup.date()
                    .required('End date is required')
                    .min(Yup.ref('start_date'), 'End date must be after start date'),
});

const EditBudgetDialog = ({ isVisible, onClose, budget, onBudgetUpdated }) => {
    const [categories, setCategories] = useState([]);
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [openEndDatePicker, setOpenEndDatePicker] = useState(false);

    useEffect(() => {
        const fetchCategories = async() => {
            try {
                const response = await getCategories();
                setCategories(response.data.data);
            } catch(error) {
                Alert.alert('Error', 'Failed to fetch categories');
            }
        };
        if(isVisible) {
            fetchCategories();
        }
    }, [isVisible]);

    const handleDelete = async() => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this budget?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async() => {
                        try {
                            await deleteBudget(budget._id);
                            Alert.alert('Success', 'Budget deleted successfully');
                            onBudgetUpdated();
                            onClose();
                        } catch(error) {
                            Alert.alert('Error', error.response?.data?.message || 'Failed to delete budget');
                        }
                    },
                },
            ]
        );
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Edit Budget</Text>
                <Formik
                    initialValues={{
                        category_id: budget?.category_id?._id || '',
                        budget_amount: budget?.budget_amount?.toString() || '',
                        start_date: budget?.start_date ? new Date(budget.start_date) : new Date(),
                        end_date: budget?.end_date ? new Date(budget.end_date) : new Date(),
                    }}
                    validationSchema={BudgetSchema}
                    enableReinitialize
                    onSubmit={async(values, { setSubmitting }) => {
                        try {
                            await updateBudget(budget._id, {
                                ...values,
                                start_date: format(values.start_date, 'yyyy-MM-dd'),
                                end_date: format(values.end_date, 'yyyy-MM-dd'),
                            });
                            Alert.alert('Success', 'Budget updated successfully');
                            onBudgetUpdated();
                            onClose();
                        } catch(error) {
                            Alert.alert('Error', error.response?.data?.message || 'Failed to update budget');
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
                        <View style={styles.form}>
                            <Text style={styles.label}>Category</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={values.category_id}
                                    onValueChange={(value) => setFieldValue('category_id', value)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select a category" value="" />
                                    {categories.map((category) => (
                                        <Picker.Item key={category._id} label={category.name} value={category._id} />
                                    ))}
                                </Picker>
                            </View>
                            {touched.category_id && errors.category_id && (
                                <Text style={styles.errorText}>{errors.category_id}</Text>
                            )}

                            <Text style={styles.label}>Budget Amount</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                onChangeText={handleChange('budget_amount')}
                                onBlur={handleBlur('budget_amount')}
                                value={values.budget_amount}
                            />
                            {touched.budget_amount && errors.budget_amount && (
                                <Text style={styles.errorText}>{errors.budget_amount}</Text>
                            )}

                            <Text style={styles.label}>Start Date</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setOpenStartDatePicker(true)}
                            >
                                <Text style={styles.dateText}>{format(values.start_date, 'yyyy-MM-dd')}</Text>
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                open={openStartDatePicker}
                                date={values.start_date}
                                mode="date"
                                onConfirm={(date) => {
                                    setOpenStartDatePicker(false);
                                    setFieldValue('start_date', date);
                                }}
                                onCancel={() => setOpenStartDatePicker(false)}
                            />
                            {touched.start_date && errors.start_date && (
                                <Text style={styles.errorText}>{errors.start_date}</Text>
                            )}

                            <Text style={styles.label}>End Date</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setOpenEndDatePicker(true)}
                            >
                                <Text style={styles.dateText}>{format(values.end_date, 'yyyy-MM-dd')}</Text>
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                open={openEndDatePicker}
                                date={values.end_date}
                                mode="date"
                                onConfirm={(date) => {
                                    setOpenEndDatePicker(false);
                                    setFieldValue('end_date', date);
                                }}
                                onCancel={() => setOpenEndDatePicker(false)}
                            />
                            {touched.end_date && errors.end_date && (
                                <Text style={styles.errorText}>{errors.end_date}</Text>
                            )}

                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, isSubmitting && styles.buttonDisabled]}
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    <Text style={styles.buttonText}>Update Budget</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.deleteButton, isSubmitting && styles.buttonDisabled]}
                                    onPress={handleDelete}
                                    disabled={isSubmitting}
                                >
                                    <Text style={styles.buttonText}>Delete</Text>
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

export default EditBudgetDialog;
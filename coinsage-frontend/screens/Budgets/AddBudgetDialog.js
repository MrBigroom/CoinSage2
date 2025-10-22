import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import api from '../../src/services/api';
import styles from '../Transactions/TransactionsStyles';

// Validation schema
const BudgetSchema = Yup.object().shape({
  category_id: Yup.string().required('Category is required'),
  amount: Yup.number().required('Amount is required').min(1, 'Amount must be at least 1'),
});

const AddBudgetDialog = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await api.post('/api/budgets', {
        category_id: values.category_id,
        amount: values.amount,
      });
      if (response.data.success) {
        navigation.goBack();
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to add budget' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.dialogContainer}>
      <Text style={styles.dialogTitle}>Add Budget</Text>
      <Formik
        initialValues={{
          category_id: '',
          amount: '',
        }}
        validationSchema={BudgetSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <Picker
                selectedValue={values.category_id}
                onValueChange={handleChange('category_id')}
                style={styles.picker}
              >
                <Picker.Item label="Select a category" value="" />
                {categories.map((category) => (
                  <Picker.Item key={category._id} label={category.name} value={category._id} />
                ))}
              </Picker>
              {touched.category_id && errors.category_id && <Text style={styles.errorText}>{errors.category_id}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Budget Amount</Text>
              <TextInput
                style={[styles.input, touched.amount && errors.amount ? styles.inputError : null]}
                onChangeText={handleChange('amount')}
                onBlur={handleBlur('amount')}
                value={values.amount}
                keyboardType="numeric"
              />
              {touched.amount && errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
            </View>
            {errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>}
            <TouchableOpacity
              style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>Add Budget</Text>
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

export default AddBudgetDialog;
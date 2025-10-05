import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { login } from '../../src/services/api';
import styles from './AuthStyles';

const LoginSchema = Yup.object().shape({
    username: Yup.string()
                    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores')
                    .required('Username is required'),
    password: Yup.string()
                    .required('Password is required'),
});

const LoginScreen = () => {
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = React.useState(false);

    const handleLogin = async(values, { setSubmitting }) => {
        try {
            const response = await login(values);
            await AsyncStorage.setItem('token', response.data.token);
            console.log('Token saved: ', await AsyncStorage.getItem('token'));
            Alert.alert('Success', 'Logged in successfully');
            navigation.navigate('Main');
        } catch(error) {
            console.error('AsyncStorage error: ', error);
            Alert.alert('Error', error.response?.data?.message || 'Login failed');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CoinSage Login</Text>
            <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                    <View style={styles.form}>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            value={values.username}
                            autoCapitalize="none"
                        />
                        {touched.username && errors.username && (
                            <Text style={styles.errorText}>{errors.username}</Text>
                        )}
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry
                        />
                        {touched.password && errors.password && (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        )}
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Text style={styles.linkText}>{showPassword ? 'Hide' : 'Show'} password</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, isSubmitting && styles.buttonDisabled]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>

                        <Text>Don&apos;t have an account? 
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.linkText}>Sign Up here</Text>
                            </TouchableOpacity>
                        </Text>
                    </View>
                )}
            </Formik>
        </View>
    );
};

export default LoginScreen;
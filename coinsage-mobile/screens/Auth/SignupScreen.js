import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { register } from '../../src/services/api';
import styles from './AuthStyles';

const SignupSchema = Yup.object().shape({
    username: Yup.string()
                    .min(4, 'Username must be at least 4 characters')
                    .max(30, 'Username must not exceed 30 characters')
                    .matches(/^[a-zA-Z0-9_]+$/, 'Username must only contain letters, numbers and underscores')
                    .required('Username is required'),
    email: Yup.string()
                .email('Please enter a valid email')
                .required('Email is required'),
    password: Yup.string()
                    .min(6, 'Password must be at least 6 characters')
                    .matches(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
                    )
                    .required('Password is required'),
    confirmPassword: Yup.string()
                            .oneOf([Yup.ref('password'), null], 'Password must match')
                            .required('Confirm password is required'),
});

const SignupScreen = () => {
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const handleSignup = async(values, { setSubmtting }) => {
        try {
            const response = await register(values);
            await AsyncStorage.setItem('token', response.data.token);
            console.log('Token saved: ', await AsyncStorage.getItem('token'));
            Alert.alert('Success', 'Registered successfully');
            navigation.navigate('Main');
        } catch(error) {
            console.error('AsyncStorage error: ', error);
            Alert.alert('Error', error.response?.data?.message || 'Registration failed');
        } finally {
            setSubmtting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.logoText}>CoinSage</Text>
            </View>
            <Text style={styles.title}>Signup</Text>
            <Formik
                initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={SignupSchema}
                onSubmit={handleSignup}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                    <View style={styles.form}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Username'
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            value={values.username}
                            autoCapitalize='none'
                        />
                        {touched.username && errors.username && (
                            <Text style={styles.errorText}>{errors.username}</Text>
                        )}
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Email'
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            keyboardType='email-address'
                            autoCapitalize='none'
                        />
                        {touched.email && errors.email && (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Password'
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry={!showPassword}
                        />
                        {touched.password && errors.password && (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        )}
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Text style={styles.linkText}>{showPassword ? 'Hide' : 'Show'} password</Text>
                        </TouchableOpacity>
                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Confirm Password'
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            value={values.confirmPassword}
                            secureTextEntry={!showConfirmPassword}
                        />
                        {touched.confirmPassword && errors.confirmPassword && (
                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        )}
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Text style={styles.linkText}>{showConfirmPassword ? 'Hide' : 'Show'} confirm password</Text>
                        </TouchableOpacity>

                        {isSubmitting ? (
                            <ActivityIndicator size="large" color={styles.button.backgroundColor} />
                        ) : (
                            <TouchableOpacity
                                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </TouchableOpacity>
                        )}

                        <Text>Already have an account? 
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.linkText}> Login here</Text>
                            </TouchableOpacity>
                        </Text>
                    </View>
                )}
            </Formik>
        </View>
    );
};

export default SignupScreen;
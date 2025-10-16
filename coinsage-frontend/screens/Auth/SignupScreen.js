import React, { useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from "../../src/contexts/AuthContext";
import styles from "./AuthStyles";

const SignupSchema = Yup.object().shape({
    username: Yup.string()
                    .min(4, 'Username must be at least 4 characters')
                    .max(30, 'Username must not exceed 30 characters')
                    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
                    .required('Username is required'),
    email: Yup.string()
                .email('Please enter a valid email')
                .required('Email is required'),
    password: Yup.string()
                    .min(6, 'Password must be at least 6 characters')
                    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                            'Password must contain one uppercase letter, one lowercase letter, one number, and one special character')
                    .required(),
    confirmPassword: Yup.string()
                            .oneOf([Yup.ref('password'), null], 'Passwords must match')
                            .required('Confirm password is required'),
});

const SignupScreen = ({ navigation }) => {
    const { signup } = useContext(AuthContext);

    const handleSignup = async(values, { setSubmitting, setErrors }) => {
        try {
            await signup(values.username, values.email, values.password);
            navigation.replace('Login');
        } catch(error) {
            setErrors({ submit: error.message || 'Signup failed' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>Sign Up for CoinSage</Text>
            <Formik
                initialValues={{ username: '', email: '', password: '', confirmPassword: '', submit: '' }}
                validationSchema={SignupSchema}
                onSubmit={handleSignup}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                style={[styles.input, touched.username && errors.username ? styles.inputError : null]}
                                onChangeText={handleChange('username')}
                                onBlur={handleBlur('username')}
                                value={values.username}
                                autoCapitalize="none"
                            />
                            {touched.username && errors.username && (
                                <Text style={styles.errorText}>{errors.username}</Text>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {touched.email && errors.email && (
                                <Text style={styles.errorText}>{errors.email}</Text>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={[styles.input, touched.password && errors.password ? styles.inputError : null]}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry
                            />
                            {touched.password && errors.password && (
                                <Text style={styles.errorText}>{errors.password}</Text>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <TextInput
                                style={[styles.input, touched.confirmPassword && errors.confirmPassword ? styles.inputError : null]}
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                value={values.confirmPassword}
                                secureTextEntry
                            />
                            {touched.confirmPassword && errors.confirmPassword && (
                                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                            )}
                        </View>

                        {errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>}

                        <TouchableOpacity
                            style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.linkText}>Already have an account? Login here</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </View>
    );
};

export default SignupScreen;
import React, { useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../src/contexts/AuthContext";
import styles from "./AuthStyles";

const LoginSchema = Yup.object().shape({
    username: Yup.string()
                    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscore')
                    .required('Username is required'),
    password: Yup.string()
                    .required('Password is required'),
});

const LoginScreen = () => {
    const { login } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogin = async(values, { setSubmitting, setErrors }) => {
        try {
            await login(values.username, values.password);
            navigation.replace('Tab');
        } catch(error) {
            setErrors({ submit: error.message || 'Login failed' });
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
            <Text style={styles.title}>Login to CoinSage</Text>
            <Formik
                initialValues={{ username: '', password: '', submit: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
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

                            {errors.submit && <Text style={styles.errorText}>{errors.password}</Text>}

                            <TouchableOpacity
                                style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.linkText}>Don&apos;t have an account? Sign up here</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    );
};

export default LoginScreen;
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 240,
        height: 240,
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    form: {
        width: '100%',
        maxWidth: 400,
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 15,
        marginBottom: 5,
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#DDD',
        fontSize: 16,
    },
    errorText: {
        color: '#FF4D4F',
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 5,
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 15,
    },
    buttonDisabled: {
        backgroundColor: '#99C2FF',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    normalText: {
        fontSize: 16,
        color: '#333',
    },
    linkText: {
        color: '#007AFF',
        fontSize: 16,
        textAlign: 'center'
    },
});
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    form: {
        width: '100%',
        marginTop: 20,
    },
    balance: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    list: {
        flex: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemLeft: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    itemCategory: {
        fontSize: 14,
        color: '#666',
    },
    itemDate: {
        fontSize: 14,
        color: '#666',
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
    },
    itemAmountIncome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28A745',
    },
    itemAmountExpense: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF4D4F',
    },
    dialogContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        paddingTop: 40,
        backgroundColor: '#fff',
    },
    dialogTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    inputError: {
        borderColor: '#FF4D4F',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 5,
        padding: 10,
        height: 50,
        width: '100%',
    },
    predictionText: {
        fontSize: 16,
        color: '#333',
        marginTop: 10,
    },
    errorText: {
        color: '#FF4D4F',
        fontSize: 14,
        marginTop: 5,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#99ccff',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#ccc',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
});

export default styles;
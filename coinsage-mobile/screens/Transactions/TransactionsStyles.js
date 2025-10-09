import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    balanceText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize:18,
        fontWeight: '600',
    },
    buttonDisabled: {
        backgroundColor: '#99C2FF',
    },
    modalContainer: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        margin: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 5,
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    amountInput: {
        flex: 1,
        marginRight: 10,
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#DDD',
        fontSize: 16,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#FFF',
    },
    picker: {
        height: 50,
        fontSize: 16,
    },
    typePicker: {
        height: 50,
        fontSize: 16,
        width: 120,
    },
    errorText: {
        color: '#FF4D4F',
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 5,
    },
    predictionText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    deleteButton: {
        backgroundColor: '#FF4D4F',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        flex: 1,
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: '#666',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        flex: 1,
        marginLeft: 10,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    transactionText: {
        fontSize: 16,
        color: '#333',
    },
    transactionSubText: {
        fontSize: 14,
        color: '#666',
    },
    transactionRight: {
        alignItems: 'flex-end',
    },
    expense: {
        color: '#FF4DAF',
    },
    income: {
        color: '#28A745',
    },
    editButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 8,
        marginTop: 5,
    },
    editButtonText: {
        color: '#FFF',
        fontSize: 14,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
});
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
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
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
    errorText: {
        color: '#FF4D4F',
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 5,
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
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#666',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        flex: 1,
    },
    budgetItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    budgetLeft: {
        flex: 1,
    },
    budgetTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    budgetStats: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5,
    },
    progressBar: {
        marginVertical: 10,
    },
    budgetRemaining: {
        fontSize: 14,
        fontWeight: '500',
    },
    remainingPositive: {
        color: '#28A745',
    },
    remainingNegative: {
        color: '#FF4D4F',
    },
    budgetRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    riskLevel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    percentage: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    editButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 8,
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
    comparisonContainer: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 15,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    comparisonTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    comparisonText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
});
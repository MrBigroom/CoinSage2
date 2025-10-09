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
        marginBottom: 10,
    },
    accuracyText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        marginBottom: 20,
    },
    tabContainer: {
        flex: 1,
    },
    logItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    logText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    logSubText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    logAmount: {
        fontSize: 16,
        fontWeight: '500',
    },
    performanceItem: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    performanceText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    performanceSubText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    progressContainer: {
        marginTop: 10,
    },
    progressLabel: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    progressBar: {
        height: 10,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#007AFF',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    expense: {
        color: '#FF4D4F',
    },
    income: {
        color: '#28A745',
    },
});
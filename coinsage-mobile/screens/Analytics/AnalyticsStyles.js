import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
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
    chartContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    legend: {
        marginTop: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    legendColor: {
        width: 12,
        height: 12,
        marginRight: 8,
        borderRadius: 2,
    },
    legendText: {
        fontSize: 14,
        color: '#333',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginVertical: 20,
    },
});
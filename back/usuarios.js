import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        axios.get('http://192.168.1.115:3000/usuarios') // Reemplaza con la IP de tu servidor
            .then(response => setUsuarios(response.data))
            .catch(error => console.error('Error al obtener usuarios:', error));
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Usuarios</Text>
            <FlatList
                data={usuarios}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.nombre}</Text>
                        <Text>{item.correo}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
});

export default Usuarios;
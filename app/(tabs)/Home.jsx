import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Etiquetarutina } from '../../components/Etiquetarutina';
import { Etiquetadieta } from '../../components/Etiquetadieta';
import { Etiquetaia } from '../../components/Etiquetaia';
import { Etiquetaconoce } from '../../components/Etiquetaconoce';
import { Colors } from '../../components/Colors';

export default function RoutineScreen() {
  const insets = useSafeAreaInsets();

  const listaItems = [
    { id: '1', tipo: 'rutina' },
    { id: '2', tipo: 'ia' },
    { id: '3', tipo: 'dieta' },
    { id: '4', tipo: 'conoce'}
  ];

  const renderItem = ({ item }) => {
    switch(item.tipo) {
      case 'rutina':
        return <Etiquetarutina />;
      case 'ia':
        return <Etiquetaia />;
      case 'dieta':
        return <Etiquetadieta />;
      case 'conoce':
        return <Etiquetaconoce/>;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList 
        data={listaItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 55, 
  },
  container: {
    flex: 1,
    backgroundColor: Colors.fondos,
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,        // Espacio superior
  },
});
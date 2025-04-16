import { StyleSheet, Text, View, Pressable, TextInput, FlatList, Modal, TouchableOpacity } from 'react-native'
import { icons } from '../../assets/icons'
import { useNavigation } from 'expo-router';
import { Colors } from '../../assets/Colors'
import React, { useState, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ejercicio from '../../components/Ejercicio';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const Exercises = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    muscleGroup: '',
    difficulty: '',
    equipment: '',
    sortBy: 'name'
  });

  // Datos de ejemplo de ejercicios
  const exercisesData = [
    { id: '1', title: 'Hack Squat', muscleGroup: 'Piernas', difficulty: 'Intermedio', equipment: 'Máquina' },
    { id: '2', title: 'Prensa', muscleGroup: 'Piernas', difficulty: 'Principiante', equipment: 'Máquina' },
    { id: '3', title: 'Press de banca', muscleGroup: 'Pecho', difficulty: 'Intermedio', equipment: 'Barra' },
    { id: '4', title: 'Dominada', muscleGroup: 'Espalda', difficulty: 'Avanzado', equipment: 'Barra' },
    { id: '5', title: 'Curl de bíceps', muscleGroup: 'Brazos', difficulty: 'Principiante', equipment: 'Mancuernas' },
    { id: '6', title: 'Sentadilla libre', muscleGroup: 'Piernas', difficulty: 'Principiante', equipment: 'Barra' },
    { id: '7', title: 'Apertura con Mancuernas', muscleGroup: 'Pecho', difficulty: 'Principiante', equipment: 'Mancuernas' },
    { id: '8', title: 'Flexiones', muscleGroup: 'Pecho', difficulty: 'Principiante', equipment: 'Peso corporal' },
    { id: '9', title: 'Plancha', muscleGroup: 'Abdomen', difficulty: 'Principiante', equipment: 'Peso corporal' },
    { id: '10', title: 'Crunch en máquina', muscleGroup: 'Abdomen', difficulty: 'Principiante', equipment: 'Máquina' },
    { id: '11', title: 'Remo en máquina', muscleGroup: 'Espalda', difficulty: 'Intermedio', equipment: 'Máquina' },
    { id: '12', title: 'Elevaciones laterales', muscleGroup: 'Brazos', difficulty: 'Intermedio', equipment: 'Mancuernas' },
  ];

  // Aplicar búsqueda y filtros
  useEffect(() => {
    let result = [...exercisesData];
    
    // Aplicar búsqueda por título
    if (searchQuery) {
      result = result.filter(exercise => 
        exercise.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Aplicar filtros
    if (filters.muscleGroup) {
      result = result.filter(exercise => exercise.muscleGroup === filters.muscleGroup);
    }
    
    if (filters.difficulty) {
      result = result.filter(exercise => exercise.difficulty === filters.difficulty);
    }
    
    if (filters.equipment) {
      result = result.filter(exercise => exercise.equipment === filters.equipment);
    }
    
    // Aplicar ordenamiento
    switch (filters.sortBy) {
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'difficulty':
        const difficultyOrder = { 'Principiante': 1, 'Intermedio': 2, 'Avanzado': 3 };
        result.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        break;
      default:
        break;
    }
    
    setFilteredExercises(result);
  }, [searchQuery, filters]);

  const renderExerciseItem = ({ item }) => (
    <Ejercicio 
      title={item.title} 
      muscleGroup={item.muscleGroup} 
      difficulty={item.difficulty} 
      equipment={item.equipment}
    />
  );

  return (
    <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: Colors.fondos}}>
      <View style={[styles.header]}>
        <Pressable onPress={() => navigation.goBack()}>
          <icons.Arrow color={Colors.text1} />
        </Pressable>
        <Text style={styles.title}>Ejercicios</Text>
      </View>
      
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.text2} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ejercicios..."
          placeholderTextColor={Colors.text2}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={20} color={Colors.text1} />
        </TouchableOpacity>
      </View>

      {/* Resultados de búsqueda */}
      {filteredExercises.length > 0 ? (
        <FlatList
          data={filteredExercises}
          renderItem={renderExerciseItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color={Colors.text2} />
          <Text style={[styles.emptyText, {color: Colors.text2}]}>No se encontraron ejercicios</Text>
        </View>
      )}

      {/* Modal de filtros */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={[styles.modalContainer, {backgroundColor: Colors.fondos}]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, {color: Colors.text2}]}>Filtros</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={28} color={Colors.text2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContainer}>
            {/* Filtro por grupo muscular */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, {color: Colors.text2}]}>Grupo muscular</Text>
              <View style={styles.filterOptions}>
                {['Piernas', 'Pecho', 'Espalda', 'Brazos', 'Abdomen','Todos'].map(group => (
                  <TouchableOpacity
                    key={group}
                    style={[
                      styles.filterOption,
                      filters.muscleGroup === (group === 'Todos' ? '' : group) && styles.selectedOption
                    ]}
                    onPress={() => setFilters({...filters, muscleGroup: group === 'Todos' ? '' : group})}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      {color: Colors.text2},
                      filters.muscleGroup === (group === 'Todos' ? '' : group) && styles.selectedOptionText
                    ]}>
                      {group}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filtro por dificultad */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, {color: Colors.text2}]}>Dificultad</Text>
              <View style={styles.filterOptions}>
                {['Principiante', 'Intermedio', 'Avanzado', 'Todos'].map(diff => (
                  <TouchableOpacity
                    key={diff}
                    style={[
                      styles.filterOption,
                      filters.difficulty === (diff === 'Todos' ? '' : diff) && styles.selectedOption
                    ]}
                    onPress={() => setFilters({...filters, difficulty: diff === 'Todos' ? '' : diff})}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      {color: Colors.text2},
                      filters.difficulty === (diff === 'Todos' ? '' : diff) && styles.selectedOptionText
                    ]}>
                      {diff}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filtro por equipo */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, {color: Colors.text2}]}>Equipo necesario</Text>
              <View style={styles.filterOptions}>
                {['Máquina', 'Barra', 'Mancuernas', 'Peso corporal', 'Todos'].map(eq => (
                  <TouchableOpacity
                    key={eq}
                    style={[
                      styles.filterOption,
                      filters.equipment === (eq === 'Todos' ? '' : eq) && styles.selectedOption
                    ]}
                    onPress={() => setFilters({...filters, equipment: eq === 'Todos' ? '' : eq})}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      {color: Colors.text2},
                      filters.equipment === (eq === 'Todos' ? '' : eq) && styles.selectedOptionText
                    ]}>
                      {eq}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Ordenar por */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, {color: Colors.text2}]}>Ordenar por</Text>
              <View style={styles.sortOptions}>
                {[
                  { value: 'name', label: 'Nombre' },
                  { value: 'difficulty', label: 'Dificultad' },
                ].map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sortOption,
                      filters.sortBy === option.value && styles.selectedSortOption
                    ]}
                    onPress={() => setFilters({...filters, sortBy: option.value})}
                  >
                    <Text style={[
                      styles.sortOptionText,
                      {color: Colors.text2},
                      filters.sortBy === option.value && styles.selectedSortOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Botón para limpiar filtros */}
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setFilters({
                  muscleGroup: '',
                  difficulty: '',
                  equipment: '',
                  sortBy: 'name'
                });
              }}
            >
              <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}

export default Exercises

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: 'Kanit',
    color: Colors.text2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.fondos2,
    padding: 20,
    gap: 10
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.fondos2,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text2,
    fontFamily: 'Kanit',
  },
  filterButton: {
    padding: 5,
  },
  listContainer: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'Kanit',
  },
  modalContainer: {
    flex: 1,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.fondos2,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Kanit',
  },
  filterContainer: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterTitle: {
    fontSize: 18,
    fontFamily: 'Kanit',
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.fondos2,
  },
  filterOptionText: {
    fontFamily: 'Kanit',
  },
  selectedOption: {
    backgroundColor: Colors.fondos2,
  },
  selectedOptionText: {
    color: Colors.text1,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 15,
  },
  sortOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.fondos2,
  },
  sortOptionText: {
    fontFamily: 'Kanit',
  },
  selectedSortOption: {
    backgroundColor: Colors.fondos2,
  },
  selectedSortOptionText: {
    color: Colors.text1,
  },
  clearFiltersButton: {
    backgroundColor: Colors.fondos2,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  clearFiltersText: {
    color: Colors.text1,
    fontFamily: 'Kanit',
    fontSize: 16,
  },
});
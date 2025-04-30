import { StyleSheet, Text, View, Pressable, TextInput, FlatList, Modal, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { icons } from '../../assets/icons';
import { useNavigation } from 'expo-router';
import { Colors } from '../../assets/Colors';
import React, { useState, useEffect, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ejercicio from '../../components/Ejercicio';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const Exercises = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [displayedExercises, setDisplayedExercises] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allExercises, setAllExercises] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const exercisesPerPage = 20;

  const [filters, setFilters] = useState({
    muscleGroup: '',
    equipment: '',
    sortBy: 'name'
  });

  // Traducciones para los filtros
  const muscleGroups = [
    { value: '', label: 'Todos' },
    { value: 'back', label: 'Espalda' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'chest', label: 'Pecho' },
    { value: 'lower arms', label: 'Antebrazos' },
    { value: 'lower legs', label: 'Pantorrillas' },
    { value: 'shoulders', label: 'Hombros' },
    { value: 'upper arms', label: 'Brazos' },
    { value: 'upper legs', label: 'Piernas' },
    { value: 'waist', label: 'Cintura' }
  ];

  const equipmentTypes = [
    { value: '', label: 'Todos' },
    { value: 'body weight', label: 'Peso corporal' },
    { value: 'machine', label: 'Máquina' },
    { value: 'dumbbell', label: 'Mancuernas' },
    { value: 'barbell', label: 'Barra' },
    { value: 'cable', label: 'Polea' },
    { value: 'kettlebell', label: 'Kettlebell' }
  ];

  // Obtener ejercicios de la API
  const fetchExercises = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        'https://exercisedb.p.rapidapi.com/exercises?limit=1000',
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': 'a6ce31be52msh0865311e56b9f0ep1a9a22jsn79b4d4d83af5',
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
          }
        }
      );
      const data = await response.json();
      setAllExercises(data);
      applyFiltersAndSearch(data, filters, searchQuery);
    } catch (err) {
      setError('Error al cargar los ejercicios. Intenta más tarde.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Aplicar filtros y búsqueda
  const applyFiltersAndSearch = useCallback((exercises, filters, query) => {
    let result = [...exercises];
    
    // Aplicar búsqueda
    if (query) {
      result = result.filter(exercise => 
        exercise.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Aplicar filtro por grupo muscular
    if (filters.muscleGroup) {
      result = result.filter(exercise => 
        exercise.bodyPart.toLowerCase() === filters.muscleGroup.toLowerCase()
      );
    }
    
    // Aplicar filtro por equipo
    if (filters.equipment) {
      result = result.filter(exercise => 
        exercise.equipment.toLowerCase() === filters.equipment.toLowerCase()
      );
    }
    
    // Aplicar ordenamiento
    if (filters.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredExercises(result);
    loadMoreExercises(result, 1); // Resetear paginación
  }, []);

  // Cargar más ejercicios
  const loadMoreExercises = (exercises, pageNum) => {
    const startIndex = (pageNum - 1) * exercisesPerPage;
    const endIndex = startIndex + exercisesPerPage;
    const newExercises = exercises.slice(startIndex, endIndex);
    
    if (pageNum === 1) {
      setDisplayedExercises(newExercises);
    } else {
      setDisplayedExercises(prev => [...prev, ...newExercises]);
    }
    
    setPage(pageNum);
    setHasMore(endIndex < exercises.length);
  };

  // Manejar carga de más ejercicios
  const handleLoadMore = async () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      loadMoreExercises(filteredExercises, page + 1);
      setIsLoadingMore(false);
    }
  };

  // Efecto para cargar ejercicios iniciales
  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  // Efecto para aplicar filtros cuando cambian
  useEffect(() => {
    if (allExercises.length > 0) {
      applyFiltersAndSearch(allExercises, filters, searchQuery);
    }
  }, [filters, searchQuery, allExercises, applyFiltersAndSearch]);

  // Renderizar item del ejercicio
  const renderExerciseItem = useCallback(({ item }) => (
    <Ejercicio 
      title={item.name} 
      muscleGroup={item.bodyPart} 
      equipment={item.equipment}
      gifUrl={item.gifUrl}
      target={item.target}
      /* onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })} */
    />
  ), []);

  // Renderizar footer de carga
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="large" color={Colors.text1} />
      </View>
    );
  };

  // Mostrar carga inicial
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.text1} />
      </View>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: Colors.text2, fontSize: 18 }}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchExercises}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
      {displayedExercises.length > 0 ? (
        <FlatList
          data={displayedExercises}
          renderItem={renderExerciseItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={21}
          removeClippedSubviews={true}
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
                {muscleGroups.map(group => (
                  <TouchableOpacity
                    key={group.value}
                    style={[
                      styles.filterOption,
                      filters.muscleGroup === group.value && styles.selectedOption
                    ]}
                    onPress={() => setFilters({...filters, muscleGroup: group.value})}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      {color: Colors.text2},
                      filters.muscleGroup === group.value && styles.selectedOptionText
                    ]}>
                      {group.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filtro por equipo */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, {color: Colors.text2}]}>Equipo necesario</Text>
              <View style={styles.filterOptions}>
                {equipmentTypes.map(equip => (
                  <TouchableOpacity
                    key={equip.value}
                    style={[
                      styles.filterOption,
                      filters.equipment === equip.value && styles.selectedOption
                    ]}
                    onPress={() => setFilters({...filters, equipment: equip.value})}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      {color: Colors.text2},
                      filters.equipment === equip.value && styles.selectedOptionText
                    ]}>
                      {equip.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Ordenar por */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, {color: Colors.text2}]}>Ordenar por</Text>
              <View style={styles.sortOptions}>
                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    filters.sortBy === 'name' && styles.selectedSortOption
                  ]}
                  onPress={() => setFilters({...filters, sortBy: 'name'})}
                >
                  <Text style={[
                    styles.sortOptionText,
                    {color: Colors.text2},
                    filters.sortBy === 'name' && styles.selectedSortOptionText
                  ]}>
                    Nombre
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón para limpiar filtros */}
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setFilters({
                  muscleGroup: '',
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
  );
};

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
    padding: 8,
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
  retryButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: Colors.fondos2,
    borderRadius: 10,
  },
  retryButtonText: {
    color: Colors.text1,
    fontFamily: 'Kanit',
    fontSize: 16,
  },
});
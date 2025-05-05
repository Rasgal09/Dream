// RoutinesScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  StatusBar,
} from 'react-native';
import {
  Feather,
  AntDesign,
} from '@expo/vector-icons';
import RoutineCard from '../../../components/Rutina';

// Datos de ejemplo
const initialRoutines = [
  {
    id: '1',
    name: 'Rutina 1',
    exercises: [
      'Curl de Pierna Sentado',
      'Curl de Piernas Acostado (Máquina)',
      'Curl Martillo',
    ],
    folder: 'Mis rutinas',
    color: '#4285F4',
  },
  {
    id: '2',
    name: 'Rutina 2',
    exercises: [
      'Cables Cruzados',
      'Curl de Bíceps (Mancuerna)',
      'Curl de Pierna Sentado',
    ],
    folder: 'Mis rutinas',
    color: '#FF5722',
  },
  {
    id: '3',
    name: 'Cardio',
    exercises: [
      'Caminadora 20 min',
      'Elíptica 15 min',
      'Salto de cuerda',
    ],
    folder: 'Favoritos',
    color: '#4CAF50',
  },
];

const initialFolders = ['Mis rutinas', 'Favoritos'];

export default function RoutinesScreen() {
  const [routines, setRoutines] = useState(initialRoutines);
  const [folders, setFolders] = useState(initialFolders);
  const [expandedFolders, setExpandedFolders] = useState({ 'Mis rutinas': true, 'Favoritos': false });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewRoutineModal, setShowNewRoutineModal] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('Mis rutinas');
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  // Filtrar rutinas por búsqueda
  const filteredRoutines = routines.filter(routine => 
    routine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Obtener rutinas por carpeta
  const getRoutinesByFolder = (folderName) => {
    return routines.filter(routine => routine.folder === folderName);
  };

  // Crear nueva carpeta
  const createNewFolder = () => {
    if (newFolderName.trim() !== '' && !folders.includes(newFolderName.trim())) {
      setFolders([...folders, newFolderName.trim()]);
      setNewFolderName('');
      setShowNewFolderModal(false);
    }
  };

  // Crear nueva rutina
  const createNewRoutine = () => {
    if (newRoutineName.trim() !== '') {
      const colors = ['#4285F4', '#FF5722', '#4CAF50', '#9C27B0', '#FF9800'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const newRoutine = {
        id: Date.now().toString(),
        name: newRoutineName.trim(),
        exercises: [],
        folder: selectedFolder,
        color: randomColor,
      };
      setRoutines([...routines, newRoutine]);
      setNewRoutineName('');
      setShowNewRoutineModal(false);
    }
  };

  // Mostrar opciones de rutina
  const showOptions = (routine) => {
    setSelectedRoutine(routine);
    setShowOptionsModal(true);
  };

  // Eliminar rutina
  const deleteRoutine = () => {
    if (selectedRoutine) {
      setRoutines(routines.filter(r => r.id !== selectedRoutine.id));
      setShowOptionsModal(false);
    }
  };

  // Cambiar carpeta de rutina
  const moveRoutineToFolder = (folderId) => {
    if (selectedRoutine) {
      setRoutines(routines.map(r => 
        r.id === selectedRoutine.id ? {...r, folder: folderId} : r
      ));
      setShowOptionsModal(false);
    }
  };

  // Alternar expansión de carpeta
  const toggleFolder = (folderName) => {
    setExpandedFolders({
      ...expandedFolders,
      [folderName]: !expandedFolders[folderName]
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rutinas</Text>
        <Text style={styles.headerSubtitle}>Organiza tus entrenamientos</Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar rutina..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearching(true)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.searchClearButton}
              onPress={() => setSearchQuery('')}
            >
              <AntDesign name="close" size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Botones de acción */}
      <View style={styles.actionButtonsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionButtons}
        >
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowNewRoutineModal(true)}
          >
            <View style={[styles.actionButtonIcon, {backgroundColor: '#4285F4'}]}>
              <Feather name="file-plus" size={20} color="white" />
            </View>
            <Text style={styles.actionButtonText}>Nueva Rutina</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowNewFolderModal(true)}
          >
            <View style={[styles.actionButtonIcon, {backgroundColor: '#FF9800'}]}>
              <Feather name="folder-plus" size={20} color="white" />
            </View>
            <Text style={styles.actionButtonText}>Nueva Carpeta</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
          >
            <View style={[styles.actionButtonIcon, {backgroundColor: '#4CAF50'}]}>
              <Feather name="calendar" size={20} color="white" />
            </View>
            <Text style={styles.actionButtonText}>Programar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
          >
            <View style={[styles.actionButtonIcon, {backgroundColor: '#9C27B0'}]}>
              <Feather name="bar-chart-2" size={20} color="white" />
            </View>
            <Text style={styles.actionButtonText}>Estadísticas</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Contenido principal */}
      <ScrollView style={styles.content}>
        {isSearching && searchQuery.length > 0 ? (
          // Resultados de búsqueda
          <>
            <Text style={styles.sectionTitle}>
              Resultados ({filteredRoutines.length})
            </Text>
            {filteredRoutines.length > 0 ? (
              filteredRoutines.map(routine => (
                <RoutineCard 
                  key={routine.id} 
                  routine={routine} 
                  onOptionsPress={() => showOptions(routine)} 
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="search" size={40} color="#555" />
                <Text style={styles.emptyStateText}>No se encontraron rutinas</Text>
              </View>
            )}
          </>
        ) : (
          // Carpetas y rutinas
          <>
            {folders.map(folder => (
              <View key={folder} style={styles.folderSection}>
                <TouchableOpacity 
                  style={styles.folderHeader}
                  onPress={() => toggleFolder(folder)}
                >
                  <View style={styles.folderTitleContainer}>
                    <Feather 
                      name="folder" 
                      size={18} 
                      color="#FFD700" 
                      style={styles.folderIcon}
                    />
                    <Text style={styles.folderName}>
                      {folder}
                    </Text>
                  </View>
                  <View style={styles.folderControls}>
                    <View style={styles.folderCountBadge}>
                      <Text style={styles.folderCount}>
                        {getRoutinesByFolder(folder).length}
                      </Text>
                    </View>
                    <Feather 
                      name={expandedFolders[folder] ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#999" 
                    />
                  </View>
                </TouchableOpacity>
                
                {expandedFolders[folder] && (
                  <View style={styles.routinesContainer}>
                    {getRoutinesByFolder(folder).length > 0 ? (
                      getRoutinesByFolder(folder).map(routine => (
                        <RoutineCard 
                          key={routine.id} 
                          routine={routine} 
                          onOptionsPress={() => showOptions(routine)} 
                        />
                      ))
                    ) : (
                      <View style={styles.emptyState}>
                        <Feather name="inbox" size={40} color="#555" />
                        <Text style={styles.emptyStateText}>No hay rutinas en esta carpeta</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Modal para nueva carpeta */}
      <Modal
        visible={showNewFolderModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nueva Carpeta</Text>
              <TouchableOpacity 
                onPress={() => {
                  setNewFolderName('');
                  setShowNewFolderModal(false);
                }}
              >
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalIconContainer}>
              <View style={styles.folderIconLarge}>
                <Feather name="folder" size={40} color="#FFD700" />
              </View>
            </View>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre de la carpeta"
              placeholderTextColor="#999"
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
            />
            
            <TouchableOpacity 
              style={[
                styles.modalConfirmButton,
                !newFolderName.trim() && styles.modalButtonDisabled
              ]}
              onPress={createNewFolder}
              disabled={!newFolderName.trim()}
            >
              <Text style={styles.modalButtonText}>Crear Carpeta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para nueva rutina */}
      <Modal
        visible={showNewRoutineModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nueva Rutina</Text>
              <TouchableOpacity 
                onPress={() => {
                  setNewRoutineName('');
                  setShowNewRoutineModal(false);
                }}
              >
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre de la rutina"
              placeholderTextColor="#999"
              value={newRoutineName}
              onChangeText={setNewRoutineName}
              autoFocus
            />
            
            <Text style={styles.modalLabel}>Selecciona una carpeta:</Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.folderPicker}
            >
              {folders.map(folder => (
                <TouchableOpacity 
                  key={folder}
                  style={[
                    styles.folderOption,
                    selectedFolder === folder && styles.selectedFolder
                  ]}
                  onPress={() => setSelectedFolder(folder)}
                >
                  <Feather 
                    name="folder" 
                    size={16} 
                    color={selectedFolder === folder ? "white" : "#FFD700"} 
                    style={styles.folderOptionIcon}
                  />
                  <Text 
                    style={[
                      styles.folderOptionText,
                      selectedFolder === folder && styles.selectedFolderText
                    ]}
                  >
                    {folder}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity 
              style={[
                styles.modalConfirmButton,
                !newRoutineName.trim() && styles.modalButtonDisabled
              ]}
              onPress={createNewRoutine}
              disabled={!newRoutineName.trim()}
            >
              <Text style={styles.modalButtonText}>Crear Rutina</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de opciones de rutina */}
      <Modal
        visible={showOptionsModal}
        transparent={true}
        animationType="slide"
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <View 
            style={styles.optionsModalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.optionsHandle} />
            
            {selectedRoutine && (
              <Text style={styles.optionsTitle}>{selectedRoutine.name}</Text>
            )}
            
            <TouchableOpacity style={styles.optionItem}>
              <View style={[styles.optionIcon, {backgroundColor: '#4285F4'}]}>
                <Feather name="edit-2" size={18} color="white" />
              </View>
              <Text style={styles.optionText}>Editar rutina</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem}>
              <View style={[styles.optionIcon, {backgroundColor: '#4CAF50'}]}>
                <Feather name="play" size={18} color="white" />
              </View>
              <Text style={styles.optionText}>Iniciar rutina</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem}>
              <View style={[styles.optionIcon, {backgroundColor: '#FF9800'}]}>
                <Feather name="copy" size={18} color="white" />
              </View>
              <Text style={styles.optionText}>Duplicar rutina</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem}>
              <View style={[styles.optionIcon, {backgroundColor: '#9C27B0'}]}>
                <Feather name="folder" size={18} color="white" />
              </View>
              <Text style={styles.optionText}>Mover a otra carpeta</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem}>
              <View style={[styles.optionIcon, {backgroundColor: '#795548'}]}>
                <Feather name="share-2" size={18} color="white" />
              </View>
              <Text style={styles.optionText}>Compartir rutina</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteOption}
              onPress={deleteRoutine}
            >
              <View style={[styles.optionIcon, {backgroundColor: '#F44336'}]}>
                <Feather name="trash-2" size={18} color="white" />
              </View>
              <Text style={styles.deleteOptionText}>Eliminar rutina</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1A1A1A',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  searchClearButton: {
    padding: 5,
  },
  actionButtonsContainer: {
    paddingVertical: 15,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  actionButtons: {
    paddingHorizontal: 15,
  },
  actionButton: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 80,
  },
  actionButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  folderSection: {
    marginBottom: 20,
  },
  folderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  folderTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderIcon: {
    marginRight: 10,
  },
  folderName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  folderControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderCountBadge: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 10,
  },
  folderCount: {
    color: '#999',
    fontSize: 12,
    fontWeight: '500',
  },
  routinesContainer: {
    paddingTop: 15,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyStateText: {
    color: '#777',
    marginTop: 10,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  folderIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInput: {
    backgroundColor: '#2A2A2A',
    color: 'white',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    height: 50,
  },
  modalLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
  folderPicker: {
    paddingVertical: 5,
    marginBottom: 20,
  },
  folderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  selectedFolder: {
    backgroundColor: '#4285F4',
  },
  folderOptionIcon: {
    marginRight: 8,
  },
  folderOptionText: {
    color: '#CCC',
    fontSize: 14,
  },
  selectedFolderText: {
    color: 'white',
    fontWeight: '500',
  },
  modalConfirmButton: {
    backgroundColor: '#4285F4',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  modalButtonDisabled: {
    backgroundColor: '#555',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  optionsModalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  optionsHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#555',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  optionsTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
  deleteOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  deleteOptionText: {
    color: '#F44336',
    fontSize: 16,
  },
});
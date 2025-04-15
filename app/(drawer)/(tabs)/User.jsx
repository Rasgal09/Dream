import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { CompUser } from '../../../components/CompUser';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const User = () => {
  

  return (
      <CompUser />
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
});
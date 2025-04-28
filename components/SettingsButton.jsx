import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../assets/Colors'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'


const SettingsButton = (props) => {
    const { title, icon, onPress, isActive } = props;
  
    
    return (
        <Pressable style={styles.settingButton} onPress={onPress}>
            <View style={styles.titleWrapper}>
                <MaterialCommunityIcons name={icon} color={Colors.text1} size={20} />
                <Text style={styles.title}>{title}</Text>
            </View>
            
            <MaterialCommunityIcons 
                name={isActive ? "check-circle" : "checkbox-blank-circle-outline"} 
                color={isActive ? Colors.grad1 : Colors.text1} 
                size={20} 
            />
        </Pressable>
    );
};

export default SettingsButton

const styles = StyleSheet.create({
    settingButton:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.text2,
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,

    },
    titleWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    title:{
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text1,
    },
})
import { StyleSheet, View, Animated, Pressable, Text } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, usePathname } from 'expo-router';

const scaleValueHome = new Animated.Value(1);
const scaleValueRutines = new Animated.Value(1);
const scaleValueDiet = new Animated.Value(1);
const scaleValueMenu = new Animated.Value(1);

export const Navbar = () => {
  const pathname = usePathname();

  const handlePressIn = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const IconWithGradient = ({ isActive, iconName, IconComponent }) => {
    return isActive ? (
      <LinearGradient
        colors={['#00D078', '#007DF0']}
        style={styles.gradientIcon}
      >
        <IconComponent name={iconName} size={28} color="white" />
      </LinearGradient>
    ) : (
      <IconComponent name={iconName} size={28} color="#B1B1B1" />
    );
  };

  return (
    <View style={styles.root}>
      <Link href="/Home" asChild>
        <Pressable
          onPressIn={() => handlePressIn(scaleValueHome)}
          onPressOut={() => handlePressOut(scaleValueHome)}
        >
          {({ pressed }) => (
            <Animated.View style={[
              { transform: [{ scale: scaleValueHome }] },
              styles.iconWrapper,
              pressed && styles.pressedIcon
            ]}>
              <View style={styles.iconContainer}>
                <IconWithGradient 
                  isActive={pathname === '/Home'}
                  iconName="home"
                  IconComponent={MaterialCommunityIcons}
                />
              </View>
            </Animated.View>
          )}
        </Pressable>
      </Link>

      <Link href="/Rutines" asChild>
        <Pressable
          onPressIn={() => handlePressIn(scaleValueRutines)}
          onPressOut={() => handlePressOut(scaleValueRutines)}
        >
          {({ pressed }) => (
            <Animated.View style={[
              { transform: [{ scale: scaleValueRutines }] },
              styles.iconWrapper,
              pressed && styles.pressedIcon
            ]}>
              <View style={styles.iconContainer}>
                <IconWithGradient 
                  isActive={pathname === '/Rutines'}
                  iconName="fitness-center"
                  IconComponent={MaterialIcons}
                />
              </View>
            </Animated.View>
          )}
        </Pressable>
      </Link>

      <Link href="/Diet" asChild>
        <Pressable
          onPressIn={() => handlePressIn(scaleValueDiet)}
          onPressOut={() => handlePressOut(scaleValueDiet)}
        >
          {({ pressed }) => (
            <Animated.View style={[
              { transform: [{ scale: scaleValueDiet }] },
              styles.iconWrapper,
              pressed && styles.pressedIcon
            ]}>
              <View style={styles.iconContainer}>
                <IconWithGradient 
                  isActive={pathname === '/Diet'}
                  iconName="food-apple"
                  IconComponent={MaterialCommunityIcons}
                />
              </View>
            </Animated.View>
          )}
        </Pressable>
      </Link>

      {/* Ícono Menú */}
      <Pressable
        onPressIn={() => handlePressIn(scaleValueMenu)}
        onPressOut={() => handlePressOut(scaleValueMenu)}
      >
        {({ pressed }) => (
          <Animated.View style={[
            { transform: [{ scale: scaleValueMenu }] },
            styles.iconWrapper,
            pressed && styles.pressedIcon
          ]}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="menu"
                size={28}
                color="#B1B1B1"
              />
              
            </View>
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    width: '100%',
    height: 70,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(49, 49, 49, 1)',
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressedIcon: {
    /* backgroundColor: 'rgba(49, 49, 49, 0.7)', */
  },
  gradientIcon: {
    width: 50,
    height: 50,
    marginTop: 3,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
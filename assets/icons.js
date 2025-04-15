import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';


export const icons = {
    Home: (props) => <MaterialIcons name="home" size={24} color={props.color} />,
    Rutines: (props) => <MaterialIcons name="fitness-center" size={24} color={props.color} />,
    Diet: (props) => <MaterialCommunityIcons name="food-apple" size={24} color={props.color} />,
    User: (props) => <MaterialIcons name="person" size={24} color={props.color} />,
    Edit : (props) => <MaterialIcons name="edit" size={16} color={props.color} />,
    Menu: (props) => <MaterialIcons name="menu" size={40} color={props.color} />,
    Arrow: (props) => <MaterialIcons name="arrow-back-ios" size={24} color={props.color} />,
    Logout: (props) => <MaterialIcons name="logout" size={24} color={props.color} />,
    Light: (props) => <MaterialIcons name="light-mode" size={24} color={props.color} />,
    Dark: (props) => <MaterialIcons name="dark-mode" size={24} color={props.color} />,
    Theme: (props) => <MaterialIcons name="theme-light-dark" size={24} color={props.color} />,
}
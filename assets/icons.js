import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';


export const icons = {
    Home: (props) => <MaterialIcons name="home" size={24} color={props.color} />,
    Rutines: (props) => <MaterialIcons name="fitness-center" size={24} color={props.color} />,
    Diet: (props) => <MaterialCommunityIcons name="food-apple" size={24} color={props.color} />,
    User: (props) => <MaterialIcons name="person" size={24} color={props.color} />
}
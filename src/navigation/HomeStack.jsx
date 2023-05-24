// import { createStackNavigator } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InitialScreen from '../screens/InitialScreen';
import HomeScreen from '../screens/HomeScreen';
import Appointment from '../screens/Appointment';
import AppointmentForm from '../screens/AppointmentForm';
import Patients from '../screens/doctorscreens/Patients';
import Patientdetails from '../screens/doctorscreens/Patientdetails';


const Stack = createNativeStackNavigator();

const  HomeStack= ()=> {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Home" component={HomeScreen} options={{
    headerShown: false
}}/>
        <Stack.Screen name="Appointment" component={Appointment} 
        options={{
          title: 'Appointment',
          headerTitleAlign: 'center',
        }}
/>
<Stack.Screen name="InitialScreen" component={InitialScreen} 
        options={{
          title: 'InitialScreen',
          headerTitleAlign: 'center',
        }}
/>
<Stack.Screen name="AppointmentForm" component={AppointmentForm} 
        options={{
          title: 'Appointment Form',
          headerTitleAlign: 'center',
        }}
/>
<Stack.Screen name="Patientdetails" component={Patientdetails} 
        options={{
          title: 'Patientdetails',
          headerTitleAlign: 'center',
        }}
/>
      </Stack.Navigator>
  );
}
export default HomeStack
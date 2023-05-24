// import { createStackNavigator } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Patients from '../screens/doctorscreens/Patients';
import Patientdetails from '../screens/doctorscreens/Patientdetails';

const Stack = createNativeStackNavigator();

const  DoctorStack= ()=> {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Patients" component={Patients} options={{
    headerShown: false
}}/>
        <Stack.Screen name="Patientdetails" component={Patientdetails} 
        options={{
          title: 'Patientdetails',
          headerTitleAlign: 'center',
        }}
/>
      </Stack.Navigator>
  );
}
export default DoctorStack
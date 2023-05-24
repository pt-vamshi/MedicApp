// import { createStackNavigator } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InitialScreen from '../screens/InitialScreen';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
const Stack = createNativeStackNavigator();

const  AuthStack= ()=> {
  return (
    <Stack.Navigator >
        <Stack.Screen name="SignIn" component={SignIn} options={{
    headerShown: false
}}/>
<Stack.Screen name="SignUp" component={SignUp} options={{
    headerShown: false
}}/>
      </Stack.Navigator>
  );
}
export default AuthStack
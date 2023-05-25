import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View,ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import DoctorStack from './DoctorStack';
import { AuthProvider ,AuthContext} from '../screens/AuthProvider';

// import Loading from '../components/Loading';

export default function Routes() {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(true);
    const [isDoctor,setIsDoctor]=useState(false)
    const doctorEmail=['sureshkrish2104@gmail.com','contact@pearlthoughts.com','parvathi@pearlthoughts.com']
  
    // Handle user state changes
    function onAuthStateChanged(user) {
      setUser(user);
      // console.log(doctorEmail.includes(user.email),user.email,"user")
      setIsDoctor(doctorEmail.includes(user?.email) || false)
      if (initializing) setInitializing(false);
      setLoading(false);
    }
    // console.log(isDoctor,"isdoc")
    useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber; // unsubscribe on unmount
    }, []);
    if (loading) {
      return <ActivityIndicator size={'large'} color={'blue'} style={{marginTop: 300}}/>;
    }
    return (
      <NavigationContainer>
        {isDoctor ?<DoctorStack/> : user ? <HomeStack /> : <AuthStack />}
        {/* {} */}
      </NavigationContainer>
    );
  }
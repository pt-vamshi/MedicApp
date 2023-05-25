import React, {useEffect,useState,useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
 
} from 'react-native';
import { AuthContext } from './AuthProvider';

const SignIn = ({navigation}) => {
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const { login } = useContext(AuthContext);

    const doLogin=()=>{
      if(email!='' && password!=""){
        login(email, password).then((data)=>{
        })
      }else{
          Alert.alert("Please fill required fields")
      }
    }
  return (
    <ScrollView style={{backgroundColor:'#fff'}}>
    <View
    style={styles.container}>
      {/* WelcomeIcon */}
      <View style={styles.header}>
        <Image
          source={require('../assets/images/docicon.jpg')}
          resizeMode="contain"
          style={{
            width: 100,
            height: 120,
            marginLeft:46,
          }}
        />
        <Text style={styles.welcome_header}>
          Doctor{' '}
          <Text
            style={[
              styles.text_header,
              {
                color: 'black',
              },
            ]}>
            App
          </Text>
        </Text>
      </View>
      {/* form */}
      <View style={styles.form}>
        <Text style={styles.text_header}>Email*</Text>
        <TextInput
          placeholder="Enter Your Email"
          placeholderTextColor="#666666"
          style={[
            styles.textInput,
            {
              color: 'black',
            },
          ]}
          autoCapitalize="none"
          onChangeText={val => setEmail(val)}
        />
        <Text style={styles.text_header}>Password*</Text>
        <TextInput
          placeholder="Enter Your Password"
          placeholderTextColor="#666666"
          style={[
            styles.textInput,
            {
              color: 'black',
            },
          ]}
          autoCapitalize="none"
             onChangeText={val => setPassword(val)}
        />
      </View>
      {/* button  */}
      <TouchableOpacity
            style={styles.appButtonContainer}
            onPress={() => doLogin()}
            // onPress={() => login(email, password)}
            >
            <Text
              style={styles.appButtonText}
              secureTextEntry={true}
              color="grey"
              align="center">
              SIGN IN
            </Text>
          </TouchableOpacity>
      {/* or */}
<View style={{flexDirection: 'row', alignItems: 'center',marginTop:10}}>
  <View style={{flex: 1, height: 1, marginLeft:20,backgroundColor: 'black'}} />
  <View>
    <Text style={{width: 50, textAlign: 'center',color:'black'}}>Or</Text>
  </View>
  <View style={{flex: 1, height: 1,  marginRight:20,backgroundColor: 'black'}} />
</View>
      
      <Text style={{fontSize:18,color:'black'}}>Don't have an account? 
      <Text
         onPress={() => navigation.navigate('SignUp')}
              style={styles.linkButtonText}
              secureTextEntry={true}
              color="grey"
              align="center">
              {" "}Sign Up
            </Text>
             </Text>
         
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
  },
  welcome_header: {
    fontSize: 24,
    // marginTop: 10,
    paddingHorizontal: 40,
    color: '#354f8c',
    fontWeight: 'bold',
  },
  form: {
    justifyContent: 'flex-start',
    alignItems:'flex-start',
    marginRight: 30,
    marginTop:10,
  },
  text_header: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    color:'black'
  },
  textInput: {
    marginTop: 12,
    paddingLeft: 10,
    color: '#05375a',
    borderWidth:1,
    width:300,
    borderColor: '#f2f2f2',
    fontSize:15,
    height:50,
    backgroundColor:'#f9f9fd',
    borderRadius:5
  },
  appButtonContainer: {
    marginTop: 12,
    marginRight:20,
    color: '#05375a',
    borderWidth:1,
    width:300,
    borderColor: '#f2f2f2',
    height:50,
    elevation: 1,
    backgroundColor: '#354f8c',
    borderRadius:6,
     paddingVertical: 8,
    paddingHorizontal: 10,
  },
  appButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkButtonText: {
    fontSize: 20,
    color: '#354f8c',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SignIn;

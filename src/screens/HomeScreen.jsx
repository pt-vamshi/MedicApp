import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  FlatList,
  Touchable,
  Pressable,
  Button,
  ScrollView
} from 'react-native';
import React, {useState, useEffect,useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import notifee from '@notifee/react-native';
// import qs from 'qs';
// import { Linking } from 'react-native';
// import SendIntentAndroid from 'react-native-send-intent';
import { AuthContext } from './AuthProvider';
import { useFocusEffect } from '@react-navigation/native';
// import { LocalNotification } from '../services/LocalPushControler';

const HomeScreen = ({navigation}) => {
  const { user, logout,update ,deviceToken} = useContext(AuthContext);
  console.log(user?.uid,"uu")
  const [isloading, setIsLoading] = useState(false);
  const [doctordata, setDoctorData] = useState([]);
  const [appointmentdata, setAppointmentData] = useState([]);
  useEffect(() => {
     database();
     appointmentdatabase();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen focused');
      appointmentdatabase();
      return () => {
        console.log('Screen unfocused');
      };
    }, [])
  );
  const database = async () => {
    setIsLoading(true);
    try {
      await firestore()
        .collection('doctor_table')
        .get()
        .then(querySnapshot => {
          const data = [];
          querySnapshot.forEach(documentSnapshot => {
            // console.log('documentSnapshot: ', documentSnapshot.id);
            data.push({...documentSnapshot.data(),docid:documentSnapshot.id});
          });
          setDoctorData(data);
          setIsLoading(false);
        });
    } catch (err) {
      setIsLoading(false);
      Alert.alert(err);
    }
  };
   
  const appointmentdatabase = async () => {
    setIsLoading(true);
    try {
      await firestore()
        .collection('user_table')
        .get()
        .then(querySnapshot => {
          const data = [];
          querySnapshot.forEach(documentSnapshot => {
            // console.log('user: ', documentSnapshot.data(),user.uid);k
            // documentSnapshot.data
            if(documentSnapshot.data().uid == user?.uid){
              data.push({...documentSnapshot.data()});
            }
          });
          setAppointmentData(data);
          setIsLoading(false);
        });
    } catch (err) {
      setIsLoading(false);
      Alert.alert(err);
    }
  }


  
  const renderData = Item => {
    return (
      <Pressable style={styles.card_container} 
      onPress={() => {
        navigation.navigate('Appointment', {
          Name: Item?.item?.Name,
          Speciality: Item?.item?.Speciality,
          Experience: Item?.item?.Experience,
          Phone_no: Item?.item?.Phone_no,
          Email: Item?.item?.Email,
        });
      }}>
        <View style={styles.doctor_details}>
          {/* Image */}
          <View style={styles.doctor_details_Image}>
            <Image
              source={require('../assets/images/docicon.jpg')}
              resizeMode="contain"
              style={{
                width: 130,
                height: 120,
              }}
            />
          </View>

          <View style={styles.doctor_details_info}>
            <Text style={styles.doctor_name}>{Item?.item?.Name}</Text>
            <Text style={styles.doctor_speciality}>
              {Item?.item?.Speciality}
            </Text>

            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 5,
                }}>
                <Text>Patients</Text>
                <Text>4.3k</Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 5,
                }}>
                <Text>Experience</Text>
                <Text>{Item?.item?.Experience} years</Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 5,
                }}>
                <Text>Rating</Text>
                <Text>*(4.9)</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const appointmentData=Item=>{
    return(
      <View  style={styles.card_container} >
      <View style={styles.doctor_details}>
            {/* Image */}
            <View style={styles.doctor_details_Image}>
              <Image
                source={require('../assets/images/patienticon.png')}
                resizeMode="contain"
                style={{
                  width: 130,
                  height: 120,
                }}
              />
            </View>
  
            <View style={styles.doctor_details_info}>
              <Text style={styles.doctor_name}>doctor-{Item?.item?.doctor?.replace('@gmail.com','')}</Text>
              <Text style={styles.doctor_speciality}>
                {Item?.item?.complaint}
              </Text>
  
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 5,
                  }}>
                  <Text>Appoinment Date</Text>
                  <Text>{Item?.item?.datetime}</Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 5,
                  }}>
                  <Text>Status</Text>
                  <Text>{Item?.item?.appointmentstatus ? 'Approved' :'Pending'}</Text>
                </View>
              </View>
            </View>
          </View>
          </View>
    )
  }

  // console.log(doctordata,"doc")
  return (
    <ScrollView style={styles.container}>
      {isloading ? (
        <ActivityIndicator
          size={'large'}
          color={'blue'}
          style={{marginTop: 300}}
        />
      ) : (
        <View style={styles.doctor_container}>

           <View style={{flexDirection:'row',alignContent:'space-between',justifyContent:'space-between'}}>
            <Text style={styles.text_header}>Your Appointments</Text>
            <Button title='Logout' onPress={() => logout()}/>
            </View>
  
          <FlatList data={appointmentdata} renderItem={appointmentData} />

          <View style={{flexDirection:'row',alignContent:'space-between',justifyContent:'space-between',marginTop:30}}>
            <Text style={styles.text_header}>Popular Doctors</Text>
            </View>
          <FlatList data={doctordata} renderItem={renderData} />
        </View>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  doctor_container: {
    margin: 20,
  },
  text_header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  card_container: {
    width: "100%",
    height: 130,
    borderWidth: 2,
    marginTop: 15,
    paddingLeft: 10,
    color: '#05375a',
    borderColor: '#f2f2f2',
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
  },
  doctor_details: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  doctor_details_Image: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'blue'
  },
  doctor_details_info: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    // backgroundColor:'red'
  },
  doctor_name: {
    fontSize: 18,
    fontWeight: '900',
    color: 'black',
  },
  doctor_speciality: {
    fontSize: 15,
    fontWeight: '400',
    color: 'black',
  },
});

export default HomeScreen;

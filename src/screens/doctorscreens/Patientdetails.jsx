import {View, Text, StyleSheet, Image,TouchableOpacity,ActivityIndicator,Alert} from 'react-native';
import React,{useState,useEffect} from 'react';
import { AuthContext } from '../AuthProvider';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
const Patientdetails = ({route, navigation}, props) => {
  const [isloading, setIsLoading] = useState(false);
  const [token,setToken]=useState('')
    // const {devicetoken,setdevicetoken } = useContext(AuthContext);
    // console.log(devicetoken,"ddd")

    const requestUserPermission = async () => {
      /**
       * On iOS, messaging permission must be requested by
       * the current application before messages can be
       * received or sent
       */
      const authStatus = await messaging().requestPermission();
      // console.log('Authorization status(authStatus):', authStatus);
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    };
  
    useEffect(() => {
      if (requestUserPermission()) {
        messaging()
          .getToken()
          .then((fcmToken) => {
            console.log('Patinet FCM Token -> ', fcmToken);
            setToken(fcmToken)
            // setdevicetoken(fcmToken);
          });
      } else console.log('Not Authorization status:', authStatus);

    }, []);

 const ConfirmAppointment=async ()=>{
  
  setIsLoading(true);
        try {
          await firestore()
          .collection('user_table')
          .doc(route?.params?.doc)
          .update({
            appointmentstatus: !route?.params?.status,
          })
            .then((querySnapshot) => {
              // const data = [];
              // querySnapshot.forEach(documentSnapshot => {
              //  console.log('user: ', querySnapshot);
               sendPushNotification()
               navigation.navigate('Patients');
              setIsLoading(false);
            });
        } catch (err) {
          setIsLoading(false);
          Alert.alert(err);
        }
    
 }
 console.log(route?.params?.status)
 const sendPushNotification = async () => {
    try {
      const message = {
        to:token,
        notification: {
          title: 'Appointment Confirmed',
          body: 'Your Appointment on'+route?.params?.datetime+'is confirmed',
        },
      };
  
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${'AAAAejg1ulo:APA91bF01g_gClFUVXc99sLypvWj2TZhjwl6WiVA5lnnjFW1z8L2M2pva0e0rAnTxjJt4OeqiUcXntHOZ_li6gO5zyuB9SwWXrzvpO-3uE4ThZdwiSjJc3aNl3XEJeVg1nd7eW2_68Zr'}`
        },
        body: JSON.stringify(message),
      });
    
     const responseData = await response.json();
      console.log('Notification sent successfully:', responseData);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  return (
    <View style={styles.container}>
      {isloading ? (
          <ActivityIndicator
            size={'large'}
            color={'blue'}
            style={{marginTop: 300}}
          />
        ) : (
      <>
      <View style={styles.card_container}>
        <View style={styles.doctor_details}>
          {/* Image */}
          <View style={styles.doctor_details_Image}>
            <Image
              source={require('../../assets/images/docicon.jpg')}
              resizeMode="contain"
              style={{
                width: 130,
                height: 120,
              }}
            />
          </View>

          <View style={styles.doctor_details_info}>
            <Text style={styles.doctor_name}>{route?.params?.name}</Text>
            <Text style={styles.doctor_speciality}>
              {route?.params?.complaint}
            </Text>
            <Text style={styles.doctor_speciality}>
              {route?.params?.age}
            </Text>
            <Text style={styles.doctor_speciality}>{route?.params?.datetime}</Text>
          </View>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.doctor_record}>
          <Text>Patients</Text>
          <Text>2.3k</Text>
        </View>
        <View style={styles.doctor_record}>
          <Text>Date</Text>
          <Text>{route.params.datetime}</Text>
        </View>
        <View style={styles.doctor_record}>
          <Text>Reviews</Text>
          <Text>4.00k</Text>
        </View>
      </View>
      <View style={styles.doctor_biography}>
        <Text style={{fontSize:18,fontWeight:'bold'}}>Biography</Text>
        <Text style={{fontSize:15,fontWeight:'500',marginTop:10}}>
          Dr. {route.params.Name} is a highly accomplished and compassionate medical
          professional specializing in {route.params.Speciality}. With extensive
          experience and a patient-centered approach, Dr. {route.params.Name} is
          known for their exceptional care and dedication to improving lives.
          They actively contribute to medical research and community outreach,
          making a positive impact in healthcare
        </Text>
      </View>
      <TouchableOpacity
            style={styles.appButtonContainer}
              onPress={() => ConfirmAppointment()}
            // onPress={() => navigation.navigate('AppointmentForm')}
            >

            <Text
              style={styles.appButtonText}
              secureTextEntry={true}
              color="grey"
              align="center">
                {route?.params?.status ? 'Cancel Appointment':'Confirm Appointment' }
            </Text>
          </TouchableOpacity>
          </>)}
    </View>
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
    width: 350,
    height: 130,
    borderWidth: 0,
    marginTop: 15,
    marginLeft: 15,
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
    flex: 0.7,
    marginLeft: 10,
    justifyContent: 'center',
    //   alignItems: 'center',
    //   alignContent: 'center',
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
  doctor_record: {
    width: 100,
    height: 50,
    borderWidth: 2,
    marginTop: 15,
    marginLeft: 25,
    paddingLeft: 10,
    color: '#05375a',
    borderColor: '#f2f2f2',
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctor_biography: {
    margin:20
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
    marginLeft:50
  },
  appButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default Patientdetails;

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
  Button
} from 'react-native';
import React, {useState, useEffect,useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import notifee from '@notifee/react-native';
import qs from 'qs';
import { Linking } from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
import { AuthContext } from './AuthProvider';
// import { LocalNotification } from '../services/LocalPushControler';

const HomeScreen = ({navigation}) => {
  const { user, logout,update ,deviceToken} = useContext(AuthContext);
  const [isloading, setIsLoading] = useState(false);
  const [doctordata, setDoctorData] = useState([]);
  useEffect(() => {
     database();
  }, []);
  // console.log({deviceToken})
  // const pushbutton=()=>{
  //   // LocalNotification()
  //   // SendIntentAndroid.sendMail("sureshkrish2104@address.com", "Subject test", "Test body");
  // }

  // const sendPushNotification = async () => {
  //   try {
  //     const message = {
  //       to: 'fhhb_1ODQcyQdeLpGlu64g:APA91bHlvFp3jPFmPnV6EIdbY7nzcFeamQbB7SEcysEoeoauTw3IeAuNEa8dIKpQ5Rv8AwyDJ8XBHfPEPAUf5XCfFeJ_IxYuKb9lDKmxW_XYhPQ06IDTSygAFwbvIIiGeqlC9NXxZYCj',
  //       notification: {
  //         title: 'Testing',
  //         body: 'please come soon',
  //       },
  //     };
  
  //     const response = await fetch('https://fcm.googleapis.com/fcm/send', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${'AAAAejg1ulo:APA91bF01g_gClFUVXc99sLypvWj2TZhjwl6WiVA5lnnjFW1z8L2M2pva0e0rAnTxjJt4OeqiUcXntHOZ_li6gO5zyuB9SwWXrzvpO-3uE4ThZdwiSjJc3aNl3XEJeVg1nd7eW2_68Zr'}`
  //       },
  //       body: JSON.stringify(message),
  //     });
  
  //     const responseData = await response.json();
  //     console.log('Notification sent successfully:', responseData);
  //   } catch (error) {
  //     console.error('Error sending notification:', error);
  //   }
  // };
  
  // async function onDisplayNotification() {
  //   // Request permissions (required for iOS)
  //   console.log("clled")
  //   await notifee.requestPermission()

  //   // Create a channel (required for Android)
  //   const channelId = await notifee.createChannel({
  //     id: '524929055322',
  //     name: 'Default Channel',
  //   });

  //   // Display a notification
  //   await notifee.displayNotification({
  //     title: 'Notification Title',
  //     body: 'Main body content of the notification',
  //     android: {
  //       channelId,
  //       smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
  //       // pressAction is needed if you want the notification to open the app when pressed
  //       pressAction: {
  //         id: 'default',
  //       },
  //     },
  //   });
  // }
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

  // console.log(doctordata,"doc")
  return (
    <View style={styles.container}>
      {isloading ? (
        <ActivityIndicator
          size={'large'}
          color={'blue'}
          style={{marginTop: 300}}
        />
      ) : (
        <View style={styles.doctor_container}>
          <View style={{flexDirection:'row',alignContent:'space-between',justifyContent:'space-between'}}>
            <Text style={styles.text_header}>Popular Doctors</Text>
            <Button title='Logout' onPress={() => logout()}/>
            </View>
          <FlatList data={doctordata} renderItem={renderData} />
        </View>
      )}
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
    flex: 0.7,
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

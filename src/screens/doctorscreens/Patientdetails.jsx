import {View, Text, StyleSheet, Platform,Image,TouchableOpacity,ActivityIndicator,Alert,PermissionsAndroid} from 'react-native';
import React,{useState,useEffect} from 'react';
import { AuthContext } from '../AuthProvider';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';


const Patientdetails = ({route, navigation}, props) => {
  const [isloading, setIsLoading] = useState(false);
  const [token,setToken]=useState('')
  const [reportfile,setReportFile]=useState('')
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
      downloadreport()
    }, []);

 const ConfirmAppointment=async ()=>{
  
  setIsLoading(true);
        try {
          await firestore()
          .collection('user_table')
          .doc(route?.params?.doc)
          .update({
            appointmentstatus: !route?.params?.status,
          }).then(querySnapshot => {
              // const data = [];
              // querySnapshot.forEach(documentSnapshot => {
              console.log('user: ', querySnapshot);
               sendPushNotification(route?.params?.status)
               navigation.navigate('Patients');
               setIsLoading(false);
            }).catch((err)=>{
              console.log(err)
              Alert.alert('Something went wrong!')
            });
        } catch (err) {
          setIsLoading(false);
          Alert.alert(err);
        }
    
 }
 const downloadreport = async () => {
  if(route?.params?.reports){
    const url = await storage().ref('myfiles/'+route?.params?.reports).getDownloadURL().then((data)=>{
      console.log(data)
      setReportFile(data)
    }
    )
  }
 
 }

 console.log(reportfile,"reportfile")
 const checkPermission = async () => {
    
  // Function to check the platform
  // If Platform is Android then check for permissions.

  if (Platform.OS === 'ios') {
    downloadFile();
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message:
            'Application needs access to your storage to download File',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Start downloading
        downloadFile();
        console.log('Storage Permission Granted.');
      } else {
        // If permission denied then show alert
        Alert.alert('Error','Storage Permission Not Granted');
      }
    } catch (err) {
      // To handle permission related exception
      console.log("++++"+err);
    }
  }
};

 const downloadFile = () => {
   
  // Get today's date to add the time suffix in filename
  let date = new Date();
  // File URL which we want to download
  let FILE_URL = reportfile;    
  // Function to get extention of the file url
  let file_ext = getFileExtention(FILE_URL);
 
  file_ext = '.' + file_ext[0];
 
  // config: To get response by passing the downloading related options
  // fs: Root directory path to download
  setIsLoading(true)
  const { config, fs } = RNFetchBlob;
  let RootDir = fs.dirs.PictureDir;
  let options = {
    fileCache: true,
    addAndroidDownloads: {
      path:
        RootDir+
        '/file_' + 
        Math.floor(date.getTime() + date.getSeconds() / 2) +
        file_ext,
      description: 'downloading file...',
      notification: true,
      // useDownloadManager works with Android only
      useDownloadManager: true,   
    },
  };
  config(options)
    .fetch('GET', FILE_URL)
    .then(res => {
      // Alert after successful downloading
      setIsLoading(false)
      console.log('res -> ', JSON.stringify(res));
      alert('File Downloaded Successfully.');
    }).catch((err)=>{
      setIsLoading(false)
      console.log('res -> ', JSON.stringify(err));
      alert('File Downloaded failed.');
    });
};
const getFileExtention = fileUrl => {
  // To get the file extension
  return /[.]/.exec(fileUrl) ?
           /[^.]+$/.exec(fileUrl) : undefined;
};
 const sendPushNotification = async (confirm) => {
    try {
      const message = {
        to:route?.params?.fcmtoken,
        notification: {
          title: !confirm?'Appointment Confirmed':'Appointment Canceled',
          body: !confirm?'Your Appointment on '+route?.params?.datetime+' is confirmed':'Your Appointment on'+route?.params?.datetime+'is cancelled',
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
      <View style={{flexDirection: 'row',alignItems:'center',justifyContent:'center'}}>
        {/* <View style={styles.doctor_record}>
          <Text>Patients</Text>
          <Text>2.3k</Text>
        </View> */}
        <View style={styles.doctor_record}>
          <Text>Date & Time</Text>
          <Text>{route.params.datetime}</Text>
        </View>
       
      </View>
      <View style={styles.doctor_biography}>
        <Text style={{fontSize:18,fontWeight:'bold'}}>Patient Complaint</Text>
        <Text style={{fontSize:15,fontWeight:'500',marginTop:10}}>
        {route?.params?.complaint} 
        </Text>
      </View>
      {route?.params?.reports && 
      <View style={{width:'100%',alignItems:'center'}}>
      <TouchableOpacity
            style={styles.appButtonContainer}
              onPress={() => checkPermission()}
            // onPress={() => navigation.navigate('AppointmentForm')}
            >
            <Text
              style={styles.appButtonText}
              secureTextEntry={true}
              color="grey"
              align="center">
              Download Report
            </Text>
          </TouchableOpacity>
          </View>
}
      <View style={{width:'100%',alignItems:'center'}}>
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
          </View>
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
    width: "100%",
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
    width: "60%",
    height: 50,
    borderWidth: 2,
    marginTop: 15,
    marginLeft: 25,
    // paddingLeft: 10,
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
    marginTop: 12,
    marginRight: 20,
    color: '#05375a',
    borderWidth: 1,
    width: 300,
    borderColor: '#f2f2f2',
    height: 50,
    elevation: 1,
    backgroundColor: '#354f8c',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  appButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default Patientdetails;

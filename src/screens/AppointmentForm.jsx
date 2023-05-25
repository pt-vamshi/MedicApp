import React, {useEffect, useState, useContext} from 'react';
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
  Button,
  ActivityIndicator
} from 'react-native';
import {AuthContext} from './AuthProvider';
import RadioButton from '../components/RadioButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
const AppointmentForm = ({route,navigation}) => {
  const {user} = useContext(AuthContext);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [complaint, setComplaint] = useState('');
  const [selecteddate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [docres, setDocRes] = useState({});

  const {login} = useContext(AuthContext);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [filedetails, setFileDetails] = useState({});
  const [process, setProcess] = useState('');
  const [isprocess, setIsProcess] = useState(false);
  const [token,setToken]=useState('')

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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const selecteddateTime = new Date(date);
    setSelectedDate(
      selecteddateTime.getDate() +
        '/' +
        selecteddateTime.getMonth() +
        '/' +
        selecteddateTime.getFullYear(),
    );
    setSelectedTime(
      `${selecteddateTime.getHours()}:${selecteddateTime.getMinutes()}`,
    );
    hideDatePicker();
  };

  const handleSelectOption = option => {
    setGender(option);
  };
  const _chooseFile = async () => {
    // Opening Document Picker to select one file
    try {
      const fileDetails = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      });
      // Setting the state for selected File
      _uploadFile(fileDetails);
      setFileDetails(fileDetails);
    } catch (error) {
      setFileDetails({});
      // If user canceled the document selection
      alert(
        DocumentPicker.isCancel(error)
          ? 'Canceled'
          : 'Unknown Error: ' + JSON.stringify(error),
      );
    }
  };

  const _uploadFile = async filePath => {
    try {
      // Check if file selected
      if (Object.keys(filePath).length == 0)
        return alert('Please Select any File');
      setIsLoading(true);

      // Create Reference
      //  console.log(filePath[0],"filepath");
      const reference = storage().ref(`/myfiles/${filePath[0].name}`);

      // Put File

      const task = reference.putFile(
        filePath[0].fileCopyUri? filePath[0].fileCopyUri?.replace('file://', ''):filePath[0].uri?.replace('file://', ''),
      )
      // if(!task){
      //   alert('Please chosse Local Documents or Images to upload!');
      // }
      // .then((data)=>{
      //         console.log(data,"data")
      // }).catch(()=>{
      //   alert('Please chosse Local Documents or Images to upload!');
      // });
      // You can do different operation with task
      // task.pause();
      // task.resume();
      // task.cancel();

      task.on('state_changed', taskSnapshot => {
        setIsProcess(true);
        setProcess(
          `${taskSnapshot.bytesTransferred} transferred 
               out of ${taskSnapshot.totalBytes}`,
        );
        console.log(
          `${taskSnapshot.bytesTransferred} transferred 
               out of ${taskSnapshot.totalBytes}`,
        );
      });
      task
        .then(res => {
          setIsProcess(false);
          setDocRes(res);
          alert('Image or document  uploaded successfully!');
          setProcess('');
        })
        .catch(err => {
          setIsProcess(false);
          setDocRes({});
          alert('Please choose Local Documents or Images to upload!');
          setProcess('');
        });
      setFileDetails({});
    } catch (error) {
       console.log('Error->', error);
      // alert(`Error-> ${error}`);
    }
    setIsLoading(false);
  };
  // console.log(docres,"docress")
  const onSubmit = () => {
    if(name!=="" && age !=="" && gender !=="" && complaint !=="" && selecteddate!=="" && selectedTime!=="" ){
      setIsLoading(true)
      firestore()
      .collection('user_table')
      .add({
        uid:user?.uid,
        name: name,
        age: age,
        gender:gender,
        complaint:complaint,
        datetime:selecteddate+" "+selectedTime,
        reports:docres?.metadata?.name || null,
        appointmentstatus:false,
        doctor:route?.params.Email,
        fcmtoken:token?token:''
      })
      .then((res) => {
        // console.log(res)
        setIsLoading(false)
        Alert.alert("Appointment created sucessfully")
        sendMail()
        navigation.navigate('Home')
        // console.log('User added!');
      }).catch((err)=>{
        setIsLoading(false)
        Alert.alert("Something went wrong")
      });
    
    }else{
        Alert.alert("Please fill all fields")
      }
  };
  
  const sendMail = async () => {
        try {
          const message = {
            "to": route?.params?.Email,
            "cc": "",
            "data": {
             "doctorName": route?.params?.Name,
             "name": name?name:"Pearl",
             "age": age?age:'23',
             "gender": gender?gender:"Male",
             "complaint": complaint?complaint:"Cavity",
             "appointmentDate": selecteddate+" "+selectedTime}
            }
          ;
      
          const response = await fetch('https://hurricane-glen-smile.glitch.me/mail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          });
      
          // const responseData = await response.json();
          // console.log('Email:', response);
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      };

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      {isloading ? (
        <ActivityIndicator
          size={'large'}
          color={'blue'}
          style={{marginTop: 300}}
        />
      ) : 
     ( <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.text_header}>Name</Text>
          <TextInput
            placeholder="Enter Your FullName"
            placeholderTextColor="#666666"
            style={[
              styles.textInput,
              {
                color: 'black',
              },
            ]}
            autoCapitalize="none"
            value={name}
            onChangeText={val => setName(val)}
          />
          <Text style={styles.text_header}>Age</Text>
          <TextInput
            placeholder="Enter Your Age"
            placeholderTextColor="#666666"
            style={[
              styles.textInput,
              {
                color: 'black',
              },
            ]}
            autoCapitalize="none"
            value={age}
            onChangeText={val => setAge(val)}
          />

          <View>
            <Text style={styles.text_header}>Gender</Text>
            <RadioButton
              options={['Male', 'Female', 'Others']}
              selectedOption={gender}
              onSelect={handleSelectOption}
            />
          </View>
          <Text style={styles.text_header}>Complaint</Text>
          <TextInput
            multiline={true}
            numberOfLines={5}
            placeholder="Enter Your Complaint"
            placeholderTextColor="#666666"
            style={styles.textInputField}
            value={complaint}
            onChangeText={val => setComplaint(val)}
          />
          <View>
            <Text style={styles.text_header}>Date and Time</Text>
            <View>
              <Button title="Pick Date and time" onPress={showDatePicker} />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>
            {selecteddate !== '' && (
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text style={{fontSize: 16}}>
                  {' '}
                  Selected Date-{selecteddate}
                  {'  '}
                </Text>
                <Text style={{fontSize: 16}}>Time-{selectedTime}</Text>
              </View>
            )}
          </View>
          <Text style={styles.text_header}>Reports</Text>

          {Object.keys(docres).length == 0 ? (
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonStyle}
              onPress={_chooseFile}>
              {process ? (
                <Text style={styles.buttonTextStyle}>{process}</Text>
              ) : (
                <Text style={styles.buttonTextStyle}>
                  Choose Image Or Document to Upload{' '}
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonStyle}
              //  onPress={_chooseFile}
            >
              <Text style={styles.buttonTextStyle}>
                {docres?.metadata?.name}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* button  */}
        <TouchableOpacity
          style={styles.appButtonContainer}
          disabled={isprocess}
          onPress={() => onSubmit()}
          // onPress={() => login(email, password)}
        >
          <Text
            style={styles.appButtonText}
            secureTextEntry={true}
            color="grey"
            align="center">
            SUBMIT
          </Text>
        </TouchableOpacity>
        {/* or */}
      </View>)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 30,
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
    alignItems: 'flex-start',
    marginRight: 30,
    marginTop: 10,
  },
  text_header: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },
  textInput: {
    marginTop: 12,
    paddingLeft: 10,
    color: '#05375a',
    borderWidth: 1,
    width: 300,
    borderColor: '#f2f2f2',
    fontSize: 15,
    height: 50,
    backgroundColor: '#f9f9fd',
    borderRadius: 5,
  },
  appButtonContainer: {
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
  linkButtonText: {
    fontSize: 20,
    color: '#354f8c',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInputField: {
    // height: '50%',
    marginTop: 10,
    width: 280,
    borderWidth: 1,
    borderColor: 'gray',
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9fd',
    borderRadius: 5,
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: 'orange',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
  buttonTextStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AppointmentForm;

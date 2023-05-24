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
  import { AuthContext } from '../AuthProvider';
  import { useFocusEffect } from '@react-navigation/native';
  const Patients = ({navigation}) => {
    const { user, logout,update } = useContext(AuthContext);
    const [isloading, setIsLoading] = useState(false);
    const [patientdata, setPatientData] = useState([]);
    // useEffect(() => {
    //    database();
    // }, []);
    // useFocusEffect(
    //   React.useCallback(() => {
    //     const unsubscribe = database();
  
    //     return () => unsubscribe();
    //   }, [])
    // );
    useFocusEffect(
      React.useCallback(() => {
        // Code to be executed when the screen gains focus (navigated to)
        // This is equivalent to calling useEffect with an empty dependency array
  
        // Place your logic here
        console.log('Screen focused');
        database();
  
        return () => {
          // Code to be executed when the screen loses focus (navigated away from)
          // This is equivalent to calling useEffect with a cleanup function
  
          // Place your cleanup logic here
          console.log('Screen unfocused');
        };
      }, [])
    );
    // console.log(patientdata,"patient")
    const database = async () => {
        setIsLoading(true);
        try {
          await firestore()
            .collection('user_table')
            .get()
            .then(querySnapshot => {
              const data = [];
              querySnapshot.forEach(documentSnapshot => {
                // console.log('user: ', documentSnapshot.data().doctor);
                // documentSnapshot.data
                if(documentSnapshot.data().doctor == user?.email){
                  data.push({...documentSnapshot.data(),docid:documentSnapshot.id});
                }
              });
              setPatientData(data);
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
          navigation.navigate('Patientdetails', {
            name: Item?.item?.name,
            age:  Item?.item?.age,
            complaint: Item?.item?.complaint,
            datetime: Item?.item?.datetime,
            gender: Item?.item?.gender,
            doc:Item?.item?.docid,
            status:Item?.item?.appointmentstatus,
          });
        }}>
          <View style={styles.doctor_details}>
            {/* Image */}
            <View style={styles.doctor_details_Image}>
              <Image
                source={require('../../assets/images/patienticon.png')}
                resizeMode="contain"
                style={{
                  width: 130,
                  height: 120,
                }}
              />
            </View>
  
            <View style={styles.doctor_details_info}>
              <Text style={styles.doctor_name}>{Item?.item?.name}</Text>
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
        </Pressable>
      );
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
          <View style={styles.doctor_container}>
            <View style={{flexDirection:'row',alignContent:'space-between',justifyContent:'space-between'}}>
            <Text style={styles.text_header}>PatientsList</Text>
            <Button title='Logout' onPress={() => logout()}/>
            </View>

            <FlatList data={patientdata} renderItem={renderData} />
            
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
  
  export default Patients;
  
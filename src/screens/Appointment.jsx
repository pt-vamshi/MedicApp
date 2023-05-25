import {View, Text, StyleSheet, Image,TouchableOpacity} from 'react-native';
import React from 'react';

const Appointment = ({route, navigation}, props) => {
  return (
    <View style={styles.container}>
      <View style={styles.card_container}>
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
            <Text style={styles.doctor_name}>{route?.params?.Name}</Text>
            <Text style={styles.doctor_speciality}>
              {route?.params?.Speciality}
            </Text>
            <Text style={styles.doctor_speciality}>
              {route?.params?.Phone_no}
            </Text>
            <Text style={styles.doctor_speciality}>{route?.params?.Email}</Text>

            {/* <View style={{flexDirection: 'row'}}>
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
              <Text>{route?.params?.Experience} year</Text>
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
          </View> */}
          </View>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.doctor_record}>
          <Text>Patients</Text>
          <Text>2.3k</Text>
        </View>
        <View style={styles.doctor_record}>
          <Text>Experience</Text>
          <Text>{route.params.Experience} Years</Text>
        </View>
        <View style={styles.doctor_record}>
          <Text>Reviews</Text>
          <Text>4.00k</Text>
        </View>
      </View>
      <View style={styles.doctor_biography}>
        <Text style={{fontSize:18,fontWeight:'bold'}}>Biography</Text>
        <Text style={{fontSize:15,fontWeight:'500',marginTop:10}}>
           {route.params.Name} is a highly accomplished and compassionate medical
          professional specializing in {route.params.Speciality}. With extensive
          experience and a patient-centered approach, {route.params.Name} is
          known for their exceptional care and dedication to improving lives.
          They actively contribute to medical research and community outreach,
          making a positive impact in healthcare
        </Text>
      </View>
      <View style={{width:'100%',alignItems:'center'}}>
      <TouchableOpacity
            style={styles.appButtonContainer}
            // onPress={() => doLogin()}
            onPress={() => navigation.navigate('AppointmentForm',{
              Email: route?.params?.Email,
              Name: route?.params?.Name
            })}
            >
            <Text
              style={styles.appButtonText}
              secureTextEntry={true}
              color="grey"
              align="center">
               Book An Appointment
            </Text>
      </TouchableOpacity>
      </View>
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
    marginLeft: 5,
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
    width:'100%'
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
    width: "25%",
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
    // marginTop: 12,
    // marginRight:20,
    color: '#05375a',
    borderWidth:1,
    width:"90%",
    borderColor: '#f2f2f2',
    height:50,
    elevation: 1,
    backgroundColor: '#354f8c',
    borderRadius:6,
    justifyContent:'center',
    alignContent:'center',
    // marginLeft:"5%",
    // marginRight:"10%"
  },
  appButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default Appointment;

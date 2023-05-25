// import { View, Text ,TouchableOpacity} from 'react-native'
// import React,{useContext} from 'react'
// import { AuthContext } from './AuthProvider';

// const InitialScreen = () => {
//   const { logout } = useContext(AuthContext);
//   return (
//     <View>
//       <Text>InitialScreen</Text>
//       <TouchableOpacity
//             // style={styles.appButtonContainer}
//             // onPress={() => doLogin()}
//             onPress={() => logout()}
//             >
//             <Text
//               // style={styles.appButtonText}
//               secureTextEntry={true}
//               color="grey"
//               align="center">
//               SIGN OUT
//             </Text>
//           </TouchableOpacity>
//     </View>
//   )
// }

// export default InitialScreen

// #3 Uploading Files and Images to Firebase Cloud Storage in React Native
// https://aboutreact.com/react-native-firebase-cloud-storage/

// Import React in our code
import React, { useEffect, useState } from "react";

// Import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

// Firebase Storage to upload file
import storage from "@react-native-firebase/storage";
// To pick the file from local file system
import DocumentPicker from "react-native-document-picker";

const InitialScreen = () => {
  // State Defination
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState({});
  const [process, setProcess] = useState("");

  useEffect(()=>{
      dd()
  },[])
 const dd=async()=>{
  const url = await storage().ref('myfiles/1602835512556..jpg').getDownloadURL();
  // console.log(url,"iii")
 }
  const _chooseFile = async () => {
    // Opening Document Picker to select one file
    try {
      const fileDetails = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
        copyTo:'cachesDirectory',
      });
      // console.log(
      //   "fileDetails : " + JSON.stringify(fileDetails)
      // );
      // Setting the state for selected File
      setFilePath(fileDetails);
    } catch (error) {
      setFilePath({});
      // If user canceled the document selection
      alert(
        DocumentPicker.isCancel(error)
          ? "Canceled"
          : "Unknown Error: " + JSON.stringify(error)
      );
    }
  };

  const _uploadFile = async () => {
    try {
      // Check if file selected
      if (Object.keys(filePath).length == 0)
        return alert("Please Select any File");
      setLoading(true);

      // Create Reference
      // console.log(filePath[0]?.uri,"filepath");
      const reference = storage().ref(
        `/myfiles/${filePath[0].name}`
      );

      // Put File
      const task = reference.putFile(
        filePath[0].fileCopyUri?.replace("file://", "")
      );
      // You can do different operation with task
      // task.pause();
      // task.resume();
      // task.cancel();

      task.on("state_changed", (taskSnapshot) => {
        setProcess(
          `${taskSnapshot.bytesTransferred} transferred 
           out of ${taskSnapshot.totalBytes}`
        );
        console.log(
          `${taskSnapshot.bytesTransferred} transferred 
           out of ${taskSnapshot.totalBytes}`
        );
      });
      task.then((res) => {
        // console.log(res,"res")
        alert("Image uploaded to the bucket!");
        setProcess("");
      });
      setFilePath({});
    } catch (error) {
      console.log("Error->", error);
      alert(`Error-> ${error}`);
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 300}}/>
        </View>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <Text style={styles.titleText}>
              Upload Input Text as File on FireStorage
            </Text>
            <View style={styles.container}>
              <Text>
                Choose File and Upload to FireStorage
              </Text>
              <Text>{process}</Text>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.buttonStyle}
                onPress={_chooseFile}
              >
                <Text style={styles.buttonTextStyle}>
                  Choose Image (Current Selected:{" "}
                  {Object.keys(filePath).length == 0
                    ? 0
                    : 1}
                  )
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={_uploadFile}
              >
                <Text style={styles.buttonTextStyle}>
                  Upload File on FireStorage
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.footerHeading}>
              React Native Firebase Cloud Storage
            </Text>
            <Text style={styles.footerText}>
              www.aboutreact.com
            </Text>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default InitialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
  },
  buttonStyle: {
    alignItems: "center",
    backgroundColor: "orange",
    padding: 10,
    width: 300,
    marginTop: 16,
  },
  buttonTextStyle: {
    color: "white",
    fontWeight: "bold",
  },
  footerHeading: {
    fontSize: 18,
    textAlign: "center",
    color: "grey",
  },
  footerText: {
    fontSize: 16,
    textAlign: "center",
    color: "grey",
  },
});
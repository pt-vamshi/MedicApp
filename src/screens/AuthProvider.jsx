import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {ReactNativeFirebase} from '@react-native-firebase/app';
export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const [devicetoken,setDeviceToken]=useState('');

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isloading,
        setIsLoading,
        devicetoken,
        setdevicetoken: (token) => {
           console.log("tokennnnnnnnnnn",token)
          setDeviceToken(token)
        },
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        register: async (email, password) => {
          setIsLoading(true);
          try {
           return await auth()
              .createUserWithEmailAndPassword(email, password).then(()=>{
                setIsLoading(false)
              }).catch((err)=>{
                setIsLoading(false)
              })
          } catch (e) {
            setIsLoading(false);
            console.log(e);
          }
        },
        update: async () => {
          auth()
            .signInAnonymously()
            .then(function () {
                auth()
                .currentUser.updateProfile({
                  displayName: 'customer ' + new Date(),
                })
                .then(function () {
                  // console.log(auth().currentUser.displayName);
                });
            });
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.error(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};

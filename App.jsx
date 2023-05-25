
import React, {useEffect,useContext} from 'react';
import Providers from './src/navigation';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { AuthContext } from './src/screens/AuthProvider';

const TOPIC = 'MyNews';

const App = () => {
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
      /**
       * Returns an FCM token for this device
       */
      messaging()
        .getToken()
        .then((fcmToken) => {
          console.log('FCM Token -> ', fcmToken);
          // setdevicetoken(fcmToken);
        });
    } else console.log('Not Authorization status:', authStatus);

    /**
     * When a notification from FCM has triggered the application
     * to open from a quit state, this method will return a
     * `RemoteMessage` containing the notification data, or
     * `null` if the app was opened via another method.
     */
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'getInitialNotification:' +
              'Notification caused app to open from quit state',
          );
          console.log(remoteMessage);
          alert(
            'getInitialNotification: Notification caused app to' +
            ' open from quit state',
          );
        }
      });

    /**
     * When the user presses a notification displayed via FCM,
     * this listener will be called if the app has opened from
     * a background state. See `getInitialNotification` to see
     * how to watch for when a notification opens the app from
     * a quit state.
     */
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      if (remoteMessage) {
        console.log(
          'onNotificationOpenedApp: ' +
            'Notification caused app to open from background state',
        );
        console.log(remoteMessage);
        alert(
          'onNotificationOpenedApp: Notification caused app to' +
          ' open from background state',
        );
      }
    });

    /**
     * Set a message handler function which is called when
     * the app is in the background or terminated. In Android,
     * a headless task is created, allowing you to access the
     * React Native environment to perform tasks such as updating
     * local storage, or sending a network request.
     */
    messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        console.log(
          'Message handled in the background!',
          remoteMessage
        );
    });

    /**
     * When any FCM payload is received, the listener callback
     * is called with a `RemoteMessage`. Returns an unsubscribe
     * function to stop listening for new messages.
     */
    const unsubscribe = messaging().onMessage(
      async (remoteMessage) => {
        // alert('A new FCM message arrived!');
        onDisplayNotification(remoteMessage);
        console.log(
          'A new FCM message arrived!',
          JSON.stringify(remoteMessage)
        );
      }
    );

    /**
     * Apps can subscribe to a topic, which allows the FCM
     * server to send targeted messages to only those devices
     * subscribed to that topic.
     */
    messaging()
      .subscribeToTopic(TOPIC)
      .then(() => {
        console.log(`Topic: ${TOPIC} Suscribed`);
      });

    return () => {
      unsubscribe;
      /**
       * Unsubscribe the device from a topic.
       */
      // messaging().unsubscribeFromTopic(TOPIC);
    };
  }, []);
   async function onDisplayNotification(remoteMessage) {
    // Request permissions (required for iOS)
    // console.log("clled",remoteMessage)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: '524929055322',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }
  return (
<Providers/>
  );
};



export default App;
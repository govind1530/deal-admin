import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = ({navigation}) => {
  const [fcmToken, setFcmToken] = React.useState(null);
  const [os,setOs]  = React.useState('')
  React.useEffect(() => {

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
        setFcmToken(token?.token);
        setOs(token?.os);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
       // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
        try {
            GoogleSignin.configure({
              webClientId:
                '190000929043-09sgr301r5ne7b2vlont6vc5tnpvq6bd.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
              offlineAccess: true,
              hostedDomain: '',
              loginHint: '',
              forceConsentPrompt: true,
              accountName: '',
            });
        } catch (e) {
            console.log(e);
        }
    }, [])
  
  
  async function googleLogin() {
    try {
        GoogleSignin.hasPlayServices().then(() => {
            GoogleSignin.signOut().then(() => {
                GoogleSignin.signIn().then((result) => {

                  // console.log(
                  //   'google data',
                  //   result?.idToken,
                  //   result?.user?.email,
                  //   result?.user?.id,
                  //   result?.user?.name,
                  //   result?.user?.photo,
                  // );

                  let userData = {
                    name: result?.user?.name,
                    email: result?.user?.email,
                    id: result?.user?.id,
                    photo: result?.user?.photo,
                  };
                  
                  //GoogleSignin.signOut()
                   firestore()
                     .collection('Admin')
                     .add({
                       adminIdToken: result?.idToken,
                       adminEmail: result?.user?.email,
                       adminId: result?.user?.id,
                       adminName: result?.user?.name,
                       adminPhoto: result?.user?.photo,
                       adminNotificationToken: fcmToken,
                       adminOs:os,
                     }).then((res) => {
                       console.log('admin added in firestore database', res)
                       if (res) {
                      navigation.navigate('Home');
                         // storeData(userData);
                         // navigation.navigate('Home');
                       }
                     }).catch((err) => {
                       console.log('error while adding admin in firestore', err);
                     })
                     
                 
                }).catch((error) => {
                    console.log(error, "error")
                })
            })
        })

    } catch (error) {
        console.log(error, "error")
        
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
        } else {
            // some other error happened
        }
    }
}

const storeData = async (value) => {
  console.log('user data',value)
  try {
    await AsyncStorage.setItem("user", value)
     navigation.navigate('Home');
  } catch (e) {
    console.log('error',e)
    // saving error
  }
}

    return (
      <View style={styles.container}>
        <GoogleSigninButton
          style={{width: 192, height: 48}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
         onPress={googleLogin}
          //disabled={this.state.isSigninInProgress}
        />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
        backgroundColor: '#131618',
        justifyContent: 'center',
    alignItems:'center',
  },
});

export default Login;
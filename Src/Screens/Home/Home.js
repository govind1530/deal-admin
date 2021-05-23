import React from 'react';
import { View, Text, Image, StyleSheet ,TouchableOpacity} from 'react-native';
import ActionButton from 'react-native-action-button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
const Home = ({navigation}) => {
const [totalCoupon,setTotalCoupon] = React.useState(0)
const [totalCategory,setTotalCategory] = React.useState(0)
const [totalUser,setTotalUser] = React.useState(0)
  React.useEffect(() => {
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
 //   const value = AsyncStorage.getItem('adminData');
   // console.log('admin data', JSON.stringify(value));
  },[])

  React.useEffect(() => {
    const subscriber = firestore()
      .collection('couponlist')
      .onSnapshot(documentSnapshot => {
       // console.log('couponlist docs: ', documentSnapshot?._docs);
        setTotalCoupon(documentSnapshot?._docs?.length)
        //console.log('couponlist changes: ',documentSnapshot?._changes);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);
  function ActionButton() {
    return (
      <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
            <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
            <Icon name="md-done-all" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
    )
  }
 const  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem("user");
      navigation.reset({
        index: 0,
        routes: [
          { name: 'Login' },
        ],
      })
    //  this.setState({user: null}); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };
    return (
      <View style={{flex: 1, backgroundColor: '#f3f3f3'}}>

<TouchableOpacity
          style={{
            width: 100,
            height: 30,
            borderRadius: 100,
            backgroundColor: 'black',
            margin: 10,
          }}
          onPress={() => signOut()}>
          <Text style={{color: 'white', textAlign: 'center', top: 5}}>
            Logout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 100,
            height: 30,
            borderRadius: 100,
            backgroundColor: '#FF6633',
            marginRight: 10,
            alignSelf:'flex-end'
          }}
          onPress={() =>navigation.navigate('CouponList')}>
          <Text style={{color: 'white', textAlign: 'center', top: 5}}>
            All Coupons
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() =>navigation.navigate('AddCoupon')}
        style={[styles.cardStyle,{borderColor:'#33B6FF'}]}>
            <Text>Total Coupon: {totalCoupon}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.cardStyle,{borderColor:'#33FF8C'}]}>
            <Text>Total Category: {totalCategory}</Text>
        </TouchableOpacity>


        <TouchableOpacity style={[styles.cardStyle,{borderColor:'#FF9033'}]}>
            <Text>Total User: {totalUser}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={{
            width: 100,
            height: 30,
            borderRadius: 100,
            backgroundColor: 'black',
            margin: 10,
          }}
          onPress={() => signOut()}>
          <Text style={{color: 'white', textAlign: 'center', top: 5}}>
            Logout
          </Text>
        </TouchableOpacity>


        <TextInput
          label="Coupon"
          value={couponCatgory}
          onChangeText={text => setCouponCatgory(text)}
        /> */}

        {/* <TextInput
          label="Coupon"
          value={text}
          onChangeText={text => setText(text)}
        /> */}
      </View>
    );
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  cardStyle:{
    margin:'5%',
    width:'90%',
    borderWidth:1,
    borderRadius:10,
    borderColor:"#453156",
    height:75,
    justifyContent:'center', 
    alignItems:"center"
  }
});

export default Home
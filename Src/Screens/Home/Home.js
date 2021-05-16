import React from 'react';
import { View, Text, Image, StyleSheet ,TouchableOpacity} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
const Home = () => {
  const [couponName, setCouponName] = React.useState('');
  const [couponCatgory, setCouponCatgory] = React.useState('');
  React.useEffect(() => {
 //   const value = AsyncStorage.getItem('adminData');
   // console.log('admin data', JSON.stringify(value));
  },[])
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

        <TextInput
          label="Coupon name"
          value={couponName}
          onChangeText={text => setCouponName(text)}
        />

        <TextInput
          label="Coupon"
          value={couponCatgory}
          onChangeText={text => setCouponCatgory(text)}
        />

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
});

export default Home
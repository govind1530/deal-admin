import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity,ActivityIndicator,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextInput} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {Checkbox} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CameraController from '../../Components/Common/CameraController';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
const AddCoupon = ({navigation}) => {
    const [couponName,setCouponName] = React.useState('')
    const [couponCode,setCouponCode] = React.useState('')
    const [couponDescription,setCouponDescription] = React.useState('')
    const [couponUrl,setCouponUrl] = React.useState('')
    const [couponType,setCouponType] = React.useState('')
    const [couponCategory,setCouponCategory] = React.useState('')
    const [couponStore,setCouponStore] = React.useState('')
  const [isDatePickerVisible, setisDatePickerVisible] = React.useState(false);
  const [dateValue, setDateValue] = React.useState('Select Expiry Date');
  const [Active, setActive] = React.useState(false);
  const [Exclusive, setExclusive] = React.useState(false);
  const [Verified, setVerified] = React.useState(false);
  const [Featured, setFeatured] = React.useState(false);
  const [imagePath,setImagePath] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [transferred, setTransferred] = React.useState(0);
  const handleConfirmStart = date => {
    console.log(moment(date).format('DD-MM-YYYY h:mm a'));
    setDateValue(moment(date).format('DD-MM-YYYY'));
    setisDatePickerVisible(false);
  };
  const hideDatePicker = () => {
    setisDatePickerVisible(false);
  };

  const openImagePicker = () =>{
    CameraController.open(async response => {
       let path =  await response.path;
       console.log(path)
       setImagePath(path)
    })
  }

  const deleteImage = () =>{
      setImagePath('')
  }
  const uploadImage = async () => {
    if( imagePath == null ) {
      return null;
    }
    const uploadUri = imagePath;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = couponName+ Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`coupons/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImagePath(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };
  const uploadCoupon = async () => {
    const imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl);

    firestore()
    .collection('couponlist')
    .add({
        Name:couponName,
        code:couponCode,
        Description:couponDescription,
        Type:couponType,
        Url:couponUrl,
        Category:couponCategory,
        Store:couponStore,
        ExpiryDate:dateValue,
        Image:imageUrl,
        Active:Active,
        Exclusive:Exclusive,
        Verified:Verified,
        Featured:Featured,
        postTime: firestore.Timestamp.fromDate(new Date()),
    })
    .then(() => {
      console.log('Post Added!');
      Alert.alert(
        'Coupon published!',
        'Your Coupon has been published Successfully!',
      );
      navigation.goBack()
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
  }
  return (
    <View style={styles.container}>
         <KeyboardAwareScrollView
          bounces={false}
          alwaysBounceVertical={false}
          keyboardShouldPersistTaps={'handled'}>
      <TextInput
        label="Coupon name"
        style={{marginTop: 10, backgroundColor: 'white'}}
        value={couponName}
        onChangeText={text => setCouponName(text)}
      />

<TextInput
        label="Coupon Code"
        style={{marginTop: 10, backgroundColor: 'white'}}
        value={couponCode}
        onChangeText={text => setCouponCode(text)}
      />

      <TextInput
        label="Coupon Description"
        multiline={true}
        style={{marginTop: 10, backgroundColor: 'white'}}
        value={couponDescription}
        onChangeText={text => setCouponDescription(text)}
      />

      <RNPickerSelect
        onValueChange={value =>setCouponType(value)}
        useNativeAndroidPickerStyle={false}
        style={customPickerStyles}
        placeholder={{label: 'Coupon type', value: null}}
        items={[
          {label: 'Coupon', value: 'Coupon'},
          {label: 'Deal', value: 'Deal'},
          {label: 'Offer', value: 'Offer'},
          {label: 'Other', value: 'Other'},
        ]}
      />

      <TextInput
        label="Affiliate URL"
        multiline={true}
        style={{marginTop: 10, backgroundColor: 'white'}}
        value={couponUrl}
        onChangeText={text => setCouponUrl(text)}
      />

      <RNPickerSelect
        onValueChange={value => setCouponCategory(value)}
        useNativeAndroidPickerStyle={false}
        style={customPickerStyles}
        placeholder={{label: 'Select Category', value: null}}
        items={[
          {label: 'Mobile', value: 'Mobile'},
          {label: 'Fashion', value: 'Fashion'},
          {label: 'Food', value: 'Food'},
          {label: 'Other', value: 'Other'},
        ]}
      />

      <RNPickerSelect
        onValueChange={value => setCouponStore(value)}
        useNativeAndroidPickerStyle={false}
        style={customPickerStyles}
        placeholder={{label: 'Select Store', value: null}}
        items={[
          {label: 'Amazone', value: 'Amazone'},
          {label: 'Flipcart', value: 'Flipcart'},
          {label: 'Zometo', value: 'Zometo'},
          {label: 'Other', value: 'Other'},
        ]}
      />

      <TouchableOpacity
        style={{
          width: '95%',
          marginTop: 30,
          marginHorizontal: 10,
          borderWidth: 1,
          borderRadius: 5,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => setisDatePickerVisible(true)}>
        <Text>{dateValue}</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={{
          width: '95%',
          marginTop: 30,
          marginHorizontal: 10,
          borderWidth: 1,
          borderRadius: 5,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => openImagePicker()}>
        <Text>Select Image</Text>
      </TouchableOpacity>
      {imagePath 
      ?
      <TouchableOpacity
              //  onPress={() => this.uploadPropertyImage(data.index)}
                style={[styles.imageConatiner, { borderColor: 'black' }]}>
                    <View>
                        <TouchableOpacity hitSlop={{ right: 30, left: 30, top: 30, bottom: 30 }} style={{ justifyContent: 'center',alignItems: 'center',right: -83, top: 10, zIndex: 5 ,height:15,width:15,borderRadius:15,backgroundColor:'red'}} 
                        onPress={() => deleteImage()}
                        >
                             <Text   style={{color:'#fff'}}>X</Text>
                        </TouchableOpacity>
                        <Image source={{ uri: imagePath }} style={{ height: 126, width: 105, resizeMode: 'contain' }} />
                    </View>
                    
            </TouchableOpacity>
      :
      null
      }
         {uploading ? (
             <View>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
            </View>
        ) : 
        null
        }
      

      {isDatePickerVisible ? (
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          minimumDate={new Date()}
          onConfirm={date => {
            handleConfirmStart(date);
          }}
          onCancel={() => hideDatePicker()}
          //value={}
        />
      ) : null}
      <View style={{flexDirection: 'row', alignItems: 'center',marginTop:5}}>
        <Checkbox
          status={Active ? 'checked' : 'unchecked'}
          onPress={() => {
            setActive(!Active);
          }}
        />
        <Text>Active</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Checkbox
          status={Exclusive ? 'checked' : 'unchecked'}
          onPress={() => {
            setExclusive(!Exclusive);
          }}
        />
        <Text>Exclusive</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Checkbox
          status={Verified ? 'checked' : 'unchecked'}
          onPress={() => {
            setVerified(!Verified);
          }}
        />
        <Text>Verified</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Checkbox
          status={Featured ? 'checked' : 'unchecked'}
          onPress={() => {
            setFeatured(!Featured);
          }}
        />
        <Text>Featured</Text>
      </View>


      <TouchableOpacity
      onPress={() =>uploadCoupon()}
      style={{width:'90%',marginTop:15,marginHorizontal:'5%',borderWidth:1,borderRadius:5,height:45,justifyContent:'center',alignItems: 'center'}}>
          <Text>Upload</Text>
      </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AddCoupon;
const customPickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'blue',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 10,
    // marginHorizontal:10
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageConatiner: {
    flex: 1,
    height: 126,
    justifyContent: 'center',
    alignItems: 'center',
    //  borderWidth: 1,
    //  borderColor: Colors.lightMint,
    marginHorizontal: 20,
    marginVertical: 10
}
});

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
ActivityIndicator
} from 'react-native';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment'
const CouponList = () => {
  const [loading, setLoading] = React.useState(false);
  const [couponList,setCouponList] = React.useState()
  React.useEffect(() => {
    const subscriber = firestore()
      .collection('couponlist')
      .onSnapshot(documentSnapshot => {
        console.log('couponlist docs: ', documentSnapshot?._docs);
        setCouponList(documentSnapshot?._docs);
        //console.log('couponlist changes: ',documentSnapshot?._changes);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);
  const loadStart = e => {
    setLoading(true);
  };

  const loadEnd = e => {
    setLoading(false);
  };
  const FastImages = (uri) => {
    return (
      <View style={{margin:10}}>
        <View style={{justifyContent:'center',alignItems: 'center'}}>
          <FastImage
            style={{width: 300, height: 150, borderRadius: 10}}
            source={{
              uri: uri ?uri:'',
              priority: FastImage.priority.normal,
            }}
           // resizeMode={FastImage.resizeMode.contain}
            onLoadStart={e => loadStart(e)}
            onLoadEnd={e => loadEnd(e)}
          />
        </View>
        {loading && (
          <ActivityIndicator
            style={[styles.activityIndicator]}
            animating={true}
            size="small"
            color={'#79FF33 '}
          />
        )}
      </View>
    );
  };
const getDetails= (data) =>{
   // console.log(data)
    firestore()
    .collection('couponlist')
    .doc(data[1])
    .get()
    .then(documentSnapshot => {
      console.log('coupon details: ', documentSnapshot);
    });
  }
  const renderItems = ({item}) =>{
    console.log('coupon data',item?._ref?._documentPath?._parts)
      return(
          <TouchableOpacity
          onPress={() =>getDetails(item?._ref?._documentPath?._parts)}
          style={styles.flatListContainer}>
              {FastImages(item?._data?.Image)}
              <View style={{flexDirection: 'row', justifyContent:'space-between',marginHorizontal:10}}>
              <Text>
                  Name: {item?._data?.Name}
              </Text>
              <Text>
                  code: {item?._data?.code}
              </Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent:'space-between',marginHorizontal:10}}>
              <Text>
                 category: {item?._data?.Category}
              </Text>
              <Text>
                 store:  {item?._data?.Store}
              </Text>
              </View>


              <View style={{marginHorizontal:10}}>
              <Text>
                 Active: {item?._data?.Active ?'True' :'False'}
              </Text>
              <Text>
                 Exclusive:  {item?._data?.Exclusive ? 'True' :'False'}
              </Text>
              <Text>
                 Featured:  {item?._data?.Featured?'True' :'False'}
              </Text>
              <Text>
                 Verfied:  {item?._data?.Verfied ?'True':'False'}
              </Text>
              </View>

              <View style={{flexDirection: 'row', justifyContent:'space-between',marginHorizontal:10}}>
              <Text>
                  Expiry Date: {item?._data?.ExpiryDate}
              </Text>
              <Text>
              Create Date: {moment(item?._data?.postTime).format('DD-MM-YYYY')}
              </Text>
              </View>

              <View style={{width:'80%',justifyContent:'center',alignItems: 'center',marginTop:5}}>
                  <Text>Description : {item?._data?.Description}</Text>
              </View>
              <View style={{width:'90%',justifyContent:'center',alignItems: 'center',marginTop:5}}>
                  <Text>Url : {item?._data?.Url}</Text>
              </View>
              
          </TouchableOpacity>
      )
  }
  return (
    <View>
     <FlatList
     data={couponList}
     renderItem={renderItems}
     keyExtractor={item => item+item}
     />
    </View>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'transparent',
    left: 0,
    right: 0,
    bottom: 0,
  },
  flatListContainer:{
      width: '95%',
      marginHorizontal:10,
      borderWidth: 1,
      borderRadius:10,
      margin:15,
  }
});

export default CouponList;

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../../Screens/Login/Login';
import Home from '../../Screens/Home/Home';
import AddCoupon from '../../Screens/Coupon/AddCoupon';
import CouponList from '../../Screens/Coupon/CouponList';
const ScreenStack = createStackNavigator();
const Stack = createStackNavigator();
const StackNavigator = () => {
    return (
      <ScreenStack.Navigator initialRouteName="Login">
        <ScreenStack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <ScreenStack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <ScreenStack.Screen
          name="AddCoupon"
          component={AddCoupon}
          options={{headerShown: false}}
        />
         <ScreenStack.Screen
          name="CouponList"
          component={CouponList}
          options={{headerShown: false}}
        />
      </ScreenStack.Navigator>
    );
}

function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="StackNavigator"
          component={StackNavigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
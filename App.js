/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';

import Routes from './Src/Navigation/Routes/Routes'

const App: () => Node = () => {
  

  return (
    <PaperProvider>
      <Routes />
    </PaperProvider>
  );
};


export default App;

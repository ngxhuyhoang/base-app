import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigator/root.stack';

const App = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default App;

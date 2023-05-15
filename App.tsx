/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import MyApp from './src/MyApp';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Main() {
  return (
    <PaperProvider
      settings={{
        // eslint-disable-next-line react/no-unstable-nested-components
        icon: props => <MaterialCommunityIcons {...props} />,
      }}>
      <MyApp />
    </PaperProvider>
  );
}

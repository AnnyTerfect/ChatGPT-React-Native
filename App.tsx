/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Provider as PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
} from 'react-native-paper';
import MyApp from './src/MyApp';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColorScheme } from 'react-native';

export default function Main() {
  const colorScheme = useColorScheme();

  const theme =
    colorScheme === 'dark'
      ? {
          ...MD3DarkTheme,
          colors: { ...MD3DarkTheme.colors, primary: '#FFF' },
        }
      : {
          ...MD3LightTheme,
          colors: { ...MD3LightTheme.colors },
        };

  return (
    <PaperProvider
      settings={{
        // eslint-disable-next-line react/no-unstable-nested-components
        icon: props => <MaterialCommunityIcons {...props} />,
      }}
      theme={theme}>
      <MyApp />
    </PaperProvider>
  );
}

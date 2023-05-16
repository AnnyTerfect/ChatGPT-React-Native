import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

export default function MyAppbar(props) {
  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action icon="menu" onPress={props.onPressMenu} />
      <Appbar.Content title="ChatGPT" />
      <Appbar.Action
        icon="dots-vertical"
        onPress={props.onPressDots}
      />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {},
});

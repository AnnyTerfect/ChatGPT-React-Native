import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

export default function MyAppbar(props) {
  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action icon="menu" color="white" onPress={props.onPressMenu} />
      <Appbar.Content title="ChatGPT" color="white" />
      <Appbar.Action
        icon="dots-vertical"
        color="white"
        onPress={props.onPressDots}
      />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: 'rgb(98, 0, 238)' },
});

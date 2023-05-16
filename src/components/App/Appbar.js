import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';

export default function MyAppbar(props) {
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => setShowMenu(true);

  const closeMenu = () => setShowMenu(false);

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action icon="menu" onPress={props.onPressMenu} />
      <Appbar.Content title="ChatGPT" />
      <Menu
        visible={showMenu}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
        <Menu.Item onPress={() => {}} title="Item 1" />
        <Menu.Item onPress={() => {}} title="Item 2" />
        <Menu.Item onPress={() => {}} title="Item 3" />
      </Menu>
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {},
});

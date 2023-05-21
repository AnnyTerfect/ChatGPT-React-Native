import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Menu, IconButton } from 'react-native-paper';

const AppBar = forwardRef((props, ref) => {
  const [title, setTitle] = useState('ChatGPT');
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => setShowMenu(true);

  const closeMenu = () => setShowMenu(false);

  useImperativeHandle(ref, () => ({
    setTitle,
  }));

  const handleClickAddChat = () => {
    closeMenu();
    props.onClickAddChat(Math.ceil(Math.random() * 100000));
  };

  const handleClickSetAPIKey = () => {
    closeMenu();
    props.onClickSetAPIKey();
  };

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action icon="menu" onPress={props.onPressMenu} />
      <Appbar.Content title={title} />
      <IconButton icon="plus-circle" onPress={handleClickAddChat} />
      <Menu
        visible={showMenu}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
        <Menu.Item
          onPress={handleClickSetAPIKey}
          leadingIcon="shield-key"
          title="Set APIKey"
        />
      </Menu>
    </Appbar.Header>
  );
});

const styles = StyleSheet.create({
  header: {},
});

export default AppBar;

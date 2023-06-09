import React, { useEffect, useRef, useState } from 'react';
import { DrawerLayoutAndroid, StyleSheet } from 'react-native';
import Appbar from './components/App/Appbar';
import APIKeyDialog from './components/Dialog/APIKeyDialog';
import Drawer from './components/App/Drawer';
import ChatTabView from './components/Chat/ChatTabView';
import { getAPIKey, saveAPIKey } from './utils/storage';
import { useTheme } from 'react-native-paper';

const App = () => {
  const theme = useTheme();

  const [APIKey, setAPIKey] = useState('');

  const appBarRef = useRef(null);
  const drawerRef = useRef(null);
  const drawerLayoutRef = useRef(null);
  const tabViewRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    getAPIKey().then(_APIKey => {
      if (_APIKey) {
        setAPIKey(_APIKey);
      } else {
        showDialog();
      }
    });
  }, []);

  const showDialog = () => {
    dialogRef.current.showDialog();
  };

  const openDrawer = () => {
    drawerLayoutRef.current && drawerLayoutRef.current.openDrawer();
  };

  const closeDrawer = () => {
    drawerLayoutRef.current && drawerLayoutRef.current.closeDrawer();
  };

  const addChat = () => {
    tabViewRef.current.addChat();
    closeDrawer();
  };

  const deleteChat = id => {
    tabViewRef.current.deleteChat(id);
  };

  const switchChat = id => {
    tabViewRef.current.switchChat(id);
    closeDrawer();
  };

  const handleSubmitKey = _APIKey => {
    setAPIKey(_APIKey);
    saveAPIKey(_APIKey);
  };

  const handleUpdateTitle = chats => {
    drawerRef.current.setChats(chats);
  };

  const handleUpdateActiveChat = chat => {
    drawerRef.current.setActiveChatId(chat.id);
    appBarRef.current.setTitle(chat.title);
  };

  return (
    <DrawerLayoutAndroid
      ref={drawerLayoutRef}
      style={theme.dark ? styles.layoutDark : styles.layoutLight}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={() => (
        <Drawer
          ref={drawerRef}
          closeDrawer={closeDrawer}
          addChat={id => addChat(id)}
          deleteChat={id => deleteChat(id)}
          switchChat={id => switchChat(id)}
        />
      )}>
      <Appbar
        ref={appBarRef}
        onPressMenu={openDrawer}
        onClickAddChat={id => addChat(id)}
        onClickSetAPIKey={showDialog}
      />

      <APIKeyDialog
        APIKey={APIKey}
        ref={dialogRef}
        onSubmitKey={handleSubmitKey}
      />
      <ChatTabView
        ref={tabViewRef}
        APIKey={APIKey}
        onUpdateTitle={handleUpdateTitle}
        onUpdateActiveChat={handleUpdateActiveChat}
      />
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  layoutLight: {
    backgroundColor: '#EEE',
  },
  layoutDark: {},
});

export default App;

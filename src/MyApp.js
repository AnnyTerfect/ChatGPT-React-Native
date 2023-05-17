import React, { useEffect, useRef, useState } from 'react';
import { DrawerLayoutAndroid, StyleSheet } from 'react-native';
import Appbar from './components/App/Appbar';
import APIKeyDialog from './components/Dialog/APIKeyDialog';
import Drawer from './components/App/Drawer';
import ChatTabView from './components/Chat/ChatTabView';
import {
  getAPIKey,
  saveAPIKey,
  getActiveChatId,
  saveActiveChatId,
  getChats,
  saveChats,
} from './utils/storage';
import { useTheme } from 'react-native-paper';

const App = () => {
  const theme = useTheme();

  const [index, setIndex] = React.useState(0);

  const [APIKey, setAPIKey] = useState('');
  const [chats, setChats] = useState([]);

  const drawerRef = useRef(null);
  const dialogRef = useRef(null);
  const chatsRef = useRef(chats);

  useEffect(() => {
    const _getAPIKey = async () => {
      const _APIKey = await getAPIKey();
      if (_APIKey) {
        setAPIKey(_APIKey);
      } else {
        showDialog();
      }
    };
    const _getChats = async () => {
      const oldChats = await getChats();
      setChats(oldChats);
      const _activeChatId = await getActiveChatId();
      if (_activeChatId) {
        setTimeout(() =>
          setIndex(oldChats.findIndex(chat => chat.id === _activeChatId)),
        );
      }
    };

    _getAPIKey();
    _getChats();
  }, []);

  useEffect(() => {
    chats[index]?.id && saveActiveChatId(chats[index].id);
  }, [chats, index]);

  useEffect(() => {
    chatsRef.current = chats;
    saveChats(chats);
  }, [chats]);

  const showDialog = () => {
    dialogRef.current.showDialog();
  };

  const openDrawer = () => {
    drawerRef.current && drawerRef.current.openDrawer();
  };

  const closeDrawer = () => {
    drawerRef.current && drawerRef.current.closeDrawer();
  };

  const addChat = () => {
    const chatId = Math.random().toString(36).substring(7);
    chatsRef.current = [...chatsRef.current, { id: chatId, chatHistory: [] }];
    setTimeout(() => {
      setIndex(chatsRef.current.length - 1);
    }, 0);
    setChats(chatsRef.current);
    closeDrawer();
    return chatId;
  };

  const deleteChat = chatId => {
    chatId = String(chatId);
    setChats(chats.filter(chat => chat.id !== chatId));
  };

  const switchChat = id => {
    setIndex(chats.findIndex(chat => chat.id === id));
    closeDrawer();
  };

  const handleSubmitKey = _APIKey => {
    setAPIKey(_APIKey);
    saveAPIKey(_APIKey);
  };

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      style={theme.dark ? styles.layoutDark : styles.layoutLight}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={() => (
        <Drawer
          closeDrawer={closeDrawer}
          activeChatId={chats[index]?.id}
          chats={chats}
          addChat={id => addChat(id)}
          deleteChat={id => deleteChat(id)}
          switchChat={id => switchChat(id)}
        />
      )}>
      <Appbar
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
        chats={chats}
        APIKey={APIKey}
        index={index}
        setIndex={setIndex}
        addChat={addChat}
        deleteChat={deleteChat}
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

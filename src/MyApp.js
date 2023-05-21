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
  getChatIds,
  commitDeleteChat,
  commitAddChat,
} from './utils/storage';
import { useTheme } from 'react-native-paper';

const App = () => {
  const theme = useTheme();

  const [APIKey, setAPIKey] = useState('');
  const [chatIds, setChatIds] = useState([]);

  const appBarRef = useRef(null);
  const drawerRef = useRef(null);
  const drawerLayoutRef = useRef(null);
  const tabViewRef = useRef(null);
  const dialogRef = useRef(null);
  const chatIdsRef = useRef(chatIds);

  useEffect(() => {
    getAPIKey().then(_APIKey => {
      if (_APIKey) {
        setAPIKey(_APIKey);
      } else {
        showDialog();
      }
    };
    const _getChatIds = async () => {
      const oldChatIds = await getChatIds();
      setChatIds(oldChatIds);
      const _activeChatId = await getActiveChatId();
      if (_activeChatId) {
        setTimeout(() =>
          setIndex(oldChatIds.findIndex(id => _activeChatId === id)),
        );
      }
    };

    _getAPIKey();
    _getChatIds();
  }, []);

  useEffect(() => {
    chatIds[index] && saveActiveChatId(chatIds[index]);
  }, [chatIds, index]);

  useEffect(() => {
    chatIdsRef.current = chatIds;
  }, [chatIds]);

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
    const _addChat = async () => {
      const chatId = Math.random().toString(36).slice(2);
      await commitAddChat(chatId);
      chatIdsRef.current = [...chatIdsRef.current, chatId];
      setTimeout(() => {
        setIndex(chatIdsRef.current.length - 1);
      }, 0);
      setChatIds(cur => [...cur, chatId]);
    };
    _addChat();
  };

  const deleteChat = chatId => {
    const _deleteChat = async () => {
      chatId = String(chatId);
      await commitDeleteChat(chatId);
      setChatIds(cur => cur.filter(id => id !== chatId));
    };
    _deleteChat();
  };

  const switchChat = id => {
    setIndex(chatIds.indexOf(id));
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
          activeChatId={chatIds[index]}
          chatIds={chatIds}
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
        chatIds={chatIds}
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

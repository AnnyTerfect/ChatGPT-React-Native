import React, { useEffect, useRef, useState } from 'react';
import { DrawerLayoutAndroid } from 'react-native';
import Appbar from './components/Appbar';
import APIKeyDialog from './components/APIKeyDialog';
import Drawer from './components/Drawer';
import ChatTabView from './components/ChatTabView';
import {
  getAPIKey,
  saveAPIKey,
  getActiveChatId,
  saveActiveChatId,
  getChatIds,
  commitDeleteChat,
  commitAddChat,
} from './utils/storage';

const App = () => {
  const drawerRef = useRef(null);
  const dialogRef = useRef(null);

  const [index, setIndex] = React.useState(0);

  const [APIKey, setAPIKey] = useState('');
  const [chatIds, setChatIds] = useState([]);

  const [addable, setAddable] = useState(true);

  useEffect(() => {
    const _getAPIKey = async () => {
      const _APIKey = await getAPIKey();
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
        setTimeout(() => {
          setIndex(i => i - 1);
        }, 500);
      }
    };

    _getAPIKey();
    _getChatIds();
  }, []);

  useEffect(() => {
    chatIds[index] && saveActiveChatId(chatIds[index]);
  }, [chatIds, index]);

  const showDialog = () => {
    dialogRef.current.showDialog();
  };

  const openDrawer = () => {
    drawerRef.current && drawerRef.current.openDrawer();
  };

  const closeDrawer = () => {
    drawerRef.current && drawerRef.current.closeDrawer();
  };

  const addChat = chatId => {
    const _addChat = async () => {
      chatId = String(chatId);
      await commitAddChat(chatId);
      setChatIds(cur => [...cur, chatId]);
      setTimeout(() => {
        setIndex(i => i - 1);
        setAddable(true);
      }, 500);
    };
    setAddable(false);
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

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={() => (
        <Drawer
          closeDrawer={closeDrawer}
          activeChatId={index}
          chatIds={chatIds}
          addChat={id => addChat(id)}
          deleteChat={id => deleteChat(id)}
          switchChat={id => switchChat(id)}
        />
      )}>
      <Appbar onPressMenu={openDrawer} onPressDots={showDialog} />

      <APIKeyDialog
        APIKey={APIKey}
        ref={dialogRef}
        onSubmitKey={handleSubmitKey}
      />
      <ChatTabView
        chatIds={chatIds}
        APIKey={APIKey}
        addable={addable}
        index={index}
        setIndex={setIndex}
        addChat={addChat}
        deleteChat={deleteChat}
      />
    </DrawerLayoutAndroid>
  );
};

export default App;

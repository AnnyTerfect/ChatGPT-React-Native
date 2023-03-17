import React, {useEffect, useRef, useState} from 'react';
import {DrawerLayoutAndroid} from 'react-native';
import {Appbar} from 'react-native-paper';
import {Chat} from './components/Chat';
import {APIKeyDialog} from './components/APIKeyDialog';
import {Drawer} from './components/Drawer'
import {getAPIKey, saveAPIKey, getActiveChatId, saveActiveChatId, getChatIds, commitDeleteChat, commitAddChat} from './utils/storage';

const App = () => {
  const drawerRef = useRef(null);
  const dialogRef = useRef(null);

  const [APIKey, setAPIKey] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatIds, setChatIds] = useState([]);

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
      const chatIds = await getChatIds();
      setChatIds(chatIds);
      const _activeChatId = await getActiveChatId();
      setActiveChatId(_activeChatId ? _activeChatId : (chatIds.length > 0 ? chatIds[0] : null));
    }

    _getAPIKey();
    _getChatIds();
  }, []);

  useEffect(() => {
    if (chatIds.indexOf(activeChatId) === -1 && chatIds.length > 0) {
      setActiveChatId(chatIds[0])
    }
    saveActiveChatId(activeChatId);
  }, [activeChatId]);

  const _handleMore = () => {
    showDialog();
  };

  const showDialog = () => {
    dialogRef.current.showDialog();
  };

  const openDrawer = () => {
    drawerRef.current && drawerRef.current.openDrawer();
  };

  const closeDrawer = () => {
    drawerRef.current && drawerRef.current.closeDrawer();
  }

  const addChat = chatId => {
    const _addChat = async () => {
      chatId = String(chatId)
      await commitAddChat(chatId);
      setChatIds((chatIds) => [...chatIds, chatId]);
      setActiveChatId(chatId);
    }
    _addChat()
  }

  const deleteChat = chatId => {
    const _deleteChat = async () => {
      chatId = String(chatId)
      await commitDeleteChat(chatId);
      setChatIds((chatIds) => chatIds.filter(id => id !== chatId));
    }
    _deleteChat()
  }

  const switchChat = chatId => {
    setActiveChatId(chatId);
    closeDrawer();
  }

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
          activeChatId={activeChatId}
          chatIds={chatIds}
          addChat={(id) => addChat(id)}
          deleteChat={(id) => deleteChat(id)}
          switchChat={(id) => switchChat(id)}
        />
      )}>
      <Appbar.Header style={{backgroundColor: 'rgb(98, 0, 238)'}}>
        <Appbar.Action icon="menu" color="white" onPress={openDrawer} />
        <Appbar.Content title="ChatGPT" color="white" />
        <Appbar.Action
          icon="dots-vertical"
          color="white"
          onPress={_handleMore}
        />
      </Appbar.Header>
      <APIKeyDialog
        APIKey={APIKey}
        ref={dialogRef}
        onSubmitKey={handleSubmitKey}
      />
      {chatIds.map(chatId => (
        <Chat
          key={chatId}
          active={chatId === activeChatId}
          APIKey={APIKey}
          chatId={chatId}
        />
      ))}
    </DrawerLayoutAndroid>
  );
};

export default App;

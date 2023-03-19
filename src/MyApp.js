import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, DrawerLayoutAndroid, View} from 'react-native';
import {Appbar, IconButton} from 'react-native-paper';
import {Chat} from './components/Chat';
import {APIKeyDialog} from './components/APIKeyDialog';
import {Drawer} from './components/Drawer'
import {getAPIKey, saveAPIKey, getActiveChatId, saveActiveChatId, getChatIds, commitDeleteChat, commitAddChat} from './utils/storage';
import {TabView, SceneMap} from 'react-native-tab-view';

const App = () => {
  const drawerRef = useRef(null);
  const dialogRef = useRef(null);

  const [index, setIndex] = React.useState(0);

  const [APIKey, setAPIKey] = useState('');
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
      if (_activeChatId) {
        setTimeout(() => { setIndex(chatIds.indexOf(_activeChatId)) })
      }
    }

    _getAPIKey();
    _getChatIds();
  }, []);

  useEffect(() => {
    console.log(`current activeChatId ${index}`)
    console.log(`chatIds = ${chatIds}`)
    console.log(`chatIds[index] = ${chatIds[index]}`)
    chatIds[index] && saveActiveChatId(chatIds[index]);
  }, [index]);

  useEffect(() => {
    console.log(chatIds)
  }, [chatIds]);

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
      let _index = index
      setTimeout(() => { setIndex(_index) }, 100)
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

  const switchChat = id => {
    setIndex(chatIds.indexOf(id));
    closeDrawer();
  }

  const handleSubmitKey = _APIKey => {
    setAPIKey(_APIKey);
    saveAPIKey(_APIKey);
  };

  const initialLayout = {width: Dimensions.get('window').width};
  const renderScene = SceneMap(
    Object.fromEntries([
      ...chatIds.map(chatId => [
        chatId, 
        () => (
          <Chat
            chatId={chatId}
            APIKey={APIKey}
            deleteChat={() => deleteChat(chatId)}
          />
        )
      ]),
      ['add', () => (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <IconButton
            icon="plus"
            mode="contained"
            size={80}
            onPress={() => addChat(Math.ceil(Math.random() * 1000000))}
          />
        </View>
      )]
    ])
  );

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
      <TabView
        renderTabBar={() => null}
        navigationState={{
          index, 
          routes: [
            ...chatIds.map((chatId, i) => (
              {key: chatId, title: String(chatId)}
            )),
            {key: 'add', title: 'add'}
          ]
        }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={{ flex: 1 }}
      />
    </DrawerLayoutAndroid>
  );
};

export default App;

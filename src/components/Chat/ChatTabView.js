import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { TabView } from 'react-native-tab-view';
import { Dimensions, StyleSheet } from 'react-native';
import Chat from './Chat';
import {
  getActiveChatId,
  getChats,
  saveActiveChatId,
  saveChats,
} from '../../utils/storage';
import { useTheme } from 'react-native-paper';

const initialLayout = { width: Dimensions.get('window').width };

const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

const debouncedSaveChats = debounce(saveChats, 1000);

const ChatTabView = forwardRef((props, ref) => {
  const theme = useTheme();

  useImperativeHandle(ref, () => ({
    addChat,
    deleteChat,
    switchChat,
  }));

  const [index, setIndex] = React.useState(0);
  const [chats, setChats] = useState([]);

  const chatsRef = useRef(chats);

  const debouncedSetChats = debounce(setChats, 1000);

  useEffect(() => {
    getChats()
      .then(setChats)
      .then(getActiveChatId)
      .then(_activeChatId => {
        if (_activeChatId) {
          setTimeout(() =>
            setIndex(chats.findIndex(chat => chat.id === _activeChatId)),
          );
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chats[index]?.id && saveActiveChatId(chats[index].id);
  }, [chats, index]);

  useEffect(() => {
    chatsRef.current = chats;
    debouncedSaveChats(chats);
  }, [chats]);

  const addChat = () => {
    const chatId = Math.random().toString(36).substring(7);
    chatsRef.current = [...chatsRef.current, { id: chatId, chatHistory: [] }];
    setTimeout(() => {
      setIndex(chatsRef.current.length - 1);
    }, 0);
    setChats(chatsRef.current);
    return chatId;
  };

  const deleteChat = chatId => {
    chatId = String(chatId);
    setChats(chats.filter(chat => chat.id !== chatId));
  };

  const switchChat = id => {
    setIndex(chats.findIndex(chat => chat.id === id));
  };

  const handleUpdateChatHistory = (id, chatHistory) => {
    debouncedSetChats(_chats =>
      _chats.map(chat => {
        if (chat.id === id) {
          return { ...chat, chatHistory };
        }
        return chat;
      }),
    );
  };

  const renderScene = ({ route }) => {
    const chat = chats.find(_chat => _chat.id === route.key);
    return (
      <Chat
        id={chat.id}
        chatHistory={chat.chatHistory}
        APIKey={props.APIKey}
        deleteChat={() => deleteChat(chat.id)}
        onUpdateChatHistory={chatHistory =>
          handleUpdateChatHistory(chat.id, chatHistory)
        }
      />
    );
  };

  return (
    <TabView
      renderTabBar={() => null}
      navigationState={{
        index: index,
        routes: [
          ...chats.map(chat => ({
            key: chat.id,
            title: String(chat.id),
          })),
        ],
      }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={[
        styles.tabView,
        theme.dark ? styles.tabViewDark : styles.tabViewLight,
      ]}
    />
  );
});

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabView: {
    flex: 1,
  },
  tabViewLight: {
    backgroundColor: '#F4F4F4',
  },
  tabViewDark: { backgroundColor: '#1A1A1A' },
});

export default ChatTabView;

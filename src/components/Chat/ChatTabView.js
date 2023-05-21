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

  const initialLayout = { width: Dimensions.get('window').width };
  const renderScene = useMemo(() => {
    return SceneMap(
      Object.fromEntries([
        ...props.chatIds.map(chatId => [
          chatId,
          () => (
            <Chat
              chatId={chatId}
              APIKey={props.APIKey}
              deleteChat={() => props.deleteChat(chatId)}
            />
          ),
        ]),
      ]),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.chatIds]);

  return (
    <TabView
      renderTabBar={() => null}
      navigationState={{
        index: index,
        routes: [
          ...props.chatIds.map(chatId => ({
            key: chatId,
            title: String(chatId),
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

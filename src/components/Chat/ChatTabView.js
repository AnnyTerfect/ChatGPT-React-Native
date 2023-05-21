import React, { useMemo } from 'react';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Dimensions, StyleSheet } from 'react-native';
import Chat from './Chat';
import { useTheme } from 'react-native-paper';

const ChatTabView = props => {
  const theme = useTheme();

  const initialLayout = { width: Dimensions.get('window').width };
  const renderScene = ({ route }) => {
    const chat = props.chats.find(_chat => _chat.id === route.key);
    return (
      <Chat
        id={chat.id}
        chatHistory={chat.chatHistory}
        APIKey={props.APIKey}
        deleteChat={() => props.deleteChat(chat.id)}
      />
    );
  };

  return (
    <TabView
      renderTabBar={() => null}
      navigationState={{
        index: props.index,
        routes: [
          ...props.chats.map(chat => ({
            key: chat.id,
            title: String(chat.id),
          })),
        ],
      }}
      renderScene={renderScene}
      onIndexChange={props.setIndex}
      initialLayout={initialLayout}
      style={[
        styles.tabView,
        theme.dark ? styles.tabViewDark : styles.tabViewLight,
      ]}
    />
  );
};

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

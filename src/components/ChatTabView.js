import React from 'react';
import { useMemo } from 'react';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Dimensions, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Chat from './Chat';

const ChatTabView = props => {
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
        [
          'add',
          () => (
            <View style={styles.center}>
              <IconButton
                icon="plus"
                mode="contained"
                size={80}
                disabled={!props.addable}
                onPress={() =>
                  props.addChat(Math.ceil(Math.random() * 1000000))
                }
              />
            </View>
          ),
        ],
      ]),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.chatIds, props.addable, props.APIKey]);

  return (
    <TabView
      renderTabBar={() => null}
      navigationState={{
        index: props.index,
        routes: [
          ...props.chatIds.map((chatId, i) => ({
            key: chatId,
            title: String(chatId),
          })),
          { key: 'add', title: 'add' },
        ],
      }}
      renderScene={renderScene}
      onIndexChange={props.setIndex}
      initialLayout={initialLayout}
      style={styles.tabView}
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
});

export default ChatTabView;

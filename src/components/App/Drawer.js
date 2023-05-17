import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { Button, IconButton, List } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const chatIcon = props => <List.Icon {...props} icon="chat" />;
const getDeleteButton = deleteChat => props =>
  (
    <IconButton
      {...props}
      icon="delete"
      onPress={e => {
        e.preventDefault();
        e.stopPropagation();
        deleteChat();
      }}
    />
  );

const Drawer = props => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        theme.dark ? styles.containerDark : styles.containerLight,
      ]}>
      <Text style={styles.title}>Chat List</Text>
      <ScrollView>
        <List.Section>
          {props.chatIds.map(chatId => (
            <List.Item
              style={
                props.activeChatId === chatId
                  ? theme.dark
                    ? styles.chatItemActiveDark
                    : styles.chatItemActiveLight
                  : {}
              }
              title={'New Chat'}
              left={chatIcon}
              right={getDeleteButton(() => props.deleteChat(chatId))}
              onPress={() => {
                props.switchChat(chatId);
              }}
              key={Math.random()}
            />
          ))}
        </List.Section>
        <Button
          icon="plus"
          mode="elevated"
          style={styles.chatAddButton}
          onPress={() => {
            props.addChat(Math.ceil(Math.random() * 100000));
          }}>
          Add Chat
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {},
  containerDark: {
    backgroundColor: '#333',
  },
  title: {
    margin: 20,
    marginTop: 40,
    fontSize: 30,
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  chatItemActiveLight: {
    backgroundColor: '#DDD',
  },
  chatItemActiveDark: {
    backgroundColor: '#444',
  },
  chatAddButton: { marginTop: 10, marginHorizontal: 10, marginBottom: 20 },
});

export default Drawer;

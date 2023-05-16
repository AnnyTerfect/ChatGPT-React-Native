import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, IconButton } from 'react-native-paper';

const Drawer = props => (
  <View style={styles.container}>
    <Text style={styles.title}>Chat List</Text>
    <View>
      {props.chatIds.map(chatId => (
        <View style={styles.chatContainer} key={Math.random()}>
          <Button
            mode={props.activeChatId === chatId ? 'contained' : 'outlined'}
            style={styles.chatButton}
            onPress={() => {
              props.switchChat(chatId);
            }}>
            chat{chatId}
          </Button>
          <IconButton
            style={styles.deleteButton}
            mode="icon"
            icon="delete"
            onPress={() => {
              props.deleteChat(chatId);
            }}
          />
        </View>
      ))}
      <Button
        icon="plus"
        mode="elevated"
        style={styles.chatAddButton}
        onPress={() => {
          props.addChat(Math.ceil(Math.random() * 100000));
        }}>
        Add Chat
      </Button>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  title: {
    margin: 20,
    marginTop: 40,
    color: 'white',
    fontSize: 30,
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  chatButton: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    contentStyle: {
      justifyContent: 'flex-start',
    },
  },
  chatDeleteButton: {
    backgroundColor: '#333',
  },
  chatAddButton: { marginTop: 10 },
});

export default Drawer;

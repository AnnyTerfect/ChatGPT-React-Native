import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

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
    marginTop: 10,
    marginHorizontal: 20,
  },
  chatButton: {
    flex: 1,
    fontSize: 18,
    contentStyle: {
      justifyContent: 'flex-start',
    },
  },
  chatAddButton: { marginTop: 10, marginHorizontal: 10, marginBottom: 20 },
});

export default Drawer;

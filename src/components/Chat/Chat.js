import React, { useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { getChatHistoryById, saveChatHistoryById } from '../../utils/storage';
import { post } from '../../utils/socket';
import { useTheme } from 'react-native-paper';

const Chat = props => {
  const theme = useTheme();

  const [text, setText] = React.useState('');
  const [msgs, setMsgs] = React.useState([]);
  const [sendBuf, setSendBuf] = React.useState([]);
  const [errors, setErrors] = React.useState([]);
  const scrollRef = useRef(null);

  const renderSendIcon = () => {
    return <TextInput.Icon icon="send" onPress={() => send()} />;
  };

  const renderWaiting = chat => {
    if (chat.role === 'waiting') {
      return (
        <>
          <ActivityIndicator animating={true} />
        </>
      );
    }
  };

  const scrollToEnd = () => {
    scrollRef.current.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    if (msgs.length) {
      scrollToEnd();
      saveChatHistoryById(props.chatId, msgs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgs]);

  useEffect(() => {
    const send = async () => {
      const createHandleNewContent = id => {
        const handleNewContent = content => {
          setMsgs(currentMsgs =>
            currentMsgs.map(chat => {
              if (chat.content === 'waiting...') {
                chat.content = '';
              }
              if (chat.content.trim() === '') {
                chat.content = chat.content.trim();
              }
              if (chat.role !== 'user' && chat.id === id) {
                return {
                  role: 'assistant',
                  content: (chat.content ? chat.content : '') + content,
                  id,
                };
              }
              return chat;
            }),
          );
        };
        return handleNewContent;
      };

      if (sendBuf.length > 0) {
        sendBuf.forEach(buf => {
          const id = buf[buf.length - 1].id;
          post(props.APIKey, buf, createHandleNewContent(id))
            .then()
            .catch(error => {
              setErrors(currentErrors => [
                ...currentErrors,
                { id, content: error },
              ]);
            });
        });
        setSendBuf([]);
      }
    };
    send();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendBuf]);

  useEffect(() => {
    if (errors.length > 0) {
      errors.forEach(error => {
        setMsgs(currentMsgs => {
          return currentMsgs.map(chat => {
            if (chat.id === error.id) {
              return {
                role: 'error',
                content: error.content,
              };
            }
            return chat;
          });
        });
      });
      setErrors([]);
    }
  }, [errors]);

  useEffect(() => {
    const _getChatHistoryById = async id => {
      let chatHistory = await getChatHistoryById(id);
      if (chatHistory && JSON.stringify(chatHistory) !== JSON.stringify(msgs)) {
        chatHistory = chatHistory.map(chat => {
          if (chat.role === 'waiting') {
            return {
              role: 'error',
              content: 'Error: Request timed out',
            };
          }
          return chat;
        });
        setMsgs(chatHistory);
      }
    };
    _getChatHistoryById(props.chatId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = () => {
    if (text.trim() === '') {
      return;
    }

    const id = Math.random();
    setSendBuf([
      ...sendBuf,
      [
        ...msgs.filter(msg => msg.role === 'user' || msg.role === 'assistant'),
        { role: 'user', content: text, id },
      ],
    ]);
    setMsgs(currentMsgs => [...currentMsgs, { role: 'user', content: text }]);
    setMsgs(currentMsgs => [
      ...currentMsgs,
      { role: 'waiting', content: 'waiting...', id },
    ]);
    setText('');
  };

  return (
    <View style={styles.view}>
      <ScrollView ref={scrollRef}>
        <Button mode="text" onPress={() => props.deleteChat(props.chatId)}>
          Delete chat
        </Button>
        {msgs.map((chat, index) => {
          return (
            <View
              key={index}
              style={[
                styles.chatContainer,
                chat.role === 'user'
                  ? styles.chatContainerUser
                  : styles.chatContainerOther,
              ]}>
              <View
                style={[
                  styles.chat,
                  chat.role === 'user'
                    ? styles.chatUser
                    : chat.role === 'error'
                    ? styles.chatError
                    : {
                        ...styles.chatOther,
                        ...(theme.dark
                          ? styles.chatOtherDark
                          : styles.chatOtherLight),
                      },
                ]}>
                <Text
                  style={[
                    chat.role === 'user'
                      ? styles.textUser
                      : theme.dark
                      ? styles.textOtherDark
                      : {},
                  ]}
                  selectable={true}>
                  {chat.content}
                </Text>
                {renderWaiting(chat)}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View
        style={[
          styles.textInputContainer,
          theme.dark
            ? styles.textInputContainerDark
            : styles.textInputContainerLight,
        ]}>
        <TextInput
          value={text}
          style={[
            styles.textInput,
            theme.dark ? styles.textInputDark : styles.textInputLight,
          ]}
          multiline={true}
          mode="outlined"
          label="Message"
          placeholder="Type something"
          right={renderSendIcon()}
          onChangeText={_text => setText(_text)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: { flex: 1 },
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  chatContainerUser: {
    justifyContent: 'flex-end',
  },
  chatContainerOther: {
    justifyContent: 'flex-start',
  },
  chat: {
    padding: 10,
    marginTop: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    maxWidth: '80%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  chatUser: {
    backgroundColor: '#5ee486',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 5,
  },
  chatError: {
    backgroundColor: '#FF0000',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 15,
  },
  chatOther: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 15,
  },
  chatOtherLight: {
    backgroundColor: '#FFF',
  },
  chatOtherDark: {
    backgroundColor: '#383838',
  },
  textUser: {
    color: '#000',
  },
  textOtherDark: {
    color: '#FFF',
  },
  textInputContainer: { padding: 5 },
  textInputContainerLight: { backgroundColor: '#F2F2F2' },
  textInputContainerDark: { backgroundColor: '#222' },
  textInput: {
    borderRadius: 5,
    padding: 5,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 100,
  },
  textInputLight: { backgroundColor: '#FFF' },
  textInputDark: { backgroundColor: '#383838' },
});

export default Chat;

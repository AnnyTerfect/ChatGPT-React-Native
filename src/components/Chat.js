import React, { useEffect, useRef } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';
import { getChatHistoryById, saveChatHistoryById } from '../utils/storage';
import { post } from '../utils/socket';

const Chat = props => {
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
  }, [msgs, props.chatId]);

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
  }, [props.APIKey, sendBuf]);

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
  }, [msgs, props.chatId]);

  const send = () => {
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
                  ? styles.chatContainer.user
                  : styles.chatContainer.other,
              ]}>
              <View
                style={[
                  styles.chat,
                  chat.role === 'user'
                    ? styles.chat.user
                    : chat.role === 'error'
                    ? styles.chat.error
                    : styles.chat.other,
                ]}>
                <Text
                  style={[
                    chat.role === 'user' ? styles.text.user : styles.text.other,
                    styles.text,
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
      <View style={styles.textInputContainer}>
        <TextInput
          value={text}
          style={styles.textInput}
          multiline={true}
          mode="outlined"
          label="Message"
          placeholder="Type something"
          textColor="#FFF"
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
    user: {
      justifyContent: 'flex-end',
    },
    other: {
      justifyContent: 'flex-start',
    },
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
    user: {
      backgroundColor: '#5ee486',
      borderTopLeftRadius: 15,
      borderTopRightRadius: 5,
    },
    error: {
      backgroundColor: '#FF0000',
      borderTopLeftRadius: 5,
      borderTopRightRadius: 15,
    },
    other: {
      backgroundColor: '#383838',
      borderTopLeftRadius: 5,
      borderTopRightRadius: 15,
    },
  },
  text: {
    user: {
      color: '#000',
    },
    other: {
      color: '#FFF',
    },
  },
  textInputContainer: { padding: 5 },
  textInput: {
    backgroundColor: '#222',
    borderRadius: 5,
    padding: 5,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 100,
  },
});

export default Chat;

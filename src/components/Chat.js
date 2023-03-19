import React, {useEffect, useRef} from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {ActivityIndicator, Button, Text, TextInput, ProgressBar} from 'react-native-paper';
import {getChatHistoryById, saveChatHistoryById} from '../utils/storage';

const Chat = props => {
  const [text, setText] = React.useState('');
  const [msgs, setMsgs] = React.useState([]);
  const [replies, setReplies] = React.useState([]);
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
      )
    }
  };


  const scrollToEnd = () => {
    scrollRef.current.scrollToEnd({animated: true});
  };

  useEffect(() => {
    if (msgs.length !== 0) {
      const lastChat = msgs[msgs.length - 1];
      if (lastChat.role === 'waiting') {
        request(lastChat.id);
      }
    }
    scrollToEnd();
    saveChatHistoryById(props.chatId, msgs);
  }, [msgs]);

  useEffect(() => {
    if (replies.length > 0) {
      replies.forEach((reply) => {
        setMsgs(currentMsgs => {
          return currentMsgs.map((chat) => {
            if (chat.id === reply.id) {
              return {
                role: 'assistant',
                content: reply.content,
              };
            }
            return chat;
          });
        });
      });
      setReplies([]);
    }
  }, [replies]);

  useEffect(() => {
    if (errors.length > 0) {
      errors.forEach((error) => {
        setMsgs(currentMsgs => {
          return currentMsgs.map((chat) => {
            if (chat.id === error.id) {
              return {
                role: 'error',
                content: error.content,
              };
            }
            return chat;
          });
        });
      })
      setErrors([]);
    }
  }, [errors]);

  useEffect(() => {
    const _getChatHistoryById = async id => {
      let chatHistory = await getChatHistoryById(id);
      if (
        chatHistory &&
        JSON.stringify(chatHistory) !== JSON.stringify(msgs)
      ) {
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
  }, []);

  const send = () => {
    setMsgs(currentMsgs => [...currentMsgs, {role: 'user', content: text}]);
    setMsgs(currentMsgs => [
      ...currentMsgs,
      {role: 'waiting', content: 'waiting...', id: Math.random() },
    ]);
    setText('');
  };

  const request = id => {
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.APIKey,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: msgs.filter(
          chat => chat.role === 'user' || chat.role === 'assistant',
        ),
        stream: false,
      }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.error && res.error.message) {
          throw res.error.message;
        }
        const _reply = res.choices[0].message;
        setReplies([...replies, { id, content: _reply.content.trim() }]);
      })
      .catch(err => {
        setErrors([...errors, { id, content: String(err).trim()}])
      });
  };

  return (
    <View style={[{flex: 1}]}>
      <ScrollView ref={scrollRef}>
        <Button mode="text" onPress={() => props.deleteChat(props.chatId)}>
          Delete chat
        </Button>
        {msgs.map((chat, index) => {
          return (
            <View
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent:
                  chat.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
              <View
                style={[
                  styles.chat,
                  {
                    backgroundColor:
                      chat.role === 'user'
                        ? '#5ee486'
                        : chat.role === 'error'
                        ? '#FF0000'
                        : '#383838',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}>
                <Text
                  style={[
                    chat.role !== 'user' ? {color: '#FFF'} : {color: '#000'},
                    {fontSize: 15},
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
      <View style={{height: 100, padding: 5}}>
        <TextInput
          value={text}
          style={{flex: 1}}
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
  chat: {
    padding: 10,
    marginTop: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    maxWidth: '80%',
  },
});

export {Chat};

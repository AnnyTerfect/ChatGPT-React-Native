import React, { useEffect, useRef } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { getChatHistoryById, saveChatHistoryById } from "../utils/storage";
import { post } from "../utils/socket";

const Chat = (props) => {
  const [text, setText] = React.useState("");
  const [msgs, setMsgs] = React.useState([]);
  const [sendBuf, setSendBuf] = React.useState([]);
  const [errors, setErrors] = React.useState([]);
  const scrollRef = useRef(null);

  const renderSendIcon = () => {
    return <TextInput.Icon icon="send" onPress={() => send()} />;
  };

  const renderWaiting = (chat) => {
    if (chat.role === "waiting") {
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
  }, [msgs]);

  useEffect(() => {
    const send = async () => {
      const createHandleNewContent = (id) => {
        const handleNewContent = (content) => {
          setMsgs((currentMsgs) =>
            currentMsgs.map((chat) => {
              if (chat.content === "waiting...") {
                chat.content = "";
              }
              if (chat.content.trim() === '') {
                chat.content = chat.content.trim();
              }
              if (chat.role !== "user" && chat.id === id) {
                return {
                  role: "assistant",
                  content: (chat.content ? chat.content : "") + content,
                  id,
                };
              }
              return chat;
            })
          );
        };
        return handleNewContent;
      };

      if (sendBuf.length > 0) {
        sendBuf.forEach((buf) => {
          const id = buf[buf.length - 1].id;
          post(props.APIKey, buf, createHandleNewContent(id))
            .then()
            .catch((error) => {
              setErrors((currentErrors) => [
                ...currentErrors,
                { id, content: error },
              ]);
            });
        });
        setSendBuf([]);
      }
    };
    send();
  }, [sendBuf]);

  useEffect(() => {
    if (errors.length > 0) {
      errors.forEach((error) => {
        setMsgs((currentMsgs) => {
          return currentMsgs.map((chat) => {
            if (chat.id === error.id) {
              return {
                role: "error",
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
    const _getChatHistoryById = async (id) => {
      let chatHistory = await getChatHistoryById(id);
      if (chatHistory && JSON.stringify(chatHistory) !== JSON.stringify(msgs)) {
        chatHistory = chatHistory.map((chat) => {
          if (chat.role === "waiting") {
            return {
              role: "error",
              content: "Error: Request timed out",
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
    const id = Math.random();
    setSendBuf([
      ...sendBuf,
      [
        ...msgs.filter(
          (msg) => msg.role === "user" || msg.role === "assistant"
        ),
        { role: "user", content: text, id },
      ],
    ]);
    setMsgs((currentMsgs) => [...currentMsgs, { role: "user", content: text }]);
    setMsgs((currentMsgs) => [
      ...currentMsgs,
      { role: "waiting", content: "waiting...", id },
    ]);
    setText("");
  };

  return (
    <View style={[{ flex: 1 }]}>
      <ScrollView ref={scrollRef}>
        <Button mode="text" onPress={() => props.deleteChat(props.chatId)}>
          Delete chat
        </Button>
        {msgs.map((chat, index) => {
          return (
            <View
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent:
                  chat.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <View
                style={[
                  styles.chat,
                  {
                    backgroundColor:
                      chat.role === "user"
                        ? "#5ee486"
                        : chat.role === "error"
                        ? "#FF0000"
                        : "#383838",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    borderTopLeftRadius: chat.role === "user" ? 15 : 5,
                    borderTopRightRadius: chat.role === "user" ? 5 : 15,
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,
                  },
                ]}
              >
                <Text
                  style={[
                    chat.role !== "user" ? { color: "#FFF" } : { color: "#000" },
                    styles.text,
                  ]}
                  selectable={true}
                >
                  {chat.content}
                </Text>
                {renderWaiting(chat)}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={{ padding: 5 }}>
        <TextInput
          value={text}
          style={styles.textInput}
          multiline={true}
          mode="outlined"
          label="Message"
          placeholder="Type something"
          textColor="#FFF"
          right={renderSendIcon()}
          onChangeText={(_text) => setText(_text)}
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
    maxWidth: "80%",
  },
  textInput: {
    backgroundColor: "#222",
    borderRadius: 5,
    padding: 5,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 100,
  },
});

export default Chat;
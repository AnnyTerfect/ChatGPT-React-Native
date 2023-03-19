import {View, Text} from 'react-native';
import {Button, IconButton} from 'react-native-paper';

const Drawer = (props) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#333',
      }}
    >
      <Text
        style={{
          margin: 20,
          marginTop: 40,
          color: 'white',
          fontSize: 30
        }}
      >
      Chat List
      </Text>
      <View>
        {props.chatIds.map((chatId) => (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
              marginHorizontal: 20
            }}
            key={Math.random()}
          >
            <Button
              mode={props.activeChatId === chatId ? 'contained' : 'outlined'}
              style={{
                flex: 1,
                color: 'white',
                fontSize: 18,
                contentStyle: {
                  justifyContent: 'flex-start',
                }
              }}
              onPress={() => { props.switchChat(chatId) }}
            >
              chat{chatId}
            </Button>
            <IconButton
              style={{
                backgroundColor: '#333',
              }}
              mode="icon"
              icon="delete"
              onPress={() => { props.deleteChat(chatId) }}
            />
          </View>
        ))}
        <Button
          icon="plus"
          mode="elevated"
          style={{marginTop: 10}}
          onPress={() => { props.addChat(Math.ceil(Math.random() * 100000)) }}
        >
          Add Chat
        </Button>
      </View>
    </View>
  );
};

export default Drawer;

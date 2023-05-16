import AsyncStorage from '@react-native-async-storage/async-storage';

const getAPIKey = async () => {
  try {
    const APIKey = await AsyncStorage.getItem('APIKey');
    return APIKey;
  } catch (err) {
    console.log('Error getting APIKey');
    console.log(err);
  }
};

const saveAPIKey = async APIKey => {
  try {
    await AsyncStorage.setItem('APIKey', APIKey);
  } catch (err) {
    console.log('Error saving APIKey');
    console.log(err);
  }
};

const getChatHistory = async () => {
  try {
    const chatHistory = await AsyncStorage.getItem('chatHistory');
    const chatHistoryJSON = JSON.parse(chatHistory);
    if (chatHistoryJSON && typeof chatHistoryJSON === 'object') {
      return chatHistoryJSON;
    }
    return [];
  } catch (err) {
    console.log('Error getting chatHistory');
    console.log(err);
    return [];
  }
};

const getChatHistoryById = async id => {
  try {
    const chatHistory = await AsyncStorage.getItem('chatHistory');
    const chatHistoryJSON = JSON.parse(chatHistory);
    const idChatHistory = chatHistoryJSON.filter(chat => chat.id === id);
    if (idChatHistory.length > 0 && idChatHistory[0].chatHistory) {
      return idChatHistory[0].chatHistory;
    }
    return [];
  } catch (err) {
    console.log('Error getting chatHistory');
    console.log(err);
    return [];
  }
};

const saveChatHistoryById = async (id, chatHistory) => {
  let oldChatHistoryJSON;
  try {
    oldChatHistoryJSON = await getChatHistory();
  } catch (err) {
    oldChatHistoryJSON = [];
    console.log('Error getting chatHistory');
    console.log(err);
  }
  const newChatHistory = oldChatHistoryJSON.map(chat => {
    if (chat.id === id) {
      return {
        id,
        chatHistory,
      };
    }
    return chat;
  });
  try {
    await AsyncStorage.setItem('chatHistory', JSON.stringify(newChatHistory));
  } catch (err) {
    console.log('Error saving chatHistory');
    console.log(err);
  }
};

const getChatIds = async () => {
  try {
    const chatHistory = await AsyncStorage.getItem('chatHistory');
    if (chatHistory) {
      return JSON.parse(chatHistory).map(chat => chat.id);
    }
    return [];
  } catch (err) {
    console.log('Error getting chatIds');
    console.log(err);
    return [];
  }
};

const commitAddChat = async chatId => {
  try {
    const chatHistory = await getChatHistory();
    await AsyncStorage.setItem(
      'chatHistory',
      JSON.stringify([...chatHistory, { id: chatId, chatHistory: [] }]),
    );
  } catch (err) {
    console.log('Error adding chat');
    console.log(err);
  }
};

const commitDeleteChat = async chatId => {
  try {
    let chatHistory = await getChatHistory();
    chatHistory = chatHistory.filter(chat => chat.id !== chatId);
    await AsyncStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  } catch (err) {
    console.log('Error deleting chat');
    console.log(err);
  }
};

const getActiveChatId = async () => {
  try {
    const activeChatId = await AsyncStorage.getItem('activeChatId');
    return activeChatId;
  } catch (err) {
    console.log('Error getting activeChatId');
    console.log(err);
  }
};

const saveActiveChatId = async activeChatId => {
  try {
    await AsyncStorage.setItem('activeChatId', activeChatId);
  } catch (err) {
    console.log('Error saving activeChatId');
    console.log(err);
  }
};

export {
  getAPIKey,
  saveAPIKey,
  getChatHistory,
  getChatHistoryById,
  saveChatHistoryById,
  getChatIds,
  commitAddChat,
  commitDeleteChat,
  getActiveChatId,
  saveActiveChatId,
};

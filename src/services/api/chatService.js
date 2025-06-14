import chatsData from '../mockData/chats.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ChatService {
  constructor() {
    this.chats = [...chatsData];
  }

  async getAll() {
    await delay(300);
    return [...this.chats].sort((a, b) => 
      new Date(b.lastMessage?.timestamp || 0) - new Date(a.lastMessage?.timestamp || 0)
    );
  }

  async getById(id) {
    await delay(250);
    const chat = this.chats.find(chat => chat.id === id);
    if (!chat) {
      throw new Error('Chat not found');
    }
    return { ...chat };
  }

  async create(chatData) {
    await delay(400);
    const newChat = {
      id: Date.now().toString(),
      type: chatData.type || 'individual',
      participants: [...chatData.participants],
      lastMessage: null,
      unreadCount: 0,
      groupName: chatData.groupName || null,
      groupAvatar: chatData.groupAvatar || null,
      createdAt: new Date().toISOString()
    };
    this.chats.push(newChat);
    return { ...newChat };
  }

  async update(id, updates) {
    await delay(250);
    const chatIndex = this.chats.findIndex(chat => chat.id === id);
    if (chatIndex === -1) {
      throw new Error('Chat not found');
    }
    
    this.chats[chatIndex] = { ...this.chats[chatIndex], ...updates };
    return { ...this.chats[chatIndex] };
  }

  async delete(id) {
    await delay(300);
    const chatIndex = this.chats.findIndex(chat => chat.id === id);
    if (chatIndex === -1) {
      throw new Error('Chat not found');
    }
    
    this.chats.splice(chatIndex, 1);
    return { success: true };
  }

  async markAsRead(chatId) {
    await delay(200);
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.unreadCount = 0;
    }
    return { success: true };
  }

  async updateUnreadCount(chatId, count) {
    await delay(150);
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.unreadCount = count;
    }
    return { success: true };
  }
}

export default new ChatService();
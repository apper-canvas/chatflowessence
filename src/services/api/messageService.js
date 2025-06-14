import messagesData from '../mockData/messages.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MessageService {
  constructor() {
    this.messages = [...messagesData];
  }

  async getAll() {
    await delay(300);
    return [...this.messages].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
  }

  async getById(id) {
    await delay(200);
    const message = this.messages.find(msg => msg.id === id);
    if (!message) {
      throw new Error('Message not found');
    }
    return { ...message };
  }

  async getByChatId(chatId) {
    await delay(400);
    return [...this.messages]
      .filter(msg => msg.chatId === chatId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  async create(messageData) {
    await delay(300);
    const newMessage = {
      id: Date.now().toString(),
      chatId: messageData.chatId,
      senderId: messageData.senderId,
      content: messageData.content,
      type: messageData.type || 'text',
      timestamp: new Date().toISOString(),
      status: 'sent',
      mediaUrl: messageData.mediaUrl || null
    };
    
    this.messages.push(newMessage);
    
    // Simulate delivery status update
    setTimeout(() => {
      this.updateStatus(newMessage.id, 'delivered');
    }, 1000);
    
    return { ...newMessage };
  }

  async update(id, updates) {
    await delay(250);
    const messageIndex = this.messages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      throw new Error('Message not found');
    }
    
    this.messages[messageIndex] = { ...this.messages[messageIndex], ...updates };
    return { ...this.messages[messageIndex] };
  }

  async delete(id) {
    await delay(300);
    const messageIndex = this.messages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      throw new Error('Message not found');
    }
    
    this.messages.splice(messageIndex, 1);
    return { success: true };
  }

  async updateStatus(messageId, status) {
    await delay(100);
    const message = this.messages.find(msg => msg.id === messageId);
    if (message) {
      message.status = status;
    }
    return { success: true };
  }

  async markMessagesAsRead(chatId, userId) {
    await delay(200);
    const chatMessages = this.messages.filter(msg => 
      msg.chatId === chatId && msg.senderId !== userId
    );
    
    chatMessages.forEach(msg => {
      if (msg.status !== 'read') {
        msg.status = 'read';
      }
    });
    
    return { success: true, updatedCount: chatMessages.length };
  }
}

export default new MessageService();
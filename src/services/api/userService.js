import usersData from '../mockData/users.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.users = [...usersData];
    this.currentUser = this.users[0]; // Simulate current user
  }

  async getAll() {
    await delay(300);
    return [...this.users];
  }

  async getById(id) {
    await delay(200);
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  }

  async getCurrentUser() {
    await delay(150);
    return { ...this.currentUser };
  }

  async create(userData) {
    await delay(400);
    const newUser = {
      id: Date.now().toString(),
      phoneNumber: userData.phoneNumber,
      displayName: userData.displayName,
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.displayName)}&background=128C7E&color=fff`,
      status: userData.status || 'Available',
      lastSeen: new Date().toISOString()
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, updates) {
    await delay(250);
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    
    if (id === this.currentUser.id) {
      this.currentUser = { ...this.users[userIndex] };
    }
    
    return { ...this.users[userIndex] };
  }

  async delete(id) {
    await delay(300);
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    this.users.splice(userIndex, 1);
    return { success: true };
  }

  async searchByName(query) {
    await delay(300);
    if (!query.trim()) {
      return [...this.users];
    }
    
    return this.users.filter(user =>
      user.displayName.toLowerCase().includes(query.toLowerCase()) ||
      user.phoneNumber.includes(query)
    );
  }

  async updateLastSeen(id) {
    await delay(100);
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.lastSeen = new Date().toISOString();
    }
    return { success: true };
  }
}

export default new UserService();
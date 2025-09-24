const { QuickDB } = require('quick.db');

class DatabaseService {
  constructor() {
    this.db = new QuickDB();
  }
  
  async isUserConnected(userId) {
    return await this.db.has(userId);
  }
  
  async getConnectedRobloxId(userId) {
    if (await this.isUserConnected(userId)) {
      return await this.db.get(userId);
    }
    return null;
  }
  
  async connectUser(discordUserId, robloxUserId) {
    await this.db.set(discordUserId, robloxUserId);
  }
  
  async disconnectUser(userId) {
    await this.db.delete(userId);
  }
  
  async saveUserRoles(userId, guildId, roles) {
    await this.db.set(`${userId}_ar_${guildId}`, roles);
  }

  async getSavedUserRoles(userId, guildId) {
    const key = `${userId}_ar_${guildId}`;
    if (await this.db.has(key)) {
      return await this.db.get(key);
    }
    return null;
  }

  async hasSavedRoles(userId, guildId) {
    return await this.db.has(`${userId}_ar_${guildId}`);
  }
}

module.exports = new DatabaseService();
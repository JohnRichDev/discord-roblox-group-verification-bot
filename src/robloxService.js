const axios = require('axios').default;
const Bottleneck = require("bottleneck/es5");
const config = require('../config.json');

const limiter = new Bottleneck({
  reservoir: config.rateLimit.reservoir,
  reservoirRefreshAmount: config.rateLimit.reservoirRefreshAmount,
  reservoirRefreshInterval: config.rateLimit.reservoirRefreshInterval,
  maxConcurrent: config.rateLimit.maxConcurrent,
  minTime: config.rateLimit.minTime
});

class RobloxService {
  async searchUser(username) {
    try {
      const response = await limiter.schedule(() => 
        axios.get(`https://users.roblox.com/v1/users/search?keyword=${username}&limit=10`)
      );
      
      if (response.data.data.length > 0) {
        return response.data.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error searching user:', error);
      throw error;
    }
  }

  async getUserDetails(userId) {
    try {
      const response = await limiter.schedule(() => 
        axios.get(`https://users.roblox.com/v1/users/${userId}`)
      );
      return response.data;
    } catch (error) {
      console.error('Error getting user details:', error);
      throw error;
    }
  }

  async getUserAvatar(userId) {
    try {
      const response = await limiter.schedule(() => 
        axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=720x720&format=Png&isCircular=false`)
      );
      return response.data.data[0].imageUrl;
    } catch (error) {
      console.error('Error getting user avatar:', error);
      throw error;
    }
  }

  async getUserGroups(userId) {
    try {
      const response = await limiter.schedule(() => 
        axios.get(`https://groups.roblox.com/v2/users/${userId}/groups/roles`)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error getting user groups:', error);
      throw error;
    }
  }

  isConfiguredGroup(groupId) {
    return config.roblox.groupIds.includes(groupId);
  }

  getRankPrefix(groupId, rank) {
    const groupRanks = config.roblox.ranks[groupId.toString()];
    if (groupRanks && groupRanks[rank.toString()]) {
      return groupRanks[rank.toString()];
    }
    return null;
  }
}

module.exports = new RobloxService();
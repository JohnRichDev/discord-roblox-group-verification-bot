const axios = require('axios');
const Bottleneck = require('bottleneck');
const config = require('../config.json');

const limiter = new Bottleneck({
  reservoir: config.rateLimit.reservoir,
  reservoirRefreshAmount: config.rateLimit.reservoirRefreshAmount,
  reservoirRefreshInterval: config.rateLimit.reservoirRefreshInterval,
  maxConcurrent: config.rateLimit.maxConcurrent,
  minTime: config.rateLimit.minTime
});

const http = axios.create({
  timeout: 5000,
  headers: { 'User-Agent': 'DiscordRobloxVerificationBot/1.0' }
});

class RobloxService {
  async searchUser(username) {
    try {
      const encoded = encodeURIComponent(String(username || ''));
      const response = await limiter.schedule(() =>
        http.get(`https://users.roblox.com/v1/users/search?keyword=${encoded}&limit=10`)
      );

      const results = response?.data?.data;
      if (Array.isArray(results) && results.length > 0) {
        return results[0];
      }
      return null;
    } catch (error) {
      console.error('Error searching user:', error?.message || error);
      throw error;
    }
  }

  async getUserDetails(userId) {
    try {
      const id = Number(userId);
      if (!Number.isFinite(id)) return null;

      const response = await limiter.schedule(() =>
        http.get(`https://users.roblox.com/v1/users/${id}`)
      );
      return response?.data ?? null;
    } catch (error) {
      console.error('Error getting user details:', error?.message || error);
      throw error;
    }
  }

  async getUserAvatar(userId) {
    try {
      const id = Number(userId);
      if (!Number.isFinite(id)) return null;

      const response = await limiter.schedule(() =>
        http.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=720x720&format=Png&isCircular=false`)
      );

      const thumb = response?.data?.data?.[0];
      return thumb?.imageUrl ?? null;
    } catch (error) {
      console.error('Error getting user avatar:', error?.message || error);
      throw error;
    }
  }

  async getUserGroups(userId) {
    try {
      const id = Number(userId);
      if (!Number.isFinite(id)) return [];

      const response = await limiter.schedule(() =>
        http.get(`https://groups.roblox.com/v2/users/${id}/groups/roles`)
      );
      return response?.data?.data ?? [];
    } catch (error) {
      console.error('Error getting user groups:', error?.message || error);
      throw error;
    }
  }

  isConfiguredGroup(groupId) {
    const id = Number(groupId);
    if (!Number.isFinite(id)) return false;
    return config.roblox.groupIds.includes(id);
  }

  getRankPrefix(groupId, rank) {
    const groupRanks = config.roblox.ranks[groupId.toString()];
    if (groupRanks?.[rank.toString()]) {
      return groupRanks[rank.toString()];
    }
    return null;
  }
}

module.exports = new RobloxService();
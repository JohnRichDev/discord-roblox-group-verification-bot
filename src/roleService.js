const robloxService = require('./robloxService');
const databaseService = require('./databaseService');
const config = require('../config.json');

class RoleService {
  async updateUserRoles(user, groupsData, guild) {
    let toAdd = [];
    let toRemove = [];
    let stats = "";

    this.removeDefaultRoles(user, toRemove);

    await this.processGroupRoles(groupsData, user, guild, toAdd);

    this.removeDuplicateRoles(toAdd, toRemove);

    stats = this.generateRoleStats(user, toAdd, toRemove);

    await this.applyRoleChanges(user, toAdd, toRemove);

    return { stats, toAdd, toRemove };
  }

  removeDefaultRoles(user, toRemove) {
    config.discord.defaultRoles.forEach(defaultRole => {
      const foundRole = user.roles.cache.find(r => r.name === defaultRole);
      if (foundRole) {
        toRemove.push(foundRole);
      }
    });
  }

  async processGroupRoles(groupsData, user, guild, toAdd) {
    for (const groupData of groupsData) {
      const group = groupData.group;
      const role = groupData.role;

      if (!robloxService.isConfiguredGroup(group.id)) continue;

      const foundRole = guild.roles.cache.find(r => r.name === role.name);
      if (foundRole) {
        toAdd.push(foundRole);
      }

      await this.updateNickname(group, role, user);

      this.addDepartmentRole(guild, group, role, toAdd);
    }
  }

  async updateNickname(group, role, user) {
    const rankPrefix = robloxService.getRankPrefix(group.id, role.rank);
    if (!rankPrefix) return;

    try {
      const robloxId = await databaseService.getConnectedRobloxId(user.id);
      const userDetails = await robloxService.getUserDetails(robloxId);
      await user.setNickname(`${rankPrefix} ${userDetails.name}`).catch(() => {
        console.log(`Failed to update nickname for ${user.user.username}`);
      });
    } catch (error) {
      console.error('Error updating nickname:', error);
    }
  }

  addDepartmentRole(guild, group, role, toAdd) {
    const guildConfig = config.discord.guilds[guild.id];
    if (!guildConfig?.departments) return;

    const departmentRoleId = guildConfig.departments[group.id.toString()];
    if (!departmentRoleId) return;

    if (parseInt(role.rank) < 2) return;

    const departmentRole = guild.roles.cache.get(departmentRoleId);
    if (departmentRole) {
      toAdd.push(departmentRole);
    }
  }

  removeDuplicateRoles(toAdd, toRemove) {
    toRemove.forEach((role) => {
      if (toAdd.includes(role)) {
        toRemove.splice(toRemove.indexOf(role), 1);
      }
    });
  }

  generateRoleStats(user, toAdd, toRemove) {
    let stats = "";

    toAdd.forEach((role) => {
      if (!user.roles.cache.has(role.id)) {
        stats += `+ Added \`${role.name}\`\n`;
      }
    });

    toRemove.forEach((role) => {
      stats += `- Removed \`${role.name}\`\n`;
    });

    return stats;
  }

  async applyRoleChanges(user, toAdd, toRemove) {
    for (const role of toRemove) {
      try {
        await user.roles.remove(role);
      } catch (error) {
        console.error(`Failed to remove role ${role.name}:`, error);
      }
    }

    for (const role of toAdd) {
      try {
        await user.roles.add(role);
      } catch (error) {
        console.error(`Failed to add role ${role.name}:`, error);
      }
    }
  }

  async handleMemberJoin(member) {
    if (await databaseService.hasSavedRoles(member.id, member.guild.id)) {
      const savedRoles = await databaseService.getSavedUserRoles(member.id, member.guild.id);
      try {
        member.roles.set(savedRoles);
      } catch (error) {
        console.error('Failed to restore saved roles:', error);
      }
    } else {
      const verifiedRole = member.guild.roles.cache.find((r) => r.name === config.discord.roleNames.verified);
      const unverifiedRole = member.guild.roles.cache.find((r) => r.name === config.discord.roleNames.unverified);
      
      if (await databaseService.isUserConnected(member.id)) {
        if (verifiedRole) member.roles.add(verifiedRole);
      } else if (unverifiedRole) {
        member.roles.add(unverifiedRole);
      }
    }
  }
  
  async handleMemberLeave(member) {
    await databaseService.saveUserRoles(member.id, member.guild.id, member.roles.cache);
  }
}

module.exports = new RoleService();
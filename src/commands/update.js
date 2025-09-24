const { EmbedBuilder } = require('discord.js');
const robloxService = require('../robloxService');
const databaseService = require('../databaseService');
const roleService = require('../roleService');
const { hasAdminPermissions, deleteMessageAfterDelay } = require('../utils');

async function handleUpdateCommand(interaction) {
  let targetUser = interaction.member;
  
  if (interaction.options.getUser('user')) {
    if (!hasAdminPermissions(interaction.member)) {
      await interaction.reply(`<@!${interaction.member.id}>, you are not allowed to update other users!`);
      return;
    }
    
    const user = interaction.options.getUser('user');
    targetUser = interaction.guild.members.cache.find((u) => u.id === user.id);
    
    if (!targetUser) {
      await interaction.reply('User not found in this server.');
      return;
    }
  }

  if (!await databaseService.isUserConnected(targetUser.id)) {
    const reply = await interaction.reply(`<@!${interaction.member.id}>, ${targetUser.id === interaction.member.id ? 'you are' : 'this user is'} not connected to a Roblox account! Do \`/connect\` first and follow the instructions.`);
    deleteMessageAfterDelay(reply);
    return;
  }

  try {
    await interaction.reply('Updating roles...');
    
    const robloxId = await databaseService.getConnectedRobloxId(targetUser.id);
    const groupsData = await robloxService.getUserGroups(robloxId);
    
    const result = await roleService.updateUserRoles(targetUser, groupsData, interaction.guild);
    
    const embed = new EmbedBuilder()
      .setTitle('Updated')
      .setColor(0xFFFF00)
      .setDescription(`\`${targetUser.nickname || targetUser.user.username}\`\n\`\`\`diff\n${result.stats || '+ ROLES UP-TO-DATE!'}\`\`\``);

    await interaction.editReply({
      content: `<@!${interaction.member.id}>`,
      embeds: [embed]
    });

  } catch (error) {
    console.error('Error updating roles:', error);
    await interaction.editReply('An error occurred while updating roles.');
  }
}

module.exports = { handleUpdateCommand };
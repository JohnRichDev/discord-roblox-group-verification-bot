const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const robloxService = require('../robloxService');
const databaseService = require('../databaseService');
const { generateRandomEmojis, deleteMessageAfterDelay } = require('../utils');
const config = require('../../config.json');

async function handleConnectCommand(interaction) {
  if (await databaseService.isUserConnected(interaction.member.id)) {
    const robloxId = await databaseService.getConnectedRobloxId(interaction.member.id);
    const reply = await interaction.reply(`<@!${interaction.member.id}>, you are already connected to Roblox ID: ${robloxId}!`);
    deleteMessageAfterDelay(reply);
    return;
  }

  await interaction.reply('Validating user...');

  try {
    const userData = await robloxService.searchUser(interaction.options.getString('username'));
    
    if (!userData) {
      await interaction.editReply('User not found.');
      return;
    }

    const userDetails = await robloxService.getUserDetails(userData.id);
    const avatarUrl = await robloxService.getUserAvatar(userData.id);
    const verificationCode = generateRandomEmojis();

    const embed = new EmbedBuilder()
      .setTitle(`${userDetails.name}'s Profile`)
      .setColor(0xFF0000)
      .setThumbnail(avatarUrl)
      .setDescription(`Name: \`${userDetails.displayName} (@${userDetails.name})\`\nDescription: \`${userDetails.description}\`\nCreation Date: \`${userDetails.created}\``)
      .setFooter({
        text: `You have ${config.bot.verification.timeout / 1000} seconds to confirm this is you!`,
      })
      .setImage("https://cdn.discordapp.com/attachments/427261181628252181/1011261889201831967/unknown.png")
      .addFields({
        name: 'SET DESCRIPTION TO BEFORE CONFIRMING!',
        value: `\`!${verificationCode}!\``
      });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`CONFIRM|${userData.id}|!${verificationCode}!`)
          .setEmoji('✅')
          .setLabel('Confirm')
          .setStyle('Success')
      );

    const message = await interaction.editReply({
      content: `<@!${interaction.member.id}>`,
      embeds: [embed],
      components: [row]
    });

    deleteMessageAfterDelay(message, config.bot.verification.timeout);

  } catch (error) {
    console.error('Error in connect command:', error);
    await interaction.editReply('An error occurred while processing your request.');
  }
}

module.exports = { handleConnectCommand };
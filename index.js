require('dotenv').config();
const { Client, ActivityType, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');

const { handleSlashCommand } = require('./src/commandHandler');
const { handleButtonInteraction } = require('./src/buttonHandler');
const roleService = require('./src/roleService');

const client = new Client({ 
  intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds] 
});

client.once('ready', () => {
  console.log('Discord Roblox Group Verification Bot is ready!');
  console.log(`Logged in as ${client.user.tag}`);
  
  client.user.setActivity({
    name: config.bot.activity.name,
    type: ActivityType[config.bot.activity.type] || ActivityType.Listening,
  });
});

client.on('guildMemberAdd', async (member) => {
  try {
    await roleService.handleMemberJoin(member);
  } catch (error) {
    console.error('Error handling member join:', error);
  }
});

client.on('guildMemberRemove', async (member) => {
  try {
    await roleService.handleMemberLeave(member);
  } catch (error) {
    console.error('Error handling member leave:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {
      await handleButtonInteraction(interaction);
    } else if (interaction.isChatInputCommand()) {
      await handleSlashCommand(interaction);
    }
  } catch (error) {
    console.error('Error handling interaction:', error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ 
        content: 'An error occurred while processing your request.', 
        ephemeral: true 
      }).catch(() => {});
    }
  }
});

process.on('SIGINT', () => {
  console.log('Shutting down bot...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down bot...');
  client.destroy();
  process.exit(0);
});

const token = process.env.TOKEN;
if (!token) {
  console.error('Discord bot token not found. Please set TOKEN in your environment or in a .env file.');
  process.exit(1);
}

client.login(token).catch(err => {
  console.error('Failed to login to Discord:', err?.message || err);
  process.exit(1);
});
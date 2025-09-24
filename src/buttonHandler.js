const robloxService = require('./robloxService');
const databaseService = require('./databaseService');
const { deleteMessageAfterDelay } = require('./utils');

async function handleButtonInteraction(interaction) {
  const args = interaction.customId.split('|');
  
  if (args[0] === "CONFIRM") {
    const robloxUserId = args[1];
    const expectedCode = args[2];

    try {
      const userDetails = await robloxService.getUserDetails(robloxUserId);
      
      if (userDetails.description === expectedCode) {
        await databaseService.connectUser(interaction.member.id, robloxUserId);
        
        const reply = await interaction.reply(`<@!${interaction.member.id}> SUCCESSFULLY CONNECTED! YOU CAN NOW USE \`/update\`!`);
        deleteMessageAfterDelay(reply);
        deleteMessageAfterDelay(interaction.message);
        
      } else {
        await interaction.reply(`<@!${interaction.member.id}> YOU DID NOT PROVIDE THE CORRECT VERIFICATION CODE!`);
        deleteMessageAfterDelay(interaction.message, 1000);
      }
    } catch (error) {
      console.error('Error in button interaction:', error);
      await interaction.reply('An error occurred during verification. Please try again.');
    }
  }
}

module.exports = { handleButtonInteraction };
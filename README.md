# Discord Roblox Group Verification Bot

A modular Discord bot that verifies Roblox group membership and automatically assigns Discord roles based on group ranks and departments.

## Features

- **User Verification**: Connect Discord accounts to Roblox profiles through verification codes
- **Automatic Role Assignment**: Assign Discord roles based on Roblox group membership and ranks
- **Department Roles**: Special department roles for specific guilds
- **Nickname Management**: Update Discord nicknames with rank prefixes
- **Role Persistence**: Save and restore user roles when they leave and rejoin
- **Admin Commands**: Manual user connection and role updates

## Project Structure

```
├── index.js                 # Main bot file
├── config.json             # Configuration file (customize here!)
├── package.json            # Dependencies
├── .env                    # Environment variables (TOKEN)
└── src/
    ├── utils.js            # Utility functions
    ├── robloxService.js    # Roblox API service
    ├── databaseService.js  # Database operations
    ├── roleService.js      # Role management logic
    ├── buttonHandler.js    # Button interaction handler
    ├── commandHandler.js   # Main command router
    └── commands/
        ├── connect.js      # Connect command
        ├── update.js       # Update roles command
        ├── disconnect.js   # Disconnect command
        ├── connection.js   # Check connection status
        └── manualConnect.js # Admin manual connect
```

## Configuration

All bot settings are centralized in `config.json`:

### Bot Settings
- `bot.activity`: Bot status activity
- `bot.verification.timeout`: Verification timeout (ms)
- `bot.verification.messageDeleteDelay`: Message auto-delete delay (ms)
- `bot.verification.emojiAmount`: Number of verification emojis

### Roblox Settings
- `roblox.groupIds`: Array of monitored Roblox group IDs
- `roblox.ranks`: Rank mappings with prefixes for each group

### Discord Settings  
- `discord.guilds`: Guild-specific configurations (department roles)
- `discord.defaultRoles`: Roles to remove during updates
- `discord.roleNames`: Verified/Unverified role names

### Rate Limiting
- `rateLimit`: Bottleneck configuration for Roblox API calls

## Commands

- `/connect <username>` - Connect your Discord to a Roblox account
- `/update [user]` - Update roles based on current Roblox groups
- `/disconnect` - Disconnect from Roblox account
- `/connection` - Check connection status
- `/manual_connect <user> <userid>` - (Admin) Manually connect users

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with your bot token:
   ```
   TOKEN=your_discord_bot_token_here
   ```
4. Customize `config.json` with your server and group settings
5. Run the bot: `node index.js`

## Customization

To customize the bot for your server:

1. **Update Group IDs**: Modify `roblox.groupIds` in `config.json`
2. **Configure Ranks**: Update `roblox.ranks` with your group rank mappings
3. **Set Guild Settings**: Configure `discord.guilds` for your server ID
4. **Department Roles**: Update department role mappings in guild config
5. **Default Roles**: Modify `discord.defaultRoles` list as needed

## Environment Variables

- `TOKEN`: Discord bot token (required)

## Dependencies

- `discord.js`: Discord API wrapper
- `axios`: HTTP client for Roblox API
- `bottleneck`: Rate limiting
- `quick.db`: Local database
- `dotenv`: Environment variable management

This Discord bot is used for Roblox group role verification. It allows users to connect their Roblox accounts to their Discord accounts and automatically assigns roles based on their group memberships in specific Roblox groups.

## Setup

1. Clone or download this repository.
2. Install the required dependencies by running `npm install`.
3. Create a `.env` file in the root directory and provide the necessary environment variables:

```bash
TOKEN=YOUR_DISCORD_BOT_TOKEN
BOT_ID=YOUR_DISCORD_BOT_ID
```

4. Update the `groupIds` and `ranks` variables in `index.js` with the appropriate group IDs and ranks for your Roblox group.
5. Customize the default roles in the `defaultRoles` array in `index.js` to match your server's role names.
6. Run the command `node applyCmds.js` to set up the Discord slash commands for the bot.

## Dependencies

This bot requires the following dependencies:

- [axios](https://www.npmjs.com/package/axios): To make HTTP requests to the Roblox API.
- [bottleneck](https://www.npmjs.com/package/bottleneck): To control the rate of API requests.
- [discord.js](https://www.npmjs.com/package/discord.js): The Discord.js library for interacting with Discord API.
- [dotenv](https://www.npmjs.com/package/dotenv): To load environment variables from the `.env` file.
- [quick.db](https://www.npmjs.com/package/quick.db): A simple key-value database for persistent data storage.

## Usage

1. Invite the bot to your Discord server using the OAuth2 URL generated by your bot's application on the Discord Developer Portal.
2. Members can connect their Roblox accounts to Discord using the `/connect` command and providing their Roblox username. They will receive a verification message with a code to confirm their identity.
3. Once connected, the bot will automatically assign roles based on the user's group memberships in the specified Roblox groups. It will also update their nickname to display the appropriate rank.
4. Members can use the `/update` command to manually update their roles and nickname.
5. If needed, users can disconnect their Roblox accounts from Discord using the `/disconnect` command.

**Note:** Make sure to replace `YOUR_DISCORD_BOT_TOKEN` and `YOUR_DISCORD_BOT_ID` in the `.env` file with your actual bot token and bot ID from the Discord Developer Portal. Also, update the group IDs, ranks, and default roles in the `index.js` file to match your specific Roblox group configuration.

Feel free to modify and customize the bot according to your needs. Happy verifying!

## Important Note for Developers

Before deploying this Discord bot for Roblox group role verification, make sure to replace the following placeholder values with your actual data:

1. `groupIds`: Update this variable in `index.js` with the group IDs of your Roblox groups. These IDs determine which groups the bot will consider for role verification.

2. `ranks`: Customize this variable in `index.js` to match the roles and their corresponding ranks in your Roblox groups. The bot will use this data to assign appropriate Discord roles based on Roblox group ranks.

3. `departments`: In `index.js`, add or modify the departments and their corresponding role assignments for your specific Discord server. The bot will assign these roles to members based on their Roblox group memberships.

4. `TOKEN`: In the `.env` file, replace `YOUR_DISCORD_BOT_TOKEN` with the actual token of your Discord bot. You can obtain this token from the Discord Developer Portal when creating your bot application.

5. `BOT_ID`: In the `.env` file, replace `YOUR_DISCORD_BOT_ID` with the actual client ID of your Discord bot. You can find this value in the Discord Developer Portal.

6. `defaultRoles`: Modify this array in `index.js` to match the default role names you have set up in your Discord server. The bot will remove these roles when assigning new roles based on Roblox group memberships.

Please ensure that you follow these steps to customize the bot for your specific Roblox group and Discord server. After making these changes, run `node applyCmds.js` to set up the Discord slash commands.

Feel free to customize the bot further to suit your needs. If you have any questions or need assistance, don't hesitate to reach out to us. Happy coding!

## Note from the Developer

This Discord bot was originally created by me for my Roblox group to facilitate role verification and streamline the process of assigning Discord roles based on Roblox group memberships. However, due to certain circumstances or changes in plans, I eventually decided not to deploy the bot for my group.

As a result, you might notice that some values, such as `groupIds`, `ranks`, `departments`, and `defaultRoles`, are already predefined in the code. These values were set based on the requirements and setup of my specific Roblox group and Discord server.

**Important:** Before deploying this bot for your own Roblox group and Discord server, please make sure to follow the instructions in the README to customize the bot by replacing the predefined values with your actual data. Modify the `groupIds`, `ranks`, `departments`, and `defaultRoles` variables to fit your own group's structure and your Discord server's role names.

Additionally, update the `.env` file with your Discord bot's actual token and bot ID. This is crucial for the bot to function correctly in your Discord server.

Feel free to explore and modify the code to suit your unique requirements. I hope this bot proves useful for your Roblox group and enhances the verification process for your community. Should you encounter any issues or have any questions, feel free to reach out to me for assistance.

Thank you, and happy coding!

## License

This Discord bot for Roblox group role verification is open-source and licensed under the [MIT License](LICENSE).

You are free to use, modify, and distribute this code for both personal and commercial purposes. However, we provide no warranty or support for this project. If you choose to use this code, you do so at your own risk.

Please make sure to review and comply with the terms of the MIT License before using this code.

If you find this project helpful or have any suggestions for improvements, feel free to contribute to the repository or give us your feedback. Happy coding!
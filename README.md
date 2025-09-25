# Discord Roblox Group Verification Bot

A modular Discord bot that automates Roblox group verification and role assignment for Discord servers. The bot connects Discord accounts to Roblox profiles and automatically assigns roles based on group membership and ranks.

## Features

- **Account Verification**: Secure connection between Discord and Roblox accounts using verification codes
- **Automatic Role Assignment**: Assigns Discord roles based on Roblox group membership and rank
- **Department-Specific Roles**: Supports specialized department roles for different guilds
- **Nickname Management**: Updates Discord nicknames with appropriate rank prefixes
- **Role Persistence**: Maintains user roles when members leave and rejoin the server
- **Administrative Tools**: Manual user management and role update commands

## Project Structure

```
├── index.js                 # Main application entry point
├── config.json             # Configuration file
├── package.json            # Project dependencies
├── .env                    # Environment variables
└── src/
    ├── utils.js            # Utility functions
    ├── robloxService.js    # Roblox API integration
    ├── databaseService.js  # Database operations
    ├── roleService.js      # Role management logic
    ├── buttonHandler.js    # Button interaction handling
    ├── commandHandler.js   # Command routing
    └── commands/
        ├── connect.js      # User connection command
        ├── update.js       # Role update command
        ├── disconnect.js   # Account disconnection
        ├── connection.js   # Connection status check
        └── manualConnect.js # Administrative connection tool
```

## Configuration

The bot uses a centralized configuration system through `config.json`:

### Bot Configuration
- `bot.activity` - Bot status display
- `bot.verification.timeout` - Verification timeout period
- `bot.verification.messageDeleteDelay` - Auto-delete delay for messages
- `bot.verification.emojiAmount` - Number of verification emojis

### Roblox Integration
- `roblox.groupIds` - Array of monitored Roblox group IDs
- `roblox.ranks` - Rank mappings with prefixes for each group

### Discord Settings
- `discord.guilds` - Guild-specific configurations
- `discord.defaultRoles` - Roles to remove during updates
- `discord.roleNames` - Verified and unverified role names

### Rate Limiting
- `rateLimit` - API request throttling configuration

## Available Commands

- `/connect <username>` - Connect Discord account to Roblox profile
- `/update [user]` - Update roles based on current Roblox group status
- `/disconnect` - Remove connection between Discord and Roblox accounts
- `/connection` - Display current connection status
- `/manual_connect <user> <userid>` - Administrator tool for manual connections

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd discord-roblox-group-verification-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   Create a `.env` file in the root directory:
   ```
   TOKEN=your_discord_bot_token
   ```

4. **Bot configuration**
   Customize `config.json` with your server and group settings

5. **Deploy commands**
   ```bash
   node applyCmds.js
   ```

6. **Start the bot**
   ```bash
   node index.js
   ```

## Customization Guide

To adapt the bot for your server:

1. **Update Group Configuration**: Modify `roblox.groupIds` in `config.json`
2. **Configure Rank Mappings**: Update `roblox.ranks` with your group structure
3. **Set Guild Information**: Configure `discord.guilds` for your server ID
4. **Define Department Roles**: Update department role mappings as needed
5. **Specify Default Roles**: Modify `discord.defaultRoles` array

## Dependencies

- **discord.js** - Discord API wrapper library
- **axios** - HTTP client for external API requests
- **bottleneck** - Rate limiting implementation
- **quick.db** - Local database solution
- **dotenv** - Environment variable management

## Usage Instructions

1. Invite the bot to your Discord server using the OAuth2 URL from the Discord Developer Portal
2. Users can connect their Roblox accounts using `/connect <username>`
3. The bot will send a verification code that must be added to the user's Roblox profile
4. Once verified, roles are automatically assigned based on group membership
5. Users can update their roles anytime using `/update`
6. Disconnection is available through `/disconnect`

## Requirements

- Node.js 16.0 or higher
- Discord bot token from Discord Developer Portal
- Appropriate bot permissions in your Discord server

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or contributions, please refer to the project repository or contact the maintainers.
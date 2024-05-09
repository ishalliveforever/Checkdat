const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Check that the environment variable for the Discord token is set
if (!process.env.DISCORD_BOT_TOKEN) {
    console.log("Checking for DISCORD_BOT_TOKEN...");
    throw new Error("DISCORD_BOT_TOKEN environment variable is not set");
}
console.log("DISCORD_BOT_TOKEN found.");

// Initialize the Discord Client with appropriate intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});
console.log("Discord Client initialized with intents.");

// Event listener for when the bot is ready
client.on('ready', () => {
    console.log(`Bot is online and logged in as ${client.user.tag}!`);
});

// Event listener for new messages
client.on('messageCreate', async message => {
    console.log(`Received message: ${message.content} from ${message.author.tag}`);
    
    // Check if the message is from a guild, is not from a bot, and matches the command
    if (!message.guild) {
        console.log("Message not from a guild, ignoring.");
        return;
    }
    if (message.author.bot) {
        console.log("Message from a bot, ignoring.");
        return;
    }

    if (message.content.toLowerCase() === '!verify') {
        console.log("Command '!verify' recognized.");
        
        // Provide the OAuth2 authentication URL for Discord
        const authUrl = `${process.env.SERVER_URL}/auth`;
        console.log(`Authentication URL: ${authUrl}`);

        // Send a reply with the verification link
        message.reply(`Please click the following link to authenticate with Discord: ${authUrl}`)
            .then(() => console.log(`Verification link sent to user ${message.author.tag}.`))
            .catch(error => console.error("Failed to send verification link:", error));
    }
});

// Log in to Discord with your app's token
client.login(process.env.DISCORD_BOT_TOKEN)
    .then(() => {
        console.log("Successfully logged into Discord.");
    })
    .catch(error => {
        console.error("Failed to log into Discord:", error);
    });

// Graceful shutdown on Ctrl+C
process.on("SIGINT", () => {
    console.log("Received SIGINT, shutting down...");
    client.destroy();
    process.exit();
});

process.on("SIGTERM", () => {
    console.log("Received SIGTERM, shutting down...");
    client.destroy();
    process.exit();
});

console.log("Event handlers and login setup complete.");

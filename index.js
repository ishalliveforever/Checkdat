const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

// Initialize the Discord Client with appropriate intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages  // Necessary to send DMs
    ]
});

// Event listener for when the bot is ready
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Event listener for new messages
client.on('messageCreate', async message => {
    // Check if the message is from a guild, is not from a bot, and matches the command
    if (!message.guild || message.author.bot) return;

    if (message.content.toLowerCase() === '!verify') {
        const verificationUrl = 'https://yourdomain.com/sign-message';  // URL to your Panda Wallet signing page

        // Try to send a direct message to the user with the verification link
        try {
            await message.author.send(`Please click the following link to sign a message with your Panda Wallet to verify your identity: ${verificationUrl}`);
            console.log("Verification link sent to the user.");
        } catch (error) {
            console.error("Could not send DM to user", error);
            message.reply("I couldn't send you a DM. Please check your privacy settings!");
        }
    }
});

// Log in to Discord with your app's token
client.login(process.env.DISCORD_BOT_TOKEN);

const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

// Configure the Discord client with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Event listener for when the bot is ready
client.on('ready', () => {
    console.log(`Bot is online and logged in as ${client.user.tag}!`);
});

// Event listener for new messages
client.on('messageCreate', async message => {
    // Ignore messages from bots or outside of guilds
    if (message.author.bot || !message.guild) return;

    // Handle the !verify command
    if (message.content.toLowerCase().startsWith('!verify')) {
        const authUrl = `${process.env.SERVER_URL}/auth`; // URL for authentication
        const button = new ButtonBuilder()
            .setLabel('Click to Verify')
            .setStyle(ButtonStyle.Link)
            .setEmoji('💻')
            .setURL(authUrl); // Set the button URL to the auth URL
        const row = new ActionRowBuilder().addComponents(button);
        try {
            await message.reply({
                content: 'Welcome to the 1Sat Society. To ensure a smooth and secure experience, please verify your wallet by clicking the button below.',
                components: [row]
            });
            console.log(`Verification link sent to user ${message.author.tag}.`);
        } catch (error) {
            console.error("Failed to send verification link:", error);
        }
    } 

    // Handle the !setlink command
    else if (message.content.toLowerCase().startsWith('!setlink')) {
        const embed = new EmbedBuilder()
            .setColor(0xFFA500) // Orange color
            .setTitle('Welcome To 1Sat Society')
            .setDescription('To ensure a smooth and secure experience, we need all members to verify their wallet.')
            .setURL('https://your-auth-url.com/auth') // Replace with your authentication URL
            .setTimestamp();

        const button = new ButtonBuilder()
            .setLabel('Verify Wallet')
            .setStyle(ButtonStyle.Link)
            .setURL('https://your-auth-url.com/auth'); // Replace with your authentication URL

        const row = new ActionRowBuilder().addComponents(button);

        const pinnedMessage = await message.channel.send({ embeds: [embed], components: [row] });

        // Optionally pin the message
        try {
            await pinnedMessage.pin();
        } catch (error) {
            console.error('Could not pin the message:', error);
        }
    } 

    // Handle the !list command
    else if (message.content.toLowerCase().startsWith('!list')) {
        const parts = message.content.split(' ').slice(1); // Split message into parts and ignore the command part
        if (parts.length < 2) {
            await message.reply('Please provide item name and price. Usage: `!list [item] [price]`');
            return;
        }

        const itemName = parts.slice(0, -1).join(' '); // Item name
        const price = parts[parts.length - 1]; // Price

        try {
            const response = await axios.post(`${process.env.SERVER_URL}/api/list_item`, {
                username: message.author.username,
                item: itemName,
                price: price
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.message) {
                await message.reply(`Item listed successfully! Item: ${itemName}, Price: ${price}`);
            } else {
                await message.reply('Failed to list item. Please try again.');
            }
        } catch (error) {
            console.error('Error listing item:', error);
            await message.reply('Failed to list item due to a server error. Please try again later.');
        }
    }
});

// Log in to Discord with the bot token
client.login(process.env.DISCORD_BOT_TOKEN);

// Handle process termination gracefully
process.on("SIGINT", () => {
    client.destroy();
    process.exit();
});

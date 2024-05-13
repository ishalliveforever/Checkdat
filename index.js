const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

// Configure the Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.on('ready', () => {
    console.log(`Bot is online and logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return; // Ignore messages from bots or outside of guilds

    if (message.content.toLowerCase() === '!verify') {
        const authUrl = `${process.env.SERVER_URL}/auth`;
        const button = new ButtonBuilder()
            .setLabel('Click to Verify')
            .setStyle(ButtonStyle.Link)
            .setEmoji('🔗')
            .setURL(authUrl);
        const row = new ActionRowBuilder().addComponents(button);
        try {
            await message.reply({ content: 'Please verify your wallet for admittance', components: [row] });
            console.log(`Verification link sent to user ${message.author.tag}.`);
        } catch (error) {
            console.error("Failed to send verification link:", error);
        }
    }

    // Listening to webhook messages in a specific channel
    if (message.channelId === "1235032260558983284" && message.webhookId) {
        console.log("Received message from webhook:", message.content);
        // Extracting relevant data from the message
        const regex = /Username: (\S+) has been assigned roles: (.*)\./;
        const matches = message.content.match(regex);
        if (matches) {
            const username = matches[1];
            const rolesToAssign = matches[2].split(', ').map(role => role.trim());

            try {
                // Fetching the user based on username
                const users = await message.guild.members.search({ query: username, limit: 1 });
                if (users.size > 0) {
                    const member = users.first();
                    for (const roleName of rolesToAssign) {
                        const role = message.guild.roles.cache.find(r => r.name === roleName);
                        if (role) {
                            await member.roles.add(role);
                            console.log(`Assigned role ${roleName} to ${member.displayName}`);
                        } else {
                            console.log(`Role ${roleName} not found`);
                        }
                    }
                    // Send confirmation message
                    await message.channel.send(`Roles [${rolesToAssign.join(', ')}] have been successfully assigned to ${member.displayName}.`);
                } else {
                    console.log(`User ${username} not found.`);
                    await message.channel.send(`User ${username} not found.`);
                }
            } catch (error) {
                console.error("Error during role assignment:", error);
                await message.channel.send(`Failed to assign roles due to an error.`);
            }
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);

process.on("SIGINT", () => {
    client.destroy();
    process.exit();
});

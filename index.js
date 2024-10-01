const { Client, IntentsBitField, REST, Routes } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const akinator = require("discord.js-akinator");
const config = require("./config.json");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

const akinatorOptions = {
    language: "tr", 
    childMode: false,
    useButtons: true,
    embedColor: "#1F1E33",
    translationCaching: {
        enabled: true,
        path: "./translationCache"
    }
};


const commands = [
    new SlashCommandBuilder()
        .setName('akinator')
        .setDescription('Akinator oyununu başlat'),
];


async function deployCommands() {
    try {
        console.log('Slash komutları kaydediliyor...');
        const rest = new REST({ version: '10' }).setToken(config.token);
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('Slash komutları başarıyla kaydedildi!');
    } catch (error) {
        console.error('Slash komutları kaydedilirken bir hata oluştu:', error);
    }
}

client.once("ready", () => {
    console.log(`${client.user.tag} olarak giriş yapıldı!`);
    deployCommands(); 
});


client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === "akinator") {
        akinator(interaction, akinatorOptions);
    }
});


client.on("messageCreate", async message => {
    if (message.content.startsWith(`${config.prefix}akinator`)) {
        akinator(message, akinatorOptions);
    }
});

client.login(config.token);
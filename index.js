import { REST, Routes, Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const { CLIENT_ID, TOKEN } = process.env;

const RESPONSE_LIMIT_TIME = 2000; // 2 seconds

const commands = [
  {
    name: "quoi",
    description: "Replies with Feur!",
  },
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

async function refreshCommands() {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Error reloading commands:", error);
  }
}

refreshCommands();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "quoi") {
    await interaction.reply("Feur!");
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Ignore messages from bots

  // Respond to specific phrases in the message content
  if (message.content.toLocaleLowerCase().includes("quoi")) {
    const currentTimestamp = Date.now();

    // Check if the last response was sent within the limit time
    if (
      message.lastResponseTimestamp &&
      currentTimestamp - message.lastResponseTimestamp < RESPONSE_LIMIT_TIME
    ) {
      return;
    }

    const messageToReply = Math.random() > 0.85 ? "Coubeh!" : "Feur!";
    await message.reply(messageToReply);
  }
});

client.login(TOKEN);

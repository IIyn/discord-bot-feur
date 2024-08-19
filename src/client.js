import { Client, GatewayIntentBits, PermissionFlagsBits } from "discord.js";

import {
  updateServerSetting,
  getServerSetting,
} from "./repository/guildStatus.repository.js";

const RESPONSE_LIMIT_TIME = 2000; // 2 seconds
let lastResponseTimestamp = null;

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

  const guildId = interaction.guildId;

  if (!guildId) {
    await interaction.reply({
      content: "Cette commande ne peut être utilisée que dans un serveur.",
      ephemeral: true,
    });
    return;
  }

  if (interaction.commandName === "quoi") {
    await interaction.reply("Feur!");
  } else if (
    interaction.commandName === "stop" ||
    interaction.commandName === "start"
  ) {
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      await interaction.reply({
        content:
          "Vous devez étre un administrateur pour utiliser cette commande.",
        ephemeral: true,
      });
      return;
    }

    if (
      interaction.commandName === "stop" &&
      !(await getServerSetting(guildId))
    ) {
      await interaction.reply({
        content: "Je suis déjà désactivé !",
        ephemeral: true,
      });
      return;
    } else if (
      interaction.commandName === "start" &&
      (await getServerSetting(guildId))
    ) {
      await interaction.reply({
        content: "Je suis déjà activé !",
        ephemeral: true,
      });
      return;
    }

    const isStarted = interaction.commandName === "start";
    await updateServerSetting(guildId, isStarted);
    await interaction.reply(
      `Le bot ${
        isStarted ? "va repondre à 'quoi' !" : "ne va plus repondre à 'quoi' !"
      }`
    );
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Ignore messages from bots

  const guildId = message.guildId;

  // Respond to specific phrases in the message content
  if (message.content.toLowerCase().includes("quoi")) {
    const currentTimestamp = Date.now();

    // compare seconds between last response and current time
    if (
      (lastResponseTimestamp &&
        currentTimestamp - lastResponseTimestamp < RESPONSE_LIMIT_TIME) ||
      !(await getServerSetting(guildId))
    ) {
      return;
    }

    const messageToReply = Math.random() > 0.85 ? "Coubeh!" : "Feur!";
    await message.reply(messageToReply);
    lastResponseTimestamp = currentTimestamp;
  }
});

export default client;

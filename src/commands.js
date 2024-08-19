import "dotenv/config";
import { Routes } from "discord.js";

const { CLIENT_ID } = process.env;

const commands = [
  {
    name: "quoi",
    description: "Replies with Feur!",
  },
  {
    name: "stop",
    description:
      "Stops the bot from responding to 'quoi' messages in this server",
  },
  {
    name: "start",
    description: "Starts the bot to respond to 'quoi' messages in this server",
  },
];

export default async function refreshCommands(rest) {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Error reloading commands:", error);
  }
}

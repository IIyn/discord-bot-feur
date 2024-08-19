import { REST } from "discord.js";
import dotenv from "dotenv";
import client from "./client.js";
import refreshCommands from "./commands.js";

dotenv.config();

const { TOKEN } = process.env;

const rest = new REST({ version: "10" }).setToken(TOKEN);

refreshCommands(rest);

client.login(TOKEN);

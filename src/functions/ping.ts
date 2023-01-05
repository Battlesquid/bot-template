import { ChatInputCommandInteraction } from "discord.js";
import BotClient from '../client';
import { ChatInputCommand } from '../functions';

const command: ChatInputCommand = {
    type: "chat_input",
    name: "ping",
    execute: async (client: BotClient, inter: ChatInputCommandInteraction) => {
        const elapsed = Date.now() - inter.createdTimestamp;
        inter.reply(`Pong (${elapsed}ms)`);
    }
};

export default command;

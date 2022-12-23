import { ChatInputCommandInteraction } from "discord.js";
import BotClient from '../client';
import { InteractionFunction } from '../functions';

const command: InteractionFunction = {
    name: "ping",
    execute: async (client: BotClient, inter: ChatInputCommandInteraction) => {
        const elapsed = Date.now() - inter.createdTimestamp;
        inter.reply(`Pong (${elapsed}ms)`);
    }
};

export default command;

import { ChatInputCommandInteraction } from "discord.js";
import BotClient from '../client';
import { ChatInputCommand } from '.';

class Ping extends ChatInputCommand {
    name = "ping";
    async execute(client: BotClient, inter: ChatInputCommandInteraction) {
        const elapsed = Date.now() - inter.createdTimestamp;
        inter.reply(`Pong (${elapsed}ms)`);
    }
}

export default new Ping();


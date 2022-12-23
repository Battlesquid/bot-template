import { ChatInputCommandInteraction } from 'discord.js';
import BotClient from '../client';
import loadDir from "../utils/loadDir";
import path from "path";

export type InteractionExecution = (
    client: BotClient,
    interaction: ChatInputCommandInteraction
) => Promise<void>

export type InteractionFunction = {
    name: string;
    subcommand?: string;
    group?: string;
    execute: InteractionExecution
};

export default async () => {
    const dir = await loadDir(__dirname);
    const promises = dir.files.map(async (file) => {
        const filepath = path.resolve(__dirname, file);
        const fn: InteractionFunction = (await import(filepath)).default;
        return fn;
    });
    return Promise.all(promises);
}

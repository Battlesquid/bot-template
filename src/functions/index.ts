import { ChatInputCommandInteraction } from 'discord.js';
import BotClient from '../client';
import { loadDirAs } from "../utils/loadDir";

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

export default () => loadDirAs<InteractionFunction>(__dirname);

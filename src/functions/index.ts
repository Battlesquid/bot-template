import { ChatInputCommandInteraction, CommandInteraction, Interaction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from 'discord.js';
import BotClient from '../client';
import { loadDirAs } from "../utils/loadDir";

export type CommandFunction<T> = (
    client: BotClient,
    interaction: T
) => Promise<void>

export type SecondaryInteractionHandler = (
    client: BotClient,
    interaction: Interaction
) => Promise<void>

export type BaseCommand<T extends CommandInteraction> = {
    name: string
    secondaryInteraction?: SecondaryInteractionHandler
    execute: CommandFunction<T>
}

export interface ChatInputCommand extends BaseCommand<ChatInputCommandInteraction> {
    type: "chat_input"
    subcommand?: string;
    group?: string;
}

export interface UserCommand extends BaseCommand<UserContextMenuCommandInteraction> {
    type: "user"
}

export interface MessageCommand extends BaseCommand<MessageContextMenuCommandInteraction> {
    type: "message"
}

export type Command =
    | ChatInputCommand
    | UserCommand
    | MessageCommand

export default () => loadDirAs<Command>(__dirname);

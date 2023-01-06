import { ApplicationCommandType, ChatInputCommandInteraction, CommandInteraction, Interaction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from 'discord.js';
import BotClient from '../client';
import { loadDirAs } from "../utils/loadDir";

export abstract class BaseCommand<T extends CommandInteraction> {
    abstract readonly type: T["commandType"];
    abstract readonly name: string;
    abstract getName(): string;
    abstract execute(client: BotClient, inter: T): Promise<void>
}

export abstract class ChatInputCommand extends BaseCommand<ChatInputCommandInteraction> {
    readonly type: ApplicationCommandType.ChatInput = ApplicationCommandType.ChatInput;
    readonly subcommand?: string;
    readonly group?: string;
    public getName(): string {
        return [
            this.name,
            this.group,
            this.subcommand
        ].filter(Boolean).join("-");
    }
    abstract execute(client: BotClient, inter: ChatInputCommandInteraction): Promise<void>
}

export abstract class UserCommand extends BaseCommand<UserContextMenuCommandInteraction> {
    readonly type: ApplicationCommandType.User = ApplicationCommandType.User
    public getName(): string {
        return this.name;
    }
    abstract execute(client: BotClient, inter: UserContextMenuCommandInteraction): Promise<void>
}

export abstract class MessageCommand extends BaseCommand<MessageContextMenuCommandInteraction> {
    readonly type: ApplicationCommandType.Message = ApplicationCommandType.Message
    public getName(): string {
        return this.name;
    }
    abstract execute(client: BotClient, inter: MessageContextMenuCommandInteraction): Promise<void>
}

export type SecondaryInteractionHandler = (
    client: BotClient,
    interaction: Interaction
) => Promise<void>

export type Command =
    | ChatInputCommand
    | UserCommand
    | MessageCommand;

export default () => loadDirAs<Command>(__dirname);

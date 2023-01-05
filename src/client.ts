import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import {
    ChatInputCommandInteraction,
    Client,
    ClientOptions,
    Collection,
    CommandInteraction, MessageContextMenuCommandInteraction,
    REST,
    Routes,
    UserContextMenuCommandInteraction
} from "discord.js";
import database from "./database";
import events from "./events";
import functions, { ChatInputCommand, MessageCommand, UserCommand } from "./functions";
import interactions from "./interactions";
import config from './utils/config';
import logger from "./utils/logger";

export default class BotClient extends Client {
    private chatInputCommands: Collection<string, ChatInputCommand>;
    private userCommands: Collection<string, UserCommand>;
    private messageCommands: Collection<string, MessageCommand>;
    public readonly logger = logger;
    private _orm!: MikroORM<PostgreSqlDriver>;

    constructor(options: ClientOptions) {
        super(options);
        this.chatInputCommands = new Collection();
        this.userCommands = new Collection();
        this.messageCommands = new Collection();
    }

    private async loadDatabase() {
        this._orm = await database();
    }

    private async loadFunctions() {
        const fns = await functions();
        fns.forEach((fn) => {
            switch (fn.type) {
                case "chat_input":
                    this.chatInputCommands.set(
                        this.getChatInputKey(fn.name, fn.subcommand, fn.group),
                        fn
                    );
                    break;
                case "user":
                    this.userCommands.set(fn.name, fn);
                    break;
                case "message":
                    this.messageCommands.set(fn.name, fn);
                    break;
            }
        });
    }

    private async loadEvents() {
        const eventList = await events();
        eventList.forEach((event) => {
            event.once
                ? this.once(event.name, (...args) => event.handle(this, ...args))
                : this.on(event.name, (...args) => event.handle(this, ...args));
        });
    }

    private async loadInteractions(reload = true) {
        const inters = await interactions();
        const rest = new REST({ version: "10" })
            .setToken(config("DISCORD_TOKEN"));
        if (reload) {
            return rest.put(Routes.applicationCommands(config("DISCORD_CLIENT_ID")), {
                body: [...inters]
            });
        }
    }

    private getChatInputKey(name: string, subcommand?: string, group?: string) {
        const subcommandKey = subcommand ? `-${subcommand}` : "";
        const groupKey = group ? `-${group}` : "";
        return `${name}${subcommandKey}${groupKey}`;
    }

    public runCommand(inter: CommandInteraction) {
        if (inter.isChatInputCommand()) {
            return this.getChatInputCommand(inter)?.execute(this, inter);
        }
        if (inter.isUserContextMenuCommand()) {
            return this.getUserCommand(inter)?.execute(this, inter);
        }
        if (inter.isMessageContextMenuCommand()) {
            return this.getMessageCommand(inter)?.execute(this, inter);
        }
        throw new Error(`Unhandled command type: ${inter.commandType}`)
    }

    public getChatInputCommand(inter: ChatInputCommandInteraction) {
        const name = inter.commandName;
        const subcommand = inter.options.getSubcommand(false) ?? undefined;
        const group = inter.options.getSubcommandGroup(false) ?? undefined;
        const key = this.getChatInputKey(name, subcommand, group);
        return this.chatInputCommands.get(key);
    }

    public getUserCommand(inter: UserContextMenuCommandInteraction) {
        return this.userCommands.get(inter.commandName);
    }

    public getMessageCommand(inter: MessageContextMenuCommandInteraction) {
        return this.messageCommands.get(inter.commandName);
    }

    public async start() {
        await Promise.all([
            this.loadDatabase(),
            this.loadInteractions(),
            this.loadEvents(),
            this.loadFunctions()
        ]);
        return this.login(config("DISCORD_TOKEN"));
    }

    get orm() {
        return this._orm;
    }
}
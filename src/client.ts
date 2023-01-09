import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Client,
  ClientOptions,
  Collection,
  CommandInteraction, MessageContextMenuCommandInteraction,
  REST,
  Routes,
  UserContextMenuCommandInteraction
} from "discord.js";
import commands, {
  ChatInputCommand,
  MessageCommand,
  UserCommand
} from "./commands";
import database from "./database";
import events from "./events";
import interactions from "./interactions";
import config from "./utils/config";
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

  get orm() {
    return this._orm;
  }

  private async loadCommands() {
    const cmds = await commands();
    cmds.forEach((cmd) => {
      switch (cmd.type) {
        case ApplicationCommandType.Message:
          this.messageCommands.set(cmd.getName(), cmd);
          break;
        case ApplicationCommandType.ChatInput:
          this.chatInputCommands.set(cmd.getName(), cmd);
          break;
        case ApplicationCommandType.User:
          this.userCommands.set(cmd.getName(), cmd);
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
    throw new Error(`Unhandled command type: ${inter.commandType}`);
  }

  public getChatInputCommand(inter: ChatInputCommandInteraction) {
    const key = [
      inter.commandName,
      inter.options.getSubcommandGroup(false),
      inter.options.getSubcommand(false)
    ].filter(Boolean).join("-");
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
      this.loadCommands()
    ]);
    return this.login(config("DISCORD_TOKEN"));
  }
}
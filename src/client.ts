import {
    ChatInputCommandInteraction,
    Client,
    ClientOptions,
    Collection,
    REST,
    Routes
} from "discord.js";
import events from "./events";
import functions, { InteractionExecution } from "./functions";
import interactions from "./interactions";
import config from './utils/config';

export default class BotClient extends Client {
    private fns: Collection<string, InteractionExecution>;

    constructor(options: ClientOptions) {
        super(options);
        this.fns = new Collection();
    }

    private async loadFunctions() {
        const fns = await functions();
        fns.forEach((fn) => {
            const key = this.makeFnKey(fn.name, fn.subcommand, fn.group);
            this.fns.set(key, fn.execute);
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

    private makeFnKey(name: string, subcommand?: string, group?: string) {
        const subcommandKey = subcommand ? `-${subcommand}` : "";
        const groupKey = group ? `-${group}` : "";
        return `${name}${subcommandKey}${groupKey}`;
    }

    public getFunction(inter: ChatInputCommandInteraction) {
        const name = inter.commandName;
        const subcommand = inter.options.getSubcommand(false) ?? undefined;
        const group = inter.options.getSubcommandGroup(false) ?? undefined;
        const key = this.makeFnKey(name, subcommand, group);
        return this.fns.get(key);
    }

    public async start(token: string) {
        await Promise.all([
            this.loadInteractions(),
            this.loadEvents(),
            this.loadFunctions()
        ]);
        return this.login(token);
    }
}
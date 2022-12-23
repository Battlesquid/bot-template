import { Client, ClientOptions } from "discord.js";
import events from "./events";

export default class BotClient extends Client {
    constructor(options: ClientOptions) {
        super(options);
    }

    private async loadCommands() {
        
    }

    private async loadEvents() {
        const eventList = await events();
        eventList.forEach((event) => {
            event.once
                ? this.once(event.name, (...args) => event.handle(this, ...args))
                : this.on(event.name, (...args) => event.handle(this, ...args));
        });
    }

    private async loadInteractions() {

    }

    public async start(token: string) {
        this.loadEvents();
        this.login(token);
    }
}
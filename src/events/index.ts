import { ClientEvents } from "discord.js";
import BotClient from "../client";
import loadDir from "../utils/loadDir";

export type Event<K extends keyof ClientEvents> = {
    name: K;
    once?: boolean | false;
    handle(
        client: BotClient,
        ...args: ClientEvents[K]
    ): Promise<void> | void;
};

export default async () => {
    const dir = await loadDir(".");
    const promises = dir.files.map(async (file) => {
        const event: Event<keyof ClientEvents> = (await import(file)).default;
        return event;
    });
    return Promise.all(promises);
}

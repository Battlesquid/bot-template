import { ClientEvents } from "discord.js";
import BotClient from "../client";
import loadDir from "../utils/loadDir";
import path from "path";

export type Event<K extends keyof ClientEvents> = {
    name: K;
    once?: boolean | false;
    handle(
        client: BotClient,
        ...args: ClientEvents[K]
    ): Promise<void> | void;
};

export default async () => {
    const dir = await loadDir(__dirname);
    const promises = dir.files.map(async (file) => {
        const filepath = path.resolve(__dirname, file);
        const event: Event<keyof ClientEvents> = (await import(filepath)).default;
        return event;
    });
    return Promise.all(promises);
}

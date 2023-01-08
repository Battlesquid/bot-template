import { ClientEvents } from "discord.js";
import BotClient from "../client";
import { loadDirAs } from "../utils/loadDir";

export type Event<K extends keyof ClientEvents = keyof ClientEvents> = {
    name: K;
    once?: boolean | false;
    handle(
        client: BotClient,
        ...args: ClientEvents[K]
    ): Promise<void> | void;
};

export default () => loadDirAs<Event>(__dirname);

import { Event } from '.';
import { Events, Interaction } from "discord.js";
import BotClient from "../client";

const event: Event<"interactionCreate"> = {
    name: Events.InteractionCreate,
    handle: async (client: BotClient, inter: Interaction) => {
        if (!inter.isChatInputCommand()) return;

        const execute = client.getFunction(inter);
        if (!execute) {
            inter.reply({
                content: "Command function not found, it may have been removed or moved somwhere else.",
                ephemeral: true
            });
            return;
        }
        execute(client, inter);
    },
};

export default event;
